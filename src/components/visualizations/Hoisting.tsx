"use client";

import { useState } from "react";
import {
  ArrowUp,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NeonPanel, type NeonTone } from "@/components/visualization-ui/NeonPanel";
import { CodeLine as CodeLineComponent } from "@/components/visualization-ui/CodeLine";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { ExampleSelector } from "@/components/visualization-ui/ExampleSelector";
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { cn } from "@/lib/utils";
import { VISUALIZATION_PANEL_TITLES, VISUALIZATION_EMPTY_STATES } from "@/lib/visualization/uiCopy";
import { useStepPlayback } from "@/hooks/useStepPlayback";


type HoistingKind = "var" | "function" | "let" | "const" | "function-expr";

interface CodeLine {
  text: string;
  indent: number;
  id: string;
}

interface HoistedLine extends CodeLine {
  isHoisted: boolean;
  isTDZ: boolean;
}

type StepKind =
  | "idle"
  | "hoist"
  | "execute"
  | "tdz-error"
  | "result";

interface ExecutionStep {
  kind: StepKind;
  highlightOriginal: string[];
  highlightHoisted: string[];
  consoleOutput: string[];
  explanation: string;
  floatingLineIds: string[];
  tdzLineIds: string[];
}

interface HoistingExample {
  id: string;
  title: string;
  kind: HoistingKind;
  description: string;
  original: CodeLine[];
  hoisted: HoistedLine[];
  steps: ExecutionStep[];
}


const EXAMPLES: HoistingExample[] = [
  {
    id: "var-basic",
    title: "var Declarations",
    kind: "var",
    description:
      "var declarations are hoisted to the top of their scope and initialized as undefined.",
    original: [
      { text: 'console.log(name);', indent: 0, id: "o1" },
      { text: 'var name = "Alice";', indent: 0, id: "o2" },
      { text: 'console.log(name);', indent: 0, id: "o3" },
    ],
    hoisted: [
      { text: "var name;", indent: 0, id: "h1", isHoisted: true, isTDZ: false },
      { text: "", indent: 0, id: "h-blank", isHoisted: false, isTDZ: false },
      { text: "console.log(name);", indent: 0, id: "h2", isHoisted: false, isTDZ: false },
      { text: 'name = "Alice";', indent: 0, id: "h3", isHoisted: false, isTDZ: false },
      { text: "console.log(name);", indent: 0, id: "h4", isHoisted: false, isTDZ: false },
    ],
    steps: [
      {
        kind: "hoist",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h1"],
        consoleOutput: [],
        explanation:
          'Before any code runs, the engine hoists <code>var name</code> to the top of the scope and initializes it as <code>undefined</code>. The assignment stays in place.',
        floatingLineIds: ["h1"],
        tdzLineIds: [],
      },
      {
        kind: "execute",
        highlightOriginal: ["o1"],
        highlightHoisted: ["h2"],
        consoleOutput: ["undefined"],
        explanation:
          "<code>console.log(name)</code> executes. <code>name</code> exists but holds <code>undefined</code> because only the declaration was hoisted, not the assignment.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "execute",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h3"],
        consoleOutput: ["undefined"],
        explanation: 'The assignment <code>name = "Alice"</code> executes. <code>name</code> is now set to <code>"Alice"</code>.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "result",
        highlightOriginal: ["o3"],
        highlightHoisted: ["h4"],
        consoleOutput: ["undefined", "Alice"],
        explanation:
          '<code>console.log(name)</code> runs again. Now <code>name</code> is <code>"Alice"</code>. <strong>Key takeaway:</strong> <code>var</code> hoisting only moves the declaration, not the value.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
    ],
  },

  {
    id: "func-decl",
    title: "Function Declarations",
    kind: "function",
    description:
      "Function declarations are fully hoisted -- both the name and the body are available before the declaration.",
    original: [
      { text: "greet();", indent: 0, id: "o1" },
      { text: "", indent: 0, id: "o-blank" },
      { text: "function greet() {", indent: 0, id: "o2" },
      { text: '  console.log("Hello!");', indent: 1, id: "o3" },
      { text: "}", indent: 0, id: "o4" },
    ],
    hoisted: [
      { text: "function greet() {", indent: 0, id: "h1", isHoisted: true, isTDZ: false },
      { text: '  console.log("Hello!");', indent: 1, id: "h2", isHoisted: true, isTDZ: false },
      { text: "}", indent: 0, id: "h3", isHoisted: true, isTDZ: false },
      { text: "", indent: 0, id: "h-blank", isHoisted: false, isTDZ: false },
      { text: "greet();", indent: 0, id: "h4", isHoisted: false, isTDZ: false },
    ],
    steps: [
      {
        kind: "hoist",
        highlightOriginal: ["o2", "o3", "o4"],
        highlightHoisted: ["h1", "h2", "h3"],
        consoleOutput: [],
        explanation:
          "Before execution, the entire function declaration is hoisted to the top -- both the name and the full body are available immediately.",
        floatingLineIds: ["h1", "h2", "h3"],
        tdzLineIds: [],
      },
      {
        kind: "execute",
        highlightOriginal: ["o1"],
        highlightHoisted: ["h4"],
        consoleOutput: [],
        explanation:
          "<code>greet()</code> is called. Since the function was fully hoisted, it exists and can be invoked even though the call appears before the declaration in the source code.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "result",
        highlightOriginal: ["o3"],
        highlightHoisted: ["h2"],
        consoleOutput: ["Hello!"],
        explanation:
          'The function body executes, printing <code>Hello!</code> to the console. <strong>Key takeaway:</strong> function declarations are fully hoisted, unlike <code>var</code> or function expressions.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
    ],
  },

  {
    id: "let-tdz",
    title: "let/const & TDZ",
    kind: "let",
    description:
      "let and const are hoisted but NOT initialized. Accessing them before declaration causes a ReferenceError (Temporal Dead Zone).",
    original: [
      { text: "console.log(score);", indent: 0, id: "o1" },
      { text: "let score = 100;", indent: 0, id: "o2" },
      { text: "console.log(score);", indent: 0, id: "o3" },
    ],
    hoisted: [
      {
        text: "// let score -- hoisted but NOT initialized (TDZ starts)",
        indent: 0,
        id: "h1",
        isHoisted: true,
        isTDZ: true,
      },
      { text: "", indent: 0, id: "h-blank", isHoisted: false, isTDZ: false },
      {
        text: "console.log(score);  // ReferenceError!",
        indent: 0,
        id: "h2",
        isHoisted: false,
        isTDZ: true,
      },
      {
        text: "let score = 100;     // TDZ ends here",
        indent: 0,
        id: "h3",
        isHoisted: false,
        isTDZ: false,
      },
      { text: "console.log(score);", indent: 0, id: "h4", isHoisted: false, isTDZ: false },
    ],
    steps: [
      {
        kind: "hoist",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h1"],
        consoleOutput: [],
        explanation:
          "<code>let score</code> is hoisted, but unlike <code>var</code>, it is <strong>not</strong> initialized. The Temporal Dead Zone (TDZ) begins from the top of the scope until the declaration is reached.",
        floatingLineIds: ["h1"],
        tdzLineIds: ["h1", "h2"],
      },
      {
        kind: "tdz-error",
        highlightOriginal: ["o1"],
        highlightHoisted: ["h2"],
        consoleOutput: ["ReferenceError: Cannot access 'score' before initialization"],
        explanation:
          "Accessing <code>score</code> inside the TDZ throws a <code>ReferenceError</code>. The variable exists (it was hoisted), but it cannot be accessed until the <code>let</code> declaration is reached.",
        floatingLineIds: [],
        tdzLineIds: ["h1", "h2"],
      },
      {
        kind: "execute",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h3"],
        consoleOutput: ["ReferenceError: Cannot access 'score' before initialization"],
        explanation:
          "If execution continued past the error, this is where the TDZ ends. <code>score</code> is now initialized to <code>100</code>.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "result",
        highlightOriginal: ["o3"],
        highlightHoisted: ["h4"],
        consoleOutput: [
          "ReferenceError: Cannot access 'score' before initialization",
          "100",
        ],
        explanation:
          'After the declaration, <code>score</code> is accessible and holds the value <code>100</code>. <strong>Key takeaway:</strong> <code>let</code>/<code>const</code> have a TDZ that prevents access before initialization.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
    ],
  },

  {
    id: "func-expr",
    title: "Function Expressions",
    kind: "function-expr",
    description:
      "When a function is assigned to a var, only the var is hoisted (as undefined). The function itself is NOT hoisted.",
    original: [
      { text: "sayHi();", indent: 0, id: "o1" },
      { text: "", indent: 0, id: "o-blank" },
      { text: "var sayHi = function() {", indent: 0, id: "o2" },
      { text: '  console.log("Hi!");', indent: 1, id: "o3" },
      { text: "};", indent: 0, id: "o4" },
    ],
    hoisted: [
      {
        text: "var sayHi;  // undefined, not a function!",
        indent: 0,
        id: "h1",
        isHoisted: true,
        isTDZ: false,
      },
      { text: "", indent: 0, id: "h-blank", isHoisted: false, isTDZ: false },
      {
        text: "sayHi();    // TypeError!",
        indent: 0,
        id: "h2",
        isHoisted: false,
        isTDZ: false,
      },
      { text: "", indent: 0, id: "h-blank2", isHoisted: false, isTDZ: false },
      {
        text: "sayHi = function() {",
        indent: 0,
        id: "h3",
        isHoisted: false,
        isTDZ: false,
      },
      {
        text: '  console.log("Hi!");',
        indent: 1,
        id: "h4",
        isHoisted: false,
        isTDZ: false,
      },
      { text: "};", indent: 0, id: "h5", isHoisted: false, isTDZ: false },
    ],
    steps: [
      {
        kind: "hoist",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h1"],
        consoleOutput: [],
        explanation:
          'Before execution, <code>var sayHi</code> is hoisted and set to <code>undefined</code>. The function assigned to it is <strong>not</strong> hoisted -- only the variable name.',
        floatingLineIds: ["h1"],
        tdzLineIds: [],
      },
      {
        kind: "tdz-error",
        highlightOriginal: ["o1"],
        highlightHoisted: ["h2"],
        consoleOutput: ["TypeError: sayHi is not a function"],
        explanation:
          "Calling <code>sayHi()</code> throws a <code>TypeError</code> because <code>sayHi</code> is <code>undefined</code> at this point. Unlike function declarations, function expressions are not fully hoisted.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "execute",
        highlightOriginal: ["o2", "o3", "o4"],
        highlightHoisted: ["h3", "h4", "h5"],
        consoleOutput: ["TypeError: sayHi is not a function"],
        explanation:
          "If execution continued past the error, the function would be assigned to <code>sayHi</code> here. Only now would <code>sayHi</code> be callable.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "result",
        highlightOriginal: [],
        highlightHoisted: [],
        consoleOutput: ["TypeError: sayHi is not a function"],
        explanation:
          '<strong>Key takeaway:</strong> function expressions assigned to <code>var</code> are only hoisted as <code>undefined</code>. Use function declarations if you need hoisting, or declare before use.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
    ],
  },
];


function kindBadgeClass(kind: HoistingKind): string {
  switch (kind) {
    case "var":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    case "function":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "let":
    case "const":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    case "function-expr":
      return "bg-purple-500/15 text-purple-400 border-purple-500/25";
  }
}

function kindLabel(kind: HoistingKind): string {
  switch (kind) {
    case "var":
      return "var";
    case "function":
      return "function";
    case "let":
      return "let/const";
    case "const":
      return "const";
    case "function-expr":
      return "func expr";
  }
}


function CodePanel({
  title,
  tone,
  lines,
  highlightIds,
  floatingIds,
  tdzIds,
}: {
  title: string;
  tone: NeonTone;
  lines: (CodeLine | HoistedLine)[];
  highlightIds: string[];
  floatingIds: string[];
  tdzIds: string[];
  isHoistedView: boolean;
}) {
  return (
    <NeonPanel
      title={title}
      tone={tone}
      bodyClassName="overflow-auto font-mono text-[13px] leading-[1.9] text-slate-200"
    >
      <div className="space-y-0.5">
        {lines.map((line, idx) => {
          const isHighlighted = highlightIds.includes(line.id);
          const isFloating = floatingIds.includes(line.id);
          const isInTDZ = tdzIds.includes(line.id);

          const icon = isFloating ? (
            <ArrowUp className="viz-float-up h-3.5 w-3.5 text-emerald-300" />
          ) : isInTDZ ? (
            <AlertTriangle className="h-3.5 w-3.5 text-red-300" />
          ) : null;

          const lineClass = cn(
            isFloating && "viz-float-up is-floating",
            isInTDZ && "is-tdz",
            isHighlighted && !isInTDZ && !isFloating && "is-highlighted",
          );

          return (
            <CodeLineComponent
              key={`${line.id}-${idx}`}
              lineNumber={idx + 1}
              text={"  ".repeat(line.indent) + line.text}
              leftSlot={icon}
              className={lineClass}
            />
          );
        })}
      </div>
    </NeonPanel>
  );
}


export function Hoisting() {
  const [activeExampleId, setActiveExampleId] = useState(EXAMPLES[0].id);

  const example = EXAMPLES.find((e) => e.id === activeExampleId) ?? EXAMPLES[0];

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

  const currentStep = currentStepIndex >= 0 ? example.steps[currentStepIndex] : null;

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
              <Badge variant="outline" className={cn("text-[10px]", kindBadgeClass(example.kind))}>
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

          <div className="app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5">
            {currentStep?.explanation ? (
              <p
                className="viz-step-desc text-center text-sm text-slate-300"
                dangerouslySetInnerHTML={{ __html: currentStep.explanation }}
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
        <div className="grid gap-4 xl:grid-cols-2">
          <CodePanel
            title={VISUALIZATION_PANEL_TITLES.sourceCode}
            tone="amber"
            lines={example.original}
            highlightIds={currentStep?.highlightOriginal ?? []}
            floatingIds={[]}
            tdzIds={[]}
            isHoistedView={false}
          />
          <CodePanel
            title="How JS Sees It (After Hoisting)"
            tone="cyan"
            lines={example.hoisted}
            highlightIds={currentStep?.highlightHoisted ?? []}
            floatingIds={currentStep?.floatingLineIds ?? []}
            tdzIds={currentStep?.tdzLineIds ?? []}
            isHoistedView={true}
          />
        </div>

        <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
      </section>
    </>
  );
}
