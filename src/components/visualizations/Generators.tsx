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

type GeneratorKind = "basic" | "data-flow" | "iterator";

type GeneratorStatus = "created" | "suspended" | "executing" | "completed";

interface SourceLine {
  num: number;
  text: string;
}

interface GeneratorState {
  status: GeneratorStatus;
  nextArg?: string;
  yieldValue?: string;
  done: boolean;
}

interface CallFlowEntry {
  id: number;
  caller: string;
  response: string;
  direction: "call" | "yield" | "return";
}

interface GeneratorStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  generatorState: GeneratorState | null;
  callFlow: CallFlowEntry[];
}

interface GeneratorExample extends ExampleOption {
  kind: GeneratorKind;
  codeLines: SourceLine[];
  steps: GeneratorStep[];
}

/* ── Badge helpers ── */

function kindBadgeClass(kind: GeneratorKind): string {
  switch (kind) {
    case "basic":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "data-flow":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/25";
    case "iterator":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
  }
}

function kindLabel(kind: GeneratorKind): string {
  switch (kind) {
    case "basic":
      return "basic";
    case "data-flow":
      return "data flow";
    case "iterator":
      return "iterator";
  }
}

/* ── Sub-components ── */

const STATUS_STYLES: Record<GeneratorStatus, string> = {
  created: "border-slate-400/35 bg-slate-400/10 text-slate-300",
  suspended: "border-amber-300/35 bg-amber-400/10 text-amber-200",
  executing: "border-cyan-300/35 bg-cyan-400/10 text-cyan-200",
  completed: "border-emerald-300/35 bg-emerald-400/10 text-emerald-200",
};

function GeneratorStatePanel({ state }: { state: GeneratorState | null }) {
  if (!state) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        not created
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Status badge */}
      <div
        key={`status-${state.status}`}
        className="viz-slide-in flex items-center justify-between"
      >
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet-300/80">
          Status
        </span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
            STATUS_STYLES[state.status],
          )}
        >
          {state.status}
        </span>
      </div>

      {/* Next argument (incoming value) */}
      {state.nextArg && (
        <div
          key={`arg-${state.nextArg}`}
          className="viz-slide-in rounded-lg border border-cyan-300/25 bg-cyan-400/8 px-3 py-2"
        >
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-cyan-400">{"\u2192"}</span>
            <span className="text-cyan-200/70">.next() received:</span>
            <span className="font-semibold text-cyan-100">{state.nextArg}</span>
          </div>
        </div>
      )}

      {/* Yield value (outgoing value) */}
      {state.yieldValue !== undefined && (
        <div
          key={`yield-${state.yieldValue}-${state.done}`}
          className="viz-slide-in rounded-lg border border-violet-300/25 bg-violet-400/8 px-3 py-2"
        >
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-violet-400">{"\u2190"}</span>
            <span className="text-violet-200/70">
              {state.done ? "returned:" : "yielded:"}
            </span>
            <span className="font-semibold text-violet-100">
              {state.yieldValue}
            </span>
          </div>
        </div>
      )}

      {/* done flag */}
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-violet-200/70">done</span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            state.done
              ? "bg-rose-500/20 text-rose-300"
              : "bg-emerald-500/20 text-emerald-300",
          )}
        >
          {String(state.done)}
        </span>
      </div>
    </div>
  );
}

const FLOW_DIRECTION_STYLES: Record<CallFlowEntry["direction"], string> = {
  call: "border-l-cyan-400/60",
  yield: "border-l-emerald-400/60",
  return: "border-l-rose-400/60",
};

function CallFlowPanel({ entries }: { entries: CallFlowEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no calls yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => {
        const isLatest = index === entries.length - 1;
        return (
          <div
            key={entry.id}
            className={cn(
              "rounded-lg border border-slate-600/30 border-l-[3px] bg-slate-800/40 px-3 py-2 font-mono text-xs",
              FLOW_DIRECTION_STYLES[entry.direction],
              isLatest && "viz-slide-in",
            )}
          >
            <div className="flex items-center gap-1.5 text-cyan-200">
              <span className="text-cyan-400">{"\u25B6"}</span>
              {entry.caller}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-violet-200">
              <span className="text-violet-400">{"\u25C0"}</span>
              {entry.response}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Example data ── */

const EXAMPLES: GeneratorExample[] = [
  /* ─── Example 1: Basic yield ─── */
  {
    id: "basic-yield",
    title: "Basic yield",
    kind: "basic",
    description:
      "A generator function creates a pausable iterator. Each .next() call resumes execution until the next yield.",
    codeLines: [
      { num: 1, text: "function* counter() {" },
      { num: 2, text: "  yield 1;" },
      { num: 3, text: "  yield 2;" },
      { num: 4, text: "  yield 3;" },
      { num: 5, text: "}" },
      { num: 6, text: "" },
      { num: 7, text: "const gen = counter();" },
      { num: 8, text: "console.log(gen.next());" },
      { num: 9, text: "console.log(gen.next());" },
      { num: 10, text: "console.log(gen.next());" },
      { num: 11, text: "console.log(gen.next());" },
    ],
    steps: [
      {
        descriptionHtml:
          'The engine registers the <code>counter</code> generator function (<code>function*</code>). The body is <strong>not</strong> executed yet.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        generatorState: null,
        callFlow: [],
      },
      {
        descriptionHtml:
          '<code>counter()</code> is called. Unlike a normal function, the body does <strong>not</strong> execute. Instead, a <span class="hl-task">generator object</span> is returned in <strong>suspended</strong> state.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: [],
        generatorState: { status: "created", done: false },
        callFlow: [],
      },
      {
        descriptionHtml:
          '<span class="hl-api">gen.next()</span> resumes the generator. Execution enters the function body and runs until <code>yield 1</code>. The generator <span class="hl-task">pauses</span> and returns <span class="hl-micro">{ value: 1, done: false }</span>.',
        activeLine: 2,
        doneLines: [1, 5, 7],
        consoleOutput: ["{ value: 1, done: false }"],
        generatorState: {
          status: "suspended",
          yieldValue: "1",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          'Second <span class="hl-api">gen.next()</span> resumes from where the generator paused. Execution continues past <code>yield 1</code> and pauses at <code>yield 2</code>.',
        activeLine: 3,
        doneLines: [1, 2, 5, 7, 8],
        consoleOutput: [
          "{ value: 1, done: false }",
          "{ value: 2, done: false }",
        ],
        generatorState: {
          status: "suspended",
          yieldValue: "2",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: "gen.next()",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          'Third <span class="hl-api">gen.next()</span> resumes from <code>yield 2</code> and pauses at <code>yield 3</code>. Each yield is like a checkpoint the generator returns to.',
        activeLine: 4,
        doneLines: [1, 2, 3, 5, 7, 8, 9],
        consoleOutput: [
          "{ value: 1, done: false }",
          "{ value: 2, done: false }",
          "{ value: 3, done: false }",
        ],
        generatorState: {
          status: "suspended",
          yieldValue: "3",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: "gen.next()",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: "gen.next()",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          'Fourth <span class="hl-api">gen.next()</span> resumes from <code>yield 3</code>. No more <code>yield</code> statements remain, so the generator <strong>completes</strong>. The result is <span class="hl-micro">{ value: undefined, done: true }</span>.',
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 7, 8, 9, 10],
        consoleOutput: [
          "{ value: 1, done: false }",
          "{ value: 2, done: false }",
          "{ value: 3, done: false }",
          "{ value: undefined, done: true }",
        ],
        generatorState: {
          status: "completed",
          yieldValue: "undefined",
          done: true,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: "gen.next()",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: "gen.next()",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
          {
            id: 4,
            caller: "gen.next()",
            response: "{ value: undefined, done: true }",
            direction: "return",
          },
        ],
      },
      {
        descriptionHtml:
          '<strong>Done.</strong> Each <span class="hl-api">.next()</span> resumed the generator until the next <span class="hl-task">yield</span>. After the last yield, <code>done: true</code> signals the generator is exhausted. Calling <code>.next()</code> again always returns <span class="hl-micro">{ value: undefined, done: true }</span>.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        consoleOutput: [
          "{ value: 1, done: false }",
          "{ value: 2, done: false }",
          "{ value: 3, done: false }",
          "{ value: undefined, done: true }",
        ],
        generatorState: {
          status: "completed",
          yieldValue: "undefined",
          done: true,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: "gen.next()",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: "gen.next()",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
          {
            id: 4,
            caller: "gen.next()",
            response: "{ value: undefined, done: true }",
            direction: "return",
          },
        ],
      },
    ],
  },

  /* ─── Example 2: Two-way Data Flow ─── */
  {
    id: "two-way-data",
    title: "Two-way Data Flow",
    kind: "data-flow",
    description:
      "Values flow OUT via yield and IN via .next(arg). The argument to .next() becomes the result of the yield expression.",
    codeLines: [
      { num: 1, text: "function* conversation() {" },
      { num: 2, text: '  const name = yield "What is your name?";' },
      { num: 3, text: "  const age = yield `Hello, ${name}!`;" },
      { num: 4, text: "  return `${name} is ${age}`;" },
      { num: 5, text: "}" },
      { num: 6, text: "" },
      { num: 7, text: "const gen = conversation();" },
      { num: 8, text: "console.log(gen.next());" },
      { num: 9, text: 'console.log(gen.next("Alice"));' },
      { num: 10, text: "console.log(gen.next(25));" },
    ],
    steps: [
      {
        descriptionHtml:
          'The <code>conversation</code> generator function is declared. It uses <code>yield</code> both to send values <strong>out</strong> and receive values <strong>in</strong>.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        generatorState: null,
        callFlow: [],
      },
      {
        descriptionHtml:
          '<code>conversation()</code> creates a <span class="hl-task">generator object</span>. The function body has not started yet. The generator is in <strong>suspended</strong> state, waiting for the first <span class="hl-api">.next()</span>.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: [],
        generatorState: { status: "created", done: false },
        callFlow: [],
      },
      {
        descriptionHtml:
          'First <span class="hl-api">gen.next()</span> starts the body. Execution runs until <code>yield "What is your name?"</code>. The string flows <strong>out</strong> as the value. Any argument to the first <code>.next()</code> is ignored because there is no <code>yield</code> waiting to receive it.',
        activeLine: 2,
        doneLines: [1, 5, 7],
        consoleOutput: ['{ value: "What is your name?", done: false }'],
        generatorState: {
          status: "suspended",
          yieldValue: '"What is your name?"',
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: '{ value: "What is your name?", done: false }',
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          '<span class="hl-api">gen.next("Alice")</span> resumes. The argument <code>"Alice"</code> flows <strong>into</strong> the generator and becomes the result of the paused <code>yield</code> expression. So <code>name</code> is set to <code>"Alice"</code>. Execution continues to the next <code>yield</code>, sending <code>"Hello, Alice!"</code> <strong>out</strong>.',
        activeLine: 3,
        doneLines: [1, 2, 5, 7, 8],
        consoleOutput: [
          '{ value: "What is your name?", done: false }',
          '{ value: "Hello, Alice!", done: false }',
        ],
        generatorState: {
          status: "suspended",
          nextArg: '"Alice"',
          yieldValue: '"Hello, Alice!"',
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: '{ value: "What is your name?", done: false }',
            direction: "yield",
          },
          {
            id: 2,
            caller: 'gen.next("Alice")',
            response: '{ value: "Hello, Alice!", done: false }',
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          '<span class="hl-api">gen.next(25)</span> resumes. <code>25</code> flows <strong>in</strong> and is assigned to <code>age</code>. The <code>return</code> statement completes the generator with <span class="hl-micro">{ value: "Alice is 25", done: true }</span>. The <code>done: true</code> flag signals the generator is finished.',
        activeLine: 4,
        doneLines: [1, 2, 3, 5, 7, 8, 9],
        consoleOutput: [
          '{ value: "What is your name?", done: false }',
          '{ value: "Hello, Alice!", done: false }',
          '{ value: "Alice is 25", done: true }',
        ],
        generatorState: {
          status: "completed",
          nextArg: "25",
          yieldValue: '"Alice is 25"',
          done: true,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: '{ value: "What is your name?", done: false }',
            direction: "yield",
          },
          {
            id: 2,
            caller: 'gen.next("Alice")',
            response: '{ value: "Hello, Alice!", done: false }',
            direction: "yield",
          },
          {
            id: 3,
            caller: "gen.next(25)",
            response: '{ value: "Alice is 25", done: true }',
            direction: "return",
          },
        ],
      },
      {
        descriptionHtml:
          '<strong>Done.</strong> Generators enable <strong>two-way communication</strong>: <span class="hl-task">yield</span> sends values out, while arguments to <span class="hl-api">.next(arg)</span> send values in. The first <code>.next()</code> starts the generator; subsequent calls resume it with a value. <code>return</code> completes the generator with <code>done: true</code>.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        consoleOutput: [
          '{ value: "What is your name?", done: false }',
          '{ value: "Hello, Alice!", done: false }',
          '{ value: "Alice is 25", done: true }',
        ],
        generatorState: {
          status: "completed",
          yieldValue: '"Alice is 25"',
          done: true,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: '{ value: "What is your name?", done: false }',
            direction: "yield",
          },
          {
            id: 2,
            caller: 'gen.next("Alice")',
            response: '{ value: "Hello, Alice!", done: false }',
            direction: "yield",
          },
          {
            id: 3,
            caller: "gen.next(25)",
            response: '{ value: "Alice is 25", done: true }',
            direction: "return",
          },
        ],
      },
    ],
  },

  /* ─── Example 3: Iterator Protocol ─── */
  {
    id: "iterator-protocol",
    title: "Iterator Protocol",
    kind: "iterator",
    description:
      "Generators automatically implement the iterator protocol, making them consumable by for...of loops.",
    codeLines: [
      { num: 1, text: "function* range(start, end) {" },
      { num: 2, text: "  for (let i = start; i <= end; i++) {" },
      { num: 3, text: "    yield i;" },
      { num: 4, text: "  }" },
      { num: 5, text: "}" },
      { num: 6, text: "" },
      { num: 7, text: "for (const num of range(1, 3)) {" },
      { num: 8, text: "  console.log(num);" },
      { num: 9, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          'The <code>range</code> generator function is declared. Generators automatically implement the <span class="hl-loop">iterator protocol</span> (both <code>Symbol.iterator</code> and <code>.next()</code>), making them usable with <code>for...of</code>.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        generatorState: null,
        callFlow: [],
      },
      {
        descriptionHtml:
          'The <span class="hl-loop">for...of</span> loop calls <code>range(1, 3)</code>, creating a generator object. Behind the scenes, the loop calls <code>[Symbol.iterator]()</code> on the generator and begins calling <span class="hl-api">.next()</span> on each iteration.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: [],
        generatorState: { status: "created", done: false },
        callFlow: [],
      },
      {
        descriptionHtml:
          'First iteration: the loop calls <span class="hl-api">.next()</span> internally. The generator enters the <code>for</code> loop with <code>i = 1</code> and hits <code>yield 1</code>. The value <code>1</code> is assigned to <code>num</code>.',
        activeLine: 3,
        doneLines: [1, 5, 7],
        consoleOutput: [],
        generatorState: {
          status: "suspended",
          yieldValue: "1",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(num)</code> outputs <code>1</code>. The <span class="hl-loop">for...of</span> loop body executes with the yielded value.',
        activeLine: 8,
        doneLines: [1, 2, 3, 5, 7],
        consoleOutput: ["1"],
        generatorState: {
          status: "suspended",
          yieldValue: "1",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          'Second iteration: <span class="hl-api">.next()</span> resumes the generator. The internal <code>for</code> loop increments <code>i</code> to <code>2</code> and hits <code>yield 2</code>.',
        activeLine: 3,
        doneLines: [1, 2, 5, 7, 8],
        consoleOutput: ["1"],
        generatorState: {
          status: "suspended",
          yieldValue: "2",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: ".next()  [for...of]",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          "<code>console.log(num)</code> outputs <code>2</code>.",
        activeLine: 8,
        doneLines: [1, 2, 3, 5, 7],
        consoleOutput: ["1", "2"],
        generatorState: {
          status: "suspended",
          yieldValue: "2",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: ".next()  [for...of]",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          'Third iteration: the generator resumes, <code>i</code> increments to <code>3</code>, and <code>yield 3</code> pauses execution.',
        activeLine: 3,
        doneLines: [1, 2, 5, 7, 8],
        consoleOutput: ["1", "2"],
        generatorState: {
          status: "suspended",
          yieldValue: "3",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: ".next()  [for...of]",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: ".next()  [for...of]",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          "<code>console.log(num)</code> outputs <code>3</code>.",
        activeLine: 8,
        doneLines: [1, 2, 3, 5, 7],
        consoleOutput: ["1", "2", "3"],
        generatorState: {
          status: "suspended",
          yieldValue: "3",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: ".next()  [for...of]",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: ".next()  [for...of]",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          'The loop calls <span class="hl-api">.next()</span> again. The generator resumes, <code>i</code> becomes <code>4</code>, the condition <code>4 &lt;= 3</code> is false, so the function exits. The result is <span class="hl-micro">{ value: undefined, done: true }</span>. The <span class="hl-loop">for...of</span> loop sees <code>done: true</code> and <strong>stops iterating</strong>.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 8],
        consoleOutput: ["1", "2", "3"],
        generatorState: {
          status: "completed",
          yieldValue: "undefined",
          done: true,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: ".next()  [for...of]",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: ".next()  [for...of]",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
          {
            id: 4,
            caller: ".next()  [for...of]",
            response: "{ value: undefined, done: true }",
            direction: "return",
          },
        ],
      },
      {
        descriptionHtml:
          '<strong>Done.</strong> Output: 1, 2, 3. The <span class="hl-loop">for...of</span> loop automatically calls <span class="hl-api">.next()</span> and extracts the <code>value</code> on each iteration. When <code>done: true</code> is returned, the loop exits. This is the <strong>iterator protocol</strong> in action \u2014 generators implement it for free.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        consoleOutput: ["1", "2", "3"],
        generatorState: {
          status: "completed",
          yieldValue: "undefined",
          done: true,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: ".next()  [for...of]",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: ".next()  [for...of]",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
          {
            id: 4,
            caller: ".next()  [for...of]",
            response: "{ value: undefined, done: true }",
            direction: "return",
          },
        ],
      },
    ],
  },
];

/* ── Main component ── */

export function Generators() {
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
      generatorState: currentStep?.generatorState,
      callFlow: currentStep?.callFlow,
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
                    className={cn(
                      "text-[10px]",
                      kindBadgeClass(ex.kind),
                    )}
                  >
                    {kindLabel(ex.kind)}
                  </Badge>
                )}
              />
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px]",
                  kindBadgeClass(example.kind),
                )}
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
                    isDone && !isActive && "is-done",
                  ),
                };
              })}
            />
          </NeonPanel>

          <div className="space-y-4">
            <NeonPanel
              title="Generator State"
              tone="violet"
              bodyClassName="min-h-[10rem]"
              className={
                flashes.generatorState ? "viz-change-flash" : undefined
              }
            >
              <GeneratorStatePanel
                state={currentStep?.generatorState ?? null}
              />
            </NeonPanel>

            <NeonPanel
              title="Call Flow"
              tone="cyan"
              bodyClassName="min-h-[8rem]"
              className={flashes.callFlow ? "viz-change-flash" : undefined}
            >
              <CallFlowPanel entries={currentStep?.callFlow ?? []} />
            </NeonPanel>

            <div
              className={
                flashes.console
                  ? "viz-change-flash rounded-3xl"
                  : undefined
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
