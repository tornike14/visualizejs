import type { ReferenceExample } from "./types";

/* ── Example Data ── */

export const EXAMPLES: ReferenceExample[] = [
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
