"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import {
  CodeBlock,
  type CodeBlockLine,
} from "@/components/visualization-ui/CodeBlock";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { ExampleSelector } from "@/components/visualization-ui/ExampleSelector";
import { MetricBars, type MetricBar } from "@/components/visualization-ui/MetricBars";
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { cn } from "@/lib/utils";
import {
  VISUALIZATION_PANEL_TITLES,
  VISUALIZATION_EMPTY_STATES,
} from "@/lib/visualization/uiCopy";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { EXAMPLES } from "./data";
import { kindBadgeClass, kindLabel } from "./helpers";
import { ComputationGraph } from "./components/ComputationGraph";
import { GradientTable } from "./components/GradientTable";
import { ParameterTable } from "./components/ParameterTable";
import type { LossPoint } from "./types";

const lossBar = (point: LossPoint): MetricBar => ({
  id: point.id,
  label: point.label,
  value: point.ratio,
  display: point.display,
  tone: point.overshoot ? "rose" : "pink",
  active: point.active,
});

export const Backpropagation = () => {
  const [activeExampleId, setActiveExampleId] = useState(EXAMPLES[0].id);

  const handleExampleChange = (id: string) => {
    setActiveExampleId(id);
  };

  const example =
    EXAMPLES.find((e) => e.id === activeExampleId) ?? EXAMPLES[0];

  const {
    currentStepIndex,
    isPlaying,
    speedLevel,
    speedLabel,
    canStep,
    canStepBack,
    togglePlay,
    step: handleStep,
    stepBack: handleStepBack,
    reset: handleReset,
    setSpeedLevel,
    jumpTo,
  } = useStepPlayback({
    totalSteps: example.steps.length,
    initialStep: -1,
    resetKey: activeExampleId,
  });

  const currentStep =
    currentStepIndex >= 0 ? example.steps[currentStepIndex] : null;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      graph: currentStep?.graph,
      gradients: currentStep?.gradients,
      parameters: currentStep?.parameters,
      loss: currentStep?.lossHistory,
    },
    currentStepIndex,
  );

  return (
    <>
      <ToolbarPortal>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <ExampleSelector
                examples={EXAMPLES}
                activeId={activeExampleId}
                onSelect={handleExampleChange}
                renderBadge={(ex) => (
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", kindBadgeClass(ex.kind))}
                  >
                    {kindLabel(ex.kind)}
                  </Badge>
                )}
              />
              <Badge
                variant="outline"
                className={cn("text-[10px]", kindBadgeClass(example.kind))}
              >
                {kindLabel(example.kind)}
              </Badge>
            </div>

            <TransportControls
              isPlaying={isPlaying}
              canStep={canStep}
              canStepBack={canStepBack}
              stepIndex={currentStepIndex}
              totalSteps={example.steps.length}
              speedLevel={speedLevel}
              speedLabel={speedLabel}
              onTogglePlay={togglePlay}
              onStep={handleStep}
              onStepBack={handleStepBack}
              onReset={handleReset}
              onSpeedLevelChange={setSpeedLevel}
              onJumpTo={jumpTo}
            />
          </div>

          <div
            role="status"
            aria-live="polite"
            className={cn(
              "app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5",
              flashes.description && "viz-change-flash-pill",
            )}
          >
            {currentStep?.descriptionHtml ? (
              <p
                className="viz-step-desc text-center text-sm text-slate-300"
                dangerouslySetInnerHTML={{ __html: currentStep.descriptionHtml }}
              />
            ) : (
              <p className="text-center text-sm text-slate-500">
                {VISUALIZATION_EMPTY_STATES.stepDescription}
              </p>
            )}
          </div>
        </div>
      </ToolbarPortal>

      <section className="relative flex flex-col gap-4 px-1 py-2 text-slate-100 sm:px-2 sm:py-3 lg:px-3 lg:py-4">
        <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]">
          <NeonPanel
            title={VISUALIZATION_PANEL_TITLES.sourceCode}
            tone="amber"
            bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
          >
            <CodeBlock
              lines={example.codeLines.map((line): CodeBlockLine => {
                const isActive = currentStep?.activeLine === line.num;
                const isDone =
                  currentStep?.doneLines.includes(line.num) ?? false;
                return {
                  key: line.num,
                  lineNumber: line.num,
                  text: line.text,
                  className: cn(
                    isActive && "is-active",
                    isDone && !isActive && "is-done",
                  ),
                };
              })}
            />
          </NeonPanel>

          <div className="space-y-4">
            <NeonPanel
              title="Computation Graph"
              tone="cyan"
              bodyClassName="min-h-[8rem]"
              className={flashes.graph ? "viz-change-flash" : undefined}
            >
              <ComputationGraph
                nodes={currentStep?.graph ?? []}
                phase={currentStep?.phase ?? "idle"}
              />
            </NeonPanel>

            <div className="grid gap-4 sm:grid-cols-2">
              <NeonPanel
                title="Gradients"
                tone="violet"
                bodyClassName="min-h-[8rem]"
                className={flashes.gradients ? "viz-change-flash" : undefined}
              >
                <GradientTable entries={currentStep?.gradients ?? []} />
              </NeonPanel>

              <NeonPanel
                title="Parameters"
                tone="green"
                bodyClassName="min-h-[8rem]"
                className={flashes.parameters ? "viz-change-flash" : undefined}
              >
                <ParameterTable rows={currentStep?.parameters ?? []} />
              </NeonPanel>
            </div>

            <NeonPanel
              title="Loss"
              tone="pink"
              bodyClassName="min-h-[5rem]"
              className={flashes.loss ? "viz-change-flash" : undefined}
            >
              <MetricBars
                bars={(currentStep?.lossHistory ?? []).map(lossBar)}
                emptyLabel="no loss computed yet"
              />
            </NeonPanel>
          </div>
        </div>
      </section>
    </>
  );
};
