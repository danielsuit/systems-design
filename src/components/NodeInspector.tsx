import { useDesignStore } from "../store/designStore";
import { Info } from "lucide-react";

export function NodeInspector() {
  const selectedId = useDesignStore((s) => s.selectedNodeId);
  const node = useDesignStore((s) => s.nodes.find((n) => n.id === selectedId));

  if (!node) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="h-4 w-4" />
          <span>Inspector</span>
        </div>
        <p className="mt-2 text-slate-500">Select a node to view details.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center gap-2 text-slate-200">
        <Info className="h-4 w-4 text-accent" />
        <span className="text-sm">Inspector</span>
      </div>
      <div className="mt-3 space-y-2 text-sm text-slate-100">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: node.color }} />
          <span className="font-semibold">{node.label}</span>
        </div>
        {node.detail ? <p className="text-slate-400">{node.detail}</p> : null}
        <p className="text-xs uppercase tracking-wide text-slate-500">{node.kind}</p>
      </div>
    </div>
  );
}
