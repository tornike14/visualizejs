"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { ExampleSelector } from "@/components/visualization-ui/ExampleSelector";
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { cn } from "@/lib/utils";
import {
  VISUALIZATION_PANEL_TITLES,
  VISUALIZATION_EMPTY_STATES,
} from "@/lib/visualization/uiCopy";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { EXAMPLES } from "./data";
import { kindBadgeClass, kindLabel } from "./helpers";
import { CodePanel } from "./components/CodePanel";

export function Hoisting() {
  const [activeExampleId, setActiveExampleId] = useState(EXAMPLES[0].id);

  const example = EXAMPLES.find((e) => e.id === activeExampleId) ?? EXAMPLES[0];

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
  } = useStepPlayback({
    totalSteps: example.steps.length,
    initialStep: -1,
    resetKey: activeExampleId,
  });

  const currentStep = currentStepIndex >= 0 ? example.steps[currentStepIndex] : null;

  const handleExampleChange = (id: string) => {
    setActiveExampleId(id);
  };

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
                  <Badge variant="outline" className={cn("text-[10px]", kindBadgeClass(ex.kind))}>
                    {kindLabel(ex.kind)}
                  </Badge>
                )}
              />
              <Badge variant="outline" className={cn("text-[10px]", kindBadgeClass(example.kind))}>
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
            />
          </div>

          <div
            className="app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5"
            aria-live="polite"
            role="status"
          >
            {currentStep?.explanation ? (
              <p
                className="viz-step-desc text-center text-sm text-slate-300"
                dangerouslySetInnerHTML={{ __html: currentStep.explanation }}
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
        <div className="grid gap-4 xl:grid-cols-2">
          <CodePanel
            title={VISUALIZATION_PANEL_TITLES.sourceCode}
            tone="amber"
            lines={example.original}
            highlightIds={currentStep?.highlightOriginal ?? []}
            floatingIds={[]}
            tdzIds={[]}
          />
          <CodePanel
            title="How JS Sees It (After Hoisting)"
            tone="cyan"
            lines={example.hoisted}
            highlightIds={currentStep?.highlightHoisted ?? []}
            floatingIds={currentStep?.floatingLineIds ?? []}
            tdzIds={currentStep?.tdzLineIds ?? []}
          />
        </div>

        <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
      </section>
    </>
  );
}
