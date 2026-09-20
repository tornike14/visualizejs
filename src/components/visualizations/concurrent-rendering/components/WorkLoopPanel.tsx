import { MetricBars } from "@/components/visualization-ui/MetricBars";
import { cn } from "@/lib/utils";
import type { WorkLoopState } from "../types";
import {
  LANE_STYLES,
  PHASE_LABELS,
  PHASE_STYLES,
  UNIT_STYLES,
} from "../helpers";

interface WorkLoopPanelProps {
  workLoop: WorkLoopState | null;
}

export const WorkLoopPanel = ({ workLoop }: WorkLoopPanelProps) => {
  if (!workLoop) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  const isRendering =
    workLoop.phase === "sync" || workLoop.phase === "concurrent";
  const barTone =
    workLoop.phase === "discarded"
      ? "rose"
      : workLoop.phase === "commit"
        ? "green"
        : workLoop.lane === "SyncLane"
          ? "amber"
          : "cyan";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400">Phase</span>
        <span
          className={cn(
            "rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            PHASE_STYLES[workLoop.phase],
          )}
        >
          {PHASE_LABELS[workLoop.phase]}
        </span>
        {workLoop.lane && (
          <span
            className={cn(
              "rounded-md border px-1.5 py-0.5 font-mono text-[10px]",
              LANE_STYLES[workLoop.lane],
            )}
          >
            {workLoop.lane}
          </span>
        )}
      </div>

      <MetricBars
        bars={[
          {
            id: "progress",
            label: "tree built",
            value: workLoop.progress,
            tone: barTone,
            active: isRendering,
          },
        ]}
      />

      {workLoop.note && (
        <p className="font-mono text-[11px] text-slate-400">{workLoop.note}</p>
      )}

      <div>
        <span className="text-xs text-slate-400">Units of work</span>
        {workLoop.units.length === 0 ? (
          <p className="mt-1 font-mono text-xs text-slate-500">none</p>
        ) : (
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {workLoop.units.map((item) => (
              <li
                key={`${item.id}|${item.status}`}
                className={cn(
                  "viz-slide-in rounded-lg border px-2 py-1 font-mono text-[11px] transition-all duration-300",
                  UNIT_STYLES[item.status],
                )}
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
