import { cn } from "@/lib/utils";
import type { HookSnapshot } from "../types";

export const HookStatePanel = ({ hooks }: { hooks: HookSnapshot[] }) => {
  if (hooks.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {hooks.map((hook, index) => {
        const hasPending = hook.pending !== null;
        return (
          <div
            key={`${hook.name}|${hook.current}|${hook.pending ?? ""}`}
            className={cn(
              "viz-slide-in rounded-lg border px-3 py-2.5 font-mono text-xs",
              hasPending
                ? "border-amber-400/35 bg-amber-500/8"
                : "border-slate-600/30 bg-slate-800/40",
            )}
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                Hook #{index}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                useState
              </span>
              <span className="text-slate-200">{hook.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">memoizedState</span>
              <span className="text-slate-500">-&gt;</span>
              <span className="text-cyan-300">{hook.current}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-slate-400">pending</span>
              <span className="text-slate-500">-&gt;</span>
              {hasPending ? (
                <span className="text-amber-300">{hook.pending}</span>
              ) : (
                <span className="text-slate-500">none</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
