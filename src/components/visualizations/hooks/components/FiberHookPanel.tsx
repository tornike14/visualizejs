import type { FiberHookState } from "../types";

interface FiberHookPanelProps {
  fiberState: FiberHookState | null;
}

export function FiberHookPanel({ fiberState }: FiberHookPanelProps) {
  if (!fiberState) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-600/30 bg-slate-800/40 px-3 py-2.5">
        <div className="mb-2 text-xs font-semibold text-slate-300">
          {fiberState.fiberLabel}
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">memoizedState</span>
          <span className="text-slate-500">-&gt;</span>
          <span className="text-cyan-400">
            {fiberState.memoizedStatePointer !== null
              ? `Hook #${fiberState.memoizedStatePointer}`
              : "null"}
          </span>
        </div>
      </div>
    </div>
  );
}
