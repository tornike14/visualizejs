import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { PipelineDiagram } from "@/components/visualization-ui/PipelineDiagram";
import { MessageFlow } from "@/components/visualization-ui/MessageFlow";
import { cn } from "@/lib/utils";
import type { HttpRequestExample, HttpRequestStep } from "../types";
import { KeyValueTable } from "./KeyValueTable";

interface LifecyclePanelsProps {
  example: HttpRequestExample;
  step: HttpRequestStep | null;
  flashes: { stages?: boolean; messages?: boolean; tableRows?: boolean };
}

const WAITING = (
  <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
    waiting
  </p>
);

export const LifecyclePanels = ({
  example,
  step,
  flashes,
}: LifecyclePanelsProps) => {
  const isVertical = example.pipelineOrientation === "vertical";

  const pipelinePanel = (
    <NeonPanel
      title={example.pipelineTitle}
      tone="cyan"
      bodyClassName="min-h-[8rem]"
      className={cn(flashes.stages && "viz-change-flash")}
    >
      {step ? (
        <div className="space-y-3">
          {step.elapsed && (
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300/80">
              elapsed <span className="text-cyan-100">{step.elapsed}</span>
            </p>
          )}
          <PipelineDiagram
            stages={step.stages}
            orientation={example.pipelineOrientation}
          />
        </div>
      ) : (
        WAITING
      )}
    </NeonPanel>
  );

  const tablePanel = (
    <NeonPanel
      title={example.tableTitle}
      tone="violet"
      bodyClassName="min-h-[8rem]"
      className={cn(flashes.tableRows && "viz-change-flash")}
    >
      {step ? <KeyValueTable rows={step.tableRows} /> : WAITING}
    </NeonPanel>
  );

  const messagesPanel = (
    <NeonPanel
      title="Messages"
      tone="green"
      bodyClassName="min-h-[8rem]"
      className={cn(flashes.messages && "viz-change-flash")}
    >
      <MessageFlow
        actors={example.actors}
        messages={step?.messages ?? []}
        activeActorId={step?.activeActorId}
        emptyLabel="no messages yet"
      />
    </NeonPanel>
  );

  if (isVertical) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {pipelinePanel}
          {tablePanel}
        </div>
        {messagesPanel}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pipelinePanel}
      <div className="grid gap-4 sm:grid-cols-2">
        {tablePanel}
        {messagesPanel}
      </div>
    </div>
  );
};
