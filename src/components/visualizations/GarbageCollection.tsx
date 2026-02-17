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

type GCKind = "algorithm" | "leak" | "weak";

interface SourceLine {
  num: number;
  text: string;
}

interface GCRoot {
  id: string;
  label: string;
  refsTo: string[];
  tone: "amber" | "emerald" | "cyan";
}

interface HeapObject {
  id: string;
  label: string;
  props: { key: string; value: string }[];
  tone: "amber" | "emerald" | "cyan" | "violet";
  status: "alive" | "unreachable" | "collected";
}

interface GCStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  roots: GCRoot[];
  heapObjects: HeapObject[];
  gcSweep?: boolean;
}

interface GCExample extends ExampleOption {
  kind: GCKind;
  codeLines: SourceLine[];
  steps: GCStep[];
}

/* ── Example Data ── */

const EXAMPLES: GCExample[] = [
  /* ── 1. Mark and Sweep ── */
  {
    id: "mark-and-sweep",
    title: "Mark and Sweep",
    description:
      "The GC traces from roots, marks reachable objects, and sweeps unreachable ones.",
    kind: "algorithm",
    codeLines: [
      { num: 1, text: "let x = { a: 1 };" },
      { num: 2, text: "let y = { b: 2, ref: x };" },
      { num: 3, text: "let z = { c: 3 };" },
      { num: 4, text: "y.ref = null;" },
      { num: 5, text: "z = null;" },
      { num: 6, text: "// GC runs: mark from roots, sweep unreachable" },
      { num: 7, text: "console.log(x.a);" },
    ],
    steps: [
      {
        descriptionHtml:
          'Three objects are created on the <span class="hl-micro">heap</span>. Each global variable is a <span class="hl-task">GC root</span> that keeps its target alive. <code>Obj#2</code> also holds a reference to <code>Obj#1</code> via <code>ref</code>.',
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: [],
        roots: [
          { id: "root-x", label: "global: x", refsTo: ["obj-1"], tone: "amber" },
          { id: "root-y", label: "global: y", refsTo: ["obj-2"], tone: "amber" },
          { id: "root-z", label: "global: z", refsTo: ["obj-3"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "a", value: "1" }],
            tone: "violet",
            status: "alive",
          },
          {
            id: "obj-2",
            label: "Obj#2",
            props: [
              { key: "b", value: "2" },
              { key: "ref", value: "-> Obj#1" },
            ],
            tone: "cyan",
            status: "alive",
          },
          {
            id: "obj-3",
            label: "Obj#3",
            props: [{ key: "c", value: "3" }],
            tone: "emerald",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          'All three objects are <span class="hl-task">reachable</span> from GC roots. <code>Obj#1</code> is reachable two ways: directly via <code>x</code> and indirectly via <code>y.ref</code>.',
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: [],
        roots: [
          { id: "root-x", label: "global: x", refsTo: ["obj-1"], tone: "amber" },
          { id: "root-y", label: "global: y", refsTo: ["obj-2"], tone: "amber" },
          { id: "root-z", label: "global: z", refsTo: ["obj-3"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "a", value: "1" }],
            tone: "violet",
            status: "alive",
          },
          {
            id: "obj-2",
            label: "Obj#2",
            props: [
              { key: "b", value: "2" },
              { key: "ref", value: "-> Obj#1" },
            ],
            tone: "cyan",
            status: "alive",
          },
          {
            id: "obj-3",
            label: "Obj#3",
            props: [{ key: "c", value: "3" }],
            tone: "emerald",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>y.ref = null</code> removes the indirect reference from <code>Obj#2</code> to <code>Obj#1</code>. But <code>Obj#1</code> is still <span class="hl-task">reachable</span> via the root <code>x</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: [],
        roots: [
          { id: "root-x", label: "global: x", refsTo: ["obj-1"], tone: "amber" },
          { id: "root-y", label: "global: y", refsTo: ["obj-2"], tone: "amber" },
          { id: "root-z", label: "global: z", refsTo: ["obj-3"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "a", value: "1" }],
            tone: "violet",
            status: "alive",
          },
          {
            id: "obj-2",
            label: "Obj#2",
            props: [
              { key: "b", value: "2" },
              { key: "ref", value: "null" },
            ],
            tone: "cyan",
            status: "alive",
          },
          {
            id: "obj-3",
            label: "Obj#3",
            props: [{ key: "c", value: "3" }],
            tone: "emerald",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>z = null</code> removes the only root reference to <code>Obj#3</code>. The root disappears and <code>Obj#3</code> is no longer <span class="hl-task">reachable</span> from any GC root.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: [],
        roots: [
          { id: "root-x", label: "global: x", refsTo: ["obj-1"], tone: "amber" },
          { id: "root-y", label: "global: y", refsTo: ["obj-2"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "a", value: "1" }],
            tone: "violet",
            status: "alive",
          },
          {
            id: "obj-2",
            label: "Obj#2",
            props: [
              { key: "b", value: "2" },
              { key: "ref", value: "null" },
            ],
            tone: "cyan",
            status: "alive",
          },
          {
            id: "obj-3",
            label: "Obj#3",
            props: [{ key: "c", value: "3" }],
            tone: "emerald",
            status: "unreachable",
          },
        ],
      },
      {
        descriptionHtml:
          '<strong>Mark phase:</strong> the GC scans from all roots (<code>x</code>, <code>y</code>). <code>Obj#1</code> is reachable via <code>x</code>. <code>Obj#2</code> is reachable via <code>y</code>. <code>Obj#3</code> has no root and is <strong>not marked</strong>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: [],
        roots: [
          { id: "root-x", label: "global: x", refsTo: ["obj-1"], tone: "amber" },
          { id: "root-y", label: "global: y", refsTo: ["obj-2"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "a", value: "1" }],
            tone: "violet",
            status: "alive",
          },
          {
            id: "obj-2",
            label: "Obj#2",
            props: [
              { key: "b", value: "2" },
              { key: "ref", value: "null" },
            ],
            tone: "cyan",
            status: "alive",
          },
          {
            id: "obj-3",
            label: "Obj#3",
            props: [{ key: "c", value: "3" }],
            tone: "emerald",
            status: "unreachable",
          },
        ],
        gcSweep: true,
      },
      {
        descriptionHtml:
          '<strong>Sweep phase:</strong> <code>Obj#3</code> is collected and its memory is freed. <code>Obj#1</code> and <code>Obj#2</code> remain on the <span class="hl-micro">heap</span>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: [],
        roots: [
          { id: "root-x", label: "global: x", refsTo: ["obj-1"], tone: "amber" },
          { id: "root-y", label: "global: y", refsTo: ["obj-2"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "a", value: "1" }],
            tone: "violet",
            status: "alive",
          },
          {
            id: "obj-2",
            label: "Obj#2",
            props: [
              { key: "b", value: "2" },
              { key: "ref", value: "null" },
            ],
            tone: "cyan",
            status: "alive",
          },
        ],
        gcSweep: true,
      },
      {
        descriptionHtml:
          '<code>console.log(x.a)</code> outputs <code>1</code>. <strong>Key takeaway:</strong> the mark-and-sweep algorithm traces from <span class="hl-task">GC roots</span>. Any object not reachable from a root is collected. Objects with at least one path from a root survive.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ["1"],
        roots: [
          { id: "root-x", label: "global: x", refsTo: ["obj-1"], tone: "amber" },
          { id: "root-y", label: "global: y", refsTo: ["obj-2"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "a", value: "1" }],
            tone: "violet",
            status: "alive",
          },
          {
            id: "obj-2",
            label: "Obj#2",
            props: [
              { key: "b", value: "2" },
              { key: "ref", value: "null" },
            ],
            tone: "cyan",
            status: "alive",
          },
        ],
      },
    ],
  },

  /* ── 2. Forgotten Timer Leak ── */
  {
    id: "forgotten-timer",
    title: "Forgotten Timer Leak",
    description:
      "A setInterval callback holds a closure reference, preventing GC even after the variable is nulled.",
    kind: "leak",
    codeLines: [
      { num: 1, text: "let data = { items: [1, 2, 3] };" },
      { num: 2, text: "const timer = setInterval(() => {" },
      { num: 3, text: "  console.log(data.items.length);" },
      { num: 4, text: "}, 1000);" },
      { num: 5, text: "data = null;" },
      { num: 6, text: "// data is null, but timer callback still refs it!" },
      { num: 7, text: "// clearInterval(timer); would fix the leak" },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>data</code> is assigned an object containing an array. The <span class="hl-task">root</span> <code>global: data</code> keeps <code>Obj#1</code> alive on the <span class="hl-micro">heap</span>.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        roots: [
          { id: "root-data", label: "global: data", refsTo: ["obj-1"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "items", value: "[1, 2, 3]" }],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>setInterval</code> starts a repeating timer. The callback is a closure that captures <code>data</code>. The <span class="hl-task">active timer</span> is now also a GC root.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        roots: [
          { id: "root-data", label: "global: data", refsTo: ["obj-1"], tone: "amber" },
          { id: "root-timer", label: "setInterval #1", refsTo: ["obj-1"], tone: "emerald" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "items", value: "[1, 2, 3]" }],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          'The timer fires. The callback accesses <code>data.items.length</code> through its closure scope and outputs <code>3</code>.',
        activeLine: 3,
        doneLines: [1, 2, 4],
        consoleOutput: ["3"],
        roots: [
          { id: "root-data", label: "global: data", refsTo: ["obj-1"], tone: "amber" },
          { id: "root-timer", label: "setInterval #1", refsTo: ["obj-1"], tone: "emerald" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "items", value: "[1, 2, 3]" }],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>data = null</code> removes the global variable root. You might expect <code>Obj#1</code> to be eligible for GC now.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["3"],
        roots: [
          { id: "root-timer", label: "setInterval #1", refsTo: ["obj-1"], tone: "emerald" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "items", value: "[1, 2, 3]" }],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          'But the <span class="hl-task">timer callback\'s closure</span> still holds a reference to the original <code>data</code> binding. The timer root keeps <code>Obj#1</code> alive. This is a <strong>memory leak</strong>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["3"],
        roots: [
          { id: "root-timer", label: "setInterval #1", refsTo: ["obj-1"], tone: "emerald" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "items", value: "[1, 2, 3]" }],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          'GC runs but <code>Obj#1</code> is still <span class="hl-task">reachable</span> via the active timer. The scan finds a path from the timer root to the object. It <strong>cannot be collected</strong>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["3"],
        roots: [
          { id: "root-timer", label: "setInterval #1", refsTo: ["obj-1"], tone: "emerald" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "items", value: "[1, 2, 3]" }],
            tone: "violet",
            status: "alive",
          },
        ],
        gcSweep: true,
      },
      {
        descriptionHtml:
          '<strong>Key takeaway:</strong> active timers are GC roots. Their callbacks keep closure variables alive indefinitely. Always call <code>clearInterval</code> / <code>clearTimeout</code> when a timer is no longer needed to prevent <strong>memory leaks</strong>.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ["3"],
        roots: [
          { id: "root-timer", label: "setInterval #1", refsTo: ["obj-1"], tone: "emerald" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "items", value: "[1, 2, 3]" }],
            tone: "violet",
            status: "alive",
          },
        ],
      },
    ],
  },

  /* ── 3. Closure Leak ── */
  {
    id: "closure-leak",
    title: "Closure Leak",
    description:
      "A returned function retains its entire closure scope, keeping a large unused variable alive.",
    kind: "leak",
    codeLines: [
      { num: 1, text: "function createHandler() {" },
      { num: 2, text: '  const largeData = new Array(10000).fill("x");' },
      { num: 3, text: "  return function handler() {" },
      { num: 4, text: '    console.log("handler called");' },
      { num: 5, text: "  };" },
      { num: 6, text: "}" },
      { num: 7, text: "const fn = createHandler();" },
      { num: 8, text: "fn();" },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>createHandler()</code> is called. Inside, <code>largeData</code> allocates a huge array on the <span class="hl-micro">heap</span>. The function scope is a <span class="hl-task">root</span>.',
        activeLine: 2,
        doneLines: [1, 7],
        consoleOutput: [],
        roots: [
          { id: "root-scope", label: "createHandler scope", refsTo: ["arr-1"], tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "arr-1",
            label: "Arr#1 (largeData)",
            props: [
              { key: "length", value: "10000" },
              { key: "[0..9999]", value: '"x"' },
            ],
            tone: "amber",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          'The <code>handler</code> function is created. It closes over <code>createHandler</code>\'s scope, which includes <code>largeData</code>, even though <code>handler</code> never uses it.',
        activeLine: 3,
        doneLines: [1, 2, 7],
        consoleOutput: [],
        roots: [
          { id: "root-scope", label: "createHandler scope", refsTo: ["arr-1", "fn-1"], tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "arr-1",
            label: "Arr#1 (largeData)",
            props: [
              { key: "length", value: "10000" },
              { key: "[0..9999]", value: '"x"' },
            ],
            tone: "amber",
            status: "alive",
          },
          {
            id: "fn-1",
            label: "handler()",
            props: [{ key: "[[Scope]]", value: "createHandler" }],
            tone: "cyan",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>createHandler</code> returns <code>handler</code>. The call frame is popped, but the <strong>closure scope</strong> survives because <code>fn</code> holds a reference to <code>handler</code>.',
        activeLine: 7,
        doneLines: [1, 2, 3, 5, 6],
        consoleOutput: [],
        roots: [
          { id: "root-fn", label: "global: fn", refsTo: ["fn-1"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "arr-1",
            label: "Arr#1 (largeData)",
            props: [
              { key: "length", value: "10000" },
              { key: "[0..9999]", value: '"x"' },
            ],
            tone: "amber",
            status: "alive",
          },
          {
            id: "fn-1",
            label: "handler()",
            props: [{ key: "[[Scope]]", value: "createHandler" }],
            tone: "cyan",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>fn()</code> executes. It logs <code>"handler called"</code>. Notice that <code>handler</code> <strong>never reads</strong> <code>largeData</code>, yet the array is still alive.',
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        consoleOutput: ["handler called"],
        roots: [
          { id: "root-fn", label: "global: fn", refsTo: ["fn-1"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "arr-1",
            label: "Arr#1 (largeData)",
            props: [
              { key: "length", value: "10000" },
              { key: "[0..9999]", value: '"x"' },
            ],
            tone: "amber",
            status: "alive",
          },
          {
            id: "fn-1",
            label: "handler()",
            props: [{ key: "[[Scope]]", value: "createHandler" }],
            tone: "cyan",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          'The reference chain: <code>fn</code> (root) -> <code>handler</code> (closure) -> scope -> <code>largeData</code> (Arr#1). GC <strong>cannot collect</strong> the 10,000-element array because it is reachable.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        consoleOutput: ["handler called"],
        roots: [
          { id: "root-fn", label: "global: fn", refsTo: ["fn-1"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "arr-1",
            label: "Arr#1 (largeData)",
            props: [
              { key: "length", value: "10000" },
              { key: "[0..9999]", value: '"x"' },
            ],
            tone: "amber",
            status: "alive",
          },
          {
            id: "fn-1",
            label: "handler()",
            props: [{ key: "[[Scope]]", value: "createHandler" }],
            tone: "cyan",
            status: "alive",
          },
        ],
        gcSweep: true,
      },
      {
        descriptionHtml:
          '<strong>Key takeaway:</strong> closures retain the <strong>entire</strong> parent scope, including variables they never use. In V8, unused variables <em>may</em> be optimized away, but this is engine-specific. Restructure code to avoid holding unnecessary references in long-lived closures.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        consoleOutput: ["handler called"],
        roots: [
          { id: "root-fn", label: "global: fn", refsTo: ["fn-1"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "arr-1",
            label: "Arr#1 (largeData)",
            props: [
              { key: "length", value: "10000" },
              { key: "[0..9999]", value: '"x"' },
            ],
            tone: "amber",
            status: "alive",
          },
          {
            id: "fn-1",
            label: "handler()",
            props: [{ key: "[[Scope]]", value: "createHandler" }],
            tone: "cyan",
            status: "alive",
          },
        ],
      },
    ],
  },

  /* ── 4. WeakRef ── */
  {
    id: "weak-references",
    title: "WeakRef",
    description:
      "WeakRef holds a reference without preventing GC. deref() returns undefined after collection.",
    kind: "weak",
    codeLines: [
      { num: 1, text: "let obj = { value: 42 };" },
      { num: 2, text: "const weak = new WeakRef(obj);" },
      { num: 3, text: "console.log(weak.deref()?.value);" },
      { num: 4, text: "obj = null;" },
      { num: 5, text: "// obj is eligible for GC despite WeakRef" },
      { num: 6, text: "// After GC runs:" },
      { num: 7, text: "console.log(weak.deref());" },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>obj</code> is created on the <span class="hl-micro">heap</span>. The <span class="hl-task">root</span> <code>global: obj</code> is a <strong>strong reference</strong> that prevents GC.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        roots: [
          { id: "root-obj", label: "global: obj", refsTo: ["obj-1"], tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "value", value: "42" }],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>new WeakRef(obj)</code> creates a <strong>weak reference</strong> to <code>Obj#1</code>. Unlike a normal reference, a WeakRef does <strong>not</strong> count as a GC root. It will not prevent collection.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        roots: [
          { id: "root-obj", label: "global: obj", refsTo: ["obj-1"], tone: "amber" },
          { id: "root-weak", label: "global: weak (WeakRef)", refsTo: [], tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "value", value: "42" }],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>weak.deref()</code> returns the target object (still alive). <code>?.value</code> reads <code>42</code> and outputs it.',
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: ["42"],
        roots: [
          { id: "root-obj", label: "global: obj", refsTo: ["obj-1"], tone: "amber" },
          { id: "root-weak", label: "global: weak (WeakRef)", refsTo: [], tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "value", value: "42" }],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>obj = null</code> removes the only <strong>strong</strong> reference. The WeakRef still exists, but it does not count as a root for GC purposes.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: ["42"],
        roots: [
          { id: "root-weak", label: "global: weak (WeakRef)", refsTo: [], tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "value", value: "42" }],
            tone: "violet",
            status: "alive",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>Obj#1</code> has no strong root references. It is now eligible for garbage collection. The <span class="hl-micro">heap</span> object is marked as unreachable.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["42"],
        roots: [
          { id: "root-weak", label: "global: weak (WeakRef)", refsTo: [], tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [{ key: "value", value: "42" }],
            tone: "violet",
            status: "unreachable",
          },
        ],
        gcSweep: true,
      },
      {
        descriptionHtml:
          'GC collects <code>Obj#1</code>. The memory is freed. The WeakRef\'s internal target is now gone.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["42"],
        roots: [
          { id: "root-weak", label: "global: weak (WeakRef)", refsTo: [], tone: "cyan" },
        ],
        heapObjects: [],
        gcSweep: true,
      },
      {
        descriptionHtml:
          '<code>weak.deref()</code> returns <code>undefined</code> because the target was collected. <strong>Key takeaway:</strong> <code>WeakRef</code> allows holding a reference without preventing GC. Useful for caches and observers where you want automatic cleanup.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ["42", "undefined"],
        roots: [
          { id: "root-weak", label: "global: weak (WeakRef)", refsTo: [], tone: "cyan" },
        ],
        heapObjects: [],
      },
    ],
  },
];

/* ── Helpers ── */

function kindBadgeClass(kind: GCKind): string {
  switch (kind) {
    case "algorithm":
      return "bg-violet-500/15 text-violet-400 border-violet-500/25";
    case "leak":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    case "weak":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/25";
  }
}

function kindLabel(kind: GCKind): string {
  switch (kind) {
    case "algorithm":
      return "algorithm";
    case "leak":
      return "leak";
    case "weak":
      return "weak";
  }
}

const ROOT_TONE_MAP = {
  amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
} as const;

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

/** Stable fingerprint for a root — changes only when root data changes. */
function rootFingerprint(root: GCRoot): string {
  return `${root.label}|${root.tone}|${root.refsTo.join(",")}`;
}

/** Stable fingerprint for a heap object — changes only when object data changes. */
function heapFingerprint(obj: HeapObject): string {
  return `${obj.label}|${obj.tone}|${obj.status}|${obj.props.map((p) => `${p.key}:${p.value}`).join(",")}`;
}

function RootsPanel({ roots }: { roots: GCRoot[] }) {
  if (roots.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no roots
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {roots.map((root) => (
        <div
          key={`${root.id}-${rootFingerprint(root)}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2.5",
            ROOT_TONE_MAP[root.tone]
          )}
        >
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
            {root.label}
          </span>
          {root.refsTo.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {root.refsTo.map((ref) => (
                <div
                  key={ref}
                  className="font-mono text-xs opacity-70"
                >
                  {'->'} {ref}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GCHeapPanel({
  objects,
  gcSweep,
}: {
  objects: HeapObject[];
  gcSweep: boolean;
}) {
  const visible = objects.filter((o) => o.status !== "collected");

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
        <div className="gc-swept pt-5 text-center font-mono text-xs tracking-[0.22em] text-emerald-400/80">
          memory freed
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-2">
      {gcSweep && (
        <div className="gc-scanbar pointer-events-none absolute inset-0 z-10 rounded-lg" />
      )}
      {visible.map((obj) => (
        <div
          key={`${obj.id}-${heapFingerprint(obj)}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2.5",
            HEAP_TONE_MAP[obj.tone],
            HEAP_STATUS_MAP[obj.status],
            gcSweep && obj.status === "unreachable" && "gc-shake"
          )}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
              {obj.label}
            </span>
            {obj.status === "unreachable" && (
              <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-300">
                unreachable
              </span>
            )}
          </div>
          <div className="space-y-1">
            {obj.props.map((prop) => (
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

export function GarbageCollection() {
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
      roots: currentStep?.roots,
      heap: currentStep?.heapObjects,
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
          .gc-scanbar {
            height: 100%;
            background: linear-gradient(
              180deg,
              transparent 0%,
              rgba(244, 114, 182, 0.12) 45%,
              rgba(244, 114, 182, 0.35) 50%,
              rgba(244, 114, 182, 0.12) 55%,
              transparent 100%
            );
            background-size: 100% 300%;
            animation: gc-scan 1.6s ease-in-out infinite;
          }

          @keyframes gc-scan {
            0%   { background-position: 0% 0%; }
            50%  { background-position: 0% 100%; }
            100% { background-position: 0% 0%; }
          }

          .gc-shake {
            animation: gc-shake 0.4s ease-in-out infinite;
          }

          @keyframes gc-shake {
            0%, 100% { transform: translateX(0); }
            25%      { transform: translateX(-2px); }
            75%      { transform: translateX(2px); }
          }

          .gc-swept {
            animation: gc-swept-in 0.5s ease-out both;
          }

          @keyframes gc-swept-in {
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
                title="GC Roots"
                tone="green"
                bodyClassName="min-h-[10rem]"
                className={flashes.roots ? "viz-change-flash" : undefined}
              >
                <RootsPanel roots={currentStep?.roots ?? []} />
              </NeonPanel>

              <NeonPanel
                title="Heap"
                tone="violet"
                bodyClassName="min-h-[10rem]"
                className={flashes.heap ? "viz-change-flash" : undefined}
              >
                <GCHeapPanel
                  objects={currentStep?.heapObjects ?? []}
                  gcSweep={currentStep?.gcSweep ?? false}
                />
              </NeonPanel>
            </div>

            <div
              className={flashes.console ? "viz-change-flash rounded-3xl" : undefined}
            >
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>

            {example.id === "mark-and-sweep" &&
              currentStepIndex === example.steps.length - 1 && (
                <div className="flex justify-center pt-1">
                  <TopicLink
                    href="/javascript/heap-stack"
                    label="See how Heap & Stack memory works"
                  />
                </div>
              )}
          </div>
        </div>
      </section>
    </>
  );
}
