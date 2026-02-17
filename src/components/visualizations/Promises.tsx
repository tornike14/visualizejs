"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import {
  CodeBlock,
  type CodeBlockLine,
} from "@/components/visualization-ui/CodeBlock";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { ExampleSelector } from "@/components/visualization-ui/ExampleSelector";
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { cn } from "@/lib/utils";
import {
  VISUALIZATION_PANEL_TITLES,
  VISUALIZATION_EMPTY_STATES,
} from "@/lib/visualization/uiCopy";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";


type PromiseKind = "basic" | "chaining" | "async-await";

interface SourceLine {
  num: number;
  text: string;
}

interface PromiseObj {
  name: string;
  state: "pending" | "fulfilled" | "rejected";
  value: string;
}

interface PromiseStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  promises: PromiseObj[];
  microtasks: string[];
  consoleOutput: string[];
}

interface PromiseExample {
  id: string;
  title: string;
  kind: PromiseKind;
  description: string;
  codeLines: SourceLine[];
  steps: PromiseStep[];
}


const EXAMPLES: PromiseExample[] = [
  {
    id: "resolve-reject",
    title: "Resolve & Reject",
    kind: "basic",
    description:
      "How the Promise constructor works: the executor runs synchronously, resolve() transitions state, and .then() callbacks are scheduled as microtasks.",
    codeLines: [
      { num: 1, text: "const promise = new Promise((resolve, reject) => {" },
      { num: 2, text: '  console.log("executor");' },
      { num: 3, text: '  resolve("done");' },
      { num: 4, text: "});" },
      { num: 5, text: "" },
      { num: 6, text: "promise.then((val) => {" },
      { num: 7, text: "  console.log(val);" },
      { num: 8, text: "});" },
      { num: 9, text: "" },
      { num: 10, text: 'console.log("after");' },
    ],
    steps: [
      {
        descriptionHtml:
          `<code>new Promise()</code> is called. The executor function is invoked <strong>synchronously</strong>. <code>promise</code> is created in <strong>pending</strong> state.`,
        activeLine: 1,
        doneLines: [],
        promises: [{ name: "promise", state: "pending", value: "\u2013" }],
        microtasks: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `Inside the executor: <code>console.log("executor")</code> runs immediately. The executor is not deferred \u2014 it runs as part of the <code>new Promise()</code> call.`,
        activeLine: 2,
        doneLines: [1],
        promises: [{ name: "promise", state: "pending", value: "\u2013" }],
        microtasks: [],
        consoleOutput: ["executor"],
      },
      {
        descriptionHtml:
          `<code>resolve("done")</code> is called. <code>promise</code> transitions from <strong>pending</strong> to <strong>fulfilled</strong> with value <code>"done"</code>. This is irreversible.`,
        activeLine: 3,
        doneLines: [1, 2],
        promises: [{ name: "promise", state: "fulfilled", value: '"done"' }],
        microtasks: [],
        consoleOutput: ["executor"],
      },
      {
        descriptionHtml:
          `<code>.then()</code> is registered on the already-fulfilled <code>promise</code>. Since it is resolved, the callback is immediately scheduled as a <span class="hl-micro">microtask</span>.`,
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        promises: [{ name: "promise", state: "fulfilled", value: '"done"' }],
        microtasks: ["(val) => log(val)"],
        consoleOutput: ["executor"],
      },
      {
        descriptionHtml:
          `<code>console.log("after")</code> runs synchronously. Microtasks are still waiting \u2014 synchronous code always finishes first.`,
        activeLine: 10,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        promises: [{ name: "promise", state: "fulfilled", value: '"done"' }],
        microtasks: ["(val) => log(val)"],
        consoleOutput: ["executor", "after"],
      },
      {
        descriptionHtml:
          `Synchronous code is done. The <span class="hl-micro">microtask queue</span> drains: <code>.then()</code> callback fires with <code>val = "done"</code> and logs it.`,
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6, 8, 9, 10],
        promises: [{ name: "promise", state: "fulfilled", value: '"done"' }],
        microtasks: [],
        consoleOutput: ["executor", "after", "done"],
      },
      {
        descriptionHtml:
          `<strong>Done.</strong> Output: executor \u2192 after \u2192 done. The executor ran synchronously, but <code>.then()</code> callbacks always run as <span class="hl-micro">microtasks</span> \u2014 even if the Promise is already resolved.`,
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        promises: [{ name: "promise", state: "fulfilled", value: '"done"' }],
        microtasks: [],
        consoleOutput: ["executor", "after", "done"],
      },
    ],
  },

  {
    id: "chaining",
    title: "Promise Chaining",
    kind: "chaining",
    description:
      "Each .then() returns a new Promise. Return values flow through the chain as each callback fulfills the next Promise.",
    codeLines: [
      { num: 1, text: "Promise.resolve(1)" },
      { num: 2, text: "  .then((val) => {" },
      { num: 3, text: "    console.log(val);" },
      { num: 4, text: "    return val * 2;" },
      { num: 5, text: "  })" },
      { num: 6, text: "  .then((val) => {" },
      { num: 7, text: "    console.log(val);" },
      { num: 8, text: "    return val * 2;" },
      { num: 9, text: "  })" },
      { num: 10, text: "  .then((val) => {" },
      { num: 11, text: "    console.log(val);" },
      { num: 12, text: "  });" },
    ],
    steps: [
      {
        descriptionHtml:
          `<code>Promise.resolve(1)</code> creates a Promise already fulfilled with value <code>1</code>.`,
        activeLine: 1,
        doneLines: [],
        promises: [{ name: "p1", state: "fulfilled", value: "1" }],
        microtasks: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `First <code>.then()</code> registers a callback. Since <code>p1</code> is fulfilled, the callback is queued as a <span class="hl-micro">microtask</span>. <code>.then()</code> returns a new Promise <code>p2</code> (pending).`,
        activeLine: 2,
        doneLines: [1],
        promises: [
          { name: "p1", state: "fulfilled", value: "1" },
          { name: "p2", state: "pending", value: "\u2013" },
        ],
        microtasks: ["then #1 (val=1)"],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `<span class="hl-micro">Microtask</span> runs: first callback receives <code>1</code> and logs it.`,
        activeLine: 3,
        doneLines: [1, 2, 5],
        promises: [
          { name: "p1", state: "fulfilled", value: "1" },
          { name: "p2", state: "pending", value: "\u2013" },
        ],
        microtasks: [],
        consoleOutput: ["1"],
      },
      {
        descriptionHtml:
          `Callback returns <code>1 * 2 = 2</code>. This fulfills <code>p2</code> with <code>2</code>, creating <code>p3</code> (pending) and scheduling the second <code>.then()</code> as a <span class="hl-micro">microtask</span>.`,
        activeLine: 4,
        doneLines: [1, 2, 3, 5],
        promises: [
          { name: "p1", state: "fulfilled", value: "1" },
          { name: "p2", state: "fulfilled", value: "2" },
          { name: "p3", state: "pending", value: "\u2013" },
        ],
        microtasks: ["then #2 (val=2)"],
        consoleOutput: ["1"],
      },
      {
        descriptionHtml:
          `Second callback receives <code>2</code>, logs it, returns <code>4</code>. <code>p3</code> is fulfilled with <code>4</code>. Third callback is scheduled.`,
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6, 9],
        promises: [
          { name: "p1", state: "fulfilled", value: "1" },
          { name: "p2", state: "fulfilled", value: "2" },
          { name: "p3", state: "fulfilled", value: "4" },
        ],
        microtasks: ["then #3 (val=4)"],
        consoleOutput: ["1", "2"],
      },
      {
        descriptionHtml:
          `Third callback receives <code>4</code> and logs it. No return value, so the chain ends.`,
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
        promises: [
          { name: "p1", state: "fulfilled", value: "1" },
          { name: "p2", state: "fulfilled", value: "2" },
          { name: "p3", state: "fulfilled", value: "4" },
        ],
        microtasks: [],
        consoleOutput: ["1", "2", "4"],
      },
      {
        descriptionHtml:
          `<strong>Done.</strong> Output: 1 \u2192 2 \u2192 4. Each <code>.then()</code> created a new Promise and passed its return value forward through the chain.`,
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        promises: [
          { name: "p1", state: "fulfilled", value: "1" },
          { name: "p2", state: "fulfilled", value: "2" },
          { name: "p3", state: "fulfilled", value: "4" },
        ],
        microtasks: [],
        consoleOutput: ["1", "2", "4"],
      },
    ],
  },

  {
    id: "async-await",
    title: "async/await",
    kind: "async-await",
    description:
      "async/await is syntactic sugar over Promises. await pauses the function and yields control back to the caller.",
    codeLines: [
      { num: 1, text: "async function fetchData() {" },
      { num: 2, text: '  console.log("before");' },
      { num: 3, text: '  const val = await Promise.resolve("data");' },
      { num: 4, text: "  console.log(val);" },
      { num: 5, text: "  return val;" },
      { num: 6, text: "}" },
      { num: 7, text: "" },
      { num: 8, text: "const result = fetchData();" },
      { num: 9, text: 'console.log("after");' },
    ],
    steps: [
      {
        descriptionHtml:
          `<code>fetchData()</code> is called. The async function starts executing synchronously. It implicitly returns a Promise <code>result</code> (pending).`,
        activeLine: 8,
        doneLines: [1, 6, 7],
        promises: [{ name: "result", state: "pending", value: "\u2013" }],
        microtasks: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `Inside <code>fetchData</code>: <code>console.log("before")</code> runs synchronously, just like in any normal function.`,
        activeLine: 2,
        doneLines: [1, 6, 7, 8],
        promises: [{ name: "result", state: "pending", value: "\u2013" }],
        microtasks: [],
        consoleOutput: ["before"],
      },
      {
        descriptionHtml:
          `<code>await Promise.resolve("data")</code> \u2014 the engine sees the resolved Promise, but <code>await</code> still pauses <code>fetchData</code> and schedules a <span class="hl-micro">microtask</span> to resume it. Execution returns to the caller.`,
        activeLine: 3,
        doneLines: [1, 2, 6, 7, 8],
        promises: [
          { name: "result", state: "pending", value: "\u2013" },
          { name: "awaited", state: "fulfilled", value: '"data"' },
        ],
        microtasks: ["resume fetchData"],
        consoleOutput: ["before"],
      },
      {
        descriptionHtml:
          `Back in the caller: <code>console.log("after")</code> runs synchronously while <code>fetchData</code> is still suspended.`,
        activeLine: 9,
        doneLines: [1, 2, 3, 6, 7, 8],
        promises: [
          { name: "result", state: "pending", value: "\u2013" },
          { name: "awaited", state: "fulfilled", value: '"data"' },
        ],
        microtasks: ["resume fetchData"],
        consoleOutput: ["before", "after"],
      },
      {
        descriptionHtml:
          `Synchronous code is done. <span class="hl-micro">Microtask</span> drains: <code>fetchData</code> resumes. <code>val</code> receives <code>"data"</code> and it is logged.`,
        activeLine: 4,
        doneLines: [1, 2, 3, 6, 7, 8, 9],
        promises: [{ name: "result", state: "pending", value: "\u2013" }],
        microtasks: [],
        consoleOutput: ["before", "after", "data"],
      },
      {
        descriptionHtml:
          `<code>return val</code> \u2014 the async function returns, which fulfills <code>result</code> with <code>"data"</code>.`,
        activeLine: 5,
        doneLines: [1, 2, 3, 4, 6, 7, 8, 9],
        promises: [{ name: "result", state: "fulfilled", value: '"data"' }],
        microtasks: [],
        consoleOutput: ["before", "after", "data"],
      },
      {
        descriptionHtml:
          `<strong>Done.</strong> Output: before \u2192 after \u2192 data. <code>await</code> pauses the async function and yields back to synchronous code, just like <code>.then()</code> schedules a microtask.`,
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        promises: [{ name: "result", state: "fulfilled", value: '"data"' }],
        microtasks: [],
        consoleOutput: ["before", "after", "data"],
      },
    ],
  },
];


function kindBadgeClass(kind: PromiseKind): string {
  switch (kind) {
    case "basic":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "chaining":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/25";
    case "async-await":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
  }
}

function kindLabel(kind: PromiseKind): string {
  switch (kind) {
    case "basic":
      return "basic";
    case "chaining":
      return "chaining";
    case "async-await":
      return "async/await";
  }
}


const QUEUE_ITEM_STYLE =
  "border-violet-300/35 bg-violet-400/10 text-violet-200 shadow-[0_0_14px_rgba(196,181,253,0.08)]";

const PROMISE_STATE_BORDER: Record<PromiseObj["state"], string> = {
  pending:
    "border-slate-400/35 bg-slate-400/10 text-slate-300 shadow-[0_0_14px_rgba(148,163,184,0.06)]",
  fulfilled:
    "border-emerald-300/35 bg-emerald-400/10 text-emerald-200 shadow-[0_0_14px_rgba(52,211,153,0.08)]",
  rejected:
    "border-red-300/35 bg-red-400/10 text-red-200 shadow-[0_0_14px_rgba(248,113,113,0.08)]",
};


function PromiseCards({ promises }: { promises: PromiseObj[] }) {
  if (promises.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {promises.map((p, index) => (
        <div
          key={`${p.name}-${p.state}-${index}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2.5",
            PROMISE_STATE_BORDER[p.state]
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold">{p.name}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
                p.state === "pending" && "bg-slate-500/20 text-slate-400",
                p.state === "fulfilled" && "bg-emerald-500/20 text-emerald-300",
                p.state === "rejected" && "bg-red-500/20 text-red-300"
              )}
            >
              {p.state}
            </span>
          </div>
          <div className="mt-1 font-mono text-xs opacity-80">
            value: {p.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function QueueItems({ items }: { items: string[] }) {
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
            QUEUE_ITEM_STYLE
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
}


export function Promises() {
  const [activeExampleId, setActiveExampleId] = useState(EXAMPLES[0].id);

  const example =
    EXAMPLES.find((e) => e.id === activeExampleId) ?? EXAMPLES[0];

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
    totalSteps: example.steps.length,
    initialStep: -1,
    resetKey: activeExampleId,
  });

  const currentStep =
    currentStepIndex >= 0 ? example.steps[currentStepIndex] : null;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      promises: currentStep?.promises,
      microtasks: currentStep?.microtasks,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  const handleExampleChange = (id: string) => {
    setActiveExampleId(id);
  };

  return (
    <>
      {/* Toolbar: portaled above the surface card */}
      <ToolbarPortal>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <ExampleSelector
                examples={EXAMPLES}
                activeId={activeExampleId}
                onSelect={handleExampleChange}
                renderBadge={(ex) => (
                  <Badge variant="outline" className={cn("text-[10px]", kindBadgeClass(ex.kind))}>
                    {kindLabel(ex.kind)}
                  </Badge>
                )}
              />
              <Badge
                variant="outline"
                className={cn("text-[10px]", kindBadgeClass(example.kind))}
              >
                {kindLabel(example.kind)}
              </Badge>
            </div>

            <TransportControls
              isPlaying={isPlaying}
              canStep={canStep}
              canStepBack={canStepBack}
              stepIndex={currentStepIndex}
              totalSteps={example.steps.length}
              speedLevel={speedLevel}
              speedLabel={speedLabel}
              onTogglePlay={togglePlay}
              onStep={handleStep}
              onStepBack={handleStepBack}
              onReset={handleReset}
              onSpeedLevelChange={setSpeedLevel}
            />
          </div>

          <div
            className={cn(
              "app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5",
              flashes.description && "viz-change-flash-pill",
            )}
          >
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
        <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]">
          <NeonPanel
            title={VISUALIZATION_PANEL_TITLES.sourceCode}
            tone="amber"
            bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
          >
            <CodeBlock
              lines={example.codeLines.map((line): CodeBlockLine => {
                const isActive = currentStep?.activeLine === line.num;
                const isDone =
                  currentStep?.doneLines.includes(line.num) ?? false;
                return {
                  key: line.num,
                  lineNumber: line.num,
                  text: line.text,
                  className: cn(
                    isActive && "is-active",
                    isDone && !isActive && "is-done"
                  ),
                };
              })}
            />
          </NeonPanel>

          <div className="space-y-4">
            <NeonPanel
              title="Promise State"
              tone="violet"
              bodyClassName="min-h-[10rem]"
              className={flashes.promises ? "viz-change-flash" : undefined}
            >
              <PromiseCards promises={currentStep?.promises ?? []} />
            </NeonPanel>

            <NeonPanel
              title="Microtask Queue"
              tone="violet"
              bodyClassName="min-h-[6rem]"
              className={flashes.microtasks ? "viz-change-flash" : undefined}
            >
              <QueueItems items={currentStep?.microtasks ?? []} />
            </NeonPanel>

            <div className={flashes.console ? "viz-change-flash rounded-3xl" : undefined}>
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
