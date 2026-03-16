import type { SourceLine } from "@/types/visualization";
import type { ClosureStep } from "./types";

export const CODE_LINES: SourceLine[] = [
  { num: 1, text: "function outer() {" },
  { num: 2, text: "  let count = 0;" },
  { num: 3, text: "  function inner() {" },
  { num: 4, text: "    count++;" },
  { num: 5, text: "    console.log(count);" },
  { num: 6, text: "  }" },
  { num: 7, text: "  return inner;" },
  { num: 8, text: "}" },
  { num: 9, text: "const fn = outer();" },
  { num: 10, text: "fn();" },
  { num: 11, text: "fn();" },
];

export const STEPS: ClosureStep[] = [
  {
    descriptionHtml:
      `The engine registers the <code>outer</code> function declaration. The function body is not executed yet.`,
    activeLine: 1,
    doneLines: [],
    stack: [],
    scope: [],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `<code>outer()</code> is called. A new execution context is pushed onto the <span class="hl-stack">Call Stack</span>.`,
    activeLine: 9,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
    stack: ["outer()"],
    scope: [{ name: "outer()", vars: { count: "undefined" } }],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `<code>let count = 0</code> declares a local variable in <code>outer</code>'s scope and initializes it to <code>0</code>.`,
    activeLine: 2,
    doneLines: [1],
    stack: ["outer()"],
    scope: [{ name: "outer()", vars: { count: "0" } }],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `The <code>inner</code> function is declared inside <code>outer</code>. It captures a reference to <code>outer</code>'s scope - this creates the <strong>closure</strong>.`,
    activeLine: 3,
    doneLines: [1, 2],
    stack: ["outer()"],
    scope: [{ name: "outer()", vars: { count: "0", inner: "f()" } }],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `<code>return inner</code> - <code>outer</code> returns the <code>inner</code> function. The execution context will be removed, but the scope is preserved because <code>inner</code> holds a reference to it.`,
    activeLine: 7,
    doneLines: [1, 2, 3, 4, 5, 6],
    stack: ["outer()"],
    scope: [{ name: "outer()", vars: { count: "0", inner: "f()" } }],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `<code>outer()</code> has returned and left the <span class="hl-stack">Call Stack</span>. But <code>count</code> survives inside the closure. <code>fn</code> now holds a reference to <code>inner</code>.`,
    activeLine: 9,
    doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
    stack: [],
    scope: [{ name: "Closure (outer)", vars: { count: "0" } }],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `<code>fn()</code> invokes <code>inner</code>. It accesses <code>count</code> from the closure and increments it from <code>0</code> to <code>1</code>.`,
    activeLine: 4,
    doneLines: [1, 2, 3, 9],
    stack: ["fn() → inner()"],
    scope: [{ name: "Closure (outer)", vars: { count: "1" } }],
    consoleOutput: [],
  },
  {
    descriptionHtml:
      `<code>console.log(count)</code> outputs <code>1</code>. The closure kept <code>count</code> alive even though <code>outer</code> finished executing.`,
    activeLine: 5,
    doneLines: [1, 2, 3, 4, 9],
    stack: ["fn() → inner()"],
    scope: [{ name: "Closure (outer)", vars: { count: "1" } }],
    consoleOutput: ["1"],
  },
  {
    descriptionHtml:
      `<code>fn()</code> is called again. <code>count</code> is still <code>1</code> from the previous call - the closure preserves state between calls. It increments to <code>2</code>.`,
    activeLine: 4,
    doneLines: [1, 2, 3, 5, 9, 10],
    stack: ["fn() → inner()"],
    scope: [{ name: "Closure (outer)", vars: { count: "2" } }],
    consoleOutput: ["1"],
  },
  {
    descriptionHtml:
      `<code>console.log(count)</code> outputs <code>2</code>. <strong>Key takeaway:</strong> closures let inner functions remember and modify variables from their outer scope, even after the outer function has returned.`,
    activeLine: 5,
    doneLines: [1, 2, 3, 4, 9, 10],
    stack: ["fn() → inner()"],
    scope: [{ name: "Closure (outer)", vars: { count: "2" } }],
    consoleOutput: ["1", "2"],
  },
];
