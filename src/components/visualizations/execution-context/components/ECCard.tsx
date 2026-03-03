import { cn } from "@/lib/utils";
import type { ExecutionContextEntry, ScopeLink } from "../types";
import { phaseColors, kindBadge } from "../helpers";
import { ScopeArrow } from "./ScopeArrow";

/** Single execution context card in the stack */
export function ECCard({
  ec,
  isTop,
  scopeLink,
  showArrow,
}: {
  ec: ExecutionContextEntry;
  isTop: boolean;
  scopeLink?: ScopeLink;
  showArrow: boolean;
}) {
  const c = isTop ? phaseColors(ec.phase) : null;

  return (
    <div>
      <div
        className={cn(
          "viz-slide-in rounded-lg border px-3 py-2.5 transition-all duration-300",
          isTop
            ? cn(c!.border, c!.bg, c!.shadow)
            : "border-slate-500/30 bg-slate-800/30"
        )}
      >
        {/* Header */}
        <div className="mb-2 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[9px] font-bold",
              ec.type === "global"
                ? "bg-pink-500/20 text-pink-300"
                : "bg-amber-500/20 text-amber-300"
            )}
          >
            {ec.type === "global" ? "Global" : "Function"}
          </span>
          <span
            className={cn(
              "font-mono text-xs font-semibold",
              isTop ? "text-slate-100" : "text-slate-400"
            )}
          >
            {ec.label}
          </span>
          {isTop && (
            <span
              className={cn(
                "rounded-full border px-1.5 py-0.5 font-mono text-[9px] font-medium",
                c!.badgeBg,
                c!.badgeBorder,
                c!.text
              )}
            >
              {ec.phase}
            </span>
          )}
        </div>

        {/* this binding */}
        <div className="mb-1.5 flex items-center gap-1.5 rounded bg-slate-800/50 px-2 py-1">
          <span className="font-mono text-[10px] font-bold text-pink-300">this</span>
          <span className="font-mono text-[10px] text-slate-500">=</span>
          <span className="font-mono text-[10px] text-slate-300">{ec.thisValue}</span>
        </div>

        {/* Variable Environment */}
        <div className="space-y-0.5">
          {ec.variableEnv.map((binding) => {
            const badge = kindBadge(binding.kind);
            return (
              <div
                key={binding.name}
                className="flex items-center justify-between rounded px-2 py-0.5 font-mono text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex rounded px-1 py-px text-[8px] font-bold",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                  <span className={isTop ? "text-slate-200" : "text-slate-400"}>
                    {binding.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "transition-colors duration-300",
                      binding.initialized ? "text-slate-200" : "text-slate-500"
                    )}
                  >
                    {binding.value}
                  </span>
                  {!binding.initialized && (
                    <span className="rounded bg-violet-500/15 px-1 py-px text-[8px] font-medium text-violet-300">
                      hoisted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Outer env reference label */}
        {ec.outerEnvLabel && (
          <div className="mt-1.5 flex items-center gap-1.5 border-t border-slate-600/30 pt-1.5">
            <span className="font-mono text-[9px] text-slate-500">
              outer:
            </span>
            <span className="font-mono text-[9px] text-pink-300/70">
              {ec.outerEnvLabel}
            </span>
          </div>
        )}
      </div>

      {/* Scope chain arrow */}
      {showArrow && <ScopeArrow active={scopeLink?.active} />}
    </div>
  );
}
