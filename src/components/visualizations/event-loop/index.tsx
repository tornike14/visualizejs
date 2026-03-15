"use client";

import dynamic from "next/dynamic";
import { Play, RotateCcw, Pencil } from "lucide-react";
import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { CodeBlock, type CodeBlockLine } from "@/components/visualization-ui/CodeBlock";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { Tooltip } from "@/components/visualization-ui/Tooltip";
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { SandboxToggle } from "@/components/sandbox/SandboxToggle";
import { SandboxErrorDisplay } from "@/components/sandbox/SandboxErrorDisplay";
import { cn } from "@/lib/utils";
import { VISUALIZATION_PANEL_TITLES, VISUALIZATION_EMPTY_STATES } from "@/lib/visualization/uiCopy";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { useSandboxUIState } from "@/hooks/useSandboxUIState";
import { SANDBOX_CONFIGS } from "@/lib/sandbox/configs";
import { generateEventLoopSteps } from "@/lib/sandbox/generators/event-loop";
import { CODE_LINES, STEPS } from "./data";
import { iconBtnBase } from "./helpers";
import { QueueItems } from "./components/QueueItems";
import { EventLoopRing } from "./components/EventLoopRing";

const SandboxEditor = dynamic(
  () => import("@/components/sandbox/SandboxEditor").then((m) => ({ default: m.SandboxEditor })),
  { ssr: false, loading: () => <div className="h-[220px] animate-pulse rounded-lg bg-slate-800/50" /> },
);

const sandboxConfig = SANDBOX_CONFIGS["event-loop"];

export function EventLoop() {
  const {
    sandbox,
    isEditing,
    usingSandbox,
    showHighlightedCode,
    handleToggleSandbox,
    handleGenerate,
    handleEditCode,
  } = useSandboxUIState(sandboxConfig, generateEventLoopSteps);

  const activeSteps = usingSandbox ? sandbox.generatedSteps! : STEPS;
  const activeCodeLines = usingSandbox ? sandbox.generatedCodeLines! : CODE_LINES;

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
    totalSteps: activeSteps.length,
    initialStep: -1,
    resetKey: usingSandbox ? `sandbox-${sandbox.generationId}` : "default",
  });

  const currentStep = currentStepIndex >= 0 ? activeSteps[currentStepIndex] : null;

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
      <ToolbarPortal>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <SandboxToggle
              isActive={sandbox.isSandboxActive}
              onToggle={handleToggleSandbox}
            />

            {sandbox.isSandboxActive && isEditing && (
              <>
                <Tooltip label="Generate visualization (Cmd+Enter)">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className={cn(
                      iconBtnBase,
                      "border-emerald-300/45 bg-gradient-to-br from-emerald-500/30 to-cyan-400/18 text-emerald-200 hover:border-emerald-300/70 hover:shadow-[0_0_16px_rgba(52,211,153,0.2)]",
                    )}
                    aria-label="Generate visualization"
                  >
                    <Play className="h-4 w-4 fill-current" />
                  </button>
                </Tooltip>

                <Tooltip label="Reset to default code">
                  <button
                    type="button"
                    onClick={sandbox.resetCode}
                    className={cn(
                      iconBtnBase,
                      "border-slate-600/85 bg-slate-900/65 text-slate-100 hover:border-slate-500",
                    )}
                    aria-label="Reset code"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </Tooltip>
              </>
            )}

            {sandbox.isSandboxActive && !isEditing && (
              <Tooltip label="Edit code">
                <button
                  type="button"
                  onClick={handleEditCode}
                  className={cn(
                    iconBtnBase,
                    "border-emerald-300/45 bg-gradient-to-br from-emerald-500/30 to-cyan-400/18 text-emerald-200 hover:border-emerald-300/70 hover:shadow-[0_0_16px_rgba(52,211,153,0.2)]",
                  )}
                  aria-label="Edit code"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </Tooltip>
            )}

            {(showHighlightedCode || !sandbox.isSandboxActive) && (
              <TransportControls
                isPlaying={isPlaying}
                canStep={canStep}
                canStepBack={canStepBack}
                stepIndex={currentStepIndex}
                totalSteps={activeSteps.length}
                speedLevel={speedLevel}
                speedLabel={speedLabel}
                onTogglePlay={togglePlay}
                onStep={handleStep}
                onStepBack={handleStepBack}
                onReset={handleReset}
                onSpeedLevelChange={setSpeedLevel}
              />
            )}
          </div>

          <div
            className={cn(
              "app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5",
              flashes.description && "viz-change-flash-pill",
            )}
            aria-live="polite"
            role="status"
          >
            {sandbox.isSandboxActive && isEditing ? (
              <p className="text-center text-sm text-emerald-300/70">
                Edit the code below and press <kbd className="mx-0.5 rounded border border-emerald-400/20 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-xs">Generate</kbd> or <kbd className="mx-0.5 rounded border border-emerald-400/20 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-xs">Cmd+Enter</kbd> to visualize.
              </p>
            ) : currentStep ? (
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
        <div className="grid gap-4 xl:grid-cols-[minmax(0,auto)_minmax(0,1fr)]">
          {sandbox.isSandboxActive && isEditing ? (
            <NeonPanel
              title="Sandbox"
              tone="green"
              bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
              className="xl:max-w-sm"
            >
              <SandboxEditor
                code={sandbox.userCode}
                codeVersion={sandbox.codeVersion}
                onChange={sandbox.setUserCode}
                onGenerate={handleGenerate}
                maxLines={sandboxConfig.maxCodeLines}
              />
              {sandbox.error && (
                <SandboxErrorDisplay
                  error={sandbox.error}
                  supportedPatterns={sandboxConfig.supportedPatterns}
                />
              )}
              <p className="mt-2 text-[11px] text-slate-500">
                Limited to {sandboxConfig.maxCodeLines} lines &middot; {sandboxConfig.maxCodeLength} characters
              </p>
            </NeonPanel>
          ) : (
            <NeonPanel
              title={VISUALIZATION_PANEL_TITLES.sourceCode}
              tone="amber"
              bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
            >
              <CodeBlock
                lines={activeCodeLines.map((line): CodeBlockLine => {
                  const isActive = currentStep?.activeLine === line.num;
                  const isDone = currentStep?.doneLines.includes(line.num) ?? false;
                  return {
                    key: line.num,
                    lineNumber: line.num,
                    text: line.text,
                    className: cn(
                      isActive && "is-active",
                      isDone && !isActive && "is-done",
                    ),
                  };
                })}
              />
            </NeonPanel>
          )}

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <NeonPanel title="Call Stack" tone="amber" bodyClassName="min-h-[10rem]" className={flashes.stack ? "viz-change-flash" : undefined}>
                <QueueItems items={currentStep?.stack ?? []} tone="stack" />
              </NeonPanel>

              <NeonPanel title="Web APIs" tone="cyan" bodyClassName="min-h-[10rem]" className={flashes.webApis ? "viz-change-flash" : undefined}>
                <QueueItems items={currentStep?.webApis ?? []} tone="web" />
              </NeonPanel>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <NeonPanel
                title="Microtask Queue"
                tone="violet"
                bodyClassName="min-h-[10rem]"
                className={flashes.microtaskQueue ? "viz-change-flash" : undefined}
              >
                <QueueItems items={currentStep?.microtaskQueue ?? []} tone="micro" />
              </NeonPanel>

              <NeonPanel title="Task Queue" tone="green" bodyClassName="min-h-[10rem]" className={flashes.taskQueue ? "viz-change-flash" : undefined}>
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

            <div className={flashes.console ? "viz-change-flash rounded-3xl" : undefined}>
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
