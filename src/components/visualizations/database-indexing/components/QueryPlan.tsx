import { cn } from "@/lib/utils";
import { PLAN_LABELS, PLAN_STYLES } from "../helpers";
import type { PlanEntry } from "../types";

const fingerprint = (entry: PlanEntry) =>
  `${entry.status}|${entry.reads}|${entry.rows}|${entry.elapsed ?? ""}|${entry.detail}`;

export const QueryPlan = ({ entries }: { entries: PlanEntry[] }) => {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no plan yet
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {entries.map((entry) => (
        <li
          key={`${entry.id}-${fingerprint(entry)}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2 font-mono text-xs",
            PLAN_STYLES[entry.status],
          )}
        >
          <div className="flex items-center gap-2">
            <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold">
              {PLAN_LABELS[entry.status]}
            </span>
            <span className="truncate font-semibold">{entry.operation}</span>
          </div>
          <p className="mt-1 break-words text-[11px] text-slate-400">
            {entry.detail}
          </p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-400">
            <span>
              reads <span className="text-slate-200 tabular-nums">{entry.reads}</span>
            </span>
            <span>
              rows <span className="text-slate-200 tabular-nums">{entry.rows}</span>
            </span>
            {entry.elapsed && (
              <span>
                time <span className="text-slate-200 tabular-nums">{entry.elapsed}</span>
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
