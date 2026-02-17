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

type ReferenceKind = "primitive" | "reference" | "shallow" | "deep";

interface SourceLine {
  num: number;
  text: string;
}

interface MemorySlot {
  variable: string;
  value: string;
  heapId: string | null;
  tone: "amber" | "emerald" | "cyan" | "violet" | "pink";
}

interface HeapObject {
  id: string;
  label: string;
  props: { key: string; value: string }[];
  tone: "amber" | "emerald" | "cyan" | "violet" | "pink";
  isShared: boolean;
}

interface ReferenceStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  memorySlots: MemorySlot[];
  heapObjects: HeapObject[];
}

interface DeepCopyVariant {
  methodId: string;
  methodLabel: string;
  codeLines: SourceLine[];
  steps: ReferenceStep[];
}

interface StandardExample extends ExampleOption {
  kind: "primitive" | "reference" | "shallow";
  codeLines: SourceLine[];
  steps: ReferenceStep[];
  variants?: undefined;
}

interface VariantExample extends ExampleOption {
  kind: "deep";
  codeLines?: undefined;
  steps?: undefined;
  variants: DeepCopyVariant[];
}

type ReferenceExample = StandardExample | VariantExample;

/* ── Example Data ── */

const EXAMPLES: ReferenceExample[] = [
  /* ── 1. Primitives ── */
  {
    id: "primitives",
    title: "Primitives (By Value)",
    description:
      "Primitive values are copied independently. Changing one does not affect the other.",
    kind: "primitive",
    codeLines: [
      { num: 1, text: "let a = 42;" },
      { num: 2, text: "let b = a;" },
      { num: 3, text: "b = 100;" },
      { num: 4, text: "console.log(a);" },
      { num: 5, text: "console.log(b);" },
    ],
    steps: [
      {
        descriptionHtml:
          "<code>let a = 42</code> creates variable <code>a</code> and stores the number <code>42</code> directly in its memory slot. Primitives hold their own value.",
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        memorySlots: [
          { variable: "a", value: "42", heapId: null, tone: "amber" },
        ],
        heapObjects: [],
      },
      {
        descriptionHtml:
          "<code>let b = a</code> copies the <strong>value</strong> of <code>a</code> into <code>b</code>. Each variable now holds its own independent copy of <code>42</code>.",
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        memorySlots: [
          { variable: "a", value: "42", heapId: null, tone: "amber" },
          { variable: "b", value: "42", heapId: null, tone: "cyan" },
        ],
        heapObjects: [],
      },
      {
        descriptionHtml:
          "<code>b = 100</code> overwrites <code>b</code> with a new value. Since <code>b</code> holds its own copy, <code>a</code> is completely unaffected.",
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: [],
        memorySlots: [
          { variable: "a", value: "42", heapId: null, tone: "amber" },
          { variable: "b", value: "100", heapId: null, tone: "cyan" },
        ],
        heapObjects: [],
      },
      {
        descriptionHtml:
          "<code>console.log(a)</code> outputs <code>42</code>. The original was never touched by changing <code>b</code>.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: ["42"],
        memorySlots: [
          { variable: "a", value: "42", heapId: null, tone: "amber" },
          { variable: "b", value: "100", heapId: null, tone: "cyan" },
        ],
        heapObjects: [],
      },
      {
        descriptionHtml:
          "<code>console.log(b)</code> outputs <code>100</code>. <strong>Key takeaway:</strong> primitives (numbers, strings, booleans, null, undefined, BigInt, Symbol) are always copied by value.",
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["42", "100"],
        memorySlots: [
          { variable: "a", value: "42", heapId: null, tone: "amber" },
          { variable: "b", value: "100", heapId: null, tone: "cyan" },
        ],
        heapObjects: [],
      },
    ],
  },

  /* ── 2. Object Reference ── */
  {
    id: "object-reference",
    title: "Object Reference",
    description:
      "Objects are assigned by reference. Two variables can point to the same object in memory.",
    kind: "reference",
    codeLines: [
      { num: 1, text: 'const obj1 = { name: "Alice", age: 30 };' },
      { num: 2, text: "const obj2 = obj1;" },
      { num: 3, text: 'obj2.name = "Bob";' },
      { num: 4, text: "console.log(obj1.name);" },
      { num: 5, text: "console.log(obj2.name);" },
      { num: 6, text: "console.log(obj1 === obj2);" },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>const obj1 = { name: "Alice", age: 30 }</code> creates an object on the heap. Variable <code>obj1</code> stores a <strong>reference</strong> (pointer) to that object, not the object itself.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        memorySlots: [
          { variable: "obj1", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "age", value: "30" },
            ],
            tone: "amber",
            isShared: false,
          },
        ],
      },
      {
        descriptionHtml:
          "<code>const obj2 = obj1</code> copies the <strong>reference</strong>, not the object. Both <code>obj1</code> and <code>obj2</code> now point to the exact same object in memory.",
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        memorySlots: [
          { variable: "obj1", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
          { variable: "obj2", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "age", value: "30" },
            ],
            tone: "amber",
            isShared: true,
          },
        ],
      },
      {
        descriptionHtml:
          '<code>obj2.name = "Bob"</code> mutates the shared object through <code>obj2</code>. Since both variables point to the same object, this change is visible through <code>obj1</code> too.',
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: [],
        memorySlots: [
          { variable: "obj1", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
          { variable: "obj2", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Bob"' },
              { key: "age", value: "30" },
            ],
            tone: "amber",
            isShared: true,
          },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(obj1.name)</code> outputs <code>"Bob"</code>. Even though we only changed <code>obj2.name</code>, <code>obj1</code> sees the change because they share the same object.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: ["Bob"],
        memorySlots: [
          { variable: "obj1", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
          { variable: "obj2", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Bob"' },
              { key: "age", value: "30" },
            ],
            tone: "amber",
            isShared: true,
          },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(obj2.name)</code> also outputs <code>"Bob"</code>. Both variables reflect the mutation.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["Bob", "Bob"],
        memorySlots: [
          { variable: "obj1", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
          { variable: "obj2", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Bob"' },
              { key: "age", value: "30" },
            ],
            tone: "amber",
            isShared: true,
          },
        ],
      },
      {
        descriptionHtml:
          "<code>obj1 === obj2</code> is <code>true</code> because <code>===</code> on objects compares references, not contents. They point to the same memory location. <strong>Key takeaway:</strong> assigning an object to another variable copies the reference, not the data.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["Bob", "Bob", "true"],
        memorySlots: [
          { variable: "obj1", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
          { variable: "obj2", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Bob"' },
              { key: "age", value: "30" },
            ],
            tone: "amber",
            isShared: true,
          },
        ],
      },
    ],
  },

  /* ── 3. Shallow Copy ── */
  {
    id: "shallow-copy",
    title: "Shallow Copy",
    description:
      "Spread operator copies top-level properties, but nested objects are still shared references.",
    kind: "shallow",
    codeLines: [
      { num: 1, text: 'const original = { name: "Alice", scores: [90, 85] };' },
      { num: 2, text: "const copy = { ...original };" },
      { num: 3, text: 'copy.name = "Bob";' },
      { num: 4, text: "copy.scores.push(100);" },
      { num: 5, text: "console.log(original.name);" },
      { num: 6, text: "console.log(copy.name);" },
      { num: 7, text: "console.log(original.scores);" },
      { num: 8, text: "console.log(copy.scores);" },
    ],
    steps: [
      {
        descriptionHtml:
          "Creates <code>original</code> with a string property and a nested array. The object and the array are separate heap objects.",
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        memorySlots: [
          { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "amber",
            isShared: false,
          },
          {
            id: "arr-1",
            label: "Arr#1",
            props: [
              { key: "0", value: "90" },
              { key: "1", value: "85" },
            ],
            tone: "violet",
            isShared: false,
          },
        ],
      },
      {
        descriptionHtml:
          "<code>{ ...original }</code> creates a <strong>new</strong> top-level object (<code>Obj#2</code>), copying each property. Primitive props (<code>name</code>) get their own copy. But <code>scores</code> is a reference to the same <code>Arr#1</code>.",
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        memorySlots: [
          { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
          { variable: "copy", value: "-> Obj#2", heapId: "obj-2", tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "amber",
            isShared: false,
          },
          {
            id: "obj-2",
            label: "Obj#2 (shallow copy)",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "cyan",
            isShared: false,
          },
          {
            id: "arr-1",
            label: "Arr#1",
            props: [
              { key: "0", value: "90" },
              { key: "1", value: "85" },
            ],
            tone: "violet",
            isShared: true,
          },
        ],
      },
      {
        descriptionHtml:
          '<code>copy.name = "Bob"</code> changes the <code>name</code> property on <code>Obj#2</code> only. Since <code>name</code> is a primitive (string), the copy has its own independent value.',
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: [],
        memorySlots: [
          { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
          { variable: "copy", value: "-> Obj#2", heapId: "obj-2", tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "amber",
            isShared: false,
          },
          {
            id: "obj-2",
            label: "Obj#2 (shallow copy)",
            props: [
              { key: "name", value: '"Bob"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "cyan",
            isShared: false,
          },
          {
            id: "arr-1",
            label: "Arr#1",
            props: [
              { key: "0", value: "90" },
              { key: "1", value: "85" },
            ],
            tone: "violet",
            isShared: true,
          },
        ],
      },
      {
        descriptionHtml:
          "<code>copy.scores.push(100)</code> modifies the <strong>shared</strong> array <code>Arr#1</code>. Both <code>original.scores</code> and <code>copy.scores</code> point to this same array, so both see the new element.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: [],
        memorySlots: [
          { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
          { variable: "copy", value: "-> Obj#2", heapId: "obj-2", tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "amber",
            isShared: false,
          },
          {
            id: "obj-2",
            label: "Obj#2 (shallow copy)",
            props: [
              { key: "name", value: '"Bob"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "cyan",
            isShared: false,
          },
          {
            id: "arr-1",
            label: "Arr#1",
            props: [
              { key: "0", value: "90" },
              { key: "1", value: "85" },
              { key: "2", value: "100" },
            ],
            tone: "pink",
            isShared: true,
          },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(original.name)</code> outputs <code>"Alice"</code>. The primitive property was not affected by changing the copy.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["Alice"],
        memorySlots: [
          { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
          { variable: "copy", value: "-> Obj#2", heapId: "obj-2", tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "amber",
            isShared: false,
          },
          {
            id: "obj-2",
            label: "Obj#2 (shallow copy)",
            props: [
              { key: "name", value: '"Bob"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "cyan",
            isShared: false,
          },
          {
            id: "arr-1",
            label: "Arr#1",
            props: [
              { key: "0", value: "90" },
              { key: "1", value: "85" },
              { key: "2", value: "100" },
            ],
            tone: "pink",
            isShared: true,
          },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(copy.name)</code> outputs <code>"Bob"</code>. The copy\'s primitive property changed independently.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["Alice", "Bob"],
        memorySlots: [
          { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
          { variable: "copy", value: "-> Obj#2", heapId: "obj-2", tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "amber",
            isShared: false,
          },
          {
            id: "obj-2",
            label: "Obj#2 (shallow copy)",
            props: [
              { key: "name", value: '"Bob"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "cyan",
            isShared: false,
          },
          {
            id: "arr-1",
            label: "Arr#1",
            props: [
              { key: "0", value: "90" },
              { key: "1", value: "85" },
              { key: "2", value: "100" },
            ],
            tone: "pink",
            isShared: true,
          },
        ],
      },
      {
        descriptionHtml:
          "<code>console.log(original.scores)</code> outputs <code>[90, 85, 100]</code>. The original sees the pushed element because the nested array was shared, not copied.",
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ["Alice", "Bob", "[90, 85, 100]"],
        memorySlots: [
          { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
          { variable: "copy", value: "-> Obj#2", heapId: "obj-2", tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "amber",
            isShared: false,
          },
          {
            id: "obj-2",
            label: "Obj#2 (shallow copy)",
            props: [
              { key: "name", value: '"Bob"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "cyan",
            isShared: false,
          },
          {
            id: "arr-1",
            label: "Arr#1",
            props: [
              { key: "0", value: "90" },
              { key: "1", value: "85" },
              { key: "2", value: "100" },
            ],
            tone: "pink",
            isShared: true,
          },
        ],
      },
      {
        descriptionHtml:
          "<code>console.log(copy.scores)</code> also outputs <code>[90, 85, 100]</code>. Same array, same data. <strong>Key takeaway:</strong> shallow copy only duplicates the top level. Nested objects and arrays remain shared references.",
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        consoleOutput: ["Alice", "Bob", "[90, 85, 100]", "[90, 85, 100]"],
        memorySlots: [
          { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
          { variable: "copy", value: "-> Obj#2", heapId: "obj-2", tone: "cyan" },
        ],
        heapObjects: [
          {
            id: "obj-1",
            label: "Obj#1",
            props: [
              { key: "name", value: '"Alice"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "amber",
            isShared: false,
          },
          {
            id: "obj-2",
            label: "Obj#2 (shallow copy)",
            props: [
              { key: "name", value: '"Bob"' },
              { key: "scores", value: "-> Arr#1" },
            ],
            tone: "cyan",
            isShared: false,
          },
          {
            id: "arr-1",
            label: "Arr#1",
            props: [
              { key: "0", value: "90" },
              { key: "1", value: "85" },
              { key: "2", value: "100" },
            ],
            tone: "pink",
            isShared: true,
          },
        ],
      },
    ],
  },

  /* ── 4. Deep Copy ── */
  {
    id: "deep-copy",
    title: "Deep Copy",
    description:
      "Creates a fully independent clone. Nested objects get their own copies. Compare three methods.",
    kind: "deep",
    variants: [
      /* ── structuredClone ── */
      {
        methodId: "structured-clone",
        methodLabel: "structuredClone",
        codeLines: [
          { num: 1, text: 'const original = { name: "Alice", scores: [90, 85] };' },
          { num: 2, text: "const clone = structuredClone(original);" },
          { num: 3, text: "clone.scores.push(100);" },
          { num: 4, text: "console.log(original.scores);" },
          { num: 5, text: "console.log(clone.scores);" },
        ],
        steps: [
          {
            descriptionHtml:
              "Creates <code>original</code> with a nested array on the heap.",
            activeLine: 1,
            doneLines: [],
            consoleOutput: [],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
            ],
          },
          {
            descriptionHtml:
              "<code>structuredClone()</code> recursively copies the entire object graph. A new <code>Obj#2</code> is created with its own <code>Arr#2</code>. No references are shared.",
            activeLine: 2,
            doneLines: [1],
            consoleOutput: [],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
              { variable: "clone", value: "-> Obj#2", heapId: "obj-2", tone: "emerald" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
              { id: "obj-2", label: "Obj#2 (deep clone)", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#2" }], tone: "emerald", isShared: false },
              { id: "arr-2", label: "Arr#2 (deep clone)", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "emerald", isShared: false },
            ],
          },
          {
            descriptionHtml:
              "<code>clone.scores.push(100)</code> modifies <code>Arr#2</code> only. <code>Arr#1</code> (the original) is completely independent.",
            activeLine: 3,
            doneLines: [1, 2],
            consoleOutput: [],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
              { variable: "clone", value: "-> Obj#2", heapId: "obj-2", tone: "emerald" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
              { id: "obj-2", label: "Obj#2 (deep clone)", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#2" }], tone: "emerald", isShared: false },
              { id: "arr-2", label: "Arr#2 (deep clone)", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }, { key: "2", value: "100" }], tone: "emerald", isShared: false },
            ],
          },
          {
            descriptionHtml:
              "<code>console.log(original.scores)</code> outputs <code>[90, 85]</code>. The original is completely unaffected by changes to the clone.",
            activeLine: 4,
            doneLines: [1, 2, 3],
            consoleOutput: ["[90, 85]"],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
              { variable: "clone", value: "-> Obj#2", heapId: "obj-2", tone: "emerald" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
              { id: "obj-2", label: "Obj#2 (deep clone)", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#2" }], tone: "emerald", isShared: false },
              { id: "arr-2", label: "Arr#2 (deep clone)", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }, { key: "2", value: "100" }], tone: "emerald", isShared: false },
            ],
          },
          {
            descriptionHtml:
              "<code>console.log(clone.scores)</code> outputs <code>[90, 85, 100]</code>. <strong>Key takeaway:</strong> <code>structuredClone()</code> is the modern, built-in way to deep copy. It handles nested objects, arrays, Maps, Sets, Dates, and circular references.",
            activeLine: 5,
            doneLines: [1, 2, 3, 4],
            consoleOutput: ["[90, 85]", "[90, 85, 100]"],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
              { variable: "clone", value: "-> Obj#2", heapId: "obj-2", tone: "emerald" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
              { id: "obj-2", label: "Obj#2 (deep clone)", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#2" }], tone: "emerald", isShared: false },
              { id: "arr-2", label: "Arr#2 (deep clone)", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }, { key: "2", value: "100" }], tone: "emerald", isShared: false },
            ],
          },
        ],
      },

      /* ── JSON round-trip ── */
      {
        methodId: "json-roundtrip",
        methodLabel: "JSON round-trip",
        codeLines: [
          { num: 1, text: 'const original = { name: "Alice", scores: [90, 85] };' },
          { num: 2, text: "const clone = JSON.parse(JSON.stringify(original));" },
          { num: 3, text: "clone.scores.push(100);" },
          { num: 4, text: "console.log(original.scores);" },
          { num: 5, text: "console.log(clone.scores);" },
        ],
        steps: [
          {
            descriptionHtml:
              "Creates <code>original</code> with a nested array.",
            activeLine: 1,
            doneLines: [],
            consoleOutput: [],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
            ],
          },
          {
            descriptionHtml:
              "<code>JSON.stringify()</code> serializes the object to a string, then <code>JSON.parse()</code> parses it into an entirely new object graph. All references are broken.",
            activeLine: 2,
            doneLines: [1],
            consoleOutput: [],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
              { variable: "clone", value: "-> Obj#2", heapId: "obj-2", tone: "emerald" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
              { id: "obj-2", label: "Obj#2 (JSON clone)", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#2" }], tone: "emerald", isShared: false },
              { id: "arr-2", label: "Arr#2 (JSON clone)", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "emerald", isShared: false },
            ],
          },
          {
            descriptionHtml:
              "<code>clone.scores.push(100)</code> modifies only the cloned array <code>Arr#2</code>.",
            activeLine: 3,
            doneLines: [1, 2],
            consoleOutput: [],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
              { variable: "clone", value: "-> Obj#2", heapId: "obj-2", tone: "emerald" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
              { id: "obj-2", label: "Obj#2 (JSON clone)", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#2" }], tone: "emerald", isShared: false },
              { id: "arr-2", label: "Arr#2 (JSON clone)", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }, { key: "2", value: "100" }], tone: "emerald", isShared: false },
            ],
          },
          {
            descriptionHtml:
              "Original scores remain <code>[90, 85]</code>. The JSON round-trip broke all shared references.",
            activeLine: 4,
            doneLines: [1, 2, 3],
            consoleOutput: ["[90, 85]"],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
              { variable: "clone", value: "-> Obj#2", heapId: "obj-2", tone: "emerald" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
              { id: "obj-2", label: "Obj#2 (JSON clone)", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#2" }], tone: "emerald", isShared: false },
              { id: "arr-2", label: "Arr#2 (JSON clone)", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }, { key: "2", value: "100" }], tone: "emerald", isShared: false },
            ],
          },
          {
            descriptionHtml:
              "Clone scores are <code>[90, 85, 100]</code>. <strong>Caveat:</strong> JSON round-trip loses <code>undefined</code>, functions, Dates (become strings), <code>Infinity</code>, <code>NaN</code>, and cannot handle circular references. Prefer <code>structuredClone()</code> when possible.",
            activeLine: 5,
            doneLines: [1, 2, 3, 4],
            consoleOutput: ["[90, 85]", "[90, 85, 100]"],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
              { variable: "clone", value: "-> Obj#2", heapId: "obj-2", tone: "emerald" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
              { id: "obj-2", label: "Obj#2 (JSON clone)", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#2" }], tone: "emerald", isShared: false },
              { id: "arr-2", label: "Arr#2 (JSON clone)", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }, { key: "2", value: "100" }], tone: "emerald", isShared: false },
            ],
          },
        ],
      },

      /* ── Manual recursive ── */
      {
        methodId: "manual-recursive",
        methodLabel: "Manual (recursive)",
        codeLines: [
          { num: 1, text: "function deepClone(obj) {" },
          { num: 2, text: "  if (obj === null || typeof obj !== 'object') return obj;" },
          { num: 3, text: "  const clone = Array.isArray(obj) ? [] : {};" },
          { num: 4, text: "  for (const key in obj) clone[key] = deepClone(obj[key]);" },
          { num: 5, text: "  return clone;" },
          { num: 6, text: "}" },
          { num: 7, text: 'const original = { name: "Alice", scores: [90, 85] };' },
          { num: 8, text: "const clone = deepClone(original);" },
          { num: 9, text: "clone.scores.push(100);" },
          { num: 10, text: "console.log(original.scores);" },
          { num: 11, text: "console.log(clone.scores);" },
        ],
        steps: [
          {
            descriptionHtml:
              "The <code>deepClone</code> function is declared. It will recursively walk through every property and create new objects/arrays at each level.",
            activeLine: 1,
            doneLines: [],
            consoleOutput: [],
            memorySlots: [],
            heapObjects: [],
          },
          {
            descriptionHtml:
              "Creates <code>original</code> with a nested array.",
            activeLine: 7,
            doneLines: [1, 2, 3, 4, 5, 6],
            consoleOutput: [],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
            ],
          },
          {
            descriptionHtml:
              "<code>deepClone(original)</code> is called. It detects <code>original</code> is an object, creates a new <code>{}</code>, then iterates each key. For <code>name</code> (a string), it returns the value directly. For <code>scores</code> (an array), it recurses and creates a new <code>[]</code>, copying each element.",
            activeLine: 8,
            doneLines: [1, 2, 3, 4, 5, 6, 7],
            consoleOutput: [],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
              { variable: "clone", value: "-> Obj#2", heapId: "obj-2", tone: "emerald" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
              { id: "obj-2", label: "Obj#2 (recursive clone)", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#2" }], tone: "emerald", isShared: false },
              { id: "arr-2", label: "Arr#2 (recursive clone)", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "emerald", isShared: false },
            ],
          },
          {
            descriptionHtml:
              "<code>clone.scores.push(100)</code> modifies only <code>Arr#2</code>. The recursive clone created entirely separate heap objects.",
            activeLine: 9,
            doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
            consoleOutput: [],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
              { variable: "clone", value: "-> Obj#2", heapId: "obj-2", tone: "emerald" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
              { id: "obj-2", label: "Obj#2 (recursive clone)", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#2" }], tone: "emerald", isShared: false },
              { id: "arr-2", label: "Arr#2 (recursive clone)", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }, { key: "2", value: "100" }], tone: "emerald", isShared: false },
            ],
          },
          {
            descriptionHtml:
              "Original scores remain <code>[90, 85]</code>.",
            activeLine: 10,
            doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            consoleOutput: ["[90, 85]"],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
              { variable: "clone", value: "-> Obj#2", heapId: "obj-2", tone: "emerald" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
              { id: "obj-2", label: "Obj#2 (recursive clone)", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#2" }], tone: "emerald", isShared: false },
              { id: "arr-2", label: "Arr#2 (recursive clone)", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }, { key: "2", value: "100" }], tone: "emerald", isShared: false },
            ],
          },
          {
            descriptionHtml:
              "Clone scores are <code>[90, 85, 100]</code>. <strong>Caveat:</strong> this naive implementation does not handle circular references, Dates, Maps, Sets, or Symbols. Use <code>structuredClone()</code> for production code.",
            activeLine: 11,
            doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            consoleOutput: ["[90, 85]", "[90, 85, 100]"],
            memorySlots: [
              { variable: "original", value: "-> Obj#1", heapId: "obj-1", tone: "amber" },
              { variable: "clone", value: "-> Obj#2", heapId: "obj-2", tone: "emerald" },
            ],
            heapObjects: [
              { id: "obj-1", label: "Obj#1", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#1" }], tone: "amber", isShared: false },
              { id: "arr-1", label: "Arr#1", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }], tone: "amber", isShared: false },
              { id: "obj-2", label: "Obj#2 (recursive clone)", props: [{ key: "name", value: '"Alice"' }, { key: "scores", value: "-> Arr#2" }], tone: "emerald", isShared: false },
              { id: "arr-2", label: "Arr#2 (recursive clone)", props: [{ key: "0", value: "90" }, { key: "1", value: "85" }, { key: "2", value: "100" }], tone: "emerald", isShared: false },
            ],
          },
        ],
      },
    ],
  },
];

/* ── Helpers ── */

function getEffectiveData(
  example: ReferenceExample,
  activeMethodId: string
): { codeLines: SourceLine[]; steps: ReferenceStep[] } {
  if (example.kind !== "deep") {
    return { codeLines: example.codeLines, steps: example.steps };
  }
  const variant =
    example.variants.find((v) => v.methodId === activeMethodId) ??
    example.variants[0];
  return { codeLines: variant.codeLines, steps: variant.steps };
}

function kindBadgeClass(kind: ReferenceKind): string {
  switch (kind) {
    case "primitive":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    case "reference":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    case "shallow":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/25";
    case "deep":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
  }
}

function kindLabel(kind: ReferenceKind): string {
  switch (kind) {
    case "primitive":
      return "by value";
    case "reference":
      return "by reference";
    case "shallow":
      return "shallow copy";
    case "deep":
      return "deep copy";
  }
}

const SLOT_TONE_MAP = {
  amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  violet: "border-violet-500/30 bg-violet-500/8 text-violet-300",
  pink: "border-pink-500/30 bg-pink-500/8 text-pink-300",
} as const;

/* ── Sub-components ── */

function MethodTabs({
  variants,
  activeMethodId,
  onSelect,
}: {
  variants: DeepCopyVariant[];
  activeMethodId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Method
      </span>
      {variants.map((v) => (
        <button
          key={v.methodId}
          type="button"
          onClick={() => onSelect(v.methodId)}
          className={cn(
            "cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-xs transition-all",
            v.methodId === activeMethodId
              ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
              : "border-slate-600/60 bg-slate-800/40 text-slate-400 hover:border-slate-500 hover:text-slate-200"
          )}
        >
          {v.methodLabel}
        </button>
      ))}
    </div>
  );
}

function MemoryDiagram({
  slots,
  heapObjects,
}: {
  slots: MemorySlot[];
  heapObjects: HeapObject[];
}) {
  if (slots.length === 0 && heapObjects.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {slots.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-violet-300/80">
            Variables
          </p>
          <div className="space-y-1.5">
            {slots.map((slot, idx) => (
              <div
                key={`${slot.variable}-${idx}`}
                className={cn(
                  "viz-slide-in flex items-center justify-between rounded-lg border px-3 py-2 font-mono text-xs",
                  SLOT_TONE_MAP[slot.tone]
                )}
              >
                <span className="font-semibold">{slot.variable}</span>
                <span>{slot.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {heapObjects.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-violet-300/80">
            Heap
          </p>
          <div className="space-y-2">
            {heapObjects.map((obj, idx) => (
              <div
                key={`${obj.id}-${idx}`}
                className={cn(
                  "viz-slide-in rounded-lg border px-3 py-2.5",
                  SLOT_TONE_MAP[obj.tone],
                  obj.isShared && "ring-1 ring-pink-400/40"
                )}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                    {obj.label}
                  </span>
                  {obj.isShared && (
                    <span className="rounded bg-pink-500/20 px-1.5 py-0.5 text-[10px] text-pink-300">
                      shared
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
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */

export function ReferenceValue() {
  const [activeExampleId, setActiveExampleId] = useState(EXAMPLES[0].id);
  const [activeMethodId, setActiveMethodId] = useState("structured-clone");

  const example =
    EXAMPLES.find((e) => e.id === activeExampleId) ?? EXAMPLES[0];
  const { codeLines, steps } = getEffectiveData(example, activeMethodId);

  const resetKey = `${activeExampleId}-${activeMethodId}`;

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
    totalSteps: steps.length,
    initialStep: -1,
    resetKey,
  });

  const currentStep =
    currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      memory: currentStep?.memorySlots,
      heap: currentStep?.heapObjects,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  const handleExampleChange = (id: string) => {
    setActiveExampleId(id);
    setActiveMethodId("structured-clone");
  };

  return (
    <>
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
              totalSteps={steps.length}
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
        <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]">
          <NeonPanel
            title={VISUALIZATION_PANEL_TITLES.sourceCode}
            tone="amber"
            bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
          >
            <CodeBlock
              lines={codeLines.map(
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
            {example.kind === "deep" && (
              <MethodTabs
                variants={example.variants}
                activeMethodId={activeMethodId}
                onSelect={setActiveMethodId}
              />
            )}

            <NeonPanel
              title="Memory"
              tone="violet"
              bodyClassName="min-h-[10rem]"
              className={flashes.memory || flashes.heap ? "viz-change-flash" : undefined}
            >
              <MemoryDiagram
                slots={currentStep?.memorySlots ?? []}
                heapObjects={currentStep?.heapObjects ?? []}
              />
            </NeonPanel>

            <div
              className={flashes.console ? "viz-change-flash rounded-3xl" : undefined}
            >
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
