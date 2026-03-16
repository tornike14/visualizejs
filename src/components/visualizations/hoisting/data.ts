import type { HoistingExample } from "./types";

export const EXAMPLES: HoistingExample[] = [
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
        kind: "hoist",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h1"],
        consoleOutput: [],
        explanation:
          'Before any code runs, the engine hoists <code>var name</code> to the top of the scope and initializes it as <code>undefined</code>. The assignment stays in place.',
        floatingLineIds: ["h1"],
        tdzLineIds: [],
      },
      {
        kind: "execute",
        highlightOriginal: ["o1"],
        highlightHoisted: ["h2"],
        consoleOutput: ["undefined"],
        explanation:
          "<code>console.log(name)</code> executes. <code>name</code> exists but holds <code>undefined</code> because only the declaration was hoisted, not the assignment.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "execute",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h3"],
        consoleOutput: ["undefined"],
        explanation: 'The assignment <code>name = "Alice"</code> executes. <code>name</code> is now set to <code>"Alice"</code>.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "result",
        highlightOriginal: ["o3"],
        highlightHoisted: ["h4"],
        consoleOutput: ["undefined", "Alice"],
        explanation:
          '<code>console.log(name)</code> runs again. Now <code>name</code> is <code>"Alice"</code>. <strong>Key takeaway:</strong> <code>var</code> hoisting only moves the declaration, not the value.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
    ],
  },

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
        kind: "hoist",
        highlightOriginal: ["o2", "o3", "o4"],
        highlightHoisted: ["h1", "h2", "h3"],
        consoleOutput: [],
        explanation:
          "Before execution, the entire function declaration is hoisted to the top -- both the name and the full body are available immediately.",
        floatingLineIds: ["h1", "h2", "h3"],
        tdzLineIds: [],
      },
      {
        kind: "execute",
        highlightOriginal: ["o1"],
        highlightHoisted: ["h4"],
        consoleOutput: [],
        explanation:
          "<code>greet()</code> is called. Since the function was fully hoisted, it exists and can be invoked even though the call appears before the declaration in the source code.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "result",
        highlightOriginal: ["o3"],
        highlightHoisted: ["h2"],
        consoleOutput: ["Hello!"],
        explanation:
          'The function body executes, printing <code>Hello!</code> to the console. <strong>Key takeaway:</strong> function declarations are fully hoisted, unlike <code>var</code> or function expressions.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
    ],
  },

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
        kind: "hoist",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h1"],
        consoleOutput: [],
        explanation:
          "<code>let score</code> is hoisted, but unlike <code>var</code>, it is <strong>not</strong> initialized. The Temporal Dead Zone (TDZ) begins from the top of the scope until the declaration is reached.",
        floatingLineIds: ["h1"],
        tdzLineIds: ["h1", "h2"],
      },
      {
        kind: "tdz-error",
        highlightOriginal: ["o1"],
        highlightHoisted: ["h2"],
        consoleOutput: ["ReferenceError: Cannot access 'score' before initialization"],
        explanation:
          "Accessing <code>score</code> inside the TDZ throws a <code>ReferenceError</code>. The variable exists (it was hoisted), but it cannot be accessed until the <code>let</code> declaration is reached.",
        floatingLineIds: [],
        tdzLineIds: ["h1", "h2"],
      },
      {
        kind: "execute",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h3"],
        consoleOutput: ["ReferenceError: Cannot access 'score' before initialization"],
        explanation:
          "If execution continued past the error, this is where the TDZ ends. <code>score</code> is now initialized to <code>100</code>.",
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
          'After the declaration, <code>score</code> is accessible and holds the value <code>100</code>. <strong>Key takeaway:</strong> <code>let</code>/<code>const</code> have a TDZ that prevents access before initialization.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
    ],
  },

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
        kind: "hoist",
        highlightOriginal: ["o2"],
        highlightHoisted: ["h1"],
        consoleOutput: [],
        explanation:
          'Before execution, <code>var sayHi</code> is hoisted and set to <code>undefined</code>. The function assigned to it is <strong>not</strong> hoisted -- only the variable name.',
        floatingLineIds: ["h1"],
        tdzLineIds: [],
      },
      {
        kind: "tdz-error",
        highlightOriginal: ["o1"],
        highlightHoisted: ["h2"],
        consoleOutput: ["TypeError: sayHi is not a function"],
        explanation:
          "Calling <code>sayHi()</code> throws a <code>TypeError</code> because <code>sayHi</code> is <code>undefined</code> at this point. Unlike function declarations, function expressions are not fully hoisted.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "execute",
        highlightOriginal: ["o2", "o3", "o4"],
        highlightHoisted: ["h3", "h4", "h5"],
        consoleOutput: ["TypeError: sayHi is not a function"],
        explanation:
          "If execution continued past the error, the function would be assigned to <code>sayHi</code> here. Only now would <code>sayHi</code> be callable.",
        floatingLineIds: [],
        tdzLineIds: [],
      },
      {
        kind: "result",
        highlightOriginal: [],
        highlightHoisted: [],
        consoleOutput: ["TypeError: sayHi is not a function"],
        explanation:
          '<strong>Key takeaway:</strong> function expressions assigned to <code>var</code> are only hoisted as <code>undefined</code>. Use function declarations if you need hoisting, or declare before use.',
        floatingLineIds: [],
        tdzLineIds: [],
      },
    ],
  },
];
