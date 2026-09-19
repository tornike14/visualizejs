import { cn } from "@/lib/utils";
import {
  FN_CARD_STYLES,
  FN_STATUS_STYLES,
  PROMISE_STATE_STYLES,
} from "../helpers";
import type { AsyncFnState } from "../types";

export const FunctionCards = ({ functions }: { functions: AsyncFnState[] }) => {
  if (functions.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no async calls yet
      </p>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {functions.map((fn) => (
        <div
          key={fn.id}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2.5",
            FN_CARD_STYLES[fn.status],
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-xs font-semibold text-slate-100">
              {fn.name}
            </span>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
                FN_STATUS_STYLES[fn.status],
              )}
            >
              {fn.status}
            </span>
          </div>
          {fn.status === "suspended" && fn.suspendedAt !== null && (
            <div className="mt-1 font-mono text-[11px] text-amber-200/80">
              parked at line {fn.suspendedAt}
            </div>
          )}
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 font-mono text-[11px] text-slate-400">
            <span>{fn.promise.name}</span>
            <span
              className={cn(
                "font-semibold",
                PROMISE_STATE_STYLES[fn.promise.state],
              )}
            >
              {fn.promise.state}
            </span>
            <span className="break-all text-slate-300/80">
              {fn.promise.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
