import { cn } from "@/lib/utils";
import type { PhaseInfo } from "../types";
import { phaseStyle, phaseLabel } from "../helpers";

interface PhaseIndicatorProps {
  phaseInfo: PhaseInfo | null;
}

export function PhaseIndicator({ phaseInfo }: PhaseIndicatorProps) {
  if (!phaseInfo) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Phase</span>
        <span
          className={cn(
            "rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
            phaseStyle(phaseInfo.phase),
          )}
        >
          {phaseLabel(phaseInfo.phase)}
        </span>
      </div>

      {phaseInfo.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {phaseInfo.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-700/50 px-1.5 py-0.5 font-mono text-[10px] text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
