import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ParameterRow } from "../types";
import { signedValueClass } from "../helpers";

const rowFingerprint = (row: ParameterRow) =>
  `${row.id}|${row.value}|${row.grad}|${row.next}|${row.active ? 1 : 0}`;

/**
 * Current parameter values, the gradient attached to each one, and the value
 * a gradient descent step would move it to.
 */
export const ParameterTable = ({ rows }: { rows: ParameterRow[] }) => {
  if (rows.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  return (
    <div className="space-y-1.5 font-mono text-xs">
      <div className="grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 px-3 text-[10px] uppercase tracking-[0.14em] text-slate-500">
        <span>param</span>
        <span className="text-right">value</span>
        <span className="text-right">grad</span>
        <span className="text-right">next</span>
      </div>
      {rows.map((row) => (
        <div
          key={rowFingerprint(row)}
          className={cn(
            "viz-slide-in grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 rounded-lg border px-3 py-2 tabular-nums",
            row.active
              ? "border-emerald-300/50 bg-emerald-400/12 text-emerald-100 shadow-[0_0_14px_rgba(52,211,153,0.16)]"
              : "border-slate-600/40 bg-slate-800/40 text-slate-300",
          )}
        >
          <span className="font-semibold">{row.name}</span>
          <span className="text-right">{row.value}</span>
          <span
            className={cn(
              "text-right",
              row.grad ? signedValueClass(row.grad) : "text-slate-600",
            )}
          >
            {row.grad ?? "?"}
          </span>
          <span className="flex items-center justify-end gap-1 text-right">
            {row.next ? (
              <>
                <ArrowRight
                  className="h-3 w-3 text-emerald-300/70"
                  aria-hidden
                />
                <span className="font-semibold text-emerald-200">
                  {row.next}
                </span>
              </>
            ) : (
              <span className="text-slate-600">?</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};
