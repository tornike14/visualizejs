import { cn } from "@/lib/utils";
import type { ScopeEntry } from "../types";
import {
  SCOPE_BOX_BASE,
  scopeHighlightClass,
  scopeLabelClass,
  scopeTypeBadge,
} from "../helpers";

export function ScopeChainDiagram({
  scopes,
  activeLink,
}: {
  scopes: ScopeEntry[];
  activeLink?: number;
}) {
  if (scopes.length === 0) {
    return (
      <p className="py-6 text-center font-mono text-xs uppercase tracking-[0.22em] text-slate-500/60">
        no scopes yet
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {scopes.map((scope, index) => {
        const badge = scopeTypeBadge(scope.type);

        return (
          <div key={`${scope.label}-${index}`}>
            {/* Scope box */}
            <div
              className={cn(
                SCOPE_BOX_BASE,
                "viz-slide-in",
                scopeHighlightClass(scope.highlight),
              )}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded px-1.5 py-0.5 font-mono text-[9px] font-bold",
                    badge.className,
                  )}
                >
                  {badge.letter}
                </span>
                <span
                  className={cn(
                    "font-mono text-xs font-semibold",
                    scopeLabelClass(scope.highlight),
                  )}
                >
                  {scope.label}
                </span>
                {scope.highlight === "searching" && (
                  <span className="rounded-full bg-violet-500/20 px-1.5 py-0.5 font-mono text-[9px] text-violet-300">
                    looking...
                  </span>
                )}
                {scope.highlight === "found" && (
                  <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] text-emerald-300">
                    found
                  </span>
                )}
              </div>

              {scope.bindings.length > 0 ? (
                <div className="space-y-0.5">
                  {scope.bindings.map((binding) => (
                    <div
                      key={binding.name}
                      className={cn(
                        "flex items-center justify-between rounded px-2 py-0.5 font-mono text-xs transition-colors",
                        scope.activeBinding === binding.name
                          ? "bg-white/8 text-slate-100"
                          : "text-slate-400",
                      )}
                    >
                      <span>{binding.name}</span>
                      <span className="text-slate-300">{binding.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-2 font-mono text-[10px] text-slate-500/60">
                  (no local bindings)
                </p>
              )}
            </div>

            {/* Arrow between scopes */}
            {index < scopes.length - 1 && (
              <div className="flex items-center justify-center py-1">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "h-4 w-px transition-colors",
                      activeLink === index
                        ? "bg-pink-400/70"
                        : "bg-slate-600/50",
                    )}
                  />
                  <span
                    className={cn(
                      "font-mono text-[9px] transition-colors",
                      activeLink === index
                        ? "text-pink-300"
                        : "text-slate-500/70",
                    )}
                  >
                    [[Scope]]
                  </span>
                  <svg
                    viewBox="0 0 10 6"
                    className={cn(
                      "h-1.5 w-2.5 transition-colors",
                      activeLink === index
                        ? "text-pink-400/70"
                        : "text-slate-600/50",
                    )}
                  >
                    <path
                      d="M0 0L5 6L10 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
