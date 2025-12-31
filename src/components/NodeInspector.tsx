import { useDesignStore, NodeKind } from "../store/designStore";
import { Info, Trash2 } from "lucide-react";
import { useState } from "react";

const nodeKinds: NodeKind[] = ["service", "database", "queue", "cache", "client", "storage", "search"];

const colorPresets = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Green", value: "#22c55e" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Blue", value: "#3b82f6" },
];

export function NodeInspector() {
  const selectedId = useDesignStore((s) => s.selectedNodeId);
  const node = useDesignStore((s) => s.nodes.find((n) => n.id === selectedId));
  const updateNode = useDesignStore((s) => s.updateNode);
  const deleteNode = useDesignStore((s) => s.deleteNode);
  const [editLabel, setEditLabel] = useState("");
  const [editDetail, setEditDetail] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editKind, setEditKind] = useState<NodeKind>("service");
  const [isEditing, setIsEditing] = useState(false);

  if (!node) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-2.5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5" />
        </div>
        <p className="mt-1 text-slate-500 text-xs">Select a node to view details.</p>
      </div>
    );
  }

  const handleEdit = () => {
    setEditLabel(node.label);
    setEditDetail(node.detail || "");
    setEditColor(node.color);
    setEditKind(node.kind);
    setIsEditing(true);
  };

  const handleSave = () => {
    updateNode(node.id, {
      label: editLabel,
      detail: editDetail || undefined,
      color: editColor,
      kind: editKind,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase">Label</label>
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="w-full mt-1 px-2 py-1.5 text-sm bg-slate-800/50 border border-slate-700 rounded text-slate-100 outline-none focus:border-accent/60 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase">Detail</label>
            <input
              type="text"
              value={editDetail}
              onChange={(e) => setEditDetail(e.target.value)}
              placeholder="Optional description"
              className="w-full mt-1 px-2 py-1.5 text-sm bg-slate-800/50 border border-slate-700 rounded text-slate-100 placeholder-slate-500 outline-none focus:border-accent/60 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase">Type</label>
            <select
              value={editKind}
              onChange={(e) => setEditKind(e.target.value as NodeKind)}
              className="w-full mt-1 px-2 py-1.5 text-sm bg-slate-800/50 border border-slate-700 rounded text-slate-100 outline-none focus:border-accent/60 transition"
            >
              {nodeKinds.map((kind) => (
                <option key={kind} value={kind}>
                  {kind.charAt(0).toUpperCase() + kind.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase">Color</label>
            <div className="flex gap-1 mt-2 flex-wrap">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setEditColor(color.value)}
                  className={`w-6 h-6 rounded transition border-2 ${
                    editColor === color.value ? "border-accent" : "border-slate-600 hover:border-slate-500"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 px-2 py-1.5 text-sm bg-accent/10 text-accent border border-accent/30 rounded transition hover:bg-accent/20"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-2 py-1.5 text-sm bg-slate-800 text-slate-300 border border-slate-700 rounded transition hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-2.5">
      <div className="space-y-1.5 text-xs text-slate-100">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: node.color }} />
          <span className="font-semibold text-sm">{node.label}</span>
        </div>
        {node.detail ? <p className="text-slate-400 text-xs">{node.detail}</p> : null}
        <p className="text-xs uppercase tracking-wide text-slate-500">{node.kind}</p>
        <div className="flex gap-1.5 mt-2">
          <button
            onClick={handleEdit}
            className="flex-1 px-1.5 py-1 text-xs bg-slate-800/50 text-slate-300 border border-slate-700 rounded transition hover:bg-slate-700 hover:text-slate-100"
          >
            Edit
          </button>
          <button
            onClick={() => deleteNode(node.id)}
            className="flex-1 px-1.5 py-1 text-xs bg-red-500/10 text-red-400 border border-red-500/30 rounded transition hover:bg-red-500/20 flex items-center justify-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
