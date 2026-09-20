"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { SourceCodePanel } from "@/components/visualization-ui/SourceCodePanel";
import {
  SourceGrid,
  VisualizationSection,
} from "@/components/visualization-ui/VisualizationLayout";
import { VisualizationToolbar } from "@/components/visualization-ui/VisualizationToolbar";
import {
  SandboxControls,
  SandboxEditingHint,
} from "@/components/sandbox/SandboxControls";
import { SandboxPanel } from "@/components/sandbox/SandboxPanel";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { useSandboxUIState } from "@/hooks/useSandboxUIState";
import { SANDBOX_CONFIGS } from "@/lib/sandbox/configs";
import { generateEventLoopSteps } from "@/lib/sandbox/generators/event-loop";
import { CODE_LINES, STEPS } from "./data";
import { QueueItems } from "./components/QueueItems";
import { EventLoopRing } from "./components/EventLoopRing";

const sandboxConfig = SANDBOX_CONFIGS["event-loop"];

export const EventLoop = () => {
  const {
    sandbox,
    isEditing,
    usingSandbox,
    showHighlightedCode,
    handleToggleSandbox,
    handleGenerate,
    handleEditCode,
  } = useSandboxUIState(sandboxConfig, generateEventLoopSteps);

  const activeSteps =
    usingSandbox && sandbox.generatedSteps ? sandbox.generatedSteps : STEPS;
  const activeCodeLines =
    usingSandbox && sandbox.generatedCodeLines
      ? sandbox.generatedCodeLines
      : CODE_LINES;
  const isEditingSandbox = sandbox.isSandboxActive && isEditing;

  const playback = useStepPlayback({
    totalSteps: activeSteps.length,
    resetKey: usingSandbox ? `sandbox-${sandbox.generationId}` : "default",
  });
  const { currentStepIndex } = playback;
  const currentStep =
    currentStepIndex >= 0 ? activeSteps[currentStepIndex] : null;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      stack: currentStep?.stack,
      webApis: currentStep?.webApis,
      taskQueue: currentStep?.taskQueue,
      microtaskQueue: currentStep?.microtaskQueue,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  return (
    <>
      <VisualizationToolbar
        playback={playback}
        totalSteps={activeSteps.length}
        descriptionHtml={currentStep?.descriptionHtml}
        descriptionFlash={flashes.description}
        align="center"
        hideTransport={sandbox.isSandboxActive && !showHighlightedCode}
        descriptionOverride={
          isEditingSandbox ? <SandboxEditingHint /> : undefined
        }
        leading={
          <SandboxControls
            isActive={sandbox.isSandboxActive}
            isEditing={isEditing}
            onToggle={handleToggleSandbox}
            onGenerate={handleGenerate}
            onResetCode={sandbox.resetCode}
            onEdit={handleEditCode}
          />
        }
      />

      <VisualizationSection>
        <SourceGrid className="xl:grid-cols-[minmax(0,auto)_minmax(0,1fr)]">
          {isEditingSandbox ? (
            <SandboxPanel
              config={sandboxConfig}
              sandbox={sandbox}
              onGenerate={handleGenerate}
              className="xl:max-w-sm"
            />
          ) : (
            <SourceCodePanel
              lines={activeCodeLines}
              activeLine={currentStep?.activeLine}
              doneLines={currentStep?.doneLines}
            />
          )}

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <NeonPanel
                title="Call Stack"
                tone="amber"
                bodyClassName="min-h-[10rem]"
                className={flashes.stack ? "viz-change-flash" : undefined}
              >
                <QueueItems items={currentStep?.stack ?? []} tone="stack" />
              </NeonPanel>

              <NeonPanel
                title="Web APIs"
                tone="cyan"
                bodyClassName="min-h-[10rem]"
                className={flashes.webApis ? "viz-change-flash" : undefined}
              >
                <QueueItems items={currentStep?.webApis ?? []} tone="web" />
              </NeonPanel>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <NeonPanel
                title="Microtask Queue"
                tone="violet"
                bodyClassName="min-h-[10rem]"
                className={
                  flashes.microtaskQueue ? "viz-change-flash" : undefined
                }
              >
                <QueueItems
                  items={currentStep?.microtaskQueue ?? []}
                  tone="micro"
                />
              </NeonPanel>

              <NeonPanel
                title="Task Queue"
                tone="green"
                bodyClassName="min-h-[10rem]"
                className={flashes.taskQueue ? "viz-change-flash" : undefined}
              >
                <QueueItems items={currentStep?.taskQueue ?? []} tone="task" />
              </NeonPanel>

              <NeonPanel
                title="Event Loop"
                tone="pink"
                bodyClassName="flex min-h-[10rem] items-center justify-center"
              >
                <EventLoopRing
                  loopActive={currentStep?.loopActive ?? false}
                  loopLabel={currentStep?.loopLabel ?? "idle"}
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
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
