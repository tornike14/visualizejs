import { cn } from "@/lib/utils";
import { PROMISE_STATE_BORDER } from "../helpers";
import type { PromiseObj } from "../types";

export const PromiseCards = ({ promises }: { promises: PromiseObj[] }) => {
  if (promises.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {promises.map((p, index) => (
        <div
          key={`${p.name}-${p.state}-${index}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2.5",
            PROMISE_STATE_BORDER[p.state]
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold">{p.name}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
                p.state === "pending" && "bg-slate-500/20 text-slate-400",
                p.state === "fulfilled" && "bg-emerald-500/20 text-emerald-300",
                p.state === "rejected" && "bg-rose-500/20 text-rose-300"
              )}
            >
              {p.state}
            </span>
          </div>
          <div className="mt-1 font-mono text-xs opacity-80">
            value: {p.value}
          </div>
        </div>
      ))}
    </div>
  );
};
