import { cn } from "@/lib/utils";
import type { MemoEntry } from "../types";
import { cacheStatusStyle, cacheStatusLabel } from "../helpers";

export function MemoCachePanel({ entries }: { entries: MemoEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no cache entries yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2 font-mono text-xs",
            cacheStatusStyle(entry.status),
          )}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
              {cacheStatusLabel(entry.status)}
            </span>
            <span className="shrink-0 font-semibold">{entry.hook}</span>
            <span className="break-words text-slate-400">{entry.label}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-500">deps:</span>
            {entry.deps.map((dep) => (
              <span
                key={dep}
                className="rounded bg-slate-700/50 px-1.5 py-0.5 text-[10px] text-slate-300"
              >
                {dep}
              </span>
            ))}
            {entry.prevDeps && (
              <>
                <span className="text-[10px] text-slate-500">prev:</span>
                {entry.prevDeps.map((dep) => (
                  <span
                    key={`prev-${dep}`}
                    className="rounded bg-slate-700/50 px-1.5 py-0.5 text-[10px] text-slate-500 line-through"
                  >
                    {dep}
                  </span>
                ))}
              </>
            )}
          </div>
          <div className="mt-1 text-[10px] text-slate-500">
            cached: {entry.cachedValue}
          </div>
        </div>
      ))}
    </div>
  );
}
