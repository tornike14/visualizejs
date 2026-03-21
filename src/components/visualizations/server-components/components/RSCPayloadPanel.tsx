import { cn } from "@/lib/utils";
import type { PayloadEntry } from "../types";
import { payloadTypeStyle, payloadTypeLabel } from "../helpers";

export function RSCPayloadPanel({ entries }: { entries: PayloadEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no payload entries yet
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2 font-mono text-xs",
            payloadTypeStyle(entry.type),
          )}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
              {payloadTypeLabel(entry.type)}
            </span>
            <span className="font-semibold">{entry.label}</span>
            {entry.status !== "pending" && (
              <span
                className={cn(
                  "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase",
                  entry.status === "streaming"
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-emerald-500/15 text-emerald-400",
                )}
              >
                {entry.status}
              </span>
            )}
          </div>
          <p className="mt-1 break-words text-slate-400">{entry.detail}</p>
        </div>
      ))}
    </div>
  );
}
