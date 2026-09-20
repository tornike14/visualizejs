import { cn } from "@/lib/utils";

export type MetricBarTone =
  | "cyan"
  | "amber"
  | "green"
  | "violet"
  | "pink"
  | "rose"
  | "slate";

export interface MetricBar {
  id: string;
  label: string;
  /** Value in the 0 to 1 range. */
  value: number;
  /** Text rendered at the end of the bar, defaults to a percentage. */
  display?: string;
  tone?: MetricBarTone;
  active?: boolean;
}

interface MetricBarsProps {
  bars: MetricBar[];
  emptyLabel?: string;
  className?: string;
}

const FILL_STYLES: Record<MetricBarTone, string> = {
  cyan: "bg-cyan-400/80",
  amber: "bg-amber-400/80",
  green: "bg-emerald-400/80",
  violet: "bg-violet-400/80",
  pink: "bg-pink-400/80",
  rose: "bg-rose-400/80",
  slate: "bg-slate-500/70",
};

/**
 * Labelled horizontal bars. Used for probability distributions, bucket fill
 * levels, cache hit ratios, and gradient magnitudes.
 */
export const MetricBars = ({
  bars,
  emptyLabel = "nothing to show yet",
  className,
}: MetricBarsProps) => {
  if (bars.length === 0) {
    return (
      <p className="pt-2 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className={cn("space-y-2", className)}>
      {bars.map((bar) => {
        const value = Math.max(0, Math.min(1, bar.value));
        return (
          <li
            key={bar.id}
            className={cn(
              "viz-slide-in grid grid-cols-[5.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 font-mono text-xs",
              bar.active ? "text-slate-100" : "text-slate-400",
            )}
          >
            <span className="truncate" title={bar.label}>
              {bar.label}
            </span>
            <span
              className={cn(
                "h-2.5 overflow-hidden rounded-full bg-slate-800/80",
                bar.active && "ring-1 ring-pink-300/50",
              )}
            >
              <span
                className={cn(
                  "block h-full rounded-full transition-all duration-500",
                  FILL_STYLES[bar.tone ?? "cyan"],
                )}
                style={{ width: `${value * 100}%` }}
              />
            </span>
            <span className="text-right tabular-nums">
              {bar.display ?? `${Math.round(value * 100)}%`}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
