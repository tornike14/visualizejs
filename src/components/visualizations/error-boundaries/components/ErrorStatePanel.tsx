import { cn } from "@/lib/utils";
import type { ErrorBoundaryInfo } from "../types";
import { phaseLabel, phaseColorClass } from "../helpers";

/* ── Error state display ── */

export const ErrorStatePanel = ({
  boundaries,
}: {
  boundaries: ErrorBoundaryInfo[];
}) => {
  if (boundaries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no boundaries
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {boundaries.map((b) => (
        <div
          key={b.id}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2 font-mono text-xs",
            b.phase === "error-thrown" || b.phase === "getDerivedStateFromError"
              ? "border-rose-500/30 bg-rose-500/8"
              : b.phase === "fallback-rendered"
                ? "border-cyan-500/30 bg-cyan-500/8"
                : b.phase === "recovered"
                  ? "border-emerald-500/30 bg-emerald-500/8"
                  : "border-slate-500/30 bg-slate-800/30",
          )}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
                phaseColorClass(b.phase),
              )}
            >
              {phaseLabel(b.phase)}
            </span>
            <span className="font-semibold text-slate-200">{b.label}</span>
          </div>
          {(b.errorMessage || b.fallbackLabel) && (
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-slate-500">
              {b.errorMessage && (
                <span>
                  error: <span className="text-rose-400">{b.errorMessage}</span>
                </span>
              )}
              {b.fallbackLabel && (
                <span>
                  fallback: <span className="text-cyan-400">{b.fallbackLabel}</span>
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
