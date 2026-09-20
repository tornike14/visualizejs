import { cn } from "@/lib/utils";
import { STAT_TONE_STYLES } from "../helpers";
import type { StatItem } from "../types";

interface StatsGridProps {
  stats: StatItem[];
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  if (stats.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {stats.map((item) => (
        <li
          key={`${item.id}-${item.value}`}
          className={cn(
            "viz-slide-in flex min-w-0 flex-col gap-0.5 rounded-lg border bg-slate-900/40 px-3 py-2",
            STAT_TONE_STYLES[item.tone ?? "slate"],
          )}
        >
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
            {item.label}
          </span>
          <span className="truncate font-mono text-sm font-semibold tabular-nums">
            {item.value}
          </span>
        </li>
      ))}
    </ul>
  );
};
