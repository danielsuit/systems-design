import { templates } from "../data/templates";
import { useDesignStore } from "../store/designStore";
import { Sparkles, LayoutTemplate } from "lucide-react";
import classNames from "classnames";

export function TemplateGallery() {
  const active = useDesignStore((s) => s.activeTemplateId);
  const setTemplate = useDesignStore((s) => s.setTemplate);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <LayoutTemplate className="h-4 w-4" />
        <span>Templates</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => setTemplate(tpl.id)}
            className={classNames(
              "rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-left transition hover:border-accent/60 hover:shadow-card",
              active === tpl.id && "border-accent/80 bg-slate-900"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-50">{tpl.name}</p>
                <p className="text-xs text-slate-400">{tpl.description}</p>
              </div>
              {active === tpl.id ? (
                <Sparkles className="h-4 w-4 text-accent" />
              ) : null}
            </div>
            {tpl.notes ? (
              <p className="mt-2 text-xs text-slate-500">{tpl.notes}</p>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
