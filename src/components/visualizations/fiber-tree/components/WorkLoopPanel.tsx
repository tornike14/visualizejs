import { cn } from "@/lib/utils";
import type { WorkLoopPhase } from "../types";
import { phaseStyle, phaseLabel } from "../helpers";

interface WorkLoopPanelProps {
  phase: WorkLoopPhase;
  currentFiber: string | null;
  pendingWork: string[];
}

export function WorkLoopPanel({
  phase,
  currentFiber,
  pendingWork,
}: WorkLoopPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Phase</span>
        <span
          className={cn(
            "rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase",
            phaseStyle(phase),
          )}
        >
          {phaseLabel(phase)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Current</span>
        <span className="font-mono text-xs text-slate-200">
          {currentFiber ?? "none"}
        </span>
      </div>

      <div>
        <span className="text-xs text-slate-400">Pending</span>
        {pendingWork.length === 0 ? (
          <p className="mt-1 font-mono text-xs text-slate-500">none</p>
        ) : (
          <div className="mt-1 flex flex-wrap gap-1">
            {pendingWork.map((item) => (
              <span
                key={item}
                className="rounded bg-slate-700/50 px-1.5 py-0.5 font-mono text-[10px] text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
