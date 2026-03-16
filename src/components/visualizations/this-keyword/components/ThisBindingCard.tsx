import { cn } from "@/lib/utils";
import { ruleColorClass } from "../helpers";
import type { ThisBinding } from "../types";

export function ThisBindingCard({ binding }: { binding: ThisBinding | null }) {
  if (!binding) {
    return (
      <p className="py-6 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60 uppercase">
        no binding yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Active Rule */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
          Active Rule
        </span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
            ruleColorClass(binding.rule)
          )}
        >
          {binding.ruleLabel}
        </span>
      </div>

      {/* Call expression */}
      <div className="rounded-lg border border-slate-500/30 bg-slate-800/30 px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
          Invocation
        </span>
        <p className="mt-0.5 font-mono text-sm text-slate-100">
          {binding.callExpression}
        </p>
      </div>

      {/* this => value */}
      <div className="flex items-center gap-3">
        <span className="rounded-lg border border-pink-300/35 bg-pink-400/10 px-3 py-1.5 font-mono text-sm font-semibold text-pink-200">
          this
        </span>
        <svg
          viewBox="0 0 24 8"
          className="h-2 w-6 flex-shrink-0 text-pink-400/70"
          aria-hidden="true"
        >
          <path
            d="M0 4H20M20 4L16 1M20 4L16 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span
          className={cn(
            "rounded-lg border px-3 py-1.5 font-mono text-sm font-semibold",
            binding.value === "undefined"
              ? "border-rose-300/35 bg-rose-400/10 text-rose-200"
              : "border-emerald-300/35 bg-emerald-400/10 text-emerald-200"
          )}
        >
          {binding.value}
        </span>
      </div>
    </div>
  );
}
