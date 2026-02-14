"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { CodeBlock, type CodeBlockLine } from "@/components/visualization-ui/CodeBlock";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { cn } from "@/lib/utils";
import { VISUALIZATION_PANEL_TITLES, VISUALIZATION_EMPTY_STATES } from "@/lib/visualization/uiCopy";
import { useStepPlayback } from "@/hooks/useStepPlayback";

interface SourceLine {
  num: number;
  text: string;
}

interface EventLoopStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  stack: string[];
  webApis: string[];
  taskQueue: string[];
  microtaskQueue: string[];
  consoleOutput: string[];
  loopActive: boolean;
  loopLabel: "idle" | "checking" | "running";
}

type QueueTone = "stack" | "web" | "task" | "micro";

const CODE_LINES: SourceLine[] = [
  { num: 1, text: "console.log('Start');" },
  { num: 2, text: "" },
  { num: 3, text: "setTimeout(() => {" },
  { num: 4, text: "  console.log('Timeout');" },
  { num: 5, text: "}, 0);" },
  { num: 6, text: "" },
  { num: 7, text: "Promise.resolve()" },
  { num: 8, text: "  .then(() => {" },
  { num: 9, text: "    console.log('Promise 1');" },
  { num: 10, text: "  })" },
  { num: 11, text: "  .then(() => {" },
  { num: 12, text: "    console.log('Promise 2');" },
  { num: 13, text: "  });" },
  { num: 14, text: "" },
  { num: 15, text: "console.log('End');" },
];

const STEPS: EventLoopStep[] = [
  {
    descriptionHtml:
      `<span class="hl-stack">Call Stack</span> receives <code>console.log('Start')</code> and executes immediately.`,
    activeLine: 1,
    doneLines: [],
    stack: ["console.log('Start')"],
    webApis: [],
    taskQueue: [],
    microtaskQueue: [],
    consoleOutput: ["Start"],
    loopActive: false,
    loopLabel: "idle",
  },
  {
    descriptionHtml:
      `<code>console.log('Start')</code> pops from the <span class="hl-stack">Call Stack</span>. Output: <strong>Start</strong>.`,
    activeLine: 1,
    doneLines: [1],
    stack: [],
    webApis: [],
    taskQueue: [],
    microtaskQueue: [],
    consoleOutput: ["Start"],
    loopActive: false,
    loopLabel: "idle",
  },
  {
    descriptionHtml:
      `<code>setTimeout(cb, 0)</code> is pushed to the <span class="hl-stack">Call Stack</span>.`,
    activeLine: 3,
    doneLines: [1],
    stack: ["setTimeout(cb, 0)"],
    webApis: [],
    taskQueue: [],
    microtaskQueue: [],
    consoleOutput: ["Start"],
    loopActive: false,
    loopLabel: "idle",
  },
  {
    descriptionHtml:
      `<code>setTimeout</code> delegates to <span class="hl-api">Web APIs</span>, and a timer starts.`,
    activeLine: 3,
    doneLines: [1, 3, 4, 5],
    stack: [],
    webApis: ["Timer (0ms)"],
    taskQueue: [],
    microtaskQueue: [],
    consoleOutput: ["Start"],
    loopActive: false,
    loopLabel: "idle",
  },
  {
    descriptionHtml:
      `Timer completes, so callback moves into the <span class="hl-task">Task Queue</span>.`,
    activeLine: null,
    doneLines: [1, 3, 4, 5],
    stack: [],
    webApis: [],
    taskQueue: ["() => log('Timeout')"],
    microtaskQueue: [],
    consoleOutput: ["Start"],
    loopActive: false,
    loopLabel: "idle",
  },
  {
    descriptionHtml:
      `<code>Promise.resolve().then(cb)</code> is pushed to the <span class="hl-stack">Call Stack</span>.`,
    activeLine: 7,
    doneLines: [1, 3, 4, 5],
    stack: ["Promise.resolve().then(cb)"],
    webApis: [],
    taskQueue: ["() => log('Timeout')"],
    microtaskQueue: [],
    consoleOutput: ["Start"],
    loopActive: false,
    loopLabel: "idle",
  },
  {
    descriptionHtml:
      `Promise resolves and the callback enters the <span class="hl-micro">Microtask Queue</span> (higher priority).`,
    activeLine: 8,
    doneLines: [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13],
    stack: [],
    webApis: [],
    taskQueue: ["() => log('Timeout')"],
    microtaskQueue: ["() => log('Promise 1')"],
    consoleOutput: ["Start"],
    loopActive: false,
    loopLabel: "idle",
  },
  {
    descriptionHtml:
      `<code>console.log('End')</code> is still synchronous and executes before queued callbacks.`,
    activeLine: 15,
    doneLines: [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13],
    stack: ["console.log('End')"],
    webApis: [],
    taskQueue: ["() => log('Timeout')"],
    microtaskQueue: ["() => log('Promise 1')"],
    consoleOutput: ["Start"],
    loopActive: false,
    loopLabel: "idle",
  },
  {
    descriptionHtml:
      `<code>console.log('End')</code> finishes. Sync code is done and output now includes <strong>End</strong>.`,
    activeLine: 15,
    doneLines: [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15],
    stack: [],
    webApis: [],
    taskQueue: ["() => log('Timeout')"],
    microtaskQueue: ["() => log('Promise 1')"],
    consoleOutput: ["Start", "End"],
    loopActive: false,
    loopLabel: "idle",
  },
  {
    descriptionHtml:
      `<span class="hl-loop">Event Loop</span> checks queues: <span class="hl-micro">Microtasks</span> are always consumed first.`,
    activeLine: null,
    doneLines: [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15],
    stack: [],
    webApis: [],
    taskQueue: ["() => log('Timeout')"],
    microtaskQueue: ["() => log('Promise 1')"],
    consoleOutput: ["Start", "End"],
    loopActive: true,
    loopLabel: "checking",
  },
  {
    descriptionHtml:
      `<span class="hl-loop">Event Loop</span> moves the first microtask to the <span class="hl-stack">Call Stack</span>.`,
    activeLine: 9,
    doneLines: [1, 3, 5, 7, 8, 10, 11, 12, 13, 15],
    stack: ["() => log('Promise 1')"],
    webApis: [],
    taskQueue: ["() => log('Timeout')"],
    microtaskQueue: [],
    consoleOutput: ["Start", "End", "Promise 1"],
    loopActive: true,
    loopLabel: "running",
  },
  {
    descriptionHtml:
      `Promise chaining queues another callback in the <span class="hl-micro">Microtask Queue</span>.`,
    activeLine: 11,
    doneLines: [1, 3, 5, 7, 8, 9, 10, 13, 15],
    stack: [],
    webApis: [],
    taskQueue: ["() => log('Timeout')"],
    microtaskQueue: ["() => log('Promise 2')"],
    consoleOutput: ["Start", "End", "Promise 1"],
    loopActive: true,
    loopLabel: "checking",
  },
  {
    descriptionHtml:
      `<span class="hl-loop">Event Loop</span> drains the remaining microtask and runs Promise 2 callback.`,
    activeLine: 12,
    doneLines: [1, 3, 5, 7, 8, 9, 10, 11, 13, 15],
    stack: ["() => log('Promise 2')"],
    webApis: [],
    taskQueue: ["() => log('Timeout')"],
    microtaskQueue: [],
    consoleOutput: ["Start", "End", "Promise 1", "Promise 2"],
    loopActive: true,
    loopLabel: "running",
  },
  {
    descriptionHtml:
      `All microtasks are done, so the <span class="hl-loop">Event Loop</span> checks the <span class="hl-task">Task Queue</span>.`,
    activeLine: null,
    doneLines: [1, 3, 5, 7, 8, 9, 10, 11, 12, 13, 15],
    stack: [],
    webApis: [],
    taskQueue: ["() => log('Timeout')"],
    microtaskQueue: [],
    consoleOutput: ["Start", "End", "Promise 1", "Promise 2"],
    loopActive: true,
    loopLabel: "checking",
  },
  {
    descriptionHtml:
      `<span class="hl-loop">Event Loop</span> moves the timeout callback to the <span class="hl-stack">Call Stack</span>.`,
    activeLine: 4,
    doneLines: [1, 3, 5, 7, 8, 9, 10, 11, 12, 13, 15],
    stack: ["() => log('Timeout')"],
    webApis: [],
    taskQueue: [],
    microtaskQueue: [],
    consoleOutput: ["Start", "End", "Promise 1", "Promise 2", "Timeout"],
    loopActive: true,
    loopLabel: "running",
  },
  {
    descriptionHtml:
      `<strong>Done:</strong> output order is Start → End → Promise 1 → Promise 2 → Timeout.`,
    activeLine: null,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    stack: [],
    webApis: [],
    taskQueue: [],
    microtaskQueue: [],
    consoleOutput: ["Start", "End", "Promise 1", "Promise 2", "Timeout"],
    loopActive: false,
    loopLabel: "idle",
  },
];

const QUEUE_ITEM_STYLES: Record<QueueTone, string> = {
  stack:
    "border-amber-300/35 bg-amber-400/10 text-amber-200 shadow-[0_0_14px_rgba(251,191,36,0.07)]",
  web: "border-cyan-300/35 bg-cyan-400/10 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.07)]",
  task: "border-emerald-300/35 bg-emerald-400/10 text-emerald-200 shadow-[0_0_14px_rgba(52,211,153,0.08)]",
  micro:
    "border-violet-300/35 bg-violet-400/10 text-violet-200 shadow-[0_0_14px_rgba(196,181,253,0.08)]",
};

function QueueItems({ items, tone }: { items: string[]; tone: QueueTone }) {
  if (items.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2 font-mono text-xs",
            QUEUE_ITEM_STYLES[tone]
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export function EventLoop() {
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
  } = useStepPlayback({ totalSteps: STEPS.length, initialStep: -1 });

  const currentStep = currentStepIndex >= 0 ? STEPS[currentStepIndex] : null;

  return (
    <>
      {/* Toolbar: portaled above the surface card */}
      <ToolbarPortal>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="app-surface-subtle inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs text-slate-300">
              {isPlaying ? <span className="viz-pulse-dot" /> : null}
              Step {Math.max(currentStepIndex + 1, 0)} / {STEPS.length}
            </p>

            <TransportControls
              isPlaying={isPlaying}
              canStep={canStep}
              canStepBack={canStepBack}
              speedLevel={speedLevel}
              speedLabel={speedLabel}
              onTogglePlay={togglePlay}
              onStep={handleStep}
              onStepBack={handleStepBack}
              onReset={handleReset}
              onSpeedLevelChange={setSpeedLevel}
            />
          </div>

          <div className="app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5">
            {currentStep ? (
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

      {/* Main visualization */}
      <section className="relative flex flex-col gap-4 px-1 py-2 text-slate-100 sm:px-2 sm:py-3 lg:px-3 lg:py-4">
        {/* Event-loop-specific styles (orbit ring) — shared animations are in globals.css */}
        <style>{`
          .el-loop-ring {
            position: relative;
            display: flex;
            height: 84px;
            width: 84px;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            border: 3px solid #2f3b58;
            transition: border-color 0.22s ease, box-shadow 0.22s ease;
          }

          .el-loop-ring--active {
            border-color: #f472b6;
            box-shadow: 0 0 22px rgba(244, 114, 182, 0.35);
          }

          .el-loop-dot {
            position: absolute;
            top: -6px;
            left: 50%;
            height: 12px;
            width: 12px;
            margin-left: -6px;
            border-radius: 9999px;
            background: #f472b6;
            opacity: 0;
            box-shadow: 0 0 12px rgba(244, 114, 182, 0.9);
          }

          .el-loop-ring--active .el-loop-dot {
            opacity: 1;
            animation: el-orbit 1s linear infinite;
          }

          .el-loop-label {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            color: #95a3bd;
            transition: color 0.22s ease;
          }

          .el-loop-ring--active .el-loop-label {
            color: #f9a8d4;
          }

          @keyframes el-orbit {
            from { transform: rotate(0deg) translateX(42px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(42px) rotate(-360deg); }
          }
        `}</style>

        <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]">
          <NeonPanel
            title={VISUALIZATION_PANEL_TITLES.sourceCode}
            tone="amber"
            bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
          >
            <CodeBlock
              lines={CODE_LINES.map((line): CodeBlockLine => {
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

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <NeonPanel title="Call Stack" tone="amber" bodyClassName="min-h-[10rem]">
                <QueueItems items={currentStep?.stack ?? []} tone="stack" />
              </NeonPanel>

              <NeonPanel title="Web APIs" tone="cyan" bodyClassName="min-h-[10rem]">
                <QueueItems items={currentStep?.webApis ?? []} tone="web" />
              </NeonPanel>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <NeonPanel
                title="Microtask Queue"
                tone="violet"
                bodyClassName="min-h-[10rem]"
              >
                <QueueItems items={currentStep?.microtaskQueue ?? []} tone="micro" />
              </NeonPanel>

              <NeonPanel title="Task Queue" tone="green" bodyClassName="min-h-[10rem]">
                <QueueItems items={currentStep?.taskQueue ?? []} tone="task" />
              </NeonPanel>

              <NeonPanel
                title="Event Loop"
                tone="pink"
                bodyClassName="flex min-h-[10rem] items-center justify-center"
              >
                <div
                  className={cn(
                    "el-loop-ring",
                    currentStep?.loopActive && "el-loop-ring--active"
                  )}
                >
                  <span className="el-loop-dot" />
                  <span className="el-loop-label">
                    {currentStep?.loopLabel ?? "idle"}
                  </span>
                </div>
              </NeonPanel>
            </div>

            <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
          </div>
        </div>
      </section>
    </>
  );
}
