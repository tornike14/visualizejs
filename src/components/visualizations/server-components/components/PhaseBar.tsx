import { cn } from "@/lib/utils";
import type { RenderPhase } from "../types";
import { phaseStyle, phaseLabel } from "../helpers";

const PHASES: RenderPhase[] = [
  "server-render",
  "serialization",
  "client-hydration",
  "complete",
];

const PHASE_ORDER: Record<RenderPhase, number> = {
  idle: -1,
  "server-render": 0,
  serialization: 1,
  "client-hydration": 2,
  complete: 3,
};

export function PhaseBar({ currentPhase }: { currentPhase: RenderPhase }) {
  const currentOrder = PHASE_ORDER[currentPhase];

  return (
    <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
      {PHASES.map((phase) => {
        const isActive = phase === currentPhase;
        const isDone = PHASE_ORDER[phase] < currentOrder;

        return (
          <div
            key={phase}
            className={cn(
              "flex items-center justify-center rounded-full border px-2 py-1 text-center font-mono text-[10px] font-bold uppercase transition-all",
              isActive && phaseStyle(phase),
              isDone &&
                "border-emerald-500/20 bg-emerald-500/5 text-emerald-400/60",
              !isActive &&
                !isDone &&
                "border-slate-600/30 bg-slate-800/30 text-slate-600",
            )}
          >
            {phaseLabel(phase)}
          </div>
        );
      })}
    </div>
  );
}
