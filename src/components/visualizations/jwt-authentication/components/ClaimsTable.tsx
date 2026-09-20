import { cn } from "@/lib/utils";
import { CLAIM_ROW_STYLES } from "../helpers";
import type { ClaimRow } from "../types";

export const ClaimsTable = ({ claims }: { claims: ClaimRow[] }) => {
  if (claims.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no claims yet
      </p>
    );
  }

  return (
    <div className="space-y-1 font-mono text-xs">
      <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-x-3 px-2 text-[10px] uppercase tracking-[0.16em] text-slate-500 sm:grid-cols-[4rem_6.5rem_minmax(0,1fr)]">
        <span>claim</span>
        <span>value</span>
        <span className="hidden sm:block">meaning</span>
      </div>
      {claims.map((row) => (
        <div
          key={`${row.claim}-${row.value}-${row.state}`}
          className={cn(
            "viz-slide-in grid grid-cols-[4rem_minmax(0,1fr)] gap-x-3 gap-y-0.5 rounded-lg px-2 py-1.5 transition-colors sm:grid-cols-[4rem_6.5rem_minmax(0,1fr)]",
            CLAIM_ROW_STYLES[row.state],
          )}
        >
          <span className="font-semibold">{row.claim}</span>
          <span className="break-all tabular-nums">{row.value}</span>
          <span className="col-span-2 text-[11px] text-slate-400 sm:col-span-1">
            {row.meaning}
          </span>
        </div>
      ))}
    </div>
  );
};
