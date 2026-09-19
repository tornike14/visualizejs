"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { TopicLink } from "@/components/visualization-ui/TopicLink";
import {
  ExamplePicker,
  KindBadge,
} from "@/components/visualization-ui/ExamplePicker";
import { SourceCodePanel } from "@/components/visualization-ui/SourceCodePanel";
import {
  SourceGrid,
  VisualizationSection,
} from "@/components/visualization-ui/VisualizationLayout";
import { VisualizationToolbar } from "@/components/visualization-ui/VisualizationToolbar";
import { useExampleTopic } from "@/hooks/useExampleTopic";
import { useChangeFlash } from "@/hooks/useChangeFlash";

import { EXAMPLES } from "./data";
import { kindBadgeClass, kindLabel } from "./helpers";
import { StackPanel } from "./components/StackPanel";
import { HeapPanel } from "./components/HeapPanel";

/* -- Main Component -- */

export const HeapStack = () => {
  const {
    example,
    activeExampleId,
    handleExampleChange,
    playback,
    currentStep,
  } = useExampleTopic(EXAMPLES);
  const { currentStepIndex } = playback;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      stack: currentStep?.stackFrames,
      heap: currentStep?.heapAllocations,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  return (
    <>
      <VisualizationToolbar
        playback={playback}
        totalSteps={example.steps.length}
        descriptionHtml={currentStep?.descriptionHtml}
        descriptionFlash={flashes.description}
        leading={
          <ExamplePicker
            examples={EXAMPLES}
            activeId={activeExampleId}
            onSelect={handleExampleChange}
            renderBadge={(ex) => (
              <KindBadge className={kindBadgeClass(ex.kind)}>
                {kindLabel(ex.kind)}
              </KindBadge>
            )}
          />
        }
      />

      <VisualizationSection>
        {/* GC sweep animations (topic-specific; shared anims are in globals.css) */}
        <style>{`
          .hs-gc-scanbar {
            background: linear-gradient(
              180deg,
              transparent 0%,
              rgba(244, 114, 182, 0.12) 45%,
              rgba(244, 114, 182, 0.35) 50%,
              rgba(244, 114, 182, 0.12) 55%,
              transparent 100%
            );
            background-size: 100% 300%;
            animation: hs-scan 1.6s ease-in-out infinite;
          }

          @keyframes hs-scan {
            0%   { background-position: 0% 0%; }
            50%  { background-position: 0% 100%; }
            100% { background-position: 0% 0%; }
          }

          .hs-gc-shake {
            animation: hs-shake 0.4s ease-in-out infinite;
          }

          @keyframes hs-shake {
            0%, 100% { transform: translateX(0); }
            25%      { transform: translateX(-2px); }
            75%      { transform: translateX(2px); }
          }

          .hs-gc-swept {
            animation: hs-swept-in 0.5s ease-out both;
          }

          @keyframes hs-swept-in {
            from { opacity: 0; transform: scale(0.95); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>

        <SourceGrid>
          <SourceCodePanel
            lines={example.codeLines}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
          />

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <NeonPanel
                title="Stack"
                tone="amber"
                bodyClassName="min-h-[10rem]"
                className={flashes.stack ? "viz-change-flash" : undefined}
              >
                <StackPanel frames={currentStep?.stackFrames ?? []} />
              </NeonPanel>

              <NeonPanel
                title="Heap"
                tone="violet"
                bodyClassName="min-h-[10rem]"
                className={flashes.heap ? "viz-change-flash" : undefined}
              >
                <HeapPanel
                  allocations={currentStep?.heapAllocations ?? []}
                  gcSweep={currentStep?.gcSweep ?? false}
                />
              </NeonPanel>
            </div>

            <div
              className={
                flashes.console ? "viz-change-flash rounded-3xl" : undefined
              }
            >
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>

            {example.kind === "gc" &&
              currentStepIndex === example.steps.length - 1 && (
                <div className="flex justify-center pt-1">
                  <TopicLink
                    href="/javascript/garbage-collection"
                    label="Explore GC & Memory Leaks in depth"
                  />
                </div>
              )}
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
