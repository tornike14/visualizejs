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
import { TopicLink } from "@/components/visualization-ui/TopicLink";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";

/* ── Types ── */

type HeapStackKind = "stack" | "heap" | "call-stack" | "gc";

interface SourceLine {
  num: number;
  text: string;
}

interface FrameVariable {
  name: string;
  value: string;
  heapRef: string | null;
}

interface StackFrame {
  id: string;
  label: string;
  variables: FrameVariable[];
}

interface HeapAllocation {
  id: string;
  label: string;
  props: { key: string; value: string }[];
  tone: "amber" | "emerald" | "cyan" | "violet";
  status: "alive" | "unreachable" | "collected";
}

interface HeapStackStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  stackFrames: StackFrame[];
  heapAllocations: HeapAllocation[];
  gcSweep?: boolean;
}

interface HeapStackExample extends ExampleOption {
  kind: HeapStackKind;
  codeLines: SourceLine[];
  steps: HeapStackStep[];
}

/* ── Example Data ── */

const EXAMPLES: HeapStackExample[] = [
  /* ── 1. Primitives on the Stack ── */
  {
    id: "primitives-on-stack",
    title: "Primitives on the Stack",
    description:
      "Function call creates a stack frame with local primitives. The frame is destroyed when the function returns.",
    kind: "stack",
    codeLines: [
      { num: 1, text: "function greet(name) {" },
      { num: 2, text: '  const prefix = "Hello";' },
      { num: 3, text: '  const msg = prefix + " " + name;' },
      { num: 4, text: "  console.log(msg);" },
      { num: 5, text: "}" },
      { num: 6, text: 'greet("Alice");' },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>greet("Alice")</code> is called. The engine pushes a new <span class="hl-stack">stack frame</span> for <code>greet</code> with the parameter <code>name</code> set to <code>"Alice"</code>.',
        activeLine: 6,
        doneLines: [],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [{ name: "greet", value: "f()", heapRef: null }],
          },
          {
            id: "greet",
            label: "greet()",
            variables: [{ name: "name", value: '"Alice"', heapRef: null }],
          },
        ],
        heapAllocations: [],
      },
      {
        descriptionHtml:
          '<code>const prefix = "Hello"</code> stores the string <code>"Hello"</code> directly in the <span class="hl-stack">stack frame</span>. Primitives live in the frame itself.',
        activeLine: 2,
        doneLines: [1, 6],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [{ name: "greet", value: "f()", heapRef: null }],
          },
          {
            id: "greet",
            label: "greet()",
            variables: [
              { name: "name", value: '"Alice"', heapRef: null },
              { name: "prefix", value: '"Hello"', heapRef: null },
            ],
          },
        ],
        heapAllocations: [],
      },
      {
        descriptionHtml:
          'The concatenation produces <code>"Hello Alice"</code> and stores it in <code>msg</code>. All three locals are now in the <span class="hl-stack">stack frame</span>.',
        activeLine: 3,
        doneLines: [1, 2, 6],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [{ name: "greet", value: "f()", heapRef: null }],
          },
          {
            id: "greet",
            label: "greet()",
            variables: [
              { name: "name", value: '"Alice"', heapRef: null },
              { name: "prefix", value: '"Hello"', heapRef: null },
              { name: "msg", value: '"Hello Alice"', heapRef: null },
            ],
          },
        ],
        heapAllocations: [],
      },
      {
        descriptionHtml:
          '<code>console.log(msg)</code> outputs <code>"Hello Alice"</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3, 6],
        consoleOutput: ["Hello Alice"],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [{ name: "greet", value: "f()", heapRef: null }],
          },
          {
            id: "greet",
            label: "greet()",
            variables: [
              { name: "name", value: '"Alice"', heapRef: null },
              { name: "prefix", value: '"Hello"', heapRef: null },
              { name: "msg", value: '"Hello Alice"', heapRef: null },
            ],
          },
        ],
        heapAllocations: [],
      },
      {
        descriptionHtml:
          '<code>greet</code> returns and its <span class="hl-stack">stack frame</span> is popped. All local variables (<code>name</code>, <code>prefix</code>, <code>msg</code>) are automatically discarded. <strong>Key takeaway:</strong> primitives stored in the stack frame are cleaned up automatically when the function returns.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ["Hello Alice"],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [{ name: "greet", value: "f()", heapRef: null }],
          },
        ],
        heapAllocations: [],
      },
    ],
  },

  /* ── 2. Objects on the Heap ── */
  {
    id: "objects-on-heap",
    title: "Objects on the Heap",
    description:
      "Object literals are allocated on the heap. Stack frames hold references. Objects survive function returns.",
    kind: "heap",
    codeLines: [
      { num: 1, text: "function createUser(name) {" },
      { num: 2, text: "  const user = { name: name, active: true };" },
      { num: 3, text: "  return user;" },
      { num: 4, text: "}" },
      { num: 5, text: 'const result = createUser("Alice");' },
      { num: 6, text: "console.log(result.name);" },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>createUser("Alice")</code> is called. A new <span class="hl-stack">stack frame</span> is pushed with the parameter <code>name: "Alice"</code>.',
        activeLine: 5,
        doneLines: [],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "createUser", value: "f()", heapRef: null },
              { name: "result", value: "undefined", heapRef: null },
            ],
          },
          {
            id: "createUser",
            label: "createUser()",
            variables: [{ name: "name", value: '"Alice"', heapRef: null }],
          },
        ],
        heapAllocations: [],
      },
      {
        descriptionHtml:
          'The object literal <code>{ name: "Alice", active: true }</code> is allocated on the <span class="hl-micro">heap</span>. The stack variable <code>user</code> stores a <strong>reference</strong> to the heap object, not the object itself.',
        activeLine: 2,
        doneLines: [1, 5],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "createUser", value: "f()", heapRef: null },
              { name: "result", value: "undefined", heapRef: null },
            ],
          },
          {
            id: "createUser",
            label: "createUser()",
            variables: [
              { name: "name", value: '"Alice"', heapRef: null },
              { name: "user", value: "-> Obj#1", heapRef: "obj-1" },
            ],
          },
        ],
        heapAllocations: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "active", value: "true" },
            ],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          "<code>return user</code> passes the reference back to the caller. The reference (not the object) is copied into the caller's context.",
        activeLine: 3,
        doneLines: [1, 2, 5],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "createUser", value: "f()", heapRef: null },
              { name: "result", value: "undefined", heapRef: null },
            ],
          },
          {
            id: "createUser",
            label: "createUser()",
            variables: [
              { name: "name", value: '"Alice"', heapRef: null },
              { name: "user", value: "-> Obj#1", heapRef: "obj-1" },
            ],
          },
        ],
        heapAllocations: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "active", value: "true" },
            ],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          'The <code>createUser</code> <span class="hl-stack">stack frame</span> is popped. Its locals (<code>name</code>, <code>user</code>) are gone. But <code>Obj#1</code> <strong>survives</strong> on the <span class="hl-micro">heap</span> because <code>result</code> in the global frame still holds a reference to it.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "createUser", value: "f()", heapRef: null },
              { name: "result", value: "-> Obj#1", heapRef: "obj-1" },
            ],
          },
        ],
        heapAllocations: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "active", value: "true" },
            ],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(result.name)</code> follows the reference from the <span class="hl-stack">stack</span> to the <span class="hl-micro">heap</span> and outputs <code>"Alice"</code>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["Alice"],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "createUser", value: "f()", heapRef: null },
              { name: "result", value: "-> Obj#1", heapRef: "obj-1" },
            ],
          },
        ],
        heapAllocations: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "active", value: "true" },
            ],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<strong>Key takeaway:</strong> <span class="hl-stack">stack frames</span> are temporary and destroyed on return. <span class="hl-micro">Heap</span> objects persist as long as at least one reference points to them.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ["Alice"],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "createUser", value: "f()", heapRef: null },
              { name: "result", value: "-> Obj#1", heapRef: "obj-1" },
            ],
          },
        ],
        heapAllocations: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "active", value: "true" },
            ],
            tone: "violet",
            status: "alive",
          },
        ],
      },
    ],
  },

  /* ── 3. Nested Function Calls ── */
  {
    id: "nested-calls",
    title: "Nested Function Calls",
    description:
      "Multiple frames stack up as functions call each other. Frames unwind in LIFO order on return.",
    kind: "call-stack",
    codeLines: [
      { num: 1, text: "function add(a, b) {" },
      { num: 2, text: "  return a + b;" },
      { num: 3, text: "}" },
      { num: 4, text: "function multiply(x, y) {" },
      { num: 5, text: "  const sum = add(x, y);" },
      { num: 6, text: "  return sum * 2;" },
      { num: 7, text: "}" },
      { num: 8, text: "const result = multiply(3, 4);" },
      { num: 9, text: "console.log(result);" },
    ],
    steps: [
      {
        descriptionHtml:
          "The global <span class=\"hl-stack\">stack frame</span> holds the function declarations <code>add</code> and <code>multiply</code>, and <code>result</code> is declared but not yet assigned.",
        activeLine: null,
        doneLines: [],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "add", value: "f()", heapRef: null },
              { name: "multiply", value: "f()", heapRef: null },
              { name: "result", value: "undefined", heapRef: null },
            ],
          },
        ],
        heapAllocations: [],
      },
      {
        descriptionHtml:
          '<code>multiply(3, 4)</code> is called. A new <span class="hl-stack">stack frame</span> is pushed with <code>x: 3</code> and <code>y: 4</code>. The stack now has 2 frames.',
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "add", value: "f()", heapRef: null },
              { name: "multiply", value: "f()", heapRef: null },
              { name: "result", value: "undefined", heapRef: null },
            ],
          },
          {
            id: "multiply",
            label: "multiply()",
            variables: [
              { name: "x", value: "3", heapRef: null },
              { name: "y", value: "4", heapRef: null },
            ],
          },
        ],
        heapAllocations: [],
      },
      {
        descriptionHtml:
          '<code>add(x, y)</code> is called from within <code>multiply</code>. A third <span class="hl-stack">stack frame</span> is pushed with <code>a: 3</code>, <code>b: 4</code>. The stack now has <strong>3 frames</strong>: global > multiply > add.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4, 7, 8],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "add", value: "f()", heapRef: null },
              { name: "multiply", value: "f()", heapRef: null },
              { name: "result", value: "undefined", heapRef: null },
            ],
          },
          {
            id: "multiply",
            label: "multiply()",
            variables: [
              { name: "x", value: "3", heapRef: null },
              { name: "y", value: "4", heapRef: null },
            ],
          },
          {
            id: "add",
            label: "add()",
            variables: [
              { name: "a", value: "3", heapRef: null },
              { name: "b", value: "4", heapRef: null },
            ],
          },
        ],
        heapAllocations: [],
      },
      {
        descriptionHtml:
          '<code>add</code> returns <code>7</code> and its <span class="hl-stack">stack frame</span> is popped. Back to 2 frames. The result <code>7</code> is returned to <code>multiply</code>.',
        activeLine: 2,
        doneLines: [1, 3, 4, 5, 7, 8],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "add", value: "f()", heapRef: null },
              { name: "multiply", value: "f()", heapRef: null },
              { name: "result", value: "undefined", heapRef: null },
            ],
          },
          {
            id: "multiply",
            label: "multiply()",
            variables: [
              { name: "x", value: "3", heapRef: null },
              { name: "y", value: "4", heapRef: null },
            ],
          },
        ],
        heapAllocations: [],
      },
      {
        descriptionHtml:
          '<code>const sum = 7</code> is stored in the <code>multiply</code> <span class="hl-stack">stack frame</span>.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4, 7, 8],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "add", value: "f()", heapRef: null },
              { name: "multiply", value: "f()", heapRef: null },
              { name: "result", value: "undefined", heapRef: null },
            ],
          },
          {
            id: "multiply",
            label: "multiply()",
            variables: [
              { name: "x", value: "3", heapRef: null },
              { name: "y", value: "4", heapRef: null },
              { name: "sum", value: "7", heapRef: null },
            ],
          },
        ],
        heapAllocations: [],
      },
      {
        descriptionHtml:
          '<code>multiply</code> returns <code>14</code> and its <span class="hl-stack">stack frame</span> is popped. Back to the global frame with <code>result: 14</code>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5, 7, 8],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "add", value: "f()", heapRef: null },
              { name: "multiply", value: "f()", heapRef: null },
              { name: "result", value: "14", heapRef: null },
            ],
          },
        ],
        heapAllocations: [],
      },
      {
        descriptionHtml:
          '<code>console.log(result)</code> outputs <code>14</code>. <strong>Key takeaway:</strong> the <span class="hl-stack">call stack</span> grows and shrinks in LIFO (Last In, First Out) order. Each function call pushes a frame; each return pops one.',
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        consoleOutput: ["14"],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "add", value: "f()", heapRef: null },
              { name: "multiply", value: "f()", heapRef: null },
              { name: "result", value: "14", heapRef: null },
            ],
          },
        ],
        heapAllocations: [],
      },
    ],
  },

  /* ── 4. Garbage Collection ── */
  {
    id: "garbage-collection",
    title: "Garbage Collection",
    description:
      "When no references point to a heap object, it becomes unreachable and the garbage collector reclaims the memory.",
    kind: "gc",
    codeLines: [
      { num: 1, text: "let data = { items: [1, 2, 3] };" },
      { num: 2, text: "console.log(data.items.length);" },
      { num: 3, text: "data = null;" },
      { num: 4, text: "// Obj#1 and Arr#1 are now unreachable" },
      { num: 5, text: "// GC can reclaim the memory" },
      { num: 6, text: "console.log(data);" },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>data</code> is assigned an object with a nested array. The object and array are allocated on the <span class="hl-micro">heap</span>. The <span class="hl-stack">stack</span> holds a reference.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "data", value: "-> Obj#1", heapRef: "obj-1" },
            ],
          },
        ],
        heapAllocations: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "items", value: "-> Arr#1" }],
            tone: "violet",
            status: "alive",
          },
          {
            id: "arr-1",
            label: "Arr#1",
            props: [
              { key: "0", value: "1" },
              { key: "1", value: "2" },
              { key: "2", value: "3" },
            ],
            tone: "cyan",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          "<code>data.items.length</code> follows the reference chain: <code>data</code> on the <span class=\"hl-stack\">stack</span> points to <code>Obj#1</code> on the <span class=\"hl-micro\">heap</span>, which contains <code>items</code> pointing to <code>Arr#1</code>. Outputs <code>3</code>.",
        activeLine: 2,
        doneLines: [1],
        consoleOutput: ["3"],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [
              { name: "data", value: "-> Obj#1", heapRef: "obj-1" },
            ],
          },
        ],
        heapAllocations: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "items", value: "-> Arr#1" }],
            tone: "violet",
            status: "alive",
          },
          {
            id: "arr-1",
            label: "Arr#1",
            props: [
              { key: "0", value: "1" },
              { key: "1", value: "2" },
              { key: "2", value: "3" },
            ],
            tone: "cyan",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>data = null</code> overwrites the reference on the <span class="hl-stack">stack</span>. The variable <code>data</code> no longer points to <code>Obj#1</code>.',
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: ["3"],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [{ name: "data", value: "null", heapRef: null }],
          },
        ],
        heapAllocations: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "items", value: "-> Arr#1" }],
            tone: "violet",
            status: "alive",
          },
          {
            id: "arr-1",
            label: "Arr#1",
            props: [
              { key: "0", value: "1" },
              { key: "1", value: "2" },
              { key: "2", value: "3" },
            ],
            tone: "cyan",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          'The garbage collector scans the <span class="hl-micro">heap</span>. It finds that <code>Obj#1</code> and <code>Arr#1</code> are not reachable from any root (stack variables). They are <strong>marked for collection</strong>.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: ["3"],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [{ name: "data", value: "null", heapRef: null }],
          },
        ],
        heapAllocations: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "items", value: "-> Arr#1" }],
            tone: "violet",
            status: "unreachable",
          },
          {
            id: "arr-1",
            label: "Arr#1",
            props: [
              { key: "0", value: "1" },
              { key: "1", value: "2" },
              { key: "2", value: "3" },
            ],
            tone: "cyan",
            status: "unreachable",
          },
        ],
        gcSweep: true,
      },
      {
        descriptionHtml:
          'The garbage collector <strong>sweeps</strong> the marked objects. <code>Obj#1</code> and <code>Arr#1</code> are removed from the <span class="hl-micro">heap</span> and the memory is freed.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["3"],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [{ name: "data", value: "null", heapRef: null }],
          },
        ],
        heapAllocations: [],
        gcSweep: true,
      },
      {
        descriptionHtml:
          "<code>console.log(data)</code> outputs <code>null</code>. The object is gone.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["3", "null"],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [{ name: "data", value: "null", heapRef: null }],
          },
        ],
        heapAllocations: [],
      },
      {
        descriptionHtml:
          '<strong>Key takeaway:</strong> JavaScript uses automatic garbage collection. When no reachable reference exists to a <span class="hl-micro">heap</span> object, the engine frees the memory. You do not need to manually deallocate, but setting references to <code>null</code> can help objects become eligible for GC sooner.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ["3", "null"],
        stackFrames: [
          {
            id: "global",
            label: "global",
            variables: [{ name: "data", value: "null", heapRef: null }],
          },
        ],
        heapAllocations: [],
      },
    ],
  },
];

/* ── Helpers ── */

function kindBadgeClass(kind: HeapStackKind): string {
  switch (kind) {
    case "stack":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    case "heap":
      return "bg-violet-500/15 text-violet-400 border-violet-500/25";
    case "call-stack":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/25";
    case "gc":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
  }
}

function kindLabel(kind: HeapStackKind): string {
  switch (kind) {
    case "stack":
      return "stack";
    case "heap":
      return "heap";
    case "call-stack":
      return "call stack";
    case "gc":
      return "GC";
  }
}

const FRAME_TONE_MAP: Record<
  number,
  string
> = {
  0: "border-slate-500/30 bg-slate-500/8 text-slate-300",
  1: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  2: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  3: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
};

const HEAP_STATUS_MAP = {
  alive: "",
  unreachable: "opacity-50 ring-1 ring-red-400/40",
  collected: "hidden",
} as const;

const HEAP_TONE_MAP = {
  amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  violet: "border-violet-500/30 bg-violet-500/8 text-violet-300",
} as const;

/* ── Sub-components ── */

function StackPanel({ frames }: { frames: StackFrame[] }) {
  if (frames.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  const reversed = [...frames].reverse();

  return (
    <div className="space-y-2">
      {reversed.map((frame, visualIdx) => {
        const frameIdx = frames.length - 1 - visualIdx;
        const isTop = visualIdx === 0;
        const toneClass =
          FRAME_TONE_MAP[frameIdx] ?? FRAME_TONE_MAP[3];

        return (
          <div
            key={frame.id}
            className={cn(
              "viz-slide-in rounded-lg border px-3 py-2.5",
              toneClass,
              isTop && "ring-1 ring-amber-400/30"
            )}
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                {frame.label}
              </span>
              {isTop && frames.length > 1 && (
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300">
                  active
                </span>
              )}
            </div>
            <div className="space-y-1">
              {frame.variables.map((v) => (
                <div
                  key={v.name}
                  className="flex items-center justify-between font-mono text-xs"
                >
                  <span className="opacity-70">{v.name}</span>
                  <span>{v.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HeapPanel({
  allocations,
  gcSweep,
}: {
  allocations: HeapAllocation[];
  gcSweep: boolean;
}) {
  const visible = allocations.filter((a) => a.status !== "collected");

  if (visible.length === 0 && !gcSweep) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  if (visible.length === 0 && gcSweep) {
    return (
      <div className="relative min-h-[4rem] overflow-hidden rounded-lg">
        <div className="hs-gc-swept pt-5 text-center font-mono text-xs tracking-[0.22em] text-emerald-400/80">
          memory freed
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-2">
      {gcSweep && (
        <div className="hs-gc-scanbar pointer-events-none absolute inset-x-0 top-0 z-10 h-full" />
      )}
      {visible.map((alloc, idx) => (
        <div
          key={`${alloc.id}-${idx}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2.5",
            HEAP_TONE_MAP[alloc.tone],
            HEAP_STATUS_MAP[alloc.status],
            gcSweep && alloc.status === "unreachable" && "hs-gc-shake"
          )}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
              {alloc.label}
            </span>
            {alloc.status === "unreachable" && (
              <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-300">
                unreachable
              </span>
            )}
          </div>
          <div className="space-y-1">
            {alloc.props.map((prop) => (
              <div
                key={prop.key}
                className="flex items-center justify-between font-mono text-xs"
              >
                <span className="opacity-70">{prop.key}</span>
                <span>{prop.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ── */

export function HeapStack() {
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
      stack: currentStep?.stackFrames,
      heap: currentStep?.heapAllocations,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  return (
    <>
      <ToolbarPortal>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <ExampleSelector
                examples={EXAMPLES}
                activeId={activeExampleId}
                onSelect={setActiveExampleId}
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

          <div
            className={cn(
              "app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5",
              flashes.description && "viz-change-flash-pill",
            )}
          >
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

      <section className="relative flex flex-col gap-4 px-1 py-2 text-slate-100 sm:px-2 sm:py-3 lg:px-3 lg:py-4">
        {/* GC sweep animations (topic-specific; shared anims are in globals.css) */}
        <style>{`
          .hs-gc-scanbar {
            background: linear-gradient(
              180deg,
              transparent 0%,
              rgba(244, 114, 182, 0.12) 45%,
              rgba(244, 114, 182, 0.35) 50%,
              rgba(244, 114, 182, 0.12) 55%,
              transparent 100%
            );
            background-size: 100% 300%;
            animation: hs-scan 1.6s ease-in-out infinite;
          }

          @keyframes hs-scan {
            0%   { background-position: 0% 0%; }
            50%  { background-position: 0% 100%; }
            100% { background-position: 0% 0%; }
          }

          .hs-gc-shake {
            animation: hs-shake 0.4s ease-in-out infinite;
          }

          @keyframes hs-shake {
            0%, 100% { transform: translateX(0); }
            25%      { transform: translateX(-2px); }
            75%      { transform: translateX(2px); }
          }

          .hs-gc-swept {
            animation: hs-swept-in 0.5s ease-out both;
          }

          @keyframes hs-swept-in {
            from { opacity: 0; transform: scale(0.95); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>

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
            <div className="grid gap-4 md:grid-cols-2">
              <NeonPanel
                title="Stack"
                tone="amber"
                bodyClassName="min-h-[10rem]"
                className={flashes.stack ? "viz-change-flash" : undefined}
              >
                <StackPanel
                  frames={currentStep?.stackFrames ?? []}
                />
              </NeonPanel>

              <NeonPanel
                title="Heap"
                tone="violet"
                bodyClassName="min-h-[10rem]"
                className={flashes.heap ? "viz-change-flash" : undefined}
              >
                <HeapPanel
                  allocations={currentStep?.heapAllocations ?? []}
                  gcSweep={currentStep?.gcSweep ?? false}
                />
              </NeonPanel>
            </div>

            <div
              className={flashes.console ? "viz-change-flash rounded-3xl" : undefined}
            >
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>

            {example.kind === "gc" &&
              currentStepIndex === example.steps.length - 1 && (
                <div className="flex justify-center pt-1">
                  <TopicLink
                    href="/javascript/garbage-collection"
                    label="Explore GC & Memory Leaks in depth"
                  />
                </div>
              )}
          </div>
        </div>
      </section>
    </>
  );
}
