import { cn } from "@/lib/utils";
import type { GeneratorState } from "../types";
import { STATUS_STYLES } from "../helpers";

export function GeneratorStatePanel({ state }: { state: GeneratorState | null }) {
  if (!state) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        not created
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Status badge */}
      <div
        key={`status-${state.status}`}
        className="viz-slide-in flex items-center justify-between"
      >
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet-300/80">
          Status
        </span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
            STATUS_STYLES[state.status],
          )}
        >
          {state.status}
        </span>
      </div>

      {/* Next argument (incoming value) */}
      {state.nextArg && (
        <div
          key={`arg-${state.nextArg}`}
          className="viz-slide-in rounded-lg border border-cyan-300/25 bg-cyan-400/8 px-3 py-2"
        >
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-cyan-400">{"\u2192"}</span>
            <span className="text-cyan-200/70">.next() received:</span>
            <span className="font-semibold text-cyan-100">{state.nextArg}</span>
          </div>
        </div>
      )}

      {/* Yield value (outgoing value) */}
      {state.yieldValue !== undefined && (
        <div
          key={`yield-${state.yieldValue}-${state.done}`}
          className="viz-slide-in rounded-lg border border-violet-300/25 bg-violet-400/8 px-3 py-2"
        >
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-violet-400">{"\u2190"}</span>
            <span className="text-violet-200/70">
              {state.done ? "returned:" : "yielded:"}
            </span>
            <span className="font-semibold text-violet-100">
              {state.yieldValue}
            </span>
          </div>
        </div>
      )}

      {/* done flag */}
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-violet-200/70">done</span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            state.done
              ? "bg-rose-500/20 text-rose-300"
              : "bg-emerald-500/20 text-emerald-300",
          )}
        >
          {String(state.done)}
        </span>
      </div>
    </div>
  );
}
