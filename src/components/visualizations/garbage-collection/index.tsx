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
import { RootsPanel } from "./components/RootsPanel";
import { GCHeapPanel } from "./components/GCHeapPanel";

export const GarbageCollection = () => {
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
      roots: currentStep?.roots,
      heap: currentStep?.heapObjects,
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

        <SourceGrid>
          <SourceCodePanel
            lines={example.codeLines}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
          />

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
              className={
                flashes.console ? "viz-change-flash rounded-3xl" : undefined
              }
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
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
