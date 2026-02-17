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
import {
  ExampleSelector,
  type ExampleOption,
} from "@/components/visualization-ui/ExampleSelector";
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { cn } from "@/lib/utils";
import {
  VISUALIZATION_PANEL_TITLES,
  VISUALIZATION_EMPTY_STATES,
} from "@/lib/visualization/uiCopy";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";

/* ── Types ── */

type CoercionKind = "equality" | "truthy" | "null" | "nan";

interface SourceLine {
  num: number;
  text: string;
}

interface CoercionOperation {
  label: string;
  result: string;
  color: "amber" | "emerald" | "red" | "cyan";
}

interface CoercionStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  coercionOps: CoercionOperation[];
}

interface CoercionExample extends ExampleOption {
  kind: CoercionKind;
  codeLines: SourceLine[];
  steps: CoercionStep[];
}

/* ── Example Data ── */

const EXAMPLES: CoercionExample[] = [
  /* ── 1. Loose vs Strict ── */
  {
    id: "loose-vs-strict",
    title: "Loose vs Strict",
    description:
      "== triggers type coercion before comparing. === compares without any conversion.",
    kind: "equality",
    codeLines: [
      { num: 1, text: 'console.log("5" == 5);' },
      { num: 2, text: 'console.log("5" === 5);' },
      { num: 3, text: "console.log(0 == false);" },
      { num: 4, text: "console.log(0 === false);" },
      { num: 5, text: 'console.log("" == false);' },
      { num: 6, text: 'console.log("" === false);' },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>"5" == 5</code> uses loose equality. The engine converts the string <code>"5"</code> to the number <code>5</code>, then compares <code>5 == 5</code>.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: ["true"],
        coercionOps: [
          { label: '"5" (string) converts to 5 (number)', result: "Coerced", color: "amber" },
          { label: "5 == 5", result: "true", color: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>"5" === 5</code> uses strict equality. Types differ (string vs number), so it returns <code>false</code> immediately. No coercion happens.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: ["true", "false"],
        coercionOps: [
          { label: "Types: string vs number", result: "Different types", color: "red" },
          { label: "No coercion performed", result: "false", color: "red" },
        ],
      },
      {
        descriptionHtml:
          "<code>0 == false</code> coerces <code>false</code> to <code>0</code>, then compares <code>0 == 0</code>. Result: <code>true</code>.",
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: ["true", "false", "true"],
        coercionOps: [
          { label: "false (boolean) converts to 0 (number)", result: "Coerced", color: "amber" },
          { label: "0 == 0", result: "true", color: "emerald" },
        ],
      },
      {
        descriptionHtml:
          "<code>0 === false</code> compares without coercion. <code>0</code> is a number, <code>false</code> is a boolean. Different types, so <code>false</code>.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: ["true", "false", "true", "false"],
        coercionOps: [
          { label: "Types: number vs boolean", result: "Different types", color: "red" },
          { label: "No coercion performed", result: "false", color: "red" },
        ],
      },
      {
        descriptionHtml:
          '<code>"" == false</code> both get coerced to numbers. <code>""</code> becomes <code>0</code>, <code>false</code> becomes <code>0</code>. <code>0 == 0</code> is <code>true</code>.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["true", "false", "true", "false", "true"],
        coercionOps: [
          { label: '"" (string) converts to 0 (number)', result: "Coerced", color: "amber" },
          { label: "false (boolean) converts to 0 (number)", result: "Coerced", color: "amber" },
          { label: "0 == 0", result: "true", color: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>"" === false</code> string vs boolean, different types. <strong>Key takeaway:</strong> <code>===</code> avoids surprises by skipping coercion entirely.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["true", "false", "true", "false", "true", "false"],
        coercionOps: [
          { label: "Types: string vs boolean", result: "Different types", color: "red" },
          { label: "No coercion performed", result: "false", color: "red" },
        ],
      },
    ],
  },

  /* ── 2. Truthy & Falsy ── */
  {
    id: "truthy-falsy",
    title: "Truthy & Falsy",
    description:
      "JavaScript has exactly 8 falsy values. Everything else is truthy -- including some surprises.",
    kind: "truthy",
    codeLines: [
      { num: 1, text: 'if (0)         console.log("0 is truthy");' },
      { num: 2, text: 'if ("")        console.log("\\\"\\\" is truthy");' },
      { num: 3, text: 'if (null)      console.log("null is truthy");' },
      { num: 4, text: 'if (undefined) console.log("undef is truthy");' },
      { num: 5, text: 'if (NaN)       console.log("NaN is truthy");' },
      { num: 6, text: 'if ("0")       console.log("\\"0\\" is truthy");' },
      { num: 7, text: 'if ([])        console.log("[] is truthy");' },
      { num: 8, text: 'if ({})        console.log("{} is truthy");' },
    ],
    steps: [
      {
        descriptionHtml:
          "<code>0</code> is one of the 8 falsy values. <code>Boolean(0)</code> is <code>false</code>, so the <code>if</code> block is skipped.",
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        coercionOps: [
          { label: "0 (number) is falsy", result: "Boolean(0) = false", color: "red" },
          { label: "if block skipped", result: "not executed", color: "red" },
        ],
      },
      {
        descriptionHtml:
          '<code>""</code> (empty string) is falsy. Any non-empty string would be truthy, but the empty string converts to <code>false</code>.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        coercionOps: [
          { label: '"" (empty string) is falsy', result: 'Boolean("") = false', color: "red" },
          { label: "if block skipped", result: "not executed", color: "red" },
        ],
      },
      {
        descriptionHtml:
          "<code>null</code> is falsy. It represents the intentional absence of any value.",
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: [],
        coercionOps: [
          { label: "null is falsy", result: "Boolean(null) = false", color: "red" },
          { label: "if block skipped", result: "not executed", color: "red" },
        ],
      },
      {
        descriptionHtml:
          "<code>undefined</code> is falsy. It means a variable was declared but not assigned a value.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: [],
        coercionOps: [
          { label: "undefined is falsy", result: "Boolean(undefined) = false", color: "red" },
          { label: "if block skipped", result: "not executed", color: "red" },
        ],
      },
      {
        descriptionHtml:
          "<code>NaN</code> (Not-a-Number) is falsy. Despite being of type <code>number</code>, it converts to <code>false</code>.",
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: [],
        coercionOps: [
          { label: "NaN is falsy", result: "Boolean(NaN) = false", color: "red" },
          { label: "if block skipped", result: "not executed", color: "red" },
        ],
      },
      {
        descriptionHtml:
          '<code>"0"</code> is <strong>truthy</strong>. It is a non-empty string, so <code>Boolean("0")</code> is <code>true</code>. This surprises many developers.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ['"0" is truthy'],
        coercionOps: [
          { label: '"0" (non-empty string) is truthy', result: 'Boolean("0") = true', color: "emerald" },
          { label: "if block executes", result: "logged", color: "emerald" },
        ],
      },
      {
        descriptionHtml:
          "<code>[]</code> (empty array) is <strong>truthy</strong>. All objects are truthy in JavaScript, including empty arrays and objects.",
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ['"0" is truthy', "[] is truthy"],
        coercionOps: [
          { label: "[] (empty array) is truthy", result: "Boolean([]) = true", color: "emerald" },
          { label: "if block executes", result: "logged", color: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>{}</code> (empty object) is <strong>truthy</strong>. <strong>Key takeaway:</strong> only these 8 values are falsy: <code>false</code>, <code>0</code>, <code>-0</code>, <code>0n</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>.',
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        consoleOutput: ['"0" is truthy', "[] is truthy", "{} is truthy"],
        coercionOps: [
          { label: "{} (empty object) is truthy", result: "Boolean({}) = true", color: "emerald" },
          { label: "if block executes", result: "logged", color: "emerald" },
        ],
      },
    ],
  },

  /* ── 3. null & undefined ── */
  {
    id: "null-undefined",
    title: "null & undefined",
    description:
      "null and undefined are loosely equal to each other but not to anything else.",
    kind: "null",
    codeLines: [
      { num: 1, text: "console.log(null == undefined);" },
      { num: 2, text: "console.log(null === undefined);" },
      { num: 3, text: "console.log(null == 0);" },
      { num: 4, text: 'console.log(null == "");' },
      { num: 5, text: "console.log(typeof null);" },
      { num: 6, text: "console.log(typeof undefined);" },
    ],
    steps: [
      {
        descriptionHtml:
          "<code>null == undefined</code> is <code>true</code>. This is a special rule in the spec: <code>null</code> and <code>undefined</code> are loosely equal to each other and nothing else.",
        activeLine: 1,
        doneLines: [],
        consoleOutput: ["true"],
        coercionOps: [
          { label: "Special rule: null == undefined", result: "Always true", color: "emerald" },
        ],
      },
      {
        descriptionHtml:
          "<code>null === undefined</code> is <code>false</code>. Strict equality checks types first: <code>null</code> is type <code>object</code>, <code>undefined</code> is type <code>undefined</code>.",
        activeLine: 2,
        doneLines: [1],
        consoleOutput: ["true", "false"],
        coercionOps: [
          { label: "Types: object vs undefined", result: "Different types", color: "red" },
          { label: "No coercion performed", result: "false", color: "red" },
        ],
      },
      {
        descriptionHtml:
          "<code>null == 0</code> is <code>false</code>. Unlike other falsy values, <code>null</code> does not coerce to a number with <code>==</code>. It only equals <code>undefined</code>.",
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: ["true", "false", "false"],
        coercionOps: [
          { label: "null is not coerced to a number", result: "No conversion", color: "cyan" },
          { label: "null == 0", result: "false", color: "red" },
        ],
      },
      {
        descriptionHtml:
          '<code>null == ""</code> is <code>false</code>. <code>null</code> is only loosely equal to <code>undefined</code>, not to <code>0</code>, <code>""</code>, or <code>false</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: ["true", "false", "false", "false"],
        coercionOps: [
          { label: "null is not coerced to a string", result: "No conversion", color: "cyan" },
          { label: 'null == ""', result: "false", color: "red" },
        ],
      },
      {
        descriptionHtml:
          '<code>typeof null</code> returns <code>"object"</code>. This is a historical bug in JavaScript that has never been fixed for backward compatibility.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["true", "false", "false", "false", "object"],
        coercionOps: [
          { label: "typeof null", result: '"object"', color: "amber" },
          { label: "Historical bug since JS 1.0", result: "Never fixed", color: "amber" },
        ],
      },
      {
        descriptionHtml:
          '<code>typeof undefined</code> returns <code>"undefined"</code>. <strong>Key takeaway:</strong> use <code>== null</code> to check for both null and undefined, or use <code>===</code> to distinguish them.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["true", "false", "false", "false", "object", "undefined"],
        coercionOps: [
          { label: "typeof undefined", result: '"undefined"', color: "emerald" },
          { label: "Matches its own type name", result: "Consistent", color: "emerald" },
        ],
      },
    ],
  },

  /* ── 4. NaN Quirks ── */
  {
    id: "nan-quirks",
    title: "NaN Quirks",
    description:
      "NaN is the only value in JavaScript that is not equal to itself.",
    kind: "nan",
    codeLines: [
      { num: 1, text: "console.log(NaN === NaN);" },
      { num: 2, text: "console.log(NaN == NaN);" },
      { num: 3, text: "console.log(typeof NaN);" },
      { num: 4, text: 'console.log(isNaN("hello"));' },
      { num: 5, text: 'console.log(Number.isNaN("hello"));' },
      { num: 6, text: "console.log(Number.isNaN(NaN));" },
    ],
    steps: [
      {
        descriptionHtml:
          "<code>NaN === NaN</code> is <code>false</code>. NaN is the <strong>only</strong> JavaScript value that is not strictly equal to itself. This is defined by IEEE 754.",
        activeLine: 1,
        doneLines: [],
        consoleOutput: ["false"],
        coercionOps: [
          { label: "NaN === NaN", result: "false", color: "red" },
          { label: "IEEE 754: NaN is never equal to anything", result: "Including itself", color: "amber" },
        ],
      },
      {
        descriptionHtml:
          "<code>NaN == NaN</code> is also <code>false</code>. Even loose equality cannot make NaN equal to itself. No coercion helps here.",
        activeLine: 2,
        doneLines: [1],
        consoleOutput: ["false", "false"],
        coercionOps: [
          { label: "NaN == NaN", result: "false", color: "red" },
          { label: "Loose equality cannot help", result: "Still not equal", color: "red" },
        ],
      },
      {
        descriptionHtml:
          '<code>typeof NaN</code> returns <code>"number"</code>. Despite its name "Not-a-Number", NaN is technically of type <code>number</code> in JavaScript.',
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: ["false", "false", "number"],
        coercionOps: [
          { label: "typeof NaN", result: '"number"', color: "amber" },
          { label: '"Not-a-Number" is a number', result: "Ironic but true", color: "amber" },
        ],
      },
      {
        descriptionHtml:
          '<code>isNaN("hello")</code> is <code>true</code>. The global <code>isNaN()</code> coerces its argument to a number first. <code>Number("hello")</code> is <code>NaN</code>, so it returns <code>true</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: ["false", "false", "number", "true"],
        coercionOps: [
          { label: 'Number("hello") produces NaN', result: "Coerced first", color: "amber" },
          { label: "isNaN(NaN)", result: "true", color: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>Number.isNaN("hello")</code> is <code>false</code>. Unlike global <code>isNaN()</code>, <code>Number.isNaN()</code> does <strong>not</strong> coerce. <code>"hello"</code> is not <code>NaN</code>, it is a string.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["false", "false", "number", "true", "false"],
        coercionOps: [
          { label: "No coercion performed", result: "Strict check", color: "cyan" },
          { label: '"hello" is a string, not NaN', result: "false", color: "red" },
        ],
      },
      {
        descriptionHtml:
          "<code>Number.isNaN(NaN)</code> is <code>true</code>. This is the reliable way to check for NaN. <strong>Key takeaway:</strong> always prefer <code>Number.isNaN()</code> over global <code>isNaN()</code>.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["false", "false", "number", "true", "false", "true"],
        coercionOps: [
          { label: "Value is exactly NaN", result: "true", color: "emerald" },
          { label: "Number.isNaN() is the safe check", result: "Recommended", color: "emerald" },
        ],
      },
    ],
  },
];

/* ── Helpers ── */

function kindBadgeClass(kind: CoercionKind): string {
  switch (kind) {
    case "equality":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    case "truthy":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "null":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/25";
    case "nan":
      return "bg-red-500/15 text-red-400 border-red-500/25";
  }
}

function kindLabel(kind: CoercionKind): string {
  switch (kind) {
    case "equality":
      return "== vs ===";
    case "truthy":
      return "truthy/falsy";
    case "null":
      return "null/undefined";
    case "nan":
      return "NaN";
  }
}

const OP_COLOR_MAP = {
  amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  red: "border-red-500/30 bg-red-500/8 text-red-300",
  cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
} as const;

/* ── Component ── */

export function TypeCoercion() {
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
      coercionOps: currentStep?.coercionOps,
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
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", kindBadgeClass(ex.kind))}
                  >
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

          <div className={cn("app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5", flashes.description && "viz-change-flash-pill")}>
            {currentStep?.descriptionHtml ? (
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
              lines={example.codeLines.map(
                (line): CodeBlockLine => {
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
                }
              )}
            />
          </NeonPanel>

          <div className="space-y-4">
            <NeonPanel
              title="Coercion Steps"
              tone="cyan"
              bodyClassName="min-h-[7rem] space-y-2"
              className={flashes.coercionOps ? "viz-change-flash" : undefined}
            >
              {currentStep && currentStep.coercionOps.length > 0 ? (
                currentStep.coercionOps.map((op, idx) => (
                  <div
                    key={`${currentStepIndex}-${idx}`}
                    className={cn(
                      "viz-slide-in flex items-center justify-between gap-3 rounded-lg border px-3 py-2 font-mono text-xs",
                      OP_COLOR_MAP[op.color]
                    )}
                  >
                    <span>{op.label}</span>
                    <span className="shrink-0 font-semibold">{op.result}</span>
                  </div>
                ))
              ) : (
                <p className="pt-1 text-sm text-slate-500/70">
                  Step through the code to see coercion in action.
                </p>
              )}
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
