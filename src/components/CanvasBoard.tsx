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
      
      const distance = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
      if (distance < 5) return;
      
      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      
      const nodeWidth = cardRect.width / drag.zoom;
      const nodeHeight = cardRect.height / drag.zoom;
      
      let x = (e.clientX - containerRect.left - drag.offsetX - panOffset.x) / drag.zoom;
      let y = (e.clientY - containerRect.top - drag.offsetY - panOffset.y) / drag.zoom;
      
      const maxX = (containerRect.width / drag.zoom) - nodeWidth;
      const maxY = (containerRect.height / drag.zoom) - nodeHeight;
      
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));
      
      updateNodePosition(drag.id, x, y);
      
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

  const isSelected = selectedId === node.id;
  const isSource = connectSourceId === node.id;

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
        "absolute w-48 select-none rounded-xl p-4 transition-shadow duration-200",
        connectMode ? "cursor-crosshair" : "cursor-grab",
      )}
      style={{
        transform: `translate(${node.x * zoom + panOffset.x}px, ${node.y * zoom + panOffset.y}px) scale(${zoom})`,
        transformOrigin: '0 0',
        zIndex: isSelected ? 10 : 5,
        background: 'var(--color-surface-2)',
        border: isSelected
          ? '1px solid var(--color-accent)'
          : isSource
            ? '1px solid var(--color-accent-muted)'
            : '1px solid var(--color-border)',
        boxShadow: isSelected
          ? '0 0 0 3px var(--color-accent-muted), 0 8px 24px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      {/* Top accent line for selected */}
      {isSelected && (
        <div
          className="absolute top-0 left-3 right-3 h-0.5 rounded-full"
          style={{ background: 'var(--color-accent)' }}
        />
      )}

      <div className="flex items-center justify-between mb-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{
            background: node.color,
            boxShadow: `0 0 8px ${node.color}40`,
          }}
        />
        <Move className="h-3.5 w-3.5" style={{ color: 'var(--color-text-ghost)' }} />
      </div>
      <p
        className="font-body font-semibold text-sm"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {node.label}
      </p>
      {node.detail && (
        <p
          className="text-xs mt-1 leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {node.detail}
        </p>
      )}
      <p
        className="mt-2.5 text-[10px] uppercase tracking-widest font-semibold"
        style={{ color: 'var(--color-text-ghost)' }}
      >
        {node.kind}
      </p>
    </div>
  );
}

export function CanvasBoard({ zoom = 1, onZoomIn, onZoomOut, onResetZoom, onZoomChange }: { zoom?: number; onZoomIn?: () => void; onZoomOut?: () => void; onResetZoom?: () => void; onZoomChange?: (newZoom: number) => void }) {
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

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!onZoomChange) return;
      e.preventDefault();
      
      const delta = -e.deltaY * 0.001;
      const newZoom = zoom + delta;
      onZoomChange(newZoom);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [zoom, onZoomChange]);

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
    const w = dims?.w ?? 192;
    const h = dims?.h ?? 118;
    return { x: (node.x + w / 2) * zoom + panOffset.x, y: (node.y + h / 2) * zoom + panOffset.y };
  };

  return (
    <div
      className="relative h-full rounded-xl overflow-hidden"
      style={{
        background: 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(212,134,78,0.12) 1px, transparent 1px)',
          backgroundSize: `${48 * zoom}px ${48 * zoom}px`,
          backgroundPosition: `${panOffset.x % (48 * zoom)}px ${panOffset.y % (48 * zoom)}px`,
        }}
      />

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
        {/* Toolbar */}
        <div className="absolute right-4 top-4 flex items-center gap-2" style={{ zIndex: 10 }}>
          <button
            disabled={nodes.length < 2}
            onClick={() => {
              setConnectMode((prev) => !prev);
              setConnectFrom(null);
              selectNode(undefined);
              setHint(false);
            }}
            className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: connectMode ? 'var(--color-accent-muted)' : 'var(--color-surface-2)',
              color: connectMode ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              border: connectMode ? '1px solid var(--color-accent-muted)' : '1px solid var(--color-border)',
            }}
          >
            <Link2 className="h-4 w-4" />
            <span>{connectMode ? "Connecting..." : "Connect"}</span>
          </button>
          <div
            className="rounded-lg px-3 py-2 text-xs font-medium tabular-nums"
            style={{
              background: 'var(--color-surface-2)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            {connections.length} edges
          </div>
        </div>

        {/* Connection SVG */}
        <svg className="absolute inset-0 overflow-visible" aria-hidden="true" style={{ zIndex: 1 }} pointerEvents="auto">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-accent)" />
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
            const isHovered = hoveredConnectionId === c.id;
            return (
              <g 
                key={c.id} 
                onMouseEnter={() => setHoveredConnectionId(c.id)}
                onMouseLeave={() => setHoveredConnectionId(null)}
                style={{ cursor: "pointer" }}
              >
                <path
                  d={path}
                  stroke="var(--color-accent)"
                  strokeWidth={isHovered ? 3 : 2}
                  fill="none"
                  markerEnd="url(#arrow)"
                  opacity={isHovered ? 1 : 0.6}
                  style={{ transition: 'opacity 0.2s, stroke-width 0.2s' }}
                />
                <path d={path} stroke="transparent" strokeWidth={12} fill="none" />
                {isHovered && (
                  <circle 
                    cx={midX} 
                    cy={midY} 
                    r="12" 
                    fill="#c0392b"
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
                {isHovered && (
                  <g 
                    transform={`translate(${midX}, ${midY})`}
                    style={{ cursor: "pointer", pointerEvents: "none" }}
                  >
                    <text 
                      x="0" 
                      y="4" 
                      textAnchor="middle" 
                      fontSize="11" 
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

        {/* Nodes */}
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

        {/* Empty state */}
        {empty && (
          <div
            className="absolute inset-0 grid place-items-center text-center"
            style={{ color: 'var(--color-text-ghost)' }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: 'var(--color-surface-2)' }}
              >
                <MousePointer2 className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
              </div>
              <p className="font-display text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Pick a template or add nodes to begin
              </p>
            </div>
          </div>
        )}

        {/* Hint toast */}
        {hint && !empty && (
          <div
            className="absolute bottom-16 left-4 flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-medium animate-fade-up shadow-card"
            style={{
              zIndex: 20,
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Move className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
            Drag nodes to arrange
          </div>
        )}

        {/* Connect mode hint */}
        {connectMode && (
          <div
            className="absolute bottom-16 right-4 flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-medium animate-fade-up shadow-card"
            style={{
              zIndex: 20,
              background: 'var(--color-accent-subtle)',
              border: '1px solid var(--color-accent-muted)',
              color: 'var(--color-accent)',
            }}
          >
            <Link2 className="h-4 w-4" />
            {connectFrom ? "Select a target node" : "Select a source node"}
          </div>
        )}

        {/* Connection toast */}
        {connectionToast && (
          <div className="absolute inset-x-0 top-4 flex justify-center" style={{ zIndex: 20 }}>
            <div
              className="rounded-lg px-4 py-2.5 text-xs font-medium shadow-elevated animate-fade-up"
              style={{
                background: 'var(--color-surface-2)',
                color: 'var(--color-accent)',
                border: '1px solid var(--color-accent-muted)',
                animationDuration: '0.3s',
              }}
            >
              {connectionToast}
            </div>
          </div>
        )}

        {/* Zoom Controls */}
        <div
          className="absolute bottom-4 right-4 flex items-center gap-1 rounded-lg px-1.5 py-1"
          style={{
            zIndex: 20,
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
          }}
        >
          <button
            onClick={onZoomOut}
            disabled={zoom <= 0.3}
            className="p-2 rounded-md transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => {
              if (zoom > 0.3) (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-3)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={onResetZoom}
            className="px-2.5 py-1.5 text-xs font-medium tabular-nums rounded-md transition-all duration-150"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
            }}
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={onZoomIn}
            disabled={zoom >= 2}
            className="p-2 rounded-md transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => {
              if (zoom < 2) (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-3)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
