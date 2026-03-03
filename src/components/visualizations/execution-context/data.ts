import type { SourceLine, ECStep } from "./types";

// ---------------------------------------------------------------------------
// Source Code
// ---------------------------------------------------------------------------

export const CODE_LINES: SourceLine[] = [
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

export const STEPS: ECStep[] = [
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
