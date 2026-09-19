import { cn } from "@/lib/utils";
import { TICK_LEGEND, TICK_STYLES } from "../helpers";
import type { TimelineRow, TimelineState } from "../types";

const pct = (t: number, maxMs: number) => `${(t / maxMs) * 100}%`;

const Track = ({
  row,
  timeline,
}: {
  row: TimelineRow;
  timeline: TimelineState;
}) => {
  const { maxMs, now, window } = timeline;
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 truncate font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:w-20">
        {row.label}
      </span>
      <div className="relative h-8 min-w-0 flex-1 rounded-md border border-slate-700/60 bg-slate-900/50">
        {window ? (
          <div
            className="absolute inset-y-0 border-x border-amber-400/40 bg-amber-400/10"
            style={{
              left: pct(window.start, maxMs),
              width: pct(window.end - window.start, maxMs),
            }}
          />
        ) : null}
        {now !== null ? (
          <div
            className="absolute inset-y-0 w-px bg-pink-400/80 shadow-[0_0_6px_rgba(244,114,182,0.8)]"
            style={{ left: pct(now, maxMs) }}
          />
        ) : null}
        {row.ticks.map((tick) => (
          <span
            key={`${tick.t}-${tick.state}-${tick.label ?? ""}`}
            title={`${tick.label ? `${tick.label} at ` : ""}t=${tick.t} ms (${tick.state})`}
            className={cn(
              "viz-slide-in absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
              TICK_STYLES[tick.state],
            )}
            style={{ left: pct(tick.t, maxMs) }}
          />
        ))}
      </div>
    </div>
  );
};

export const Timeline = ({ timeline }: { timeline: TimelineState | null }) => {
  if (!timeline) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  const { maxMs, now, window } = timeline;
  const axis = [0, maxMs / 4, maxMs / 2, (maxMs * 3) / 4, maxMs];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-slate-400">
        <span>
          now:{" "}
          <span className="text-pink-300">
            {now === null ? "not started" : `t=${now} ms`}
          </span>
        </span>
        {window ? (
          <span>
            {window.label}:{" "}
            <span className="text-amber-300">
              t={window.start} to t={window.end} ms
            </span>
          </span>
        ) : null}
      </div>

      <div className="space-y-2">
        {timeline.rows.map((row) => (
          <Track key={row.id} row={row} timeline={timeline} />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="w-16 shrink-0 sm:w-20" />
        <div className="relative h-4 min-w-0 flex-1 font-mono text-[9px] text-slate-500">
          {axis.map((t, index) => (
            <span
              key={t}
              className={cn(
                "absolute top-0",
                index === 0
                  ? "translate-x-0"
                  : index === axis.length - 1
                    ? "-translate-x-full"
                    : "-translate-x-1/2",
              )}
              style={{ left: pct(t, maxMs) }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 font-mono text-[10px] text-slate-400">
        {TICK_LEGEND.map((item) => (
          <span key={item.state} className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block rounded-full",
                TICK_STYLES[item.state],
              )}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};
