import { useState } from "react";
import { templates } from "../data/templates";
import { useDesignStore } from "../store/designStore";
import { useNavigate } from "react-router-dom";
import { Sparkles, FolderPlus, ArrowUpRight } from "lucide-react";
import classNames from "classnames";

export function TemplateGallery() {
  const active = useDesignStore((s) => s.activeTemplateId);
  const setTemplate = useDesignStore((s) => s.setTemplate);
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: 'var(--color-accent-subtle)' }}
        >
          <FolderPlus className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
        </div>
        <div>
          <h2 className="font-display text-lg" style={{ color: 'var(--color-text-primary)' }}>
            New Project
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Pick a template to open in the canvas
          </p>
        </div>
      </div>

      {/* Template cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl) => {
          const isActive = active === tpl.id;
          const isHovered = hoveredId === tpl.id;
          const isHighlighted = isActive || isHovered;
          return (
            <button
              key={tpl.id}
              onClick={() => { setTemplate(tpl.id); navigate("/canvas"); }}
              onMouseEnter={() => setHoveredId(tpl.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={classNames(
                "group relative text-left rounded-lg p-3 transition-all duration-200",
                isHovered && !isActive ? "-translate-y-0.5" : ""
              )}
              style={{
                background: isHighlighted ? 'var(--color-accent-subtle)' : 'var(--color-surface-1)',
                border: isHighlighted
                  ? '1px solid var(--color-accent-muted)'
                  : '1px solid var(--color-border)',
                transitionTimingFunction: 'var(--ease-out-expo)',
              }}
            >
              {isHighlighted && (
                <div
                  className="absolute top-0 left-3 right-3 h-0.5 rounded-full"
                  style={{ background: 'var(--color-accent)' }}
                />
              )}

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h3
                    className="font-display text-sm truncate"
                    style={{ color: isHighlighted ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
                  >
                    {tpl.name}
                  </h3>
                  {isHighlighted && (
                    <Sparkles className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
                  )}
                </div>
                <ArrowUpRight
                  className="h-3.5 w-3.5 flex-shrink-0 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: 'var(--color-text-muted)' }}
                />
              </div>

              <p
                className="mt-1 text-xs leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {tpl.description}
              </p>

              {tpl.nodes.length > 0 && (
                <div
                  className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
                  style={{ background: 'var(--color-surface-3)', color: 'var(--color-text-muted)' }}
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
