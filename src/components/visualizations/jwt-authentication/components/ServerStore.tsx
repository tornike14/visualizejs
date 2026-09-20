import { cn } from "@/lib/utils";
import { STORE_STYLES } from "../helpers";
import type { StoreEntry } from "../types";

export const ServerStore = ({ entries }: { entries: StoreEntry[] }) => {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        allow-list empty
      </p>
    );
  }

  return (
    <div className="space-y-1.5 font-mono text-xs">
      <div className="grid grid-cols-[minmax(0,1fr)_3rem_5rem] gap-x-2 px-3 text-[10px] uppercase tracking-[0.16em] text-slate-500">
        <span>sha256(refresh token)</span>
        <span>user</span>
        <span>status</span>
      </div>
      {entries.map((entry) => (
        <div
          key={`${entry.id}-${entry.status}-${entry.active ? "on" : "off"}`}
          className={cn(
            "viz-slide-in grid grid-cols-[minmax(0,1fr)_3rem_5rem] items-center gap-x-2 rounded-lg border px-3 py-2 transition-all duration-300",
            STORE_STYLES[entry.status],
            entry.active && "ring-1 ring-pink-300/50",
          )}
        >
          <span className="min-w-0">
            <span className="block truncate">{entry.tokenHash}</span>
            <span className="block text-[10px] text-slate-500 no-underline">
              expires {entry.expires}
            </span>
          </span>
          <span>{entry.userId}</span>
          <span className="text-[10px] uppercase tracking-[0.14em]">
            {entry.status}
          </span>
        </div>
      ))}
    </div>
  );
};
