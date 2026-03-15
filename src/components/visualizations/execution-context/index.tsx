"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import {
  CodeBlock,
  type CodeBlockLine,
} from "@/components/visualization-ui/CodeBlock";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { cn } from "@/lib/utils";
import {
  VISUALIZATION_PANEL_TITLES,
  VISUALIZATION_EMPTY_STATES,
} from "@/lib/visualization/uiCopy";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { CODE_LINES, STEPS } from "./data";
import { PhaseIndicator } from "./components/PhaseIndicator";
import { PhaseDetailPanel } from "./components/PhaseDetailPanel";
import { ReturnIndicator } from "./components/ReturnIndicator";
import { CallStack } from "./components/CallStack";

export function ExecutionContext() {
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
  } = useStepPlayback({ totalSteps: STEPS.length, initialStep: -1 });

  const currentStep =
    currentStepIndex >= 0 ? STEPS[currentStepIndex] : null;

  const topEC = currentStep?.stack[0] ?? null;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      stack: currentStep?.stack,
      phase: topEC?.phase,
      detail: currentStep?.phaseDetail,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex
  );

  return (
    <>
      {/* Toolbar */}
      <ToolbarPortal>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <TransportControls
              isPlaying={isPlaying}
              canStep={canStep}
              canStepBack={canStepBack}
              stepIndex={currentStepIndex}
              totalSteps={STEPS.length}
              speedLevel={speedLevel}
              speedLabel={speedLabel}
              onTogglePlay={togglePlay}
              onStep={handleStep}
              onStepBack={handleStepBack}
              onReset={handleReset}
              onSpeedLevelChange={setSpeedLevel}
            />
          </div>

          <div
            role="status"
            aria-live="polite"
            className={cn(
              "app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5",
              flashes.description && "viz-change-flash-pill"
            )}
          >
            {currentStep ? (
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

      {/* Main visualization */}
      <section className="relative flex flex-col gap-4 px-1 py-2 text-slate-100 sm:px-2 sm:py-3 lg:px-3 lg:py-4">
        {/* Phase indicator - always visible */}
        <NeonPanel
          title="Current Phase"
          tone="violet"
          className={flashes.phase ? "viz-change-flash" : undefined}
        >
          <PhaseIndicator phase={topEC?.phase ?? null} />
        </NeonPanel>

        <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]">
          {/* Left: Source Code */}
          <NeonPanel
            title={VISUALIZATION_PANEL_TITLES.sourceCode}
            tone="amber"
            bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
          >
            <CodeBlock
              lines={CODE_LINES.map((line): CodeBlockLine => {
                const isActive = currentStep?.activeLine === line.num;
                const isDone =
                  currentStep?.doneLines.includes(line.num) ?? false;
                const isHighlighted =
                  currentStep?.highlightLines.includes(line.num) ?? false;
                return {
                  key: line.num,
                  lineNumber: line.num,
                  text: line.text,
                  className: cn(
                    isActive && "is-active",
                    isDone && !isActive && "is-done",
                    isHighlighted && !isActive && !isDone && "is-highlighted"
                  ),
                };
              })}
            />
          </NeonPanel>

          {/* Right: Stack + Details + Console */}
          <div className="space-y-4">
            {/* Execution Context Stack */}
            <NeonPanel
              title="Execution Context Stack"
              tone="cyan"
              bodyClassName="min-h-[10rem]"
              className={flashes.stack ? "viz-change-flash" : undefined}
            >
              <CallStack
                stack={currentStep?.stack ?? []}
                scopeLinks={currentStep?.scopeLinks ?? []}
              />
            </NeonPanel>

            {/* Activity panel - always visible */}
            <NeonPanel
              title="Activity"
              tone="green"
              bodyClassName="min-h-[4rem]"
              className={flashes.detail ? "viz-change-flash" : undefined}
            >
              {currentStep?.phaseDetail ? (
                <PhaseDetailPanel detail={currentStep.phaseDetail} />
              ) : currentStep?.returnValue ? (
                <ReturnIndicator value={currentStep.returnValue} />
              ) : (
                <p className="py-3 text-center font-mono text-xs uppercase tracking-[0.22em] text-slate-500/60">
                  waiting for execution
                </p>
              )}
            </NeonPanel>

            {/* Console */}
            <div
              className={
                flashes.console ? "viz-change-flash rounded-3xl" : undefined
              }
            >
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
