import { PipelineDiagram } from "@/components/visualization-ui/PipelineDiagram";
import type { TriggerState } from "../types";

export const TriggerPanel = ({ trigger }: { trigger: TriggerState | null }) => {
  if (!trigger) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
          source
        </span>
        <span className="font-mono text-sm font-semibold text-pink-200">
          {trigger.source}
        </span>
        <span className="text-xs text-slate-400">{trigger.note}</span>
      </div>
      <PipelineDiagram stages={trigger.stages} />
    </div>
  );
};
