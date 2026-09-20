"use client";

import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import {
  ExamplePicker,
  KindBadge,
} from "@/components/visualization-ui/ExamplePicker";
import { VisualizationSection } from "@/components/visualization-ui/VisualizationLayout";
import { VisualizationToolbar } from "@/components/visualization-ui/VisualizationToolbar";
import { useExampleTopic } from "@/hooks/useExampleTopic";
import { VISUALIZATION_PANEL_TITLES } from "@/lib/visualization/uiCopy";
import { EXAMPLES } from "./data";
import { kindBadgeClass, kindLabel } from "./helpers";
import { CodePanel } from "./components/CodePanel";

export const Hoisting = () => {
  const {
    example,
    activeExampleId,
    handleExampleChange,
    playback,
    currentStep,
  } = useExampleTopic(EXAMPLES);

  return (
    <>
      <VisualizationToolbar
        playback={playback}
        totalSteps={example.steps.length}
        descriptionHtml={currentStep?.explanation}
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
      </VisualizationSection>
    </>
  );
};
