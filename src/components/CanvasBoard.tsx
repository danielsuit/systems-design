import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useDesignStore, NodeModel } from "../store/designStore";
import { Move, MousePointer2, Link2, ZoomIn, ZoomOut, X } from "lucide-react";
import classNames from "classnames";

interface DragState {
  id: string;
  offsetX: number;
  offsetY: number;
  zoom: number;
  startX: number;
  startY: number;
  hasMoved: boolean;
}

interface NodeCardProps {
  node: NodeModel;
  connectMode?: boolean;
  connectSourceId?: string | null;
  onConnectTarget?: (id: string) => void;
  onMeasure?: (id: string, size: { w: number; h: number }) => void;
  zoom?: number;
  panOffset?: { x: number; y: number };
}

function NodeCard({ node, connectMode, connectSourceId, onConnectTarget, onMeasure, zoom = 1, panOffset = { x: 0, y: 0 } }: NodeCardProps) {
  const updateNodePosition = useDesignStore((s) => s.updateNodePosition);
  const selectNode = useDesignStore((s) => s.selectNode);
  const selectedId = useDesignStore((s) => s.selectedNodeId);
  const [drag, setDrag] = useState<DragState | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!cardRef.current || !onMeasure) return;
    const rect = cardRef.current.getBoundingClientRect();
    onMeasure(node.id, {
      w: rect.width / zoom,
      h: rect.height / zoom,
    });
  }, [node.id, onMeasure, zoom]);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!drag) return;
      const container = cardRef.current?.parentElement;
      const card = cardRef.current;
      if (!container || !card) return;
      
      // Check if pointer has moved beyond threshold (5px)
      const distance = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
      if (distance < 5) return;
      
      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      
      // Calculate unscaled node dimensions
      const nodeWidth = cardRect.width / drag.zoom;
      const nodeHeight = cardRect.height / drag.zoom;
      
      // Calculate position with canvas bounds (account for pan offset)
      let x = (e.clientX - containerRect.left - drag.offsetX - panOffset.x) / drag.zoom;
      let y = (e.clientY - containerRect.top - drag.offsetY - panOffset.y) / drag.zoom;
      
      // Constrain to canvas boundaries
      const maxX = (containerRect.width / drag.zoom) - nodeWidth;
      const maxY = (containerRect.height / drag.zoom) - nodeHeight;
      
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));
      
      updateNodePosition(drag.id, x, y);
      
      // Mark that movement has happened
      if (!drag.hasMoved) {
        setDrag({ ...drag, hasMoved: true });
      }
    };

    const stop = () => setDrag(null);

    if (drag) {
      window.addEventListener("pointermove", handleMove, { passive: true });
      window.addEventListener("pointerup", stop);
    }
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", stop);
    };
  }, [drag, updateNodePosition, zoom, panOffset]);

  return (
    <div
      ref={cardRef}
      onPointerDown={(e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        if (connectMode && onConnectTarget) {
          e.preventDefault();
          selectNode(node.id);
          onConnectTarget(node.id);
          return;
        }
        setDrag({ 
          id: node.id, 
          offsetX: e.clientX - rect.left, 
          offsetY: e.clientY - rect.top, 
          zoom,
          startX: e.clientX,
          startY: e.clientY,
          hasMoved: false
        });
        selectNode(node.id);
      }}
      className={classNames(
        "absolute w-44 cursor-grab select-none rounded-xl border border-white/5 bg-slate-800/90 p-3 shadow-card transition",
        selectedId === node.id && "ring-2 ring-accent/80",
        connectMode && "cursor-crosshair",
        connectSourceId === node.id && "ring-2 ring-accent"
      )}
      style={{
        transform: `translate(${node.x * zoom + panOffset.x}px, ${node.y * zoom + panOffset.y}px) scale(${zoom})`,
        transformOrigin: '0 0',
        zIndex: 5
      }}
    >
      <div className="flex items-center justify-between">
        <div className="h-3 w-3 rounded-full" style={{ background: node.color }} />
        <Move className="h-4 w-4 text-slate-500" />
      </div>
      <p className="mt-2 font-semibold text-slate-50">{node.label}</p>
      {node.detail ? <p className="text-xs text-slate-400">{node.detail}</p> : null}
      <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-500">{node.kind}</p>
    </div>
  );
}

export function CanvasBoard({ zoom = 1, onZoomIn, onZoomOut, onResetZoom }: { zoom?: number; onZoomIn?: () => void; onZoomOut?: () => void; onResetZoom?: () => void }) {
  const nodes = useDesignStore((s) => s.nodes);
  const connections = useDesignStore((s) => s.connections);
  const addConnection = useDesignStore((s) => s.addConnection);
  const deleteConnection = useDesignStore((s) => s.deleteConnection);
  const selectNode = useDesignStore((s) => s.selectNode);
  const [hint, setHint] = useState(true);
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [hoveredConnectionId, setHoveredConnectionId] = useState<string | null>(null);
  const [connectionToast, setConnectionToast] = useState<string | null>(null);
  const [nodeDims, setNodeDims] = useState<Record<string, { w: number; h: number }>>({});
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hintTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (hintTimeout.current) window.clearTimeout(hintTimeout.current);
    hintTimeout.current = window.setTimeout(() => setHint(false), 2400);
    return () => {
      if (hintTimeout.current) window.clearTimeout(hintTimeout.current);
    };
  }, [nodes]);

  useEffect(() => {
    if (!isPanning) return;
    
    const handlePanMove = (e: PointerEvent) => {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPanOffset({ x: dx, y: dy });
    };
    
    const handlePanEnd = () => {
      setIsPanning(false);
    };
    
    window.addEventListener("pointermove", handlePanMove);
    window.addEventListener("pointerup", handlePanEnd);
    
    return () => {
      window.removeEventListener("pointermove", handlePanMove);
      window.removeEventListener("pointerup", handlePanEnd);
    };
  }, [isPanning, panStart]);

  const empty = useMemo(() => nodes.length === 0, [nodes]);

  const handleConnectTarget = (id: string) => {
    if (!connectMode) return;
    if (!connectFrom) {
      setConnectFrom(id);
      return;
    }
    addConnection(connectFrom, id);
    setConnectFrom(null);
    setConnectMode(false);
    setConnectionToast("Connection added");
    window.setTimeout(() => setConnectionToast(null), 1600);
  };

  const registerMeasure = useCallback((id: string, size: { w: number; h: number }) => {
    setNodeDims((prev) => {
      const current = prev[id];
      if (current && current.w === size.w && current.h === size.h) return prev;
      return { ...prev, [id]: size };
    });
  }, []);

  const getCenter = (node: NodeModel) => {
    const dims = nodeDims[node.id];
    const w = dims?.w ?? 176;
    const h = dims?.h ?? 118;
    return { x: (node.x + w / 2) * zoom + panOffset.x, y: (node.y + h / 2) * zoom + panOffset.y };
  };

  return (
    <div className="relative h-full rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.08),_transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(34,211,238,0.06),_transparent_35%)]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      <div 
        ref={containerRef} 
        className="relative h-full cursor-grab active:cursor-grabbing" 
        onClick={(e) => {
          if (e.target === containerRef.current) {
            selectNode(undefined);
          }
        }}
        onPointerDown={(e) => {
          if (e.target === containerRef.current) {
            setIsPanning(true);
            setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
          }
        }}
      >
        <div className="absolute right-4 top-4 flex items-center gap-2" style={{ zIndex: 10 }}>
          <button
            disabled={nodes.length < 2}
            onClick={() => {
              setConnectMode((prev) => !prev);
              setConnectFrom(null);
              selectNode(undefined);
              setHint(false);
            }}
            className={classNames(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
              connectMode
                ? "border-accent/70 bg-accent/10 text-accent"
                : "border-slate-800 bg-slate-900/80 text-slate-200 hover:border-accent/50"
            )}
          >
            <Link2 className="h-4 w-4" />
            <span>{connectMode ? "Connecting..." : "Connect nodes"}</span>
          </button>
          <div className="rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300">
            {connections.length} connections
          </div>
        </div>

        <svg className="absolute inset-0 overflow-visible" aria-hidden="true" style={{ zIndex: 1 }} pointerEvents="auto">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
            </marker>
          </defs>
          {connections.map((c) => {
            const from = nodes.find((n) => n.id === c.from);
            const to = nodes.find((n) => n.id === c.to);
            if (!from || !to) return null;
            const start = getCenter(from);
            const end = getCenter(to);
            const dx = end.x - start.x;
            const curvature = Math.max(48, Math.abs(dx) * 0.4);
            const path = `M ${start.x} ${start.y} C ${start.x + curvature} ${start.y}, ${end.x - curvature} ${end.y}, ${end.x} ${end.y}`;
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            return (
              <g 
                key={c.id} 
                onMouseEnter={() => setHoveredConnectionId(c.id)}
                onMouseLeave={() => setHoveredConnectionId(null)}
                style={{ cursor: "pointer" }}
              >
                <path d={path} stroke="#38bdf8" strokeWidth={2.5} fill="none" markerEnd="url(#arrow)" opacity={0.9} filter="drop-shadow(0 0 4px rgba(56,189,248,0.35))" />
                <path d={path} stroke="transparent" strokeWidth={12} fill="none" />
                {hoveredConnectionId === c.id && (
                  <circle 
                    cx={midX} 
                    cy={midY} 
                    r="14" 
                    fill="#dc2626" 
                    opacity="0.9"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConnection(c.id);
                      setConnectionToast("Connection removed");
                      window.setTimeout(() => setConnectionToast(null), 1600);
                    }}
                  />
                )}
                {hoveredConnectionId === c.id && (
                  <g 
                    transform={`translate(${midX}, ${midY})`}
                    style={{ cursor: "pointer", pointerEvents: "none" }}
                  >
                    <text 
                      x="0" 
                      y="4" 
                      textAnchor="middle" 
                      fontSize="12" 
                      fill="white" 
                      fontWeight="bold"
                    >
                      ×
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {nodes.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
            connectMode={connectMode}
            connectSourceId={connectFrom}
            onConnectTarget={handleConnectTarget}
            onMeasure={registerMeasure}
            zoom={zoom}
            panOffset={panOffset}
          />
        ))}

        {empty ? (
          <div className="absolute inset-0 grid place-items-center text-center text-slate-400">
            <div className="flex flex-col items-center gap-2">
              <MousePointer2 className="h-6 w-6" />
              <p>Pick a template or add nodes to start sketching.</p>
            </div>
          </div>
        ) : null}

        {hint ? (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-2 text-xs text-slate-300 shadow-card" style={{ zIndex: 20 }}>
            <Move className="h-4 w-4 text-accent" />
            Drag nodes to arrange the architecture
          </div>
        ) : null}

        {connectMode ? (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-2 text-xs text-accent shadow-card" style={{ zIndex: 20 }}>
            <Link2 className="h-4 w-4" />
            {connectFrom ? "Select a target node" : "Select a source node"}
          </div>
        ) : null}

        {connectionToast ? (
          <div className="absolute inset-x-0 top-4 flex justify-center" style={{ zIndex: 20 }}>
            <div className="rounded-full bg-slate-900/95 px-4 py-2 text-xs text-accent shadow-card border border-accent/40">
              {connectionToast}
            </div>
          </div>
        ) : null}

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-2 py-1" style={{ zIndex: 20 }}>
          <button
            onClick={onZoomOut}
            disabled={zoom <= 0.3}
            className="p-1.5 rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={onResetZoom}
            className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 transition"
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={onZoomIn}
            disabled={zoom >= 2}
            className="p-1.5 rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
