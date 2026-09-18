import { cn } from "@/lib/utils";

export type PipelineStageStatus = "pending" | "active" | "done" | "skipped";

export interface PipelineStage {
  id: string;
  label: string;
  /** Short line under the label, for example "DNS lookup" or "12 ms". */
  detail?: string;
  status: PipelineStageStatus;
}

interface PipelineDiagramProps {
  stages: PipelineStage[];
  /** Stack vertically instead of flowing left to right. */
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const STAGE_STYLES: Record<PipelineStageStatus, string> = {
  pending: "border-slate-600/50 bg-slate-800/40 text-slate-400",
  active:
    "border-cyan-300/50 bg-cyan-400/12 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.18)]",
  done: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
  skipped: "border-slate-700/40 bg-slate-900/40 text-slate-600 line-through",
};

const CONNECTOR_STYLES: Record<PipelineStageStatus, string> = {
  pending: "bg-slate-600/40",
  active: "bg-cyan-400/60",
  done: "bg-emerald-400/50",
  skipped: "bg-slate-700/40",
};

/**
 * Ordered stages with one highlighted as active. Used for request lifecycles,
 * model forward passes, and any process that moves through fixed phases.
 */
export const PipelineDiagram = ({
  stages,
  orientation = "horizontal",
  className,
}: PipelineDiagramProps) => {
  const isVertical = orientation === "vertical";

  return (
    <ol
      className={cn(
        "flex",
        isVertical ? "flex-col items-stretch" : "flex-wrap items-stretch gap-y-3",
        className,
      )}
      aria-label="Pipeline stages"
    >
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;
        return (
          <li
            key={stage.id}
            className={cn(
              "flex items-center",
              isVertical ? "flex-col items-stretch" : "min-w-0",
            )}
          >
            <div
              className={cn(
                "viz-slide-in flex min-w-[6.5rem] flex-col items-center justify-center rounded-xl border px-3 py-2 text-center transition-all duration-300",
                STAGE_STYLES[stage.status],
              )}
              aria-current={stage.status === "active" ? "step" : undefined}
            >
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
                {stage.label}
              </span>
              {stage.detail && (
                <span className="mt-0.5 text-[11px] opacity-80">{stage.detail}</span>
              )}
            </div>
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "transition-colors",
                  isVertical ? "mx-auto h-4 w-px" : "h-px w-5 shrink-0",
                  CONNECTOR_STYLES[stage.status === "done" ? "done" : stage.status === "active" ? "active" : "pending"],
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};
