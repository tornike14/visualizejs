"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { ComponentTreeDiagram } from "@/components/visualization-ui/ComponentTreeDiagram";
import {
  ExamplePicker,
  KindBadge,
} from "@/components/visualization-ui/ExamplePicker";
import { SourceCodePanel } from "@/components/visualization-ui/SourceCodePanel";
import {
  SourceGrid,
  VisualizationSection,
  WaitingPlaceholder,
} from "@/components/visualization-ui/VisualizationLayout";
import { VisualizationToolbar } from "@/components/visualization-ui/VisualizationToolbar";
import { useExampleTopic } from "@/hooks/useExampleTopic";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { EXAMPLES } from "./data";
import { kindBadgeClass, kindLabel } from "./helpers";
import { ChecksPanel } from "./components/ChecksPanel";
import { TriggerPanel } from "./components/TriggerPanel";
import { SignalGraph } from "./components/SignalGraph";

export const AngularChangeDetection = () => {
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
        <SourceGrid>
          <SourceCodePanel
            lines={example.codeLines}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
          />

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
                <WaitingPlaceholder />
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
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
