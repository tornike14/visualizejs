import { cn } from "@/lib/utils";
import type { EventPathEntry } from "../types";
import { phaseColorClass } from "../helpers";

/* ── Event path display ── */

export const EventPathPanel = ({ entries }: { entries: EventPathEntry[] }) => {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no events yet
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {entries.map((entry, i) => (
        <div
          key={`${entry.nodeLabel}-${entry.phase}-${i}`}
          className={cn(
            "viz-slide-in flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs",
            entry.stopped
              ? "border-rose-500/30 bg-rose-500/8"
              : "border-slate-500/30 bg-slate-800/30",
          )}
        >
          <span
            className={cn(
              "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
              phaseColorClass(entry.phase),
              entry.phase === "capture" && "bg-cyan-500/15",
              entry.phase === "target" && "bg-amber-500/15",
              entry.phase === "bubble" && "bg-emerald-500/15",
            )}
          >
            {entry.phase}
          </span>
          <span className="font-semibold text-slate-200">{entry.nodeLabel}</span>
          {entry.handlerFired && (
            <span className="ml-auto text-emerald-400">fired</span>
          )}
          {entry.stopped && (
            <span className="ml-auto text-rose-400">stopped</span>
          )}
          {!entry.handlerFired && !entry.stopped && (
            <span className="ml-auto text-slate-500">pass</span>
          )}
        </div>
      ))}
    </div>
  );
};
