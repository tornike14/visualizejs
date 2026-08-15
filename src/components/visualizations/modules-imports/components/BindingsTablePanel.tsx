import { cn } from "@/lib/utils";
import type { Binding } from "../types";

/* ── Bindings table display ── */

export const BindingsTablePanel = ({ bindings }: { bindings: Binding[] }) => {
  if (bindings.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no bindings yet
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {bindings.map((b) => (
        <div
          key={`${b.name}-${b.sourceModule}`}
          className={cn(
            "viz-slide-in flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs",
            b.value === "uninitialized" || b.value === "undefined"
              ? "border-rose-500/30 bg-rose-500/8"
              : "border-slate-500/30 bg-slate-800/30",
          )}
        >
          <span className="font-semibold text-slate-200">{b.name}</span>
          <span className="text-slate-500">&larr;</span>
          <span className="text-slate-400">{b.sourceModule}</span>
          <span className="ml-auto text-slate-300">{b.value}</span>
          {b.isLive && (
            <span className="shrink-0 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-400">
              live
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
