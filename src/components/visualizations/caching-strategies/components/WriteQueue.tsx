import { cn } from "@/lib/utils";
import { QUEUE_LABELS, QUEUE_STYLES } from "../helpers";
import type { QueuedWrite } from "../types";

/** Pending database writes for the write-behind policy, oldest first. */
export const WriteQueue = ({ items }: { items: QueuedWrite[] }) => {
  if (items.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        nothing queued
      </p>
    );
  }

  return (
    <ol className="space-y-1.5">
      {items.map((item, index) => (
        <li
          key={`${item.id}-${item.status}`}
          className={cn(
            "viz-slide-in flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs transition-all duration-300",
            QUEUE_STYLES[item.status],
          )}
        >
          <span className="text-[10px] text-slate-500 tabular-nums">
            {index}
          </span>
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
            {QUEUE_LABELS[item.status]}
          </span>
        </li>
      ))}
    </ol>
  );
};
