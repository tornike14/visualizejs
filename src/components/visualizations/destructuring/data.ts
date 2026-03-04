import type { DestructuringExample } from "./types";

/* ── Example Data ── */

export const EXAMPLES: DestructuringExample[] = [
  /* ── 1. Array Destructuring ── */
  {
    id: "array",
    title: "Array Destructuring",
    description:
      "Unpack array elements into distinct variables by position.",
    kind: "array",
    codeLines: [
      { num: 1, text: 'const colors = ["red", "green", "blue"];' },
      { num: 2, text: "const [first, second, third] = colors;" },
      { num: 3, text: "const [primary, , tertiary] = colors;" },
      { num: 4, text: "console.log(first);" },
      { num: 5, text: "console.log(second);" },
      { num: 6, text: "console.log(primary, tertiary);" },
    ],
    steps: [
      {
        descriptionHtml:
          'Creates an array <code>colors</code> with three string elements: <code>"red"</code>, <code>"green"</code>, and <code>"blue"</code>.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        bindings: [
          { name: "colors", value: '["red", "green", "blue"]', isNew: true, tone: "amber" },
        ],
      },
      {
        descriptionHtml:
          "<code>[first, second, third] = colors</code> unpacks the array by position. Index 0 goes to <code>first</code>, index 1 to <code>second</code>, index 2 to <code>third</code>.",
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        bindings: [
          { name: "colors", value: '["red", "green", "blue"]', isNew: false, tone: "amber" },
          { name: "first", value: '"red"', isNew: true, tone: "cyan" },
          { name: "second", value: '"green"', isNew: true, tone: "cyan" },
          { name: "third", value: '"blue"', isNew: true, tone: "cyan" },
        ],
      },
      {
        descriptionHtml:
          "The comma without a variable name <strong>skips</strong> index 1. <code>primary</code> gets index 0, index 1 is ignored, and <code>tertiary</code> gets index 2.",
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: [],
        bindings: [
          { name: "colors", value: '["red", "green", "blue"]', isNew: false, tone: "amber" },
          { name: "first", value: '"red"', isNew: false, tone: "cyan" },
          { name: "second", value: '"green"', isNew: false, tone: "cyan" },
          { name: "third", value: '"blue"', isNew: false, tone: "cyan" },
          { name: "primary", value: '"red"', isNew: true, tone: "emerald" },
          { name: "tertiary", value: '"blue"', isNew: true, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(first)</code> outputs <code>"red"</code> from the first destructuring.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: ["red"],
        bindings: [
          { name: "colors", value: '["red", "green", "blue"]', isNew: false, tone: "amber" },
          { name: "first", value: '"red"', isNew: false, tone: "cyan" },
          { name: "second", value: '"green"', isNew: false, tone: "cyan" },
          { name: "third", value: '"blue"', isNew: false, tone: "cyan" },
          { name: "primary", value: '"red"', isNew: false, tone: "emerald" },
          { name: "tertiary", value: '"blue"', isNew: false, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(second)</code> outputs <code>"green"</code>.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["red", "green"],
        bindings: [
          { name: "colors", value: '["red", "green", "blue"]', isNew: false, tone: "amber" },
          { name: "first", value: '"red"', isNew: false, tone: "cyan" },
          { name: "second", value: '"green"', isNew: false, tone: "cyan" },
          { name: "third", value: '"blue"', isNew: false, tone: "cyan" },
          { name: "primary", value: '"red"', isNew: false, tone: "emerald" },
          { name: "tertiary", value: '"blue"', isNew: false, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(primary, tertiary)</code> outputs <code>"red" "blue"</code>. The skipped element <code>"green"</code> was never assigned. <strong>Key takeaway:</strong> array destructuring extracts values by index position, and you can skip indices with empty commas.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["red", "green", "red blue"],
        bindings: [
          { name: "colors", value: '["red", "green", "blue"]', isNew: false, tone: "amber" },
          { name: "first", value: '"red"', isNew: false, tone: "cyan" },
          { name: "second", value: '"green"', isNew: false, tone: "cyan" },
          { name: "third", value: '"blue"', isNew: false, tone: "cyan" },
          { name: "primary", value: '"red"', isNew: false, tone: "emerald" },
          { name: "tertiary", value: '"blue"', isNew: false, tone: "emerald" },
        ],
      },
    ],
  },

  /* ── 2. Object Destructuring ── */
  {
    id: "object",
    title: "Object Destructuring",
    description:
      "Extract object properties into variables by name, with optional renaming.",
    kind: "object",
    codeLines: [
      { num: 1, text: 'const user = { name: "Alice", age: 30, role: "admin" };' },
      { num: 2, text: "const { name, age } = user;" },
      { num: 3, text: "const { role: userRole } = user;" },
      { num: 4, text: "console.log(name);" },
      { num: 5, text: "console.log(age);" },
      { num: 6, text: "console.log(userRole);" },
    ],
    steps: [
      {
        descriptionHtml:
          'Creates an object <code>user</code> with three properties: <code>name</code>, <code>age</code>, and <code>role</code>.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        bindings: [
          { name: "user", value: '{ name: "Alice", age: 30, role: "admin" }', isNew: true, tone: "amber" },
        ],
      },
      {
        descriptionHtml:
          '<code>{ name, age } = user</code> extracts properties by <strong>matching property names</strong>. The variable <code>name</code> gets the value of <code>user.name</code>, and <code>age</code> gets <code>user.age</code>.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        bindings: [
          { name: "user", value: '{ name: "Alice", age: 30, role: "admin" }', isNew: false, tone: "amber" },
          { name: "name", value: '"Alice"', isNew: true, tone: "cyan" },
          { name: "age", value: "30", isNew: true, tone: "cyan" },
        ],
      },
      {
        descriptionHtml:
          '<code>{ role: userRole }</code> extracts the <code>role</code> property but <strong>renames</strong> it to <code>userRole</code>. The syntax is <code>propertyName: newVariable</code>.',
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: [],
        bindings: [
          { name: "user", value: '{ name: "Alice", age: 30, role: "admin" }', isNew: false, tone: "amber" },
          { name: "name", value: '"Alice"', isNew: false, tone: "cyan" },
          { name: "age", value: "30", isNew: false, tone: "cyan" },
          { name: "userRole", value: '"admin"', isNew: true, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(name)</code> outputs <code>"Alice"</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: ["Alice"],
        bindings: [
          { name: "user", value: '{ name: "Alice", age: 30, role: "admin" }', isNew: false, tone: "amber" },
          { name: "name", value: '"Alice"', isNew: false, tone: "cyan" },
          { name: "age", value: "30", isNew: false, tone: "cyan" },
          { name: "userRole", value: '"admin"', isNew: false, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          "<code>console.log(age)</code> outputs <code>30</code>.",
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["Alice", "30"],
        bindings: [
          { name: "user", value: '{ name: "Alice", age: 30, role: "admin" }', isNew: false, tone: "amber" },
          { name: "name", value: '"Alice"', isNew: false, tone: "cyan" },
          { name: "age", value: "30", isNew: false, tone: "cyan" },
          { name: "userRole", value: '"admin"', isNew: false, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(userRole)</code> outputs <code>"admin"</code>. <strong>Key takeaway:</strong> object destructuring matches by property name, and <code>{ prop: alias }</code> lets you rename the resulting variable.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["Alice", "30", "admin"],
        bindings: [
          { name: "user", value: '{ name: "Alice", age: 30, role: "admin" }', isNew: false, tone: "amber" },
          { name: "name", value: '"Alice"', isNew: false, tone: "cyan" },
          { name: "age", value: "30", isNew: false, tone: "cyan" },
          { name: "userRole", value: '"admin"', isNew: false, tone: "emerald" },
        ],
      },
    ],
  },

  /* ── 3. Defaults & Nested ── */
  {
    id: "defaults-nested",
    title: "Defaults & Nested",
    description:
      "Set fallback values for missing properties and destructure nested structures.",
    kind: "nested",
    codeLines: [
      { num: 1, text: 'const config = { theme: "dark", font: { size: 14 } };' },
      { num: 2, text: 'const { theme, lang = "en" } = config;' },
      { num: 3, text: "const { font: { size } } = config;" },
      { num: 4, text: "const [x = 0, y = 0] = [5];" },
      { num: 5, text: "console.log(theme, lang);" },
      { num: 6, text: "console.log(size);" },
      { num: 7, text: "console.log(x, y);" },
    ],
    steps: [
      {
        descriptionHtml:
          "Creates a <code>config</code> object with a <code>theme</code> string and a nested <code>font</code> object containing <code>size</code>.",
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        bindings: [
          { name: "config", value: '{ theme: "dark", font: { size: 14 } }', isNew: true, tone: "amber" },
        ],
      },
      {
        descriptionHtml:
          '<code>theme</code> gets <code>"dark"</code> from the object. <code>lang</code> is not in <code>config</code>, so the <strong>default value</strong> <code>"en"</code> is used. Defaults activate only when the property is <code>undefined</code>.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        bindings: [
          { name: "config", value: '{ theme: "dark", font: { size: 14 } }', isNew: false, tone: "amber" },
          { name: "theme", value: '"dark"', isNew: true, tone: "cyan" },
          { name: "lang", value: '"en" (default)', isNew: true, tone: "violet" },
        ],
      },
      {
        descriptionHtml:
          '<code>{ font: { size } }</code> is <strong>nested destructuring</strong>. It reaches into <code>config.font</code> and extracts <code>size</code>. Note: <code>font</code> itself is not created as a variable.',
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: [],
        bindings: [
          { name: "config", value: '{ theme: "dark", font: { size: 14 } }', isNew: false, tone: "amber" },
          { name: "theme", value: '"dark"', isNew: false, tone: "cyan" },
          { name: "lang", value: '"en" (default)', isNew: false, tone: "violet" },
          { name: "size", value: "14", isNew: true, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          "Array destructuring with defaults. <code>x</code> gets <code>5</code> (index 0 exists). <code>y</code> gets the default <code>0</code> because index 1 is <code>undefined</code>.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: [],
        bindings: [
          { name: "config", value: '{ theme: "dark", font: { size: 14 } }', isNew: false, tone: "amber" },
          { name: "theme", value: '"dark"', isNew: false, tone: "cyan" },
          { name: "lang", value: '"en" (default)', isNew: false, tone: "violet" },
          { name: "size", value: "14", isNew: false, tone: "emerald" },
          { name: "x", value: "5", isNew: true, tone: "pink" },
          { name: "y", value: "0 (default)", isNew: true, tone: "pink" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(theme, lang)</code> outputs <code>"dark" "en"</code>. The default filled in the missing property seamlessly.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["dark en"],
        bindings: [
          { name: "config", value: '{ theme: "dark", font: { size: 14 } }', isNew: false, tone: "amber" },
          { name: "theme", value: '"dark"', isNew: false, tone: "cyan" },
          { name: "lang", value: '"en" (default)', isNew: false, tone: "violet" },
          { name: "size", value: "14", isNew: false, tone: "emerald" },
          { name: "x", value: "5", isNew: false, tone: "pink" },
          { name: "y", value: "0 (default)", isNew: false, tone: "pink" },
        ],
      },
      {
        descriptionHtml:
          "<code>console.log(size)</code> outputs <code>14</code>. Nested destructuring extracted it directly from the inner object.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["dark en", "14"],
        bindings: [
          { name: "config", value: '{ theme: "dark", font: { size: 14 } }', isNew: false, tone: "amber" },
          { name: "theme", value: '"dark"', isNew: false, tone: "cyan" },
          { name: "lang", value: '"en" (default)', isNew: false, tone: "violet" },
          { name: "size", value: "14", isNew: false, tone: "emerald" },
          { name: "x", value: "5", isNew: false, tone: "pink" },
          { name: "y", value: "0 (default)", isNew: false, tone: "pink" },
        ],
      },
      {
        descriptionHtml:
          "<code>console.log(x, y)</code> outputs <code>5 0</code>. <strong>Key takeaway:</strong> defaults activate when a value is <code>undefined</code>. Nested destructuring reaches into inner objects/arrays without intermediate variables.",
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ["dark en", "14", "5 0"],
        bindings: [
          { name: "config", value: '{ theme: "dark", font: { size: 14 } }', isNew: false, tone: "amber" },
          { name: "theme", value: '"dark"', isNew: false, tone: "cyan" },
          { name: "lang", value: '"en" (default)', isNew: false, tone: "violet" },
          { name: "size", value: "14", isNew: false, tone: "emerald" },
          { name: "x", value: "5", isNew: false, tone: "pink" },
          { name: "y", value: "0 (default)", isNew: false, tone: "pink" },
        ],
      },
    ],
  },

  /* ── 4. Function Parameters ── */
  {
    id: "function-params",
    title: "Function Parameters",
    description:
      "Destructure objects and arrays directly in function parameter lists.",
    kind: "params",
    codeLines: [
      { num: 1, text: 'function greet({ name, greeting = "Hello" }) {' },
      { num: 2, text: "  return `${greeting}, ${name}!`;" },
      { num: 3, text: "}" },
      { num: 4, text: 'const msg1 = greet({ name: "Alice" });' },
      { num: 5, text: 'const msg2 = greet({ name: "Bob", greeting: "Hi" });' },
      { num: 6, text: "console.log(msg1);" },
      { num: 7, text: "console.log(msg2);" },
    ],
    steps: [
      {
        descriptionHtml:
          "The function <code>greet</code> is declared. Its parameter uses <strong>object destructuring</strong> to extract <code>name</code> and <code>greeting</code> (with a default) from the argument.",
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        bindings: [],
      },
      {
        descriptionHtml:
          '<code>greet({ name: "Alice" })</code> is called. The argument <code>{ name: "Alice" }</code> is destructured: <code>name</code> gets <code>"Alice"</code>, and <code>greeting</code> uses the default <code>"Hello"</code>.',
        activeLine: 1,
        doneLines: [3],
        consoleOutput: [],
        bindings: [
          { name: "name", value: '"Alice"', isNew: true, tone: "cyan" },
          { name: "greeting", value: '"Hello" (default)', isNew: true, tone: "violet" },
        ],
      },
      {
        descriptionHtml:
          'The template literal builds <code>"Hello, Alice!"</code> and returns it.',
        activeLine: 2,
        doneLines: [1, 3],
        consoleOutput: [],
        bindings: [
          { name: "name", value: '"Alice"', isNew: false, tone: "cyan" },
          { name: "greeting", value: '"Hello" (default)', isNew: false, tone: "violet" },
        ],
      },
      {
        descriptionHtml:
          'The return value <code>"Hello, Alice!"</code> is stored in <code>msg1</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: [],
        bindings: [
          { name: "msg1", value: '"Hello, Alice!"', isNew: true, tone: "amber" },
        ],
      },
      {
        descriptionHtml:
          '<code>greet({ name: "Bob", greeting: "Hi" })</code> is called. This time <code>greeting</code> is provided, so the default is <strong>not</strong> used. <code>name</code> gets <code>"Bob"</code>, <code>greeting</code> gets <code>"Hi"</code>.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: [],
        bindings: [
          { name: "msg1", value: '"Hello, Alice!"', isNew: false, tone: "amber" },
          { name: "msg2", value: '"Hi, Bob!"', isNew: true, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(msg1)</code> outputs <code>"Hello, Alice!"</code>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["Hello, Alice!"],
        bindings: [
          { name: "msg1", value: '"Hello, Alice!"', isNew: false, tone: "amber" },
          { name: "msg2", value: '"Hi, Bob!"', isNew: false, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(msg2)</code> outputs <code>"Hi, Bob!"</code>. <strong>Key takeaway:</strong> destructuring in parameters lets you extract exactly the properties you need, with defaults for optional values. This pattern is common in configuration objects and React props.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ["Hello, Alice!", "Hi, Bob!"],
        bindings: [
          { name: "msg1", value: '"Hello, Alice!"', isNew: false, tone: "amber" },
          { name: "msg2", value: '"Hi, Bob!"', isNew: false, tone: "emerald" },
        ],
      },
    ],
  },
];
