import { cn } from "@/lib/utils";
import type { RenderDecision } from "../types";
import { decisionStyle, decisionLabel } from "../helpers";

export function RenderDecisionPanel({
  decisions,
}: {
  decisions: RenderDecision[];
}) {
  if (decisions.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no render decisions yet
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {decisions.map((d, index) => (
        <div
          key={`${d.componentId}-${index}`}
          className={cn(
            "viz-slide-in flex flex-wrap items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-xs",
            decisionStyle(d.decision),
          )}
        >
          <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
            {decisionLabel(d.decision)}
          </span>
          <span className="shrink-0 font-semibold">{d.label}</span>
          <span className="break-words text-slate-400">{d.reason}</span>
        </div>
      ))}
    </div>
  );
}
