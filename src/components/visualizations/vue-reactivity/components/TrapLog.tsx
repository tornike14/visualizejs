import { cn } from "@/lib/utils";
import { TRAP_RESULT_LABELS, TRAP_RESULT_STYLES } from "../helpers";
import type { TrapEntry } from "../types";

export const TrapLog = ({ traps }: { traps: TrapEntry[] }) => {
  if (traps.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no traps fired
      </p>
    );
  }

  return (
    <ol className="space-y-1.5">
      {traps.map((trap, index) => {
        const isLatest = index === traps.length - 1;
        return (
          <li
            key={trap.id}
            className={cn(
              "viz-slide-in rounded-lg border px-3 py-2 font-mono text-xs transition-opacity",
              TRAP_RESULT_STYLES[trap.result],
              !isLatest && "opacity-60",
            )}
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
                {trap.op}
              </span>
              <span className="font-semibold text-slate-100">
                {trap.target}.{trap.key}
              </span>
              <span className="text-slate-400">
                {trap.op === "set" ? "=" : "->"} {trap.value}
              </span>
              <span className="ml-auto shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold">
                {TRAP_RESULT_LABELS[trap.result]}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-snug text-slate-400">
              {trap.isRef && (
                <span className="mr-1.5 rounded border border-violet-300/30 px-1 text-[9px] uppercase tracking-[0.12em] text-violet-300">
                  ref accessor
                </span>
              )}
              {trap.note}
            </p>
          </li>
        );
      })}
    </ol>
  );
};
