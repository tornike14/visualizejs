import { cn } from "@/lib/utils";
import type { SuspenseBoundary } from "../types";
import { boundaryStatusStyle, boundaryStatusLabel } from "../helpers";

export function BoundaryStatusPanel({
  boundaries,
}: {
  boundaries: SuspenseBoundary[];
}) {
  if (boundaries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no boundaries yet
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
            boundaryStatusStyle(b.status),
          )}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
              {boundaryStatusLabel(b.status)}
            </span>
            <span className="font-semibold">{b.label}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-slate-500">
            <span>fallback: {b.fallbackLabel}</span>
            {b.promiseLabel && <span className="break-words">promise: {b.promiseLabel}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
