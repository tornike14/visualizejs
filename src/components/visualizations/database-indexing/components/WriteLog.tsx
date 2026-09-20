import { cn } from "@/lib/utils";
import { WRITE_LABELS, WRITE_STYLES } from "../helpers";
import type { WriteLogEntry } from "../types";

export const WriteLog = ({ entries }: { entries: WriteLogEntry[] }) => {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no writes yet
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {entries.map((entry, index) => (
        <li
          key={`${entry.id}-${entry.detail}`}
          className={cn(
            "viz-slide-in flex items-start gap-2 rounded-lg border px-3 py-2 font-mono text-xs",
            WRITE_STYLES[entry.tone],
          )}
        >
          <span className="shrink-0 pt-0.5 text-[10px] text-slate-500 tabular-nums">
            {index + 1}
          </span>
          <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold">
            {WRITE_LABELS[entry.tone]}
          </span>
          <span className="min-w-0">
            <span className="font-semibold">{entry.target}</span>
            <span className="block break-words text-[11px] text-slate-400">
              {entry.detail}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};
