import { cn } from "@/lib/utils";
import type { RequestLogEntry } from "../types";
import { decisionStyle } from "../helpers";

export const RequestLog = ({ entries }: { entries: RequestLogEntry[] }) => {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no requests yet
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className={cn(
            "viz-slide-in flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-3 py-2 font-mono text-xs",
            decisionStyle(entry.decision),
          )}
        >
          <span className="w-16 shrink-0 tabular-nums text-slate-300">
            {entry.time}
          </span>
          <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
            {entry.status}
          </span>
          <span className="font-semibold uppercase tracking-[0.08em]">
            {entry.decision}
          </span>
          <span className="min-w-0 basis-full text-slate-400 sm:basis-auto">
            {entry.detail}
          </span>
        </li>
      ))}
    </ul>
  );
};
