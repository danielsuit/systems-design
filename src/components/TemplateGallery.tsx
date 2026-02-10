import { templates } from "../data/templates";
import { useDesignStore } from "../store/designStore";
import { Sparkles, LayoutTemplate, ArrowUpRight } from "lucide-react";
import classNames from "classnames";

export function TemplateGallery() {
  const active = useDesignStore((s) => s.activeTemplateId);
  const setTemplate = useDesignStore((s) => s.setTemplate);

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: 'var(--color-accent-subtle)' }}
        >
          <LayoutTemplate className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
        </div>
        <div>
          <h2 className="font-display text-lg" style={{ color: 'var(--color-text-primary)' }}>
            Templates
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Start with a proven architecture pattern
          </p>
        </div>
      </div>

      {/* Template cards — editorial grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {templates.map((tpl, i) => {
          const isActive = active === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => setTemplate(tpl.id)}
              className={classNames(
                "group relative text-left rounded-xl p-5 transition-all duration-250",
                "hover:-translate-y-0.5",
                isActive
                  ? "shadow-glow"
                  : "hover:shadow-card"
              )}
              style={{
                background: isActive ? 'var(--color-surface-2)' : 'var(--color-surface-1)',
                border: isActive
                  ? '1px solid var(--color-accent-muted)'
                  : '1px solid var(--color-border)',
                transitionTimingFunction: 'var(--ease-out-expo)',
              }}
            >
              {/* Active indicator accent line */}
              {isActive && (
                <div
                  className="absolute top-0 left-3 right-3 h-0.5 rounded-full"
                  style={{ background: 'var(--color-accent)' }}
                />
              )}

              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-display text-base"
                      style={{
                        color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                      }}
                    >
                      {tpl.name}
                    </h3>
                    {isActive && (
                      <Sparkles
                        className="h-3.5 w-3.5 flex-shrink-0"
                        style={{ color: 'var(--color-accent)' }}
                      />
                    )}
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {tpl.description}
                  </p>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 flex-shrink-0 ml-3 mt-0.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: 'var(--color-text-muted)' }}
                />
              </div>

              {tpl.notes && (
                <p
                  className="mt-3 text-xs leading-relaxed"
                  style={{ color: 'var(--color-text-ghost)' }}
                >
                  {tpl.notes}
                </p>
              )}

              {/* Node count badge */}
              {tpl.nodes.length > 0 && (
                <div
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    background: 'var(--color-surface-3)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <span>{tpl.nodes.length} nodes</span>
                  {tpl.connections && (
                    <>
                      <span style={{ color: 'var(--color-text-ghost)' }}>·</span>
                      <span>{tpl.connections.length} edges</span>
                    </>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
