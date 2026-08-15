import type { ModulesExample } from "./types";

/* ── Example Data ── */

export const EXAMPLES: ModulesExample[] = [
  /* ── 1. Named & Default Exports ── */
  {
    id: "named-default",
    title: "Named & Default Exports",
    description:
      "Named exports bind by name. Default exports bind by the 'default' key. One module can have both.",
    kind: "named-default",
    codeLines: [
      { num: 1, text: "// ── math.js ──" },
      { num: 2, text: "export const PI = 3.14;" },
      { num: 3, text: "export function double(x) {" },
      { num: 4, text: "  return x * 2;" },
      { num: 5, text: "}" },
      { num: 6, text: "export default function square(x) {" },
      { num: 7, text: "  return x * x;" },
      { num: 8, text: "}" },
      { num: 9, text: "" },
      { num: 10, text: "// ── app.js ──" },
      { num: 11, text: 'import square, { PI, double } from "./math.js";' },
      { num: 12, text: "console.log(PI);" },
      { num: 13, text: "console.log(double(5));" },
      { num: 14, text: "console.log(square(3));" },
    ],
    steps: [
      {
        descriptionHtml:
          'The engine encounters <code>import</code> in <code>app.js</code>. Before executing any code, it begins resolving the module graph by loading <code>math.js</code>.',
        activeLine: 11,
        doneLines: [],
        consoleOutput: [],
        modules: [
          { id: "app", filename: "app.js", phase: "unlinked", exports: [] },
          { id: "math", filename: "math.js", phase: "unlinked", exports: [], highlight: "active" },
        ],
        edges: [{ from: "app", to: "math", imports: ["square (default)", "PI", "double"] }],
        bindings: [],
      },
      {
        descriptionHtml:
          '<code>math.js</code> is parsed. The engine discovers three exports: named <code>PI</code>, named <code>double</code>, and default <code>square</code>. Module records are created.',
        activeLine: 2,
        doneLines: [],
        consoleOutput: [],
        modules: [
          { id: "app", filename: "app.js", phase: "unlinked", exports: [] },
          { id: "math", filename: "math.js", phase: "linking", exports: ["PI", "double", "default (square)"], highlight: "active" },
        ],
        edges: [{ from: "app", to: "math", imports: ["square (default)", "PI", "double"], highlight: "active" }],
        bindings: [],
      },
      {
        descriptionHtml:
          'Named exports <code>PI</code> and <code>double</code> are linked. Each import in <code>app.js</code> gets a live binding that points to the same memory slot as the export in <code>math.js</code>.',
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: [],
        modules: [
          { id: "app", filename: "app.js", phase: "linking", exports: [], highlight: "active" },
          { id: "math", filename: "math.js", phase: "linked", exports: ["PI", "double", "default (square)"] },
        ],
        edges: [{ from: "app", to: "math", imports: ["square (default)", "PI", "double"], highlight: "resolved" }],
        bindings: [
          { name: "PI", sourceModule: "math.js", sourceExport: "PI", value: "3.14", isLive: true },
          { name: "double", sourceModule: "math.js", sourceExport: "double", value: "function", isLive: true },
          { name: "square", sourceModule: "math.js", sourceExport: "default", value: "function", isLive: true },
        ],
      },
      {
        descriptionHtml:
          'Module graph is fully linked. Evaluation begins depth-first: <code>math.js</code> evaluates first since it has no imports.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        modules: [
          { id: "app", filename: "app.js", phase: "linked", exports: [] },
          { id: "math", filename: "math.js", phase: "evaluating", exports: ["PI", "double", "default (square)"], highlight: "active" },
        ],
        edges: [{ from: "app", to: "math", imports: ["square (default)", "PI", "double"], highlight: "resolved" }],
        bindings: [
          { name: "PI", sourceModule: "math.js", sourceExport: "PI", value: "3.14", isLive: true },
          { name: "double", sourceModule: "math.js", sourceExport: "double", value: "function", isLive: true },
          { name: "square", sourceModule: "math.js", sourceExport: "default", value: "function", isLive: true },
        ],
      },
      {
        descriptionHtml:
          '<code>math.js</code> evaluated. <code>app.js</code> now evaluates. <code>console.log(PI)</code> reads the live binding and outputs <code>3.14</code>.',
        activeLine: 12,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
        consoleOutput: ["3.14"],
        modules: [
          { id: "app", filename: "app.js", phase: "evaluating", exports: [], highlight: "active" },
          { id: "math", filename: "math.js", phase: "evaluated", exports: ["PI", "double", "default (square)"] },
        ],
        edges: [{ from: "app", to: "math", imports: ["square (default)", "PI", "double"], highlight: "resolved" }],
        bindings: [
          { name: "PI", sourceModule: "math.js", sourceExport: "PI", value: "3.14", isLive: true },
          { name: "double", sourceModule: "math.js", sourceExport: "double", value: "function", isLive: true },
          { name: "square", sourceModule: "math.js", sourceExport: "default", value: "function", isLive: true },
        ],
      },
      {
        descriptionHtml:
          '<code>double(5)</code> returns 10. <code>square(3)</code> returns 9. Both functions were imported and called successfully.',
        activeLine: 14,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
        consoleOutput: ["3.14", "10", "9"],
        modules: [
          { id: "app", filename: "app.js", phase: "evaluated", exports: [], highlight: "active" },
          { id: "math", filename: "math.js", phase: "evaluated", exports: ["PI", "double", "default (square)"] },
        ],
        edges: [{ from: "app", to: "math", imports: ["square (default)", "PI", "double"], highlight: "resolved" }],
        bindings: [
          { name: "PI", sourceModule: "math.js", sourceExport: "PI", value: "3.14", isLive: true },
          { name: "double", sourceModule: "math.js", sourceExport: "double", value: "function", isLive: true },
          { name: "square", sourceModule: "math.js", sourceExport: "default", value: "function", isLive: true },
        ],
      },
      {
        descriptionHtml:
          'Named exports bind by name: <code>{ PI, double }</code>. The default export binds via the <code>default</code> key and is imported without braces. A module can have one default and many named exports.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14],
        consoleOutput: ["3.14", "10", "9"],
        modules: [
          { id: "app", filename: "app.js", phase: "evaluated", exports: [] },
          { id: "math", filename: "math.js", phase: "evaluated", exports: ["PI", "double", "default (square)"] },
        ],
        edges: [{ from: "app", to: "math", imports: ["square (default)", "PI", "double"], highlight: "resolved" }],
        bindings: [
          { name: "PI", sourceModule: "math.js", sourceExport: "PI", value: "3.14", isLive: true },
          { name: "double", sourceModule: "math.js", sourceExport: "double", value: "function", isLive: true },
          { name: "square", sourceModule: "math.js", sourceExport: "default", value: "function", isLive: true },
        ],
      },
    ],
  },

  /* ── 2. Live Bindings ── */
  {
    id: "live-bindings",
    title: "Live Bindings",
    description:
      "ES module imports are live, read-only references. When the source module mutates a value, the importer sees the change.",
    kind: "live-bindings",
    codeLines: [
      { num: 1, text: "// ── counter.js ──" },
      { num: 2, text: "export let count = 0;" },
      { num: 3, text: "export function increment() {" },
      { num: 4, text: "  count++;" },
      { num: 5, text: "}" },
      { num: 6, text: "" },
      { num: 7, text: "// ── app.js ──" },
      { num: 8, text: 'import { count, increment } from "./counter.js";' },
      { num: 9, text: "console.log(count);" },
      { num: 10, text: "increment();" },
      { num: 11, text: "console.log(count);" },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>app.js</code> imports from <code>counter.js</code>. The engine loads and parses both modules.',
        activeLine: 8,
        doneLines: [],
        consoleOutput: [],
        modules: [
          { id: "app", filename: "app.js", phase: "unlinked", exports: [] },
          { id: "counter", filename: "counter.js", phase: "unlinked", exports: [], highlight: "active" },
        ],
        edges: [{ from: "app", to: "counter", imports: ["count", "increment"] }],
        bindings: [],
      },
      {
        descriptionHtml:
          '<code>counter.js</code> is parsed. Exports <code>count</code> and <code>increment</code> are discovered. Module records are created.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        modules: [
          { id: "app", filename: "app.js", phase: "unlinked", exports: [] },
          { id: "counter", filename: "counter.js", phase: "linking", exports: ["count", "increment"], highlight: "active" },
        ],
        edges: [{ from: "app", to: "counter", imports: ["count", "increment"], highlight: "active" }],
        bindings: [],
      },
      {
        descriptionHtml:
          'Bindings linked. <code>count</code> in app.js points to the <strong>same memory slot</strong> as <code>count</code> in counter.js. This is a live binding, not a copy.',
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: [],
        modules: [
          { id: "app", filename: "app.js", phase: "linked", exports: [], highlight: "active" },
          { id: "counter", filename: "counter.js", phase: "linked", exports: ["count", "increment"] },
        ],
        edges: [{ from: "app", to: "counter", imports: ["count", "increment"], highlight: "resolved" }],
        bindings: [
          { name: "count", sourceModule: "counter.js", sourceExport: "count", value: "0", isLive: true },
          { name: "increment", sourceModule: "counter.js", sourceExport: "increment", value: "function", isLive: true },
        ],
      },
      {
        descriptionHtml:
          'Evaluation begins. <code>counter.js</code> evaluates: <code>count</code> is initialized to 0. Then <code>app.js</code> starts. <code>console.log(count)</code> reads <strong>0</strong> from the live binding.',
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 7, 8],
        consoleOutput: ["0"],
        modules: [
          { id: "app", filename: "app.js", phase: "evaluating", exports: [], highlight: "active" },
          { id: "counter", filename: "counter.js", phase: "evaluated", exports: ["count", "increment"] },
        ],
        edges: [{ from: "app", to: "counter", imports: ["count", "increment"], highlight: "resolved" }],
        bindings: [
          { name: "count", sourceModule: "counter.js", sourceExport: "count", value: "0", isLive: true },
          { name: "increment", sourceModule: "counter.js", sourceExport: "increment", value: "function", isLive: true },
        ],
      },
      {
        descriptionHtml:
          '<code>increment()</code> is called. Inside <code>counter.js</code>, <code>count++</code> changes count from 0 to 1. The mutation happens in the source module.',
        activeLine: 4,
        doneLines: [1, 2, 3, 5, 7, 8, 9, 10],
        consoleOutput: ["0"],
        modules: [
          { id: "app", filename: "app.js", phase: "evaluating", exports: [] },
          { id: "counter", filename: "counter.js", phase: "evaluated", exports: ["count", "increment"], highlight: "active" },
        ],
        edges: [{ from: "app", to: "counter", imports: ["count", "increment"], highlight: "resolved" }],
        bindings: [
          { name: "count", sourceModule: "counter.js", sourceExport: "count", value: "1", isLive: true },
          { name: "increment", sourceModule: "counter.js", sourceExport: "increment", value: "function", isLive: true },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(count)</code> reads <strong>1</strong>. The import sees the updated value because ES module imports are live bindings. They reference the same memory slot, not a copied value.',
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 7, 8, 9, 10],
        consoleOutput: ["0", "1"],
        modules: [
          { id: "app", filename: "app.js", phase: "evaluating", exports: [], highlight: "active" },
          { id: "counter", filename: "counter.js", phase: "evaluated", exports: ["count", "increment"] },
        ],
        edges: [{ from: "app", to: "counter", imports: ["count", "increment"], highlight: "resolved" }],
        bindings: [
          { name: "count", sourceModule: "counter.js", sourceExport: "count", value: "1", isLive: true },
          { name: "increment", sourceModule: "counter.js", sourceExport: "increment", value: "function", isLive: true },
        ],
      },
      {
        descriptionHtml:
          'Imports are read-only from the importer side. <code>count = 5</code> in app.js would throw a TypeError. Only the exporting module can change its own exports. This is different from CommonJS <code>require()</code>, which copies values.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11],
        consoleOutput: ["0", "1"],
        modules: [
          { id: "app", filename: "app.js", phase: "evaluated", exports: [] },
          { id: "counter", filename: "counter.js", phase: "evaluated", exports: ["count", "increment"] },
        ],
        edges: [{ from: "app", to: "counter", imports: ["count", "increment"], highlight: "resolved" }],
        bindings: [
          { name: "count", sourceModule: "counter.js", sourceExport: "count", value: "1", isLive: true },
          { name: "increment", sourceModule: "counter.js", sourceExport: "increment", value: "function", isLive: true },
        ],
      },
    ],
  },

  /* ── 3. Circular Dependencies ── */
  {
    id: "circular",
    title: "Circular Dependencies",
    description:
      "The engine handles circular imports by using partially-initialized module records. Bindings may be uninitialized if read too early.",
    kind: "circular",
    codeLines: [
      { num: 1, text: "// ── a.js ──" },
      { num: 2, text: 'import { b } from "./b.js";' },
      { num: 3, text: 'export const a = "A";' },
      { num: 4, text: 'console.log("a.js sees b:", b);' },
      { num: 5, text: "" },
      { num: 6, text: "// ── b.js ──" },
      { num: 7, text: 'import { a } from "./a.js";' },
      { num: 8, text: 'export const b = "B";' },
      { num: 9, text: 'console.log("b.js sees a:", a);' },
    ],
    steps: [
      {
        descriptionHtml:
          'The engine starts loading <code>a.js</code>. It encounters <code>import { b } from "./b.js"</code> and begins loading <code>b.js</code>.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        modules: [
          { id: "a", filename: "a.js", phase: "linking", exports: ["a"], highlight: "active" },
          { id: "b", filename: "b.js", phase: "unlinked", exports: [] },
        ],
        edges: [
          { from: "a", to: "b", imports: ["b"], highlight: "active" },
        ],
        bindings: [],
      },
      {
        descriptionHtml:
          '<code>b.js</code> is loaded. It imports <code>{ a }</code> from <code>a.js</code>. The engine detects a <strong>circular reference</strong>. It uses the partially-initialized module record for <code>a.js</code>.',
        activeLine: 7,
        doneLines: [1, 2, 6],
        consoleOutput: [],
        modules: [
          { id: "a", filename: "a.js", phase: "linking", exports: ["a"] },
          { id: "b", filename: "b.js", phase: "linking", exports: ["b"], highlight: "active" },
        ],
        edges: [
          { from: "a", to: "b", imports: ["b"], highlight: "active" },
          { from: "b", to: "a", imports: ["a"], highlight: "active" },
        ],
        bindings: [
          { name: "a (in b.js)", sourceModule: "a.js", sourceExport: "a", value: "uninitialized", isLive: true },
          { name: "b (in a.js)", sourceModule: "b.js", sourceExport: "b", value: "uninitialized", isLive: true },
        ],
      },
      {
        descriptionHtml:
          'Both modules are linked. Evaluation starts depth-first. <code>b.js</code> evaluates first (since <code>a.js</code> depends on it). <code>b = "B"</code> is assigned.',
        activeLine: 8,
        doneLines: [1, 2, 6, 7],
        consoleOutput: [],
        modules: [
          { id: "a", filename: "a.js", phase: "linked", exports: ["a"] },
          { id: "b", filename: "b.js", phase: "evaluating", exports: ["b"], highlight: "active" },
        ],
        edges: [
          { from: "a", to: "b", imports: ["b"], highlight: "resolved" },
          { from: "b", to: "a", imports: ["a"], highlight: "resolved" },
        ],
        bindings: [
          { name: "a (in b.js)", sourceModule: "a.js", sourceExport: "a", value: "uninitialized", isLive: true },
          { name: "b (in a.js)", sourceModule: "b.js", sourceExport: "b", value: '"B"', isLive: true },
        ],
      },
      {
        descriptionHtml:
          '<code>b.js</code> reads <code>a</code> from its import. But <code>a.js</code> has not evaluated yet, so <code>a</code> is still in the temporal dead zone. The value is <code>undefined</code>.',
        activeLine: 9,
        doneLines: [1, 2, 6, 7, 8],
        consoleOutput: ["b.js sees a: undefined"],
        modules: [
          { id: "a", filename: "a.js", phase: "linked", exports: ["a"] },
          { id: "b", filename: "b.js", phase: "evaluating", exports: ["b"], highlight: "active" },
        ],
        edges: [
          { from: "a", to: "b", imports: ["b"], highlight: "resolved" },
          { from: "b", to: "a", imports: ["a"], highlight: "resolved" },
        ],
        bindings: [
          { name: "a (in b.js)", sourceModule: "a.js", sourceExport: "a", value: "undefined", isLive: true },
          { name: "b (in a.js)", sourceModule: "b.js", sourceExport: "b", value: '"B"', isLive: true },
        ],
      },
      {
        descriptionHtml:
          '<code>b.js</code> finishes evaluation. Control returns to <code>a.js</code>. Now <code>a = "A"</code> is assigned.',
        activeLine: 3,
        doneLines: [1, 2, 6, 7, 8, 9],
        consoleOutput: ["b.js sees a: undefined"],
        modules: [
          { id: "a", filename: "a.js", phase: "evaluating", exports: ["a"], highlight: "active" },
          { id: "b", filename: "b.js", phase: "evaluated", exports: ["b"] },
        ],
        edges: [
          { from: "a", to: "b", imports: ["b"], highlight: "resolved" },
          { from: "b", to: "a", imports: ["a"], highlight: "resolved" },
        ],
        bindings: [
          { name: "a (in b.js)", sourceModule: "a.js", sourceExport: "a", value: '"A"', isLive: true },
          { name: "b (in a.js)", sourceModule: "b.js", sourceExport: "b", value: '"B"', isLive: true },
        ],
      },
      {
        descriptionHtml:
          '<code>a.js</code> reads <code>b</code>. Since <code>b.js</code> has already evaluated, <code>b</code> is <code>"B"</code>. Logs <code>"a.js sees b: B"</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3, 6, 7, 8, 9],
        consoleOutput: ["b.js sees a: undefined", "a.js sees b: B"],
        modules: [
          { id: "a", filename: "a.js", phase: "evaluating", exports: ["a"], highlight: "active" },
          { id: "b", filename: "b.js", phase: "evaluated", exports: ["b"] },
        ],
        edges: [
          { from: "a", to: "b", imports: ["b"], highlight: "resolved" },
          { from: "b", to: "a", imports: ["a"], highlight: "resolved" },
        ],
        bindings: [
          { name: "a (in b.js)", sourceModule: "a.js", sourceExport: "a", value: '"A"', isLive: true },
          { name: "b (in a.js)", sourceModule: "b.js", sourceExport: "b", value: '"B"', isLive: true },
        ],
      },
      {
        descriptionHtml:
          'Circular dependencies work because the engine creates module records before evaluation. But bindings can be uninitialized if read before the exporter has finished evaluating. Avoid reading circular imports at the top level; instead, read them inside functions that run later.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 6, 7, 8, 9],
        consoleOutput: ["b.js sees a: undefined", "a.js sees b: B"],
        modules: [
          { id: "a", filename: "a.js", phase: "evaluated", exports: ["a"] },
          { id: "b", filename: "b.js", phase: "evaluated", exports: ["b"] },
        ],
        edges: [
          { from: "a", to: "b", imports: ["b"], highlight: "resolved" },
          { from: "b", to: "a", imports: ["a"], highlight: "resolved" },
        ],
        bindings: [
          { name: "a (in b.js)", sourceModule: "a.js", sourceExport: "a", value: '"A"', isLive: true },
          { name: "b (in a.js)", sourceModule: "b.js", sourceExport: "b", value: '"B"', isLive: true },
        ],
      },
    ],
  },
];
