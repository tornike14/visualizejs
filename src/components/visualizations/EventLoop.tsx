"use client";

import { useCallback, useEffect, useState } from "react";
import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import {
  TransportControls,
  type PlaybackSpeedLevel,
} from "@/components/visualization-ui/TransportControls";
import { cn } from "@/lib/utils";

interface CodeLine {
  num: number;
  html: string;
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

const CODE_LINES: CodeLine[] = [
  {
    num: 1,
    html: `<span class="el-fn">console</span>.<span class="el-fn">log</span>(<span class="el-str">'Start'</span>);`,
  },
  { num: 2, html: "" },
  {
    num: 3,
    html: `<span class="el-fn">setTimeout</span>(<span class="el-kw">() =></span> {`,
  },
  {
    num: 4,
    html: `  <span class="el-fn">console</span>.<span class="el-fn">log</span>(<span class="el-str">'Timeout'</span>);`,
  },
  { num: 5, html: `}, <span class="el-num">0</span>);` },
  { num: 6, html: "" },
  {
    num: 7,
    html: `<span class="el-kw">Promise</span>.<span class="el-fn">resolve</span>()`,
  },
  {
    num: 8,
    html: `  .<span class="el-fn">then</span>(<span class="el-kw">() =></span> {`,
  },
  {
    num: 9,
    html: `    <span class="el-fn">console</span>.<span class="el-fn">log</span>(<span class="el-str">'Promise 1'</span>);`,
  },
  { num: 10, html: `  })` },
  {
    num: 11,
    html: `  .<span class="el-fn">then</span>(<span class="el-kw">() =></span> {`,
  },
  {
    num: 12,
    html: `    <span class="el-fn">console</span>.<span class="el-fn">log</span>(<span class="el-str">'Promise 2'</span>);`,
  },
  { num: 13, html: `  });` },
  { num: 14, html: "" },
  {
    num: 15,
    html: `<span class="el-fn">console</span>.<span class="el-fn">log</span>(<span class="el-str">'End'</span>);`,
  },
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
    doneLines: [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15],
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
    doneLines: [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15],
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
    doneLines: [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15],
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
    doneLines: [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15],
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
    doneLines: [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15],
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
      `✅ <strong>Done:</strong> output order is Start → End → Promise 1 → Promise 2 → Timeout.`,
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

const LAST_STEP_INDEX = STEPS.length - 1;

const SPEED_TO_DELAY_MS: Record<PlaybackSpeedLevel, number> = {
  1: 2500,
  2: 1800,
  3: 1200,
  4: 700,
  5: 400,
};

const SPEED_LABELS: Record<PlaybackSpeedLevel, string> = {
  1: "0.5x",
  2: "0.75x",
  3: "1x",
  4: "1.5x",
  5: "2x",
};

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
      <p className="pt-7 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
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
            "el-queue-item rounded-lg border px-3 py-2 font-mono text-xs",
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
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedLevel, setSpeedLevel] = useState<PlaybackSpeedLevel>(3);

  const currentStep = currentStepIndex >= 0 ? STEPS[currentStepIndex] : null;
  const canStep = currentStepIndex < LAST_STEP_INDEX;

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((previousPlaying) => {
      if (previousPlaying) {
        return false;
      }

      setCurrentStepIndex((previousStep) => {
        if (previousStep < 0 || previousStep >= LAST_STEP_INDEX) {
          return 0;
        }
        return previousStep;
      });

      return true;
    });
  }, []);

  const handleStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((previousStep) => {
      if (previousStep >= LAST_STEP_INDEX) {
        return previousStep;
      }
      return previousStep + 1;
    });
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCurrentStepIndex((previousStep) => {
        if (previousStep >= LAST_STEP_INDEX) {
          setIsPlaying(false);
          return previousStep;
        }

        const nextStep = previousStep + 1;
        if (nextStep >= LAST_STEP_INDEX) {
          setIsPlaying(false);
        }
        return nextStep;
      });
    }, SPEED_TO_DELAY_MS[speedLevel]);

    return () => window.clearTimeout(timeoutId);
  }, [currentStepIndex, isPlaying, speedLevel]);

  return (
    <section className="relative flex flex-col gap-6 px-1 py-2 text-slate-100 sm:px-2 sm:py-3 lg:px-3 lg:py-4">
      <style>{`
        .el-code-line {
          display: flex;
          gap: 0.75rem;
          border-radius: 0.5rem;
          padding: 2px 10px;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .el-code-line.is-active {
          background: rgba(251, 191, 36, 0.12);
          box-shadow: inset 3px 0 0 #fbbf24;
        }

        .el-code-line.is-done {
          opacity: 0.4;
        }

        .el-line-num {
          min-width: 22px;
          color: #94a3b8;
          opacity: 0.45;
          user-select: none;
          text-align: right;
        }

        .el-fn { color: #60a5fa; }
        .el-kw { color: #c084fc; }
        .el-str { color: #34d399; }
        .el-num { color: #fbbf24; }

        .el-queue-item {
          animation: el-slide-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

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

        .el-console-line {
          animation: el-fade-in 0.22s ease;
        }

        .el-console-prefix {
          margin-right: 8px;
          color: #34d399;
        }

        .el-step-desc code {
          border: 1px solid rgba(71, 85, 105, 0.7);
          background: rgba(15, 23, 42, 0.5);
          border-radius: 6px;
          padding: 2px 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.78rem;
        }

        .el-step-desc .hl-stack { color: #fbbf24; font-weight: 600; }
        .el-step-desc .hl-api { color: #22d3ee; font-weight: 600; }
        .el-step-desc .hl-task { color: #34d399; font-weight: 600; }
        .el-step-desc .hl-micro { color: #c4b5fd; font-weight: 600; }
        .el-step-desc .hl-loop { color: #f472b6; font-weight: 600; }

        .el-playing-dot {
          display: inline-block;
          height: 8px;
          width: 8px;
          border-radius: 9999px;
          background: #34d399;
          animation: el-pulse 1s ease infinite;
        }

        @keyframes el-slide-in {
          from { transform: translateX(-16px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes el-fade-in {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes el-orbit {
          from { transform: rotate(0deg) translateX(42px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(42px) rotate(-360deg); }
        }

        @keyframes el-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <TransportControls
            isPlaying={isPlaying}
            canStep={canStep}
            speedLevel={speedLevel}
            speedLabel={SPEED_LABELS[speedLevel]}
            onTogglePlay={handleTogglePlay}
            onStep={handleStep}
            onReset={handleReset}
            onSpeedLevelChange={setSpeedLevel}
          />

          <p className="app-surface-subtle inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs text-slate-300">
            {isPlaying ? <span className="el-playing-dot" /> : null}
            Step {Math.max(currentStepIndex + 1, 0)} / {STEPS.length}
          </p>
        </div>

        {currentStep ? (
          <div className="app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-3">
            <p
              className="el-step-desc text-center text-sm text-slate-300"
              dangerouslySetInnerHTML={{
                __html: currentStep.descriptionHtml,
              }}
            />
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
          <NeonPanel
            title="Source Code"
            tone="amber"
            bodyClassName="min-h-[29rem] space-y-0.5 font-mono text-[13px] leading-[1.9] text-slate-200"
          >
            {CODE_LINES.map((line) => {
              const isActive = currentStep?.activeLine === line.num;
              const isDone = currentStep?.doneLines.includes(line.num) ?? false;

              return (
                <div
                  key={line.num}
                  className={cn("el-code-line", isActive && "is-active", isDone && "is-done")}
                >
                  <span className="el-line-num">{line.num}</span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: line.html || "&nbsp;",
                    }}
                  />
                </div>
              );
            })}
          </NeonPanel>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <NeonPanel title="Call Stack" tone="amber" bodyClassName="min-h-[13rem]">
                <QueueItems items={currentStep?.stack ?? []} tone="stack" />
              </NeonPanel>

              <NeonPanel title="Web APIs" tone="cyan" bodyClassName="min-h-[13rem]">
                <QueueItems items={currentStep?.webApis ?? []} tone="web" />
              </NeonPanel>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <NeonPanel
                title="Microtask Queue"
                tone="violet"
                bodyClassName="min-h-[13rem]"
              >
                <QueueItems items={currentStep?.microtaskQueue ?? []} tone="micro" />
              </NeonPanel>

              <NeonPanel title="Task Queue" tone="green" bodyClassName="min-h-[13rem]">
                <QueueItems items={currentStep?.taskQueue ?? []} tone="task" />
              </NeonPanel>

              <NeonPanel
                title="Event Loop"
                tone="pink"
                bodyClassName="flex min-h-[13rem] items-center justify-center"
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

            <NeonPanel
              title="Console Output"
              tone="slate"
              bodyClassName="min-h-[5.8rem] space-y-1.5 font-mono text-xs text-slate-300"
            >
              {(currentStep?.consoleOutput ?? []).length === 0 ? (
                <p className="pt-1 text-slate-500/70">No output yet.</p>
              ) : (
                (currentStep?.consoleOutput ?? []).map((line, index) => (
                  <div key={`${line}-${index}`} className="el-console-line">
                    <span className="el-console-prefix">›</span>
                    {line}
                  </div>
                ))
              )}
            </NeonPanel>
          </div>
        </div>
      </div>
    </section>
  );
}
