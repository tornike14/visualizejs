"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ChevronDown,
  ArrowUp,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NeonPanel, type NeonTone } from "@/components/visualization-ui/NeonPanel";
import {
  TransportControls,
  type PlaybackSpeedLevel,
} from "@/components/visualization-ui/TransportControls";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type HoistingKind = "var" | "function" | "let" | "const" | "function-expr";

interface CodeLine {
  text: string;
  indent: number;
  /** Semantic id so we can reference it in steps */
  id: string;
}

interface HoistedLine extends CodeLine {
  /** Whether this line was injected by hoisting (shown with highlight) */
  isHoisted: boolean;
  /** If this line is in the TDZ */
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
  /** Line ids that are highlighted during this step */
  highlightOriginal: string[];
  highlightHoisted: string[];
  /** The console output produced at this step (cumulative) */
  consoleOutput: string[];
  /** Explanation shown below the code panels */
  explanation: string;
  /** Lines that should appear "floating up" during this step */
  floatingLineIds: string[];
  /** Lines in the TDZ zone during this step */
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

// ---------------------------------------------------------------------------
// Preset Examples
// ---------------------------------------------------------------------------

const EXAMPLES: HoistingExample[] = [
  // 1. var declarations
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
        kind: "idle",
        highlightOriginal: [],
        highlightHoisted: [],
        consoleOutput: [],
        explanation: "Before execution begins, the JS engine scans the code for declarations.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "hoist",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h1"],
        consoleOutput: [],
        explanation:
          'The engine hoists "var name" to the top and initializes it as undefined. The assignment stays in place.',
        floatingLineIds: ["h1"],
        tdzLineIds: [],
      },
      {
        kind: "execute",
        highlightOriginal: ["o1"],
        highlightHoisted: ["h2"],
        consoleOutput: ["undefined"],
        explanation:
          "console.log(name) runs. name exists but is undefined because only the declaration was hoisted, not the assignment.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "execute",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h3"],
        consoleOutput: ["undefined"],
        explanation: 'The assignment name = "Alice" now executes. name is set to "Alice".',
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "result",
        highlightOriginal: ["o3"],
        highlightHoisted: ["h4"],
        consoleOutput: ["undefined", '"Alice"'],
        explanation:
          'console.log(name) runs again. Now name is "Alice". var hoisting only moves the declaration, not the value.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
    ],
  },

  // 2. function declarations
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
        kind: "idle",
        highlightOriginal: [],
        highlightHoisted: [],
        consoleOutput: [],
        explanation:
          "The JS engine scans for declarations before executing any code.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "hoist",
        highlightOriginal: ["o2", "o3", "o4"],
        highlightHoisted: ["h1", "h2", "h3"],
        consoleOutput: [],
        explanation:
          "The entire function declaration is hoisted to the top -- both the name and the full body.",
        floatingLineIds: ["h1", "h2", "h3"],
        tdzLineIds: [],
      },
      {
        kind: "execute",
        highlightOriginal: ["o1"],
        highlightHoisted: ["h4"],
        consoleOutput: [],
        explanation:
          "greet() is called. Since the function was fully hoisted, it exists and can be invoked.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "result",
        highlightOriginal: ["o3"],
        highlightHoisted: ["h2"],
        consoleOutput: ['"Hello!"'],
        explanation:
          'The function body executes, printing "Hello!". Function declarations are fully hoisted, unlike var or function expressions.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
    ],
  },

  // 3. let/const  -- Temporal Dead Zone
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
        kind: "idle",
        highlightOriginal: [],
        highlightHoisted: [],
        consoleOutput: [],
        explanation:
          "The engine scans for declarations. let and const are hoisted to the top of the block but remain uninitialized.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "hoist",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h1"],
        consoleOutput: [],
        explanation:
          "let score is hoisted, but unlike var, it is NOT initialized. The Temporal Dead Zone (TDZ) begins from the top of the scope until the declaration is reached.",
        floatingLineIds: ["h1"],
        tdzLineIds: ["h1", "h2"],
      },
      {
        kind: "tdz-error",
        highlightOriginal: ["o1"],
        highlightHoisted: ["h2"],
        consoleOutput: ["ReferenceError: Cannot access 'score' before initialization"],
        explanation:
          "Accessing score in the TDZ throws a ReferenceError. The variable exists (it was hoisted), but it cannot be accessed until the let declaration is reached.",
        floatingLineIds: [],
        tdzLineIds: ["h1", "h2"],
      },
      {
        kind: "execute",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h3"],
        consoleOutput: ["ReferenceError: Cannot access 'score' before initialization"],
        explanation:
          "If execution continued (ignoring the error), this is where the TDZ ends. score is now initialized to 100.",
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
          'After the declaration, score is accessible and holds the value 100. The key lesson: let/const have a TDZ that prevents access before initialization.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
    ],
  },

  // 4. Function expressions with var
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
        kind: "idle",
        highlightOriginal: [],
        highlightHoisted: [],
        consoleOutput: [],
        explanation:
          "The engine prepares to execute. It finds a var declaration and hoists it.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "hoist",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h1"],
        consoleOutput: [],
        explanation:
          'var sayHi is hoisted and set to undefined. The function assigned to it is NOT hoisted -- only the variable name.',
        floatingLineIds: ["h1"],
        tdzLineIds: [],
      },
      {
        kind: "tdz-error",
        highlightOriginal: ["o1"],
        highlightHoisted: ["h2"],
        consoleOutput: ["TypeError: sayHi is not a function"],
        explanation:
          "Calling sayHi() fails with TypeError because sayHi is undefined at this point. Unlike function declarations, function expressions are not fully hoisted.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "execute",
        highlightOriginal: ["o2", "o3", "o4"],
        highlightHoisted: ["h3", "h4", "h5"],
        consoleOutput: ["TypeError: sayHi is not a function"],
        explanation:
          "If execution continued past the error, the function would be assigned to sayHi here.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "result",
        highlightOriginal: [],
        highlightHoisted: [],
        consoleOutput: ["TypeError: sayHi is not a function"],
        explanation:
          "Key takeaway: Function expressions assigned to var are only hoisted as undefined. Use function declarations if you need hoisting, or declare before use.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Utility: Kind badge colors
// ---------------------------------------------------------------------------

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

const SPEED_TO_DELAY_MS: Record<PlaybackSpeedLevel, number> = {
  1: 2400,
  2: 1800,
  3: 1300,
  4: 850,
  5: 500,
};

const SPEED_LABELS: Record<PlaybackSpeedLevel, string> = {
  1: "0.5x",
  2: "0.75x",
  3: "1x",
  4: "1.5x",
  5: "2x",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CodePanel({
  title,
  tone,
  lines,
  highlightIds,
  floatingIds,
  tdzIds,
  isHoistedView,
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
      bodyClassName="min-h-[24rem] overflow-auto p-0 font-mono text-sm leading-relaxed"
    >
      <div className="space-y-1 p-4">
        {lines.map((line, idx) => {
          const isHighlighted = highlightIds.includes(line.id);
          const isFloating = floatingIds.includes(line.id);
          const isInTDZ = tdzIds.includes(line.id);
          const isHoistedLine =
            isHoistedView && "isHoisted" in line && line.isHoisted;

          return (
            <div
              key={`${line.id}-${idx}`}
              className={cn(
                "flex items-start gap-3 rounded-lg px-2 py-1 transition-all duration-300",
                isFloating && "ho-floating bg-emerald-500/10 ring-1 ring-emerald-400/20",
                isInTDZ && "bg-red-500/10 ring-1 ring-red-400/20",
                isHighlighted && !isInTDZ && "bg-amber-400/10 ring-1 ring-amber-300/20"
              )}
            >
              <span className="w-5 shrink-0 select-none text-right text-xs text-slate-500/65">
                {idx + 1}
              </span>

              <span className="w-4 shrink-0">
                {isFloating && <ArrowUp className="ho-floating h-3.5 w-3.5 text-emerald-300" />}
                {isInTDZ && !isFloating && (
                  <AlertTriangle className="h-3.5 w-3.5 text-red-300" />
                )}
              </span>

              <span
                className={cn(
                  "flex-1 whitespace-pre",
                  line.text === "" && "opacity-0",
                  isHoistedLine && "text-emerald-300",
                  isInTDZ && "text-red-300",
                  !isHoistedLine && !isInTDZ && line.text !== "" && "text-slate-100"
                )}
              >
                {"  ".repeat(line.indent)}
                {line.text || " "}
              </span>
            </div>
          );
        })}
      </div>
    </NeonPanel>
  );
}

function ConsolePanel({ output }: { output: string[] }) {
  return (
    <NeonPanel
      title="Console Output"
      tone="slate"
      bodyClassName="min-h-[8.5rem] overflow-auto p-3 font-mono text-xs leading-relaxed"
    >
      <div className="space-y-1">
        {output.length === 0 ? (
          <span className="text-slate-500/70">
            {"// output will appear here"}
          </span>
        ) : (
          output.map((line, idx) => {
            const isError =
              line.startsWith("ReferenceError") || line.startsWith("TypeError");
            return (
              <div
                key={idx}
                className={cn(
                  "py-0.5",
                  isError ? "text-red-300" : "text-emerald-300"
                )}
              >
                <span className="mr-2 text-slate-500/60">&gt;</span>
                {line}
              </div>
            );
          })
        )}
      </div>
    </NeonPanel>
  );
}

function ExampleSelector({
  examples,
  activeId,
  onSelect,
}: {
  examples: HoistingExample[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = examples.find((e) => e.id === activeId);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "app-surface-subtle flex min-w-[16rem] items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-100 transition-all hover:border-pink-300/35 hover:bg-[rgba(22,33,59,0.72)]",
          open && "ring-2 ring-pink-300/50"
        )}
      >
        <span>{active?.title ?? "Select example"}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="app-surface absolute left-0 top-full z-50 mt-2 w-[22rem] overflow-hidden rounded-2xl border-[color:var(--app-border)] p-1.5 shadow-[0_18px_36px_rgba(2,6,23,0.5)]">
          {examples.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                onSelect(ex.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full flex-col gap-1 rounded-xl border border-transparent px-3 py-2.5 text-left text-sm transition-all",
                ex.id === activeId
                  ? "border-pink-300/30 bg-[rgba(31,45,74,0.65)]"
                  : "hover:border-[rgba(71,85,105,0.6)] hover:bg-[rgba(22,33,59,0.62)]"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-100">{ex.title}</span>
                <Badge variant="outline" className={cn("text-[10px]", kindBadgeClass(ex.kind))}>
                  {kindLabel(ex.kind)}
                </Badge>
              </div>
              <span className="line-clamp-2 text-xs text-slate-400">
                {ex.description}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StepIndicator({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            idx === current
              ? "w-7 bg-amber-300"
              : idx < current
                ? "w-3 bg-amber-300/45"
                : "w-3 bg-slate-700/80"
          )}
        />
      ))}
    </div>
  );
}

function explanationTone(kind: StepKind): NeonTone {
  if (kind === "tdz-error") {
    return "pink";
  }

  if (kind === "hoist") {
    return "green";
  }

  return "slate";
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function Hoisting() {
  const [activeExampleId, setActiveExampleId] = useState(EXAMPLES[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedLevel, setSpeedLevel] = useState<PlaybackSpeedLevel>(3);

  const example = EXAMPLES.find((e) => e.id === activeExampleId) ?? EXAMPLES[0];
  const totalSteps = example.steps.length;
  const lastStepIndex = totalSteps - 1;
  const step = example.steps[currentStepIndex] ?? example.steps[0];
  const canStep = currentStepIndex < lastStepIndex;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCurrentStepIndex((previousStep) => {
        if (previousStep >= lastStepIndex) {
          setIsPlaying(false);
          return previousStep;
        }

        const nextStep = previousStep + 1;
        if (nextStep >= lastStepIndex) {
          setIsPlaying(false);
        }

        return nextStep;
      });
    }, SPEED_TO_DELAY_MS[speedLevel]);

    return () => window.clearTimeout(timeoutId);
  }, [currentStepIndex, isPlaying, lastStepIndex, speedLevel]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((previousPlaying) => {
      if (previousPlaying) {
        return false;
      }

      setCurrentStepIndex((previousStep) => {
        if (previousStep >= lastStepIndex) {
          return 0;
        }

        return previousStep;
      });

      return true;
    });
  }, [lastStepIndex]);

  const handleStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((previousStep) =>
      Math.min(previousStep + 1, lastStepIndex)
    );
  }, [lastStepIndex]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleExampleChange = useCallback(
    (id: string) => {
      setIsPlaying(false);
      setActiveExampleId(id);
      setCurrentStepIndex(0);
    },
    []
  );

  return (
    <section className="relative flex flex-col gap-6 px-1 py-2 text-slate-100 sm:px-2 sm:py-3 lg:px-3 lg:py-4">
      <style>{`
        .ho-floating {
          animation: ho-float-up 0.7s ease-out;
        }

        @keyframes ho-float-up {
          from {
            opacity: 0.25;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <ExampleSelector
            examples={EXAMPLES}
            activeId={activeExampleId}
            onSelect={handleExampleChange}
          />
          <Badge variant="outline" className={cn("text-[10px]", kindBadgeClass(example.kind))}>
            {kindLabel(example.kind)}
          </Badge>
        </div>

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
            Step {currentStepIndex + 1} / {totalSteps}
          </p>
        </div>
      </div>

      <div className="app-surface-subtle flex items-start gap-2 rounded-2xl px-4 py-3 text-sm text-slate-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
        <p>{example.description}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodePanel
          title="Original Code"
          tone="amber"
          lines={example.original}
          highlightIds={step.highlightOriginal}
          floatingIds={[]}
          tdzIds={[]}
          isHoistedView={false}
        />
        <CodePanel
          title="How JS Sees It (After Hoisting)"
          tone="cyan"
          lines={example.hoisted}
          highlightIds={step.highlightHoisted}
          floatingIds={step.floatingLineIds}
          tdzIds={step.tdzLineIds}
          isHoistedView={true}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <NeonPanel
          title="Step Explanation"
          tone={explanationTone(step.kind)}
          bodyClassName="min-h-[8.5rem] flex items-start gap-2 text-sm"
        >
          {step.kind === "tdz-error" && (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
          )}
          {step.kind === "hoist" && (
            <ArrowUp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
          )}
          <p
            className={cn(
              step.kind === "tdz-error" && "text-red-200",
              step.kind === "hoist" && "text-emerald-200",
              step.kind !== "tdz-error" && step.kind !== "hoist" && "text-slate-300"
            )}
          >
            {step.explanation}
          </p>
        </NeonPanel>
        <div>
          <ConsolePanel output={step.consoleOutput} />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <StepIndicator total={totalSteps} current={currentStepIndex} />
        <span className="text-xs text-[color:var(--app-text-secondary)]">
          Hoisting pass first, execution pass second.
        </span>
      </div>
    </section>
  );
}
