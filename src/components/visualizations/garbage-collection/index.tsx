"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import {
  CodeBlock,
  type CodeBlockLine,
} from "@/components/visualization-ui/CodeBlock";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { ExampleSelector } from "@/components/visualization-ui/ExampleSelector";
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { cn } from "@/lib/utils";
import {
  VISUALIZATION_PANEL_TITLES,
  VISUALIZATION_EMPTY_STATES,
} from "@/lib/visualization/uiCopy";
import { TopicLink } from "@/components/visualization-ui/TopicLink";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { EXAMPLES } from "./data";
import { kindBadgeClass, kindLabel } from "./helpers";
import { RootsPanel } from "./components/RootsPanel";
import { GCHeapPanel } from "./components/GCHeapPanel";

export function GarbageCollection() {
  const [activeExampleId, setActiveExampleId] = useState(EXAMPLES[0].id);

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
      roots: currentStep?.roots,
      heap: currentStep?.heapObjects,
      console: currentStep?.consoleOutput,
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
                onSelect={setActiveExampleId}
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
            />
          </div>

          <div
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
        {/* GC sweep animations (topic-specific; shared anims are in globals.css) */}
        <style>{`
          .gc-scanbar {
            height: 100%;
            background: linear-gradient(
              180deg,
              transparent 0%,
              rgba(244, 114, 182, 0.12) 45%,
              rgba(244, 114, 182, 0.35) 50%,
              rgba(244, 114, 182, 0.12) 55%,
              transparent 100%
            );
            background-size: 100% 300%;
            animation: gc-scan 1.6s ease-in-out infinite;
          }

          @keyframes gc-scan {
            0%   { background-position: 0% 0%; }
            50%  { background-position: 0% 100%; }
            100% { background-position: 0% 0%; }
          }

          .gc-shake {
            animation: gc-shake 0.4s ease-in-out infinite;
          }

          @keyframes gc-shake {
            0%, 100% { transform: translateX(0); }
            25%      { transform: translateX(-2px); }
            75%      { transform: translateX(2px); }
          }

          .gc-swept {
            animation: gc-swept-in 0.5s ease-out both;
          }

          @keyframes gc-swept-in {
            from { opacity: 0; transform: scale(0.95); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>

        <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]">
          <NeonPanel
            title={VISUALIZATION_PANEL_TITLES.sourceCode}
            tone="amber"
            bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
          >
            <CodeBlock
              lines={example.codeLines.map(
                (line): CodeBlockLine => {
                  const isActive = currentStep?.activeLine === line.num;
                  const isDone =
                    currentStep?.doneLines.includes(line.num) ?? false;
                  return {
                    key: line.num,
                    lineNumber: line.num,
                    text: line.text,
                    className: cn(
                      isActive && "is-active",
                      isDone && !isActive && "is-done"
                    ),
                  };
                }
              )}
            />
          </NeonPanel>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <NeonPanel
                title="GC Roots"
                tone="green"
                bodyClassName="min-h-[10rem]"
                className={flashes.roots ? "viz-change-flash" : undefined}
              >
                <RootsPanel roots={currentStep?.roots ?? []} />
              </NeonPanel>

              <NeonPanel
                title="Heap"
                tone="violet"
                bodyClassName="min-h-[10rem]"
                className={flashes.heap ? "viz-change-flash" : undefined}
              >
                <GCHeapPanel
                  objects={currentStep?.heapObjects ?? []}
                  gcSweep={currentStep?.gcSweep ?? false}
                />
              </NeonPanel>
            </div>

            <div
              className={flashes.console ? "viz-change-flash rounded-3xl" : undefined}
            >
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>

            {example.id === "mark-and-sweep" &&
              currentStepIndex === example.steps.length - 1 && (
                <div className="flex justify-center pt-1">
                  <TopicLink
                    href="/javascript/heap-stack"
                    label="See how Heap & Stack memory works"
                  />
                </div>
              )}
          </div>
        </div>
      </section>
    </>
  );
}
