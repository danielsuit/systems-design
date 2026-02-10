import { useDesignStore, NodeKind } from "../store/designStore";
import { Info, Trash2, Pencil, Check, X } from "lucide-react";
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
      <div
        className="rounded-xl p-4"
        style={{
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4" style={{ color: 'var(--color-text-ghost)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-ghost)' }}>
            Select a node to inspect
          </p>
        </div>
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
      <div
        className="rounded-xl p-5 space-y-4 animate-fade-in"
        style={{
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-accent-muted)',
          animationDuration: '0.2s',
        }}
      >
        {/* Accent line */}
        <div
          className="h-0.5 rounded-full -mt-1 mb-3"
          style={{ background: 'var(--color-accent)' }}
        />

        <div className="space-y-3">
          <div>
            <label className="overline mb-1.5 block">Label</label>
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="overline mb-1.5 block">Detail</label>
            <input
              type="text"
              value={editDetail}
              onChange={(e) => setEditDetail(e.target.value)}
              placeholder="Optional description"
              className="input-field"
            />
          </div>

          <div>
            <label className="overline mb-1.5 block">Type</label>
            <select
              value={editKind}
              onChange={(e) => setEditKind(e.target.value as NodeKind)}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              {nodeKinds.map((kind) => (
                <option key={kind} value={kind}>
                  {kind.charAt(0).toUpperCase() + kind.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="overline mb-2 block">Color</label>
            <div className="flex gap-1.5 flex-wrap">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setEditColor(color.value)}
                  className="w-7 h-7 rounded-lg transition-all duration-150"
                  style={{
                    backgroundColor: color.value,
                    boxShadow: editColor === color.value
                      ? `0 0 0 2px var(--color-bg), 0 0 0 4px ${color.value}`
                      : 'none',
                    transform: editColor === color.value ? 'scale(1.1)' : 'scale(1)',
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="btn-primary flex-1"
              style={{ padding: '10px 16px' }}
            >
              <Check className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn-ghost flex-1"
              style={{ padding: '10px 16px' }}
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5 animate-fade-in"
      style={{
        background: 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
        animationDuration: '0.2s',
      }}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full"
            style={{
              background: node.color,
              boxShadow: `0 0 0 1px var(--color-surface-1), 0 0 0 3px ${node.color}40`,
            }}
          />
          <h3
            className="font-display text-base flex-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {node.label}
          </h3>
        </div>

        {node.detail && (
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {node.detail}
          </p>
        )}

        <div
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wider"
          style={{
            background: 'var(--color-surface-3)',
            color: 'var(--color-text-muted)',
          }}
        >
          {node.kind}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-border)' }} />

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="btn-ghost flex-1"
            style={{ padding: '8px 12px', fontSize: '13px' }}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => deleteNode(node.id)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200"
            style={{
              background: 'rgba(192, 57, 43, 0.1)',
              color: '#e74c3c',
              border: '1px solid rgba(192, 57, 43, 0.2)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(192, 57, 43, 0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(192, 57, 43, 0.1)';
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
