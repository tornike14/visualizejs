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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SourceLine {
  num: number;
  text: string;
}

interface Binding {
  name: string;
  value: string;
  kind: "var" | "function" | "param";
  /** True when the variable has been assigned its runtime value. */
  initialized: boolean;
}

interface ScopeLink {
  from: string;
  to: string;
  active?: boolean;
}

interface ExecutionContextEntry {
  id: string;
  label: string;
  type: "global" | "function";
  phase: "creation" | "execution";
  thisValue: string;
  variableEnv: Binding[];
  outerEnvLabel: string | null;
}

interface PhaseDetail {
  label: string;
  items: string[];
}

interface ECStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  highlightLines: number[];
  stack: ExecutionContextEntry[];
  scopeLinks: ScopeLink[];
  phaseDetail: PhaseDetail | null;
  returnValue: string | null;
  consoleOutput: string[];
}

// ---------------------------------------------------------------------------
// Source Code
// ---------------------------------------------------------------------------

const CODE_LINES: SourceLine[] = [
  { num: 1, text: 'var language = "JS";' },
  { num: 2, text: "" },
  { num: 3, text: "function greet(name) {" },
  { num: 4, text: '  var message = language + ", " + name;' },
  { num: 5, text: "  console.log(message);" },
  { num: 6, text: "  return message;" },
  { num: 7, text: "}" },
  { num: 8, text: "" },
  { num: 9, text: "function run() {" },
  { num: 10, text: '  var result = greet("World");' },
  { num: 11, text: "  console.log(result);" },
  { num: 12, text: "}" },
  { num: 13, text: "" },
  { num: 14, text: "run();" },
];

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

const STEPS: ECStep[] = [
  // Step 0: Global EC - creation phase starts
  {
    descriptionHtml:
      'The engine creates the <span class="hl-stack">Global Execution Context</span> and enters the <strong>creation phase</strong>. It scans all declarations before executing a single line.',
    activeLine: null,
    doneLines: [],
    highlightLines: [1, 3, 9],
    stack: [
      {
        id: "global",
        label: "Global EC",
        type: "global",
        phase: "creation",
        thisValue: "window",
        variableEnv: [
          { name: "language", value: "undefined", kind: "var", initialized: false },
          { name: "greet", value: "fn()", kind: "function", initialized: true },
          { name: "run", value: "fn()", kind: "function", initialized: true },
        ],
        outerEnvLabel: null,
      },
    ],
    scopeLinks: [],
    phaseDetail: {
      label: "Creation Phase",
      items: [
        "Scan for var declarations -> hoist as undefined",
        "Scan for function declarations -> store full definition",
        "Bind this -> window (global object)",
      ],
    },
    returnValue: null,
    consoleOutput: [],
  },
  // Step 1: Global EC - execution phase
  {
    descriptionHtml:
      'The <span class="hl-stack">Global EC</span> enters the <strong>execution phase</strong>. Code runs line by line. <code>language</code> is assigned <code>"JS"</code>. Function definitions are skipped (already hoisted).',
    activeLine: 1,
    doneLines: [],
    highlightLines: [],
    stack: [
      {
        id: "global",
        label: "Global EC",
        type: "global",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "language", value: '"JS"', kind: "var", initialized: true },
          { name: "greet", value: "fn()", kind: "function", initialized: true },
          { name: "run", value: "fn()", kind: "function", initialized: true },
        ],
        outerEnvLabel: null,
      },
    ],
    scopeLinks: [],
    phaseDetail: {
      label: "Execution Phase",
      items: [
        'Line 1: language = "JS"',
        "Lines 3-7: skip (already hoisted)",
        "Lines 9-12: skip (already hoisted)",
        "Line 14: call run()",
      ],
    },
    returnValue: null,
    consoleOutput: [],
  },
  // Step 2: run() called - creation phase
  {
    descriptionHtml:
      '<code>run()</code> is called on line 14. The engine <strong>pushes</strong> a new <span class="hl-stack">Function Execution Context</span> and enters its <strong>creation phase</strong>. Local <code>var result</code> is hoisted.',
    activeLine: 14,
    doneLines: [1],
    highlightLines: [10],
    stack: [
      {
        id: "run",
        label: "run() EC",
        type: "function",
        phase: "creation",
        thisValue: "window",
        variableEnv: [
          { name: "result", value: "undefined", kind: "var", initialized: false },
        ],
        outerEnvLabel: "Global EC",
      },
      {
        id: "global",
        label: "Global EC",
        type: "global",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "language", value: '"JS"', kind: "var", initialized: true },
          { name: "greet", value: "fn()", kind: "function", initialized: true },
          { name: "run", value: "fn()", kind: "function", initialized: true },
        ],
        outerEnvLabel: null,
      },
    ],
    scopeLinks: [{ from: "run", to: "global", active: true }],
    phaseDetail: {
      label: "Creation Phase",
      items: [
        "Scan for var declarations -> result = undefined",
        "Bind this -> window (default binding)",
        "Set outer environment -> Global EC",
      ],
    },
    returnValue: null,
    consoleOutput: [],
  },
  // Step 3: run() execution phase begins
  {
    descriptionHtml:
      'The <span class="hl-stack">run() EC</span> enters the <strong>execution phase</strong>. Line 10 calls <code>greet("World")</code>. The assignment to <code>result</code> is suspended until <code>greet</code> returns.',
    activeLine: 10,
    doneLines: [1, 14],
    highlightLines: [],
    stack: [
      {
        id: "run",
        label: "run() EC",
        type: "function",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "result", value: "undefined", kind: "var", initialized: false },
        ],
        outerEnvLabel: "Global EC",
      },
      {
        id: "global",
        label: "Global EC",
        type: "global",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "language", value: '"JS"', kind: "var", initialized: true },
          { name: "greet", value: "fn()", kind: "function", initialized: true },
          { name: "run", value: "fn()", kind: "function", initialized: true },
        ],
        outerEnvLabel: null,
      },
    ],
    scopeLinks: [{ from: "run", to: "global" }],
    phaseDetail: {
      label: "Execution Phase",
      items: [
        'Line 10: greet("World") -> push new EC',
        "Waiting for greet() to return...",
      ],
    },
    returnValue: null,
    consoleOutput: [],
  },
  // Step 4: greet() called - creation phase (3 deep!)
  {
    descriptionHtml:
      '<code>greet("World")</code> is called. A third EC is <strong>pushed</strong> - the stack is now 3 deep. During <strong>creation</strong>: param <code>name</code> is bound to <code>"World"</code>, <code>message</code> is hoisted as <code>undefined</code>.',
    activeLine: 3,
    doneLines: [1, 10, 14],
    highlightLines: [4],
    stack: [
      {
        id: "greet",
        label: "greet() EC",
        type: "function",
        phase: "creation",
        thisValue: "window",
        variableEnv: [
          { name: "name", value: '"World"', kind: "param", initialized: true },
          { name: "message", value: "undefined", kind: "var", initialized: false },
        ],
        outerEnvLabel: "Global EC",
      },
      {
        id: "run",
        label: "run() EC",
        type: "function",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "result", value: "undefined", kind: "var", initialized: false },
        ],
        outerEnvLabel: "Global EC",
      },
      {
        id: "global",
        label: "Global EC",
        type: "global",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "language", value: '"JS"', kind: "var", initialized: true },
          { name: "greet", value: "fn()", kind: "function", initialized: true },
          { name: "run", value: "fn()", kind: "function", initialized: true },
        ],
        outerEnvLabel: null,
      },
    ],
    scopeLinks: [
      { from: "greet", to: "global", active: true },
      { from: "run", to: "global" },
    ],
    phaseDetail: {
      label: "Creation Phase",
      items: [
        'Bind parameter: name = "World"',
        "Hoist var: message = undefined",
        "Bind this -> window (default binding)",
        "Set outer environment -> Global EC",
      ],
    },
    returnValue: null,
    consoleOutput: [],
  },
  // Step 5: greet() execution - message assignment
  {
    descriptionHtml:
      '<span class="hl-stack">greet() EC</span> enters <strong>execution</strong>. Line 4: <code>message</code> needs <code>language</code> - not in local scope, so the engine follows the <strong>outer environment</strong> link to <span class="hl-stack">Global EC</span> and finds <code>"JS"</code>.',
    activeLine: 4,
    doneLines: [1, 3, 10, 14],
    highlightLines: [],
    stack: [
      {
        id: "greet",
        label: "greet() EC",
        type: "function",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "name", value: '"World"', kind: "param", initialized: true },
          { name: "message", value: '"JS, World"', kind: "var", initialized: true },
        ],
        outerEnvLabel: "Global EC",
      },
      {
        id: "run",
        label: "run() EC",
        type: "function",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "result", value: "undefined", kind: "var", initialized: false },
        ],
        outerEnvLabel: "Global EC",
      },
      {
        id: "global",
        label: "Global EC",
        type: "global",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "language", value: '"JS"', kind: "var", initialized: true },
          { name: "greet", value: "fn()", kind: "function", initialized: true },
          { name: "run", value: "fn()", kind: "function", initialized: true },
        ],
        outerEnvLabel: null,
      },
    ],
    scopeLinks: [
      { from: "greet", to: "global", active: true },
      { from: "run", to: "global" },
    ],
    phaseDetail: {
      label: "Scope Lookup",
      items: [
        "Need: language",
        "greet() local env -> not found",
        "Follow [[Outer]] -> Global EC",
        'Found: language = "JS"',
      ],
    },
    returnValue: null,
    consoleOutput: [],
  },
  // Step 6: greet() execution - console.log
  {
    descriptionHtml:
      'Line 5: <code>console.log(message)</code> outputs <code>"JS, World"</code>. The value comes from the local <code>message</code> binding in <span class="hl-stack">greet() EC</span>.',
    activeLine: 5,
    doneLines: [1, 3, 4, 10, 14],
    highlightLines: [],
    stack: [
      {
        id: "greet",
        label: "greet() EC",
        type: "function",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "name", value: '"World"', kind: "param", initialized: true },
          { name: "message", value: '"JS, World"', kind: "var", initialized: true },
        ],
        outerEnvLabel: "Global EC",
      },
      {
        id: "run",
        label: "run() EC",
        type: "function",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "result", value: "undefined", kind: "var", initialized: false },
        ],
        outerEnvLabel: "Global EC",
      },
      {
        id: "global",
        label: "Global EC",
        type: "global",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "language", value: '"JS"', kind: "var", initialized: true },
          { name: "greet", value: "fn()", kind: "function", initialized: true },
          { name: "run", value: "fn()", kind: "function", initialized: true },
        ],
        outerEnvLabel: null,
      },
    ],
    scopeLinks: [
      { from: "greet", to: "global" },
      { from: "run", to: "global" },
    ],
    phaseDetail: null,
    returnValue: null,
    consoleOutput: ['"JS, World"'],
  },
  // Step 7: greet() returns - popped
  {
    descriptionHtml:
      'Line 6: <code>return message</code>. The <span class="hl-stack">greet() EC</span> is <strong>popped</strong> from the stack and destroyed. The return value <code>"JS, World"</code> flows back to <code>run()</code>.',
    activeLine: 6,
    doneLines: [1, 3, 4, 5, 10, 14],
    highlightLines: [],
    stack: [
      {
        id: "run",
        label: "run() EC",
        type: "function",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "result", value: '"JS, World"', kind: "var", initialized: true },
        ],
        outerEnvLabel: "Global EC",
      },
      {
        id: "global",
        label: "Global EC",
        type: "global",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "language", value: '"JS"', kind: "var", initialized: true },
          { name: "greet", value: "fn()", kind: "function", initialized: true },
          { name: "run", value: "fn()", kind: "function", initialized: true },
        ],
        outerEnvLabel: null,
      },
    ],
    scopeLinks: [{ from: "run", to: "global" }],
    phaseDetail: null,
    returnValue: '"JS, World"',
    consoleOutput: ['"JS, World"'],
  },
  // Step 8: run() - console.log(result)
  {
    descriptionHtml:
      'Back in <span class="hl-stack">run() EC</span>. <code>result</code> now holds <code>"JS, World"</code>. Line 11: <code>console.log(result)</code> outputs the value.',
    activeLine: 11,
    doneLines: [1, 3, 4, 5, 6, 10, 14],
    highlightLines: [],
    stack: [
      {
        id: "run",
        label: "run() EC",
        type: "function",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "result", value: '"JS, World"', kind: "var", initialized: true },
        ],
        outerEnvLabel: "Global EC",
      },
      {
        id: "global",
        label: "Global EC",
        type: "global",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "language", value: '"JS"', kind: "var", initialized: true },
          { name: "greet", value: "fn()", kind: "function", initialized: true },
          { name: "run", value: "fn()", kind: "function", initialized: true },
        ],
        outerEnvLabel: null,
      },
    ],
    scopeLinks: [{ from: "run", to: "global" }],
    phaseDetail: null,
    returnValue: null,
    consoleOutput: ['"JS, World"', '"JS, World"'],
  },
  // Step 9: run() returns - popped
  {
    descriptionHtml:
      '<code>run()</code> finishes and is <strong>popped</strong>. Only the <span class="hl-stack">Global EC</span> remains - it persists until the program ends or the browser tab closes.',
    activeLine: null,
    doneLines: [1, 3, 4, 5, 6, 10, 11, 14],
    highlightLines: [],
    stack: [
      {
        id: "global",
        label: "Global EC",
        type: "global",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "language", value: '"JS"', kind: "var", initialized: true },
          { name: "greet", value: "fn()", kind: "function", initialized: true },
          { name: "run", value: "fn()", kind: "function", initialized: true },
        ],
        outerEnvLabel: null,
      },
    ],
    scopeLinks: [],
    phaseDetail: null,
    returnValue: null,
    consoleOutput: ['"JS, World"', '"JS, World"'],
  },
  // Step 10: Summary
  {
    descriptionHtml:
      '<strong>Key takeaway:</strong> Every function call creates a new EC with a <strong>creation phase</strong> (hoisting + this binding + outer env link) then an <strong>execution phase</strong> (line-by-line). Contexts stack (LIFO) and pop on return. The Global EC is always at the bottom.',
    activeLine: null,
    doneLines: [1, 3, 4, 5, 6, 10, 11, 14],
    highlightLines: [],
    stack: [
      {
        id: "global",
        label: "Global EC",
        type: "global",
        phase: "execution",
        thisValue: "window",
        variableEnv: [
          { name: "language", value: '"JS"', kind: "var", initialized: true },
          { name: "greet", value: "fn()", kind: "function", initialized: true },
          { name: "run", value: "fn()", kind: "function", initialized: true },
        ],
        outerEnvLabel: null,
      },
    ],
    scopeLinks: [],
    phaseDetail: null,
    returnValue: null,
    consoleOutput: ['"JS, World"', '"JS, World"'],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function phaseColors(phase: "creation" | "execution") {
  return phase === "creation"
    ? {
        border: "border-violet-300/40",
        bg: "bg-violet-400/10",
        shadow: "shadow-[0_0_18px_rgba(196,181,253,0.1)]",
        text: "text-violet-300",
        badgeBg: "bg-violet-500/20",
        badgeBorder: "border-violet-500/25",
      }
    : {
        border: "border-emerald-300/40",
        bg: "bg-emerald-400/10",
        shadow: "shadow-[0_0_18px_rgba(52,211,153,0.1)]",
        text: "text-emerald-300",
        badgeBg: "bg-emerald-500/20",
        badgeBorder: "border-emerald-500/25",
      };
}

function kindBadge(kind: Binding["kind"]): { label: string; className: string } {
  switch (kind) {
    case "var":
      return { label: "var", className: "text-amber-300 bg-amber-500/15" };
    case "function":
      return { label: "fn", className: "text-blue-300 bg-blue-500/15" };
    case "param":
      return { label: "arg", className: "text-cyan-300 bg-cyan-500/15" };
  }
}

function ecFingerprint(ec: ExecutionContextEntry): string {
  const bindings = ec.variableEnv
    .map((b) => `${b.name}:${b.value}:${b.initialized}`)
    .join(",");
  return `${ec.id}|${ec.phase}|${bindings}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Phase indicator: two segments, active one glows */
function PhaseIndicator({ phase }: { phase: "creation" | "execution" | null }) {
  const isCreation = phase === "creation";
  const isExecution = phase === "execution";

  return (
    <div className="flex items-center gap-2">
      {/* Creation segment */}
      <div
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 transition-all duration-500",
          isCreation
            ? "border-violet-400/40 bg-violet-500/15 shadow-[0_0_12px_rgba(196,181,253,0.15)]"
            : "border-slate-600/30 bg-slate-800/20"
        )}
      >
        <div
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-500",
            isCreation ? "bg-violet-400 shadow-[0_0_6px_rgba(196,181,253,0.6)]" : "bg-slate-600"
          )}
        />
        <span
          className={cn(
            "font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300",
            isCreation ? "text-violet-300" : "text-slate-500"
          )}
        >
          Creation
        </span>
      </div>

      {/* Arrow between phases */}
      <svg viewBox="0 0 12 8" className="h-2 w-3 flex-shrink-0 text-slate-500/60" aria-hidden="true">
        <path d="M0 4H8M8 4L5 1M8 4L5 7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Execution segment */}
      <div
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 transition-all duration-500",
          isExecution
            ? "border-emerald-400/40 bg-emerald-500/15 shadow-[0_0_12px_rgba(52,211,153,0.15)]"
            : "border-slate-600/30 bg-slate-800/20"
        )}
      >
        <div
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-500",
            isExecution ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-slate-600"
          )}
        />
        <span
          className={cn(
            "font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300",
            isExecution ? "text-emerald-300" : "text-slate-500"
          )}
        >
          Execution
        </span>
      </div>
    </div>
  );
}

/** Detail panel: shows what's happening inside the active EC */
function PhaseDetailPanel({ detail }: { detail: PhaseDetail }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {detail.label}
        </span>
      </div>
      <div className="space-y-1">
        {detail.items.map((item, i) => (
          <div
            key={`${detail.label}-${i}`}
            className="viz-slide-in flex items-start gap-2 rounded px-2 py-1 font-mono text-[11px] text-slate-300"
          >
            <span className="mt-0.5 flex-shrink-0 text-pink-400/70">
              {i === detail.items.length - 1 ? ">" : " "}
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Return value indicator */
function ReturnIndicator({ value }: { value: string }) {
  return (
    <div className="viz-slide-in flex items-center justify-center gap-2 rounded-lg border border-pink-300/30 bg-pink-400/5 px-3 py-2">
      <svg viewBox="0 0 16 12" className="h-3 w-4 flex-shrink-0 text-pink-400" aria-hidden="true">
        <path
          d="M10 1v4H2m0 0l3-3M2 5l3 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-wider text-pink-300/70">
        return
      </span>
      <span className="font-mono text-xs font-semibold text-pink-200">
        {value}
      </span>
    </div>
  );
}

/** Outer environment link arrow between stack items */
function ScopeArrow({ active }: { active?: boolean }) {
  return (
    <div className="flex items-center justify-center py-0.5">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "h-3 w-px transition-colors duration-300",
            active ? "bg-pink-400/70" : "bg-slate-600/40"
          )}
        />
        <span
          className={cn(
            "font-mono text-[8px] transition-colors duration-300",
            active ? "text-pink-300" : "text-slate-600"
          )}
        >
          [[Outer]]
        </span>
        <svg
          viewBox="0 0 10 6"
          className={cn(
            "h-1.5 w-2.5 transition-colors duration-300",
            active ? "text-pink-400/70" : "text-slate-600/40"
          )}
          aria-hidden="true"
        >
          <path
            d="M0 0L5 6L10 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}

/** Single execution context card in the stack */
function ECCard({
  ec,
  isTop,
  scopeLink,
  showArrow,
}: {
  ec: ExecutionContextEntry;
  isTop: boolean;
  scopeLink?: ScopeLink;
  showArrow: boolean;
}) {
  const c = isTop ? phaseColors(ec.phase) : null;

  return (
    <div>
      <div
        className={cn(
          "viz-slide-in rounded-lg border px-3 py-2.5 transition-all duration-300",
          isTop
            ? cn(c!.border, c!.bg, c!.shadow)
            : "border-slate-500/30 bg-slate-800/30"
        )}
      >
        {/* Header */}
        <div className="mb-2 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[9px] font-bold",
              ec.type === "global"
                ? "bg-pink-500/20 text-pink-300"
                : "bg-amber-500/20 text-amber-300"
            )}
          >
            {ec.type === "global" ? "Global" : "Function"}
          </span>
          <span
            className={cn(
              "font-mono text-xs font-semibold",
              isTop ? "text-slate-100" : "text-slate-400"
            )}
          >
            {ec.label}
          </span>
          {isTop && (
            <span
              className={cn(
                "rounded-full border px-1.5 py-0.5 font-mono text-[9px] font-medium",
                c!.badgeBg,
                c!.badgeBorder,
                c!.text
              )}
            >
              {ec.phase}
            </span>
          )}
        </div>

        {/* this binding */}
        <div className="mb-1.5 flex items-center gap-1.5 rounded bg-slate-800/50 px-2 py-1">
          <span className="font-mono text-[10px] font-bold text-pink-300">this</span>
          <span className="font-mono text-[10px] text-slate-500">=</span>
          <span className="font-mono text-[10px] text-slate-300">{ec.thisValue}</span>
        </div>

        {/* Variable Environment */}
        <div className="space-y-0.5">
          {ec.variableEnv.map((binding) => {
            const badge = kindBadge(binding.kind);
            return (
              <div
                key={binding.name}
                className="flex items-center justify-between rounded px-2 py-0.5 font-mono text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex rounded px-1 py-px text-[8px] font-bold",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                  <span className={isTop ? "text-slate-200" : "text-slate-400"}>
                    {binding.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "transition-colors duration-300",
                      binding.initialized ? "text-slate-200" : "text-slate-500"
                    )}
                  >
                    {binding.value}
                  </span>
                  {!binding.initialized && (
                    <span className="rounded bg-violet-500/15 px-1 py-px text-[8px] font-medium text-violet-300">
                      hoisted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Outer env reference label */}
        {ec.outerEnvLabel && (
          <div className="mt-1.5 flex items-center gap-1.5 border-t border-slate-600/30 pt-1.5">
            <span className="font-mono text-[9px] text-slate-500">
              outer:
            </span>
            <span className="font-mono text-[9px] text-pink-300/70">
              {ec.outerEnvLabel}
            </span>
          </div>
        )}
      </div>

      {/* Scope chain arrow */}
      {showArrow && <ScopeArrow active={scopeLink?.active} />}
    </div>
  );
}

/** The full execution context stack */
function CallStack({
  stack,
  scopeLinks,
}: {
  stack: ExecutionContextEntry[];
  scopeLinks: ScopeLink[];
}) {
  if (stack.length === 0) {
    return (
      <p className="py-6 text-center font-mono text-xs uppercase tracking-[0.22em] text-slate-500/60">
        empty stack
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {stack.map((ec, index) => {
        const isTop = index === 0;
        const link = scopeLinks.find((l) => l.from === ec.id);
        const showArrow = index < stack.length - 1;

        return (
          <ECCard
            key={`${ec.id}-${ecFingerprint(ec)}`}
            ec={ec}
            isTop={isTop}
            scopeLink={link}
            showArrow={showArrow}
          />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ExecutionContext() {
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

  const currentStep =
    currentStepIndex >= 0 ? STEPS[currentStepIndex] : null;

  const topEC = currentStep?.stack[0] ?? null;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      stack: currentStep?.stack,
      phase: topEC?.phase,
      detail: currentStep?.phaseDetail,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex
  );

  return (
    <>
      {/* Toolbar */}
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
              flashes.description && "viz-change-flash-pill"
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
        {/* Phase indicator - always visible */}
        <NeonPanel
          title="Current Phase"
          tone="violet"
          className={flashes.phase ? "viz-change-flash" : undefined}
        >
          <PhaseIndicator phase={topEC?.phase ?? null} />
        </NeonPanel>

        <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]">
          {/* Left: Source Code */}
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
                const isHighlighted =
                  currentStep?.highlightLines.includes(line.num) ?? false;
                return {
                  key: line.num,
                  lineNumber: line.num,
                  text: line.text,
                  className: cn(
                    isActive && "is-active",
                    isDone && !isActive && "is-done",
                    isHighlighted && !isActive && !isDone && "is-highlighted"
                  ),
                };
              })}
            />
          </NeonPanel>

          {/* Right: Stack + Details + Console */}
          <div className="space-y-4">
            {/* Execution Context Stack */}
            <NeonPanel
              title="Execution Context Stack"
              tone="cyan"
              bodyClassName="min-h-[10rem]"
              className={flashes.stack ? "viz-change-flash" : undefined}
            >
              <CallStack
                stack={currentStep?.stack ?? []}
                scopeLinks={currentStep?.scopeLinks ?? []}
              />
            </NeonPanel>

            {/* Activity panel - always visible */}
            <NeonPanel
              title="Activity"
              tone="green"
              bodyClassName="min-h-[4rem]"
              className={flashes.detail ? "viz-change-flash" : undefined}
            >
              {currentStep?.phaseDetail ? (
                <PhaseDetailPanel detail={currentStep.phaseDetail} />
              ) : currentStep?.returnValue ? (
                <ReturnIndicator value={currentStep.returnValue} />
              ) : (
                <p className="py-3 text-center font-mono text-xs uppercase tracking-[0.22em] text-slate-500/60">
                  waiting for execution
                </p>
              )}
            </NeonPanel>

            {/* Console */}
            <div
              className={
                flashes.console ? "viz-change-flash rounded-3xl" : undefined
              }
            >
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
