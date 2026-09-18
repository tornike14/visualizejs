import { cn } from "@/lib/utils";
import type { LaneEntry } from "../types";
import { LANE_MASKS, LANE_STATUS_STYLES, LANE_STYLES } from "../helpers";

interface LanesTableProps {
  lanes: LaneEntry[];
}

const laneFingerprint = (lane: LaneEntry) =>
  `${lane.id}|${lane.lane}|${lane.status}`;

export const LanesTable = ({ lanes }: LanesTableProps) => {
  if (lanes.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no pending updates
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50">
      <div className="flex justify-between border-b border-slate-700/50 bg-slate-900/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
        <span>update</span>
        <span>lane / status</span>
      </div>
      <ul>
        {lanes.map((lane) => (
          <li
            key={laneFingerprint(lane)}
            className="viz-slide-in space-y-1.5 border-b border-slate-800/60 px-3 py-2 font-mono text-xs last:border-b-0"
          >
            <p
              className={cn(
                "break-words leading-snug text-slate-200",
                lane.status === "discarded" && "text-slate-500 line-through",
              )}
            >
              {lane.update}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <span
                className={cn(
                  "inline-flex items-baseline gap-1.5 rounded-md border px-1.5 py-0.5 leading-tight",
                  LANE_STYLES[lane.lane],
                )}
              >
                <span className="text-[10px] font-semibold">{lane.lane}</span>
                <span className="text-[9px] opacity-70">{LANE_MASKS[lane.lane]}</span>
              </span>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-wide",
                  LANE_STATUS_STYLES[lane.status],
                )}
              >
                {lane.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
