import { cn } from "@/lib/utils";
import type { TimerItem } from "../types";

export const TimerList = ({ timers }: { timers: TimerItem[] }) => {
  if (timers.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no timers
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {timers.map((timer) => (
        <div
          key={timer.id}
          className={cn(
            "viz-slide-in flex items-center justify-between gap-2 rounded-lg border px-3 py-2 font-mono text-xs",
            timer.status === "due"
              ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-200"
              : "border-cyan-300/35 bg-cyan-400/10 text-cyan-200",
          )}
        >
          <span className="truncate">{timer.label}</span>
          <span className="shrink-0 tabular-nums">
            {timer.status === "due" ? "due" : `${timer.remainingMs} ms left`}
          </span>
        </div>
      ))}
    </div>
  );
};
