import { cn } from "@/lib/utils";
import type { LookupState } from "../types";

export function LookupTracker({ lookup }: { lookup: LookupState | null }) {
  if (!lookup) {
    return (
      <p className="py-4 text-center font-mono text-xs uppercase tracking-[0.22em] text-slate-500/60">
        no lookup in progress
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Identifier being looked up */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
          Resolving
        </span>
        <span className="rounded-lg border border-pink-300/35 bg-pink-400/10 px-2.5 py-1 font-mono text-sm font-semibold text-pink-200">
          {lookup.identifier}
        </span>
      </div>

      {/* Breadcrumb trail */}
      <div className="flex flex-wrap items-center gap-1.5">
        {lookup.path.map((scope, i) => {
          const isLast = i === lookup.path.length - 1;
          const isFoundHere = lookup.result === "found" && lookup.foundIn === scope;
          const isError = lookup.result === "error" && isLast;

          return (
            <div key={`${scope}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg
                  viewBox="0 0 12 8"
                  className="h-2 w-3 flex-shrink-0 text-slate-500/60"
                  aria-hidden="true"
                >
                  <path
                    d="M0 4H8M8 4L5 1M8 4L5 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
              <span
                className={cn(
                  "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                  isFoundHere
                    ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-300"
                    : isError
                      ? "border-red-300/40 bg-red-400/10 text-red-300"
                      : "border-slate-500/30 bg-slate-800/30 text-slate-400",
                )}
              >
                {scope}
              </span>
            </div>
          );
        })}
      </div>

      {/* Result */}
      <div className="flex items-center gap-2">
        {lookup.result === "found" && (
          <span className="rounded-full border border-emerald-500/25 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-medium text-emerald-300">
            Found in {lookup.foundIn}
          </span>
        )}
        {lookup.result === "error" && (
          <span className="rounded-full border border-red-500/25 bg-red-500/15 px-2.5 py-0.5 font-mono text-[10px] font-medium text-red-300">
            ReferenceError
          </span>
        )}
        {lookup.result === "searching" && (
          <span className="rounded-full border border-violet-500/25 bg-violet-500/15 px-2.5 py-0.5 font-mono text-[10px] font-medium text-violet-300">
            Searching...
          </span>
        )}
      </div>
    </div>
  );
}
