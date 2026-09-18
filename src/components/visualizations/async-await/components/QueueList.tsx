import { cn } from "@/lib/utils";
import { QUEUE_ITEM_STYLES } from "../helpers";
import type { QueueTone } from "../types";

interface QueueListProps {
  items: string[];
  tone: QueueTone;
  emptyLabel?: string;
}

export const QueueList = ({ items, tone, emptyLabel = "empty" }: QueueListProps) => {
  if (items.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className={cn(
            "viz-slide-in overflow-hidden break-words rounded-lg border px-3 py-2 font-mono text-xs",
            QUEUE_ITEM_STYLES[tone],
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
