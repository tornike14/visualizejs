"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import {
  CodeBlock,
  type CodeBlockLine,
} from "@/components/visualization-ui/CodeBlock";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { cn } from "@/lib/utils";
import {
  VISUALIZATION_PANEL_TITLES,
  VISUALIZATION_EMPTY_STATES,
} from "@/lib/visualization/uiCopy";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import type { SourceLine } from "@/types/visualization";

interface ScopeEntry {
  name: string;
  vars: Record<string, string>;
}

interface ClosureStep {
  descriptionHtml: string;
  activeLine: number;
  doneLines: number[];
  stack: string[];
  scope: ScopeEntry[];
  consoleOutput: string[];
}

const CODE_LINES: SourceLine[] = [
  { num: 1, text: "function outer() {" },
  { num: 2, text: "  let count = 0;" },
  { num: 3, text: "  function inner() {" },
  { num: 4, text: "    count++;" },
  { num: 5, text: "    console.log(count);" },
  { num: 6, text: "  }" },
  { num: 7, text: "  return inner;" },
  { num: 8, text: "}" },
  { num: 9, text: "const fn = outer();" },
  { num: 10, text: "fn();" },
  { num: 11, text: "fn();" },
];

const STEPS: ClosureStep[] = [
  {
    descriptionHtml:
      `The engine registers the <code>outer</code> function declaration. The function body is not executed yet.`,
    activeLine: 1,
    doneLines: [],
    stack: [],
    scope: [],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `<code>outer()</code> is called. A new execution context is pushed onto the <span class="hl-stack">Call Stack</span>.`,
    activeLine: 9,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
    stack: ["outer()"],
    scope: [{ name: "outer()", vars: { count: "undefined" } }],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `<code>let count = 0</code> declares a local variable in <code>outer</code>'s scope and initializes it to <code>0</code>.`,
    activeLine: 2,
    doneLines: [1],
    stack: ["outer()"],
    scope: [{ name: "outer()", vars: { count: "0" } }],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `The <code>inner</code> function is declared inside <code>outer</code>. It captures a reference to <code>outer</code>'s scope - this creates the <strong>closure</strong>.`,
    activeLine: 3,
    doneLines: [1, 2],
    stack: ["outer()"],
    scope: [{ name: "outer()", vars: { count: "0", inner: "f()" } }],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `<code>return inner</code> - <code>outer</code> returns the <code>inner</code> function. The execution context will be removed, but the scope is preserved because <code>inner</code> holds a reference to it.`,
    activeLine: 7,
    doneLines: [1, 2, 3, 4, 5, 6],
    stack: ["outer()"],
    scope: [{ name: "outer()", vars: { count: "0", inner: "f()" } }],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `<code>outer()</code> has returned and left the <span class="hl-stack">Call Stack</span>. But <code>count</code> survives inside the closure. <code>fn</code> now holds a reference to <code>inner</code>.`,
    activeLine: 9,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
    stack: [],
    scope: [{ name: "Closure (outer)", vars: { count: "0" } }],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `<code>fn()</code> invokes <code>inner</code>. It accesses <code>count</code> from the closure and increments it from <code>0</code> to <code>1</code>.`,
    activeLine: 4,
    doneLines: [1, 2, 3, 9],
    stack: ["fn() → inner()"],
    scope: [{ name: "Closure (outer)", vars: { count: "1" } }],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `<code>console.log(count)</code> outputs <code>1</code>. The closure kept <code>count</code> alive even though <code>outer</code> finished executing.`,
    activeLine: 5,
    doneLines: [1, 2, 3, 4, 9],
    stack: ["fn() → inner()"],
    scope: [{ name: "Closure (outer)", vars: { count: "1" } }],
    consoleOutput: ["1"],
  },
  {
    descriptionHtml:
      `<code>fn()</code> is called again. <code>count</code> is still <code>1</code> from the previous call - the closure preserves state between calls. It increments to <code>2</code>.`,
    activeLine: 4,
    doneLines: [1, 2, 3, 5, 9, 10],
    stack: ["fn() → inner()"],
    scope: [{ name: "Closure (outer)", vars: { count: "2" } }],
    consoleOutput: ["1"],
  },
  {
    descriptionHtml:
      `<code>console.log(count)</code> outputs <code>2</code>. <strong>Key takeaway:</strong> closures let inner functions remember and modify variables from their outer scope, even after the outer function has returned.`,
    activeLine: 5,
    doneLines: [1, 2, 3, 4, 9, 10],
    stack: ["fn() → inner()"],
    scope: [{ name: "Closure (outer)", vars: { count: "2" } }],
    consoleOutput: ["1", "2"],
  },
];

const STACK_ITEM_STYLE =
  "border-amber-300/35 bg-amber-400/10 text-amber-200 shadow-[0_0_14px_rgba(251,191,36,0.07)]";

const SCOPE_ITEM_STYLE =
  "border-cyan-300/35 bg-cyan-400/10 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.07)]";

function StackItems({ items }: { items: string[] }) {
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
            STACK_ITEM_STYLE
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function ScopeItems({ entries }: { entries: ScopeEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div
          key={`${entry.name}-${index}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2.5",
            SCOPE_ITEM_STYLE
          )}
        >
          <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan-300/80">
            {entry.name}
          </p>
          <div className="space-y-1">
            {Object.entries(entry.vars).map(([varName, value]) => (
              <div
                key={varName}
                className="flex items-center justify-between font-mono text-xs"
              >
                <span className="text-cyan-200/70">{varName}</span>
                <span className="text-cyan-100">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Closures() {
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

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      stack: currentStep?.stack,
      scope: currentStep?.scope,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  return (
    <>
      <ToolbarPortal>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <TransportControls
              isPlaying={isPlaying}
              canStep={canStep}
              canStepBack={canStepBack}
              stepIndex={currentStepIndex}
              totalSteps={STEPS.length}
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

      <section className="relative flex flex-col gap-4 px-1 py-2 text-slate-100 sm:px-2 sm:py-3 lg:px-3 lg:py-4">
        <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]">
          <NeonPanel
            title={VISUALIZATION_PANEL_TITLES.sourceCode}
            tone="amber"
            bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
          >
            <CodeBlock
              lines={CODE_LINES.map((line): CodeBlockLine => {
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
              title="Call Stack"
              tone="amber"
              bodyClassName="min-h-[10rem]"
              className={flashes.stack ? "viz-change-flash" : undefined}
            >
              <StackItems items={currentStep?.stack ?? []} />
            </NeonPanel>

            <NeonPanel
              title="Scope Chain"
              tone="cyan"
              bodyClassName="min-h-[10rem]"
              className={flashes.scope ? "viz-change-flash" : undefined}
            >
              <ScopeItems entries={currentStep?.scope ?? []} />
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
