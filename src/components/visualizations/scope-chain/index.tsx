"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
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
import { ScopeChainDiagram } from "./components/ScopeChainDiagram";
import { LookupTracker } from "./components/LookupTracker";

export const ScopeChain = () => {
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
      scopes: currentStep?.scopes,
      lookup: currentStep?.lookup,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  return (
    <>
      {/* Toolbar: portaled above the surface card */}
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

      {/* Main visualization */}
      <VisualizationSection>
        <SourceGrid>
          <SourceCodePanel
            lines={example.codeLines}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
          />

          <div className="space-y-4">
            <NeonPanel
              title="Scope Chain"
              tone="violet"
              bodyClassName="min-h-[14rem]"
              className={flashes.scopes ? "viz-change-flash" : undefined}
            >
              <ScopeChainDiagram
                scopes={currentStep?.scopes ?? []}
                activeLink={currentStep?.activeLink}
              />
            </NeonPanel>

            <NeonPanel
              title="Identifier Lookup"
              tone="pink"
              bodyClassName="min-h-[6rem]"
              className={flashes.lookup ? "viz-change-flash" : undefined}
            >
              <LookupTracker lookup={currentStep?.lookup ?? null} />
            </NeonPanel>

            <div
              className={
                flashes.console ? "viz-change-flash rounded-3xl" : undefined
              }
            >
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
