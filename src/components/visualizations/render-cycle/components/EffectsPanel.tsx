import { cn } from "@/lib/utils";
import type { EffectEntry } from "../types";
import { effectStatusStyle } from "../helpers";

interface EffectsPanelProps {
  effects: EffectEntry[];
}

export function EffectsPanel({ effects }: EffectsPanelProps) {
  if (effects.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no effects
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {effects.map((effect, index) => (
        <div
          key={`${effect.type}-${effect.label}-${index}`}
          className={cn(
            "viz-slide-in flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs",
            effectStatusStyle(effect.status),
          )}
        >
          <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
            {effect.type}
          </span>
          <span className="text-slate-200">{effect.label}</span>
          <span className="ml-auto shrink-0 text-[10px] uppercase">
            {effect.status}
          </span>
        </div>
      ))}
    </div>
  );
}
