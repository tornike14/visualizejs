import { cn } from "@/lib/utils";
import type { EffectEntry, EffectPhase } from "../types";
import { phaseLabel, phaseColorClass } from "../helpers";

/* ── Effect timeline display ── */

const PhaseBadge = ({ phase }: { phase: EffectPhase }) => (
  <span
    className={cn(
      "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
      phaseColorClass(phase),
    )}
  >
    {phaseLabel(phase)}
  </span>
);

export const EffectTimelinePanel = ({
  effects,
  currentPhase,
}: {
  effects: EffectEntry[];
  currentPhase: EffectPhase;
}) => {
  if (effects.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no effects
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Current phase indicator */}
      {currentPhase !== "idle" && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-500/20 bg-slate-800/40 px-3 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Phase
          </span>
          <PhaseBadge phase={currentPhase} />
        </div>
      )}

      {/* Effect entries */}
      {effects.map((entry) => (
        <div
          key={entry.id}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2 font-mono text-xs",
            entry.phase === "effect-run"
              ? "border-violet-500/30 bg-violet-500/8"
              : entry.phase === "cleanup-run"
                ? "border-rose-500/30 bg-rose-500/8"
                : "border-slate-500/30 bg-slate-800/30",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-200">{entry.label}</span>
            <PhaseBadge phase={entry.phase} />
          </div>
          {entry.deps && (
            <div className="mt-1 text-slate-400">
              deps: <span className="text-slate-300">{entry.deps}</span>
              {entry.cleanupPending && (
                <span className="ml-2 text-rose-400">(cleanup pending)</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
