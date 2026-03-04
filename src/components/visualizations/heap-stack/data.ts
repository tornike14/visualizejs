import type { HeapStackExample } from "./types";

export const EXAMPLES: HeapStackExample[] = [
  /* -- 1. Primitives on the Stack -- */
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

  /* -- 2. Objects on the Heap -- */
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

  /* -- 3. Nested Function Calls -- */
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

  /* -- 4. Garbage Collection -- */
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
