import { cn } from "@/lib/utils";
import { TIMELINE_FILL, TIMELINE_TOTAL_MS } from "../helpers";
import type { TimelineBar } from "../types";

interface TimelineBarsProps {
  bars: TimelineBar[];
  elapsedMs: number;
}

export const TimelineBars = ({ bars, elapsedMs }: TimelineBarsProps) => {
  if (bars.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        nothing scheduled
      </p>
    );
  }

  const elapsedPct = Math.min(100, (elapsedMs / TIMELINE_TOTAL_MS) * 100);

  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
        <span>0 ms</span>
        <span className="text-pink-300">now: {elapsedMs} ms</span>
        <span>{TIMELINE_TOTAL_MS} ms</span>
      </div>
      <ul className="space-y-2">
        {bars.map((bar) => {
          const left = (bar.startMs / TIMELINE_TOTAL_MS) * 100;
          const width = ((bar.endMs - bar.startMs) / TIMELINE_TOTAL_MS) * 100;
          return (
            <li
              key={bar.id}
              className="viz-slide-in grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-2 text-slate-300"
            >
              <span className="truncate" title={bar.label}>
                {bar.label}
              </span>
              <span className="relative block h-3 overflow-hidden rounded-full bg-slate-800/80">
                <span
                  className={cn(
                    "absolute inset-y-0 rounded-full transition-all duration-500",
                    TIMELINE_FILL[bar.tone],
                    bar.status === "pending" && "opacity-40",
                  )}
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
                <span
                  className="absolute inset-y-0 w-px bg-pink-300/80"
                  style={{ left: `${elapsedPct}%` }}
                />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
