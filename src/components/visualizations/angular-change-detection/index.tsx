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
import { ComponentTreeDiagram } from "@/components/visualization-ui/ComponentTreeDiagram";
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
import { ChecksPanel } from "./components/ChecksPanel";
import { TriggerPanel } from "./components/TriggerPanel";
import { SignalGraph } from "./components/SignalGraph";

export const AngularChangeDetection = () => {
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
      tree: currentStep?.tree,
      trigger: currentStep?.trigger,
      checks: currentStep?.checks,
      signals: currentStep?.signals,
    },
    currentStepIndex,
  );

  const showSignalGraph = example.kind === "signals";

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
                dangerouslySetInnerHTML={{
                  __html: currentStep.descriptionHtml,
                }}
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
              title="Component Tree"
              tone="cyan"
              bodyClassName="min-h-[10rem]"
              className={flashes.tree ? "viz-change-flash" : undefined}
            >
              {currentStep ? (
                <ComponentTreeDiagram
                  tree={currentStep.tree}
                  activeNodeId={currentStep.activeNodeId}
                />
              ) : (
                <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
                  waiting
                </p>
              )}
            </NeonPanel>

            <div className="grid gap-4 sm:grid-cols-2">
              <NeonPanel
                title="Trigger"
                tone="violet"
                bodyClassName="min-h-[8rem]"
                className={flashes.trigger ? "viz-change-flash" : undefined}
              >
                <TriggerPanel trigger={currentStep?.trigger ?? null} />
              </NeonPanel>

              {showSignalGraph ? (
                <NeonPanel
                  title="Signal Graph"
                  tone="pink"
                  bodyClassName="min-h-[8rem]"
                  className={flashes.signals ? "viz-change-flash" : undefined}
                >
                  <SignalGraph nodes={currentStep?.signals ?? []} />
                </NeonPanel>
              ) : (
                <NeonPanel
                  title="Checks Performed"
                  tone="green"
                  bodyClassName="min-h-[8rem]"
                  className={flashes.checks ? "viz-change-flash" : undefined}
                >
                  <ChecksPanel checks={currentStep?.checks ?? []} />
                </NeonPanel>
              )}
            </div>

            {showSignalGraph && (
              <NeonPanel
                title="Checks Performed"
                tone="green"
                bodyClassName="min-h-[6rem]"
                className={flashes.checks ? "viz-change-flash" : undefined}
              >
                <ChecksPanel checks={currentStep?.checks ?? []} />
              </NeonPanel>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
