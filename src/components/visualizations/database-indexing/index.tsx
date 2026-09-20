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
import { TablePages } from "./components/TablePages";
import { QueryPlan } from "./components/QueryPlan";
import { IndexDefinition } from "./components/IndexDefinition";
import { WriteLog } from "./components/WriteLog";

export const DatabaseIndexing = () => {
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
      pages: currentStep?.pages,
      tree: [currentStep?.tree, currentStep?.activeNodeId],
      plan: currentStep?.plan,
      aside: [currentStep?.indexColumns, currentStep?.writeLog],
    },
    currentStepIndex,
  );

  const isWrites = example.kind === "writes";

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
            <div className="grid gap-4 sm:grid-cols-2">
              <NeonPanel
                title="Table Pages"
                tone="cyan"
                bodyClassName="min-h-[8rem]"
                className={flashes.pages ? "viz-change-flash" : undefined}
              >
                {currentStep ? (
                  <TablePages pages={currentStep.pages} />
                ) : (
                  <WaitingPlaceholder />
                )}
              </NeonPanel>

              <NeonPanel
                title="Query Plan"
                tone="violet"
                bodyClassName="min-h-[8rem]"
                className={flashes.plan ? "viz-change-flash" : undefined}
              >
                {currentStep ? (
                  <QueryPlan entries={currentStep.plan} />
                ) : (
                  <WaitingPlaceholder />
                )}
              </NeonPanel>
            </div>

            <NeonPanel
              title={`B-tree: ${example.indexName}`}
              tone="green"
              bodyClassName="min-h-[10rem]"
              className={flashes.tree ? "viz-change-flash" : undefined}
            >
              {currentStep?.tree ? (
                <ComponentTreeDiagram
                  tree={currentStep.tree}
                  activeNodeId={currentStep.activeNodeId}
                />
              ) : (
                <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
                  {currentStep ? "no index" : "waiting"}
                </p>
              )}
            </NeonPanel>

            <NeonPanel
              title={isWrites ? "Write Log" : "Index Definition"}
              tone="pink"
              bodyClassName="min-h-[6rem]"
              className={flashes.aside ? "viz-change-flash" : undefined}
            >
              {!currentStep ? (
                <WaitingPlaceholder />
              ) : isWrites ? (
                <WriteLog entries={currentStep.writeLog} />
              ) : (
                <IndexDefinition
                  indexName={example.indexName}
                  columns={currentStep.indexColumns}
                />
              )}
            </NeonPanel>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
