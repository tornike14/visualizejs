import { cn } from "@/lib/utils";
import { SCOPE_ITEM_STYLE } from "../helpers";
import type { ScopeEntry } from "../types";

export const ScopeItems = ({ entries }: { entries: ScopeEntry[] }) => {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div
          key={`${entry.name}-${index}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2.5",
            SCOPE_ITEM_STYLE
          )}
        >
          <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan-300/80">
            {entry.name}
          </p>
          <div className="space-y-1">
            {Object.entries(entry.vars).map(([varName, value]) => (
              <div
                key={varName}
                className="flex items-center justify-between font-mono text-xs"
              >
                <span className="text-cyan-200/70">{varName}</span>
                <span className="text-cyan-100">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
