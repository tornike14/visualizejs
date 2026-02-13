"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  ChevronDown,
  ArrowUp,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CodePanel({
  title,
  lines,
  highlightIds,
  floatingIds,
  tdzIds,
  isHoistedView,
}: {
  title: string;
  lines: (CodeLine | HoistedLine)[];
  highlightIds: string[];
  floatingIds: string[];
  tdzIds: string[];
  isHoistedView: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
      {/* Panel header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="block h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="block h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="block h-2.5 w-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="ml-2 text-xs font-medium text-muted-foreground">{title}</span>
      </div>

      {/* Code lines */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed">
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
                "flex items-start gap-3 rounded-md px-2 py-0.5 transition-all duration-500",
                isHighlighted && "bg-yellow-500/10",
                isInTDZ && "bg-red-500/10",
                isFloating &&
                  "animate-[floatUp_0.8s_ease-out_forwards] bg-emerald-500/10",
                !isHighlighted && !isInTDZ && !isFloating && "bg-transparent"
              )}
            >
              {/* Line number */}
              <span className="w-5 shrink-0 select-none text-right text-xs text-muted-foreground/50">
                {idx + 1}
              </span>

              {/* Indicators */}
              <span className="w-4 shrink-0">
                {isFloating && (
                  <ArrowUp className="h-3.5 w-3.5 animate-[floatUp_0.8s_ease-out_forwards] text-emerald-400" />
                )}
                {isInTDZ && !isFloating && (
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                )}
              </span>

              {/* Code text */}
              <span
                className={cn(
                  "flex-1 whitespace-pre",
                  isHoistedLine && "text-emerald-400",
                  isInTDZ && "text-red-400",
                  !isHoistedLine &&
                    !isInTDZ &&
                    (line.text === "" ? "opacity-0" : "text-foreground")
                )}
              >
                {"  ".repeat(line.indent)}
                {line.text || " "}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConsolePanel({ output }: { output: string[] }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">Console</span>
      </div>
      <div className="min-h-[4rem] flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed">
        {output.length === 0 ? (
          <span className="text-muted-foreground/50">
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
                  isError ? "text-red-400" : "text-emerald-400"
                )}
              >
                <span className="mr-2 text-muted-foreground/40">&gt;</span>
                {line}
              </div>
            );
          })
        )}
      </div>
    </div>
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
          "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          open && "ring-2 ring-ring/50"
        )}
      >
        <span>{active?.title ?? "Select example"}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          {examples.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                onSelect(ex.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full flex-col gap-1 px-4 py-3 text-left text-sm transition-colors hover:bg-accent",
                ex.id === activeId && "bg-accent"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{ex.title}</span>
                <Badge variant="outline" className={cn("text-[10px]", kindBadgeClass(ex.kind))}>
                  {kindLabel(ex.kind)}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground line-clamp-2">
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
              ? "w-6 bg-yellow-400"
              : idx < current
                ? "w-3 bg-yellow-400/40"
                : "w-3 bg-muted"
          )}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function Hoisting() {
  const [activeExampleId, setActiveExampleId] = useState(EXAMPLES[0].id);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const example = EXAMPLES.find((e) => e.id === activeExampleId) ?? EXAMPLES[0];
  const step = example.steps[currentStep];
  const isLastStep = currentStep >= example.steps.length - 1;

  // Auto-play logic
  const clearAutoPlay = useCallback(() => {
    if (playIntervalRef.current !== null) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    playIntervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= example.steps.length) {
          clearAutoPlay();
          return prev;
        }
        return next;
      });
    }, 1800);

    return () => {
      if (playIntervalRef.current !== null) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, [isPlaying, example.steps.length, clearAutoPlay]);

  const handlePlay = useCallback(() => {
    if (isLastStep) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [isLastStep]);

  const handlePause = useCallback(() => {
    clearAutoPlay();
  }, [clearAutoPlay]);

  const handleStepForward = useCallback(() => {
    clearAutoPlay();
    setCurrentStep((prev) => Math.min(prev + 1, example.steps.length - 1));
  }, [example.steps.length, clearAutoPlay]);

  const handleReset = useCallback(() => {
    clearAutoPlay();
    setCurrentStep(0);
  }, [clearAutoPlay]);

  const handleExampleChange = useCallback(
    (id: string) => {
      clearAutoPlay();
      setActiveExampleId(id);
      setCurrentStep(0);
    },
    [clearAutoPlay]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header row: selector + controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ExampleSelector
          examples={EXAMPLES}
          activeId={activeExampleId}
          onSelect={handleExampleChange}
        />

        <div className="flex items-center gap-2">
          {isPlaying ? (
            <Button variant="outline" size="sm" onClick={handlePause}>
              <Pause className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Pause</span>
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handlePlay}>
              <Play className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Play</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleStepForward}
            disabled={isLastStep}
          >
            <SkipForward className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Step</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Reset</span>
          </Button>

          <div className="ml-2 hidden sm:block">
            <StepIndicator total={example.steps.length} current={currentStep} />
          </div>
        </div>
      </div>

      {/* Mobile step indicator */}
      <div className="block sm:hidden">
        <StepIndicator total={example.steps.length} current={currentStep} />
      </div>

      {/* Description badge */}
      <div className="flex items-start gap-2 rounded-lg border border-border bg-card/50 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{example.description}</p>
      </div>

      {/* Split code panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CodePanel
          title="Original Code"
          lines={example.original}
          highlightIds={step.highlightOriginal}
          floatingIds={[]}
          tdzIds={[]}
          isHoistedView={false}
        />
        <CodePanel
          title="How JS Sees It (After Hoisting)"
          lines={example.hoisted}
          highlightIds={step.highlightHoisted}
          floatingIds={step.floatingLineIds}
          tdzIds={step.tdzLineIds}
          isHoistedView={true}
        />
      </div>

      {/* Explanation */}
      <div
        className={cn(
          "rounded-lg border px-4 py-3 text-sm transition-colors duration-300",
          step.kind === "tdz-error"
            ? "border-red-500/30 bg-red-500/5 text-red-300"
            : step.kind === "hoist"
              ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
              : "border-border bg-card/50 text-muted-foreground"
        )}
      >
        <div className="flex items-start gap-2">
          {step.kind === "tdz-error" && (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          )}
          {step.kind === "hoist" && (
            <ArrowUp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          )}
          <p>{step.explanation}</p>
        </div>
      </div>

      {/* Console */}
      <ConsolePanel output={step.consoleOutput} />

      {/* Step counter text */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Step {currentStep + 1} of {example.steps.length}
        </span>
        <Badge variant="outline" className={cn("text-[10px]", kindBadgeClass(example.kind))}>
          {kindLabel(example.kind)}
        </Badge>
      </div>
    </div>
  );
}

export default Hoisting;
