import { cn } from "@/lib/utils";
import type { QueuedUpdate } from "../types";
import { updateStatusStyle } from "../helpers";

const fingerprint = (u: QueuedUpdate) =>
  `${u.id}|${u.status}|${u.result ?? ""}`;

export const UpdateQueuePanel = ({ updates }: { updates: QueuedUpdate[] }) => {
  if (updates.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        queue empty
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {updates.map((update, index) => (
        <div
          key={fingerprint(update)}
          className={cn(
            "viz-slide-in flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-3 py-2 font-mono text-xs",
            updateStatusStyle(update.status),
          )}
        >
          <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold">
            #{index + 1}
          </span>
          <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
            {update.payloadKind}
          </span>
          <span className="text-slate-400">{update.hook}</span>
          <span className="break-all font-semibold">{update.payload}</span>
          {update.result ? (
            <span className="ml-auto shrink-0 text-emerald-300">
              {update.result}
            </span>
          ) : (
            <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wider opacity-70">
              {update.status}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
