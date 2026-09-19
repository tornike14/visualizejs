import { cn } from "@/lib/utils";
import { ENTRY_LABELS, ENTRY_STYLES } from "../helpers";
import type { CacheEntry, SourceRow } from "../types";

const entryFingerprint = (entry: CacheEntry) =>
  `${entry.key}|${entry.value}|${entry.ttl}|${entry.state}`;

interface CacheStorePanelProps {
  entries: CacheEntry[];
  database: SourceRow[];
  started: boolean;
}

/** Key, value, TTL rows for the cache, with the database rows underneath for comparison. */
export const CacheStorePanel = ({
  entries,
  database,
  started,
}: CacheStorePanelProps) => {
  if (!started) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.length === 0 ? (
        <p className="pt-2 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
          empty
        </p>
      ) : (
        <ul className="space-y-1.5">
          {entries.map((entry) => (
            <li
              key={`${entry.key}-${entryFingerprint(entry)}`}
              className={cn(
                "viz-slide-in flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-3 py-2 font-mono text-xs transition-all duration-300",
                ENTRY_STYLES[entry.state],
              )}
            >
              <span className="font-semibold">{entry.key}</span>
              <span className="min-w-0 flex-1 truncate text-slate-300">
                {entry.value}
              </span>
              <span className="text-[10px] uppercase tracking-[0.1em] opacity-70">
                ttl {entry.ttl}
              </span>
              <span className="rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
                {ENTRY_LABELS[entry.state]}
              </span>
            </li>
          ))}
        </ul>
      )}

      {database.length > 0 && (
        <div className="border-t border-slate-700/50 pt-2">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
            database (source of truth)
          </p>
          <ul className="space-y-1">
            {database.map((row) => (
              <li
                key={`${row.key}-${row.value}`}
                className="viz-slide-in flex flex-wrap items-center gap-x-3 rounded-lg border border-slate-600/40 bg-slate-800/40 px-3 py-1.5 font-mono text-xs text-slate-300"
              >
                <span className="text-slate-400">{row.key}</span>
                <span className="min-w-0 flex-1 truncate">{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
