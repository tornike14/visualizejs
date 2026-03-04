import { cn } from "@/lib/utils";
import type { CallFlowEntry } from "../types";
import { FLOW_DIRECTION_STYLES } from "../helpers";

export function CallFlowPanel({ entries }: { entries: CallFlowEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no calls yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => {
        const isLatest = index === entries.length - 1;
        return (
          <div
            key={entry.id}
            className={cn(
              "rounded-lg border border-slate-600/30 border-l-[3px] bg-slate-800/40 px-3 py-2 font-mono text-xs",
              FLOW_DIRECTION_STYLES[entry.direction],
              isLatest && "viz-slide-in",
            )}
          >
            <div className="flex items-center gap-1.5 text-cyan-200">
              <span className="text-cyan-400">{"\u25B6"}</span>
              {entry.caller}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-violet-200">
              <span className="text-violet-400">{"\u25C0"}</span>
              {entry.response}
            </div>
          </div>
        );
      })}
    </div>
  );
}
