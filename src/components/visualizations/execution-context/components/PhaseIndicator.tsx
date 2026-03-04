import { cn } from "@/lib/utils";

/** Phase indicator: two segments, active one glows */
export function PhaseIndicator({ phase }: { phase: "creation" | "execution" | null }) {
  const isCreation = phase === "creation";
  const isExecution = phase === "execution";

  return (
    <div className="flex items-center gap-2">
      {/* Creation segment */}
      <div
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 transition-all duration-500",
          isCreation
            ? "border-violet-400/40 bg-violet-500/15 shadow-[0_0_12px_rgba(196,181,253,0.15)]"
            : "border-slate-600/30 bg-slate-800/20"
        )}
      >
        <div
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-500",
            isCreation ? "bg-violet-400 shadow-[0_0_6px_rgba(196,181,253,0.6)]" : "bg-slate-600"
          )}
        />
        <span
          className={cn(
            "font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300",
            isCreation ? "text-violet-300" : "text-slate-500"
          )}
        >
          Creation
        </span>
      </div>

      {/* Arrow between phases */}
      <svg viewBox="0 0 12 8" className="h-2 w-3 flex-shrink-0 text-slate-500/60" aria-hidden="true">
        <path d="M0 4H8M8 4L5 1M8 4L5 7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Execution segment */}
      <div
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 transition-all duration-500",
          isExecution
            ? "border-emerald-400/40 bg-emerald-500/15 shadow-[0_0_12px_rgba(52,211,153,0.15)]"
            : "border-slate-600/30 bg-slate-800/20"
        )}
      >
        <div
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-500",
            isExecution ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-slate-600"
          )}
        />
        <span
          className={cn(
            "font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300",
            isExecution ? "text-emerald-300" : "text-slate-500"
          )}
        >
          Execution
        </span>
      </div>
    </div>
  );
}
