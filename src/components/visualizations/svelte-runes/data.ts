import type { DomNode, SignalNode, SvelteRunesExample } from "./types";

/* ── Signal graph example ── */

const S = {
  count: (value: string): SignalNode => ({
    id: "count",
    name: "count",
    type: "source",
    status: "clean",
    value,
    deps: [],
  }),
  double: (
    status: SignalNode["status"],
    value: string,
    deps: string[] = ["count"],
  ): SignalNode => ({
    id: "double",
    name: "double",
    type: "derived",
    status,
    value,
    deps,
  }),
  tpl: (status: SignalNode["status"], deps: string[]): SignalNode => ({
    id: "tpl",
    name: "button text",
    type: "template",
    status,
    deps,
  }),
  fx: (status: SignalNode["status"], deps: string[]): SignalNode => ({
    id: "fx",
    name: "$effect",
    type: "effect",
    status,
    deps,
  }),
};

const btn = (state: DomNode["state"] = "unchanged"): DomNode => ({
  id: "button",
  label: "<button>",
  state,
});

const btnText = (
  text: string,
  state: DomNode["state"] = "unchanged",
): DomNode => ({
  id: "button-text",
  label: "#text",
  text,
  state,
  depth: 1,
});

/* ── Compiler example ── */

const C = {
  count: (value: string): SignalNode => ({
    id: "count",
    name: "count",
    type: "source",
    status: "clean",
    value,
    deps: [],
  }),
  tpl: (status: SignalNode["status"]): SignalNode => ({
    id: "tpl",
    name: "template_effect",
    type: "template",
    status,
    deps: ["count"],
  }),
};

const h1 = (state: DomNode["state"] = "unchanged"): DomNode => ({
  id: "h1",
  label: "<h1>",
  text: '"Counter"',
  state,
});

/* ── Deep state example ── */

const D = {
  todos: (): SignalNode => ({
    id: "todos",
    name: "todos",
    type: "source",
    status: "clean",
    value: "Proxy(Array)",
    deps: [],
  }),
  len: (value: string): SignalNode => ({
    id: "len",
    name: "todos.length",
    type: "source",
    status: "clean",
    value,
    deps: [],
  }),
  i0: (): SignalNode => ({
    id: "i0",
    name: "todos[0]",
    type: "source",
    status: "clean",
    value: "Proxy(Object)",
    deps: [],
  }),
  i0done: (value: string): SignalNode => ({
    id: "i0done",
    name: "todos[0].done",
    type: "source",
    status: "clean",
    value,
    deps: [],
  }),
  i1: (): SignalNode => ({
    id: "i1",
    name: "todos[1]",
    type: "source",
    status: "clean",
    value: "Proxy(Object)",
    deps: [],
  }),
  i1done: (value: string): SignalNode => ({
    id: "i1done",
    name: "todos[1].done",
    type: "source",
    status: "clean",
    value,
    deps: [],
  }),
  raw: (value: string, note = "no proxy"): SignalNode => ({
    id: "raw",
    name: "raw",
    type: "source",
    status: "clean",
    value,
    deps: [],
    note,
  }),
  each: (status: SignalNode["status"]): SignalNode => ({
    id: "each",
    name: "each block",
    type: "template",
    status,
    deps: ["todos", "todos.length"],
  }),
  li0: (status: SignalNode["status"]): SignalNode => ({
    id: "li0",
    name: "li #0 text",
    type: "template",
    status,
    deps: ["todos[0].done"],
  }),
  li1: (status: SignalNode["status"]): SignalNode => ({
    id: "li1",
    name: "li #1 text",
    type: "template",
    status,
    deps: ["todos[1].done"],
  }),
  p: (status: SignalNode["status"]): SignalNode => ({
    id: "p",
    name: "p text",
    type: "template",
    status,
    deps: ["raw"],
  }),
  fx: (status: SignalNode["status"], deps: string[]): SignalNode => ({
    id: "fx",
    name: "$effect",
    type: "effect",
    status,
    deps,
  }),
};

const li = (
  id: string,
  text: string,
  state: DomNode["state"] = "unchanged",
): DomNode => ({ id, label: "<li>", text, state });

const pRaw = (
  text: string,
  state: DomNode["state"] = "unchanged",
): DomNode => ({ id: "p", label: "<p>", text, state });

export const EXAMPLES: SvelteRunesExample[] = [
  {
    id: "signals",
    title: "Signal graph",
    description:
      "$state, $derived and $effect build a graph. A write pushes dirty flags, reads pull fresh values.",
    kind: "signals",
    codeLines: [
      { num: 1, text: "<script>" },
      { num: 2, text: "  let count = $state(0);" },
      { num: 3, text: "  let double = $derived(count * 2);" },
      { num: 4, text: "  $effect(() => {" },
      { num: 5, text: "    console.log('double is', double);" },
      { num: 6, text: "  });" },
      { num: 7, text: "</script>" },
      { num: 8, text: "<button onclick={() => count++}>" },
      { num: 9, text: "  {count} x 2 = {double}" },
      { num: 10, text: "</button>" },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>$state(0)</code> creates a <span class="hl-api">source signal</span>: an object holding the value 0, a version counter, and an empty list of reactions. The compiler rewrites every later read of <code>count</code> to <code>$.get(count)</code> and every write to <code>$.set(count, ...)</code>.',
        activeLine: 2,
        doneLines: [],
        signals: [S.count("0")],
        dom: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          '<code>$derived</code> registers a <span class="hl-micro">derived signal</span> but does not run <code>count * 2</code>. Deriveds are lazy: the expression runs on the first read, so until then the node has no value and no dependencies.',
        activeLine: 3,
        doneLines: [2],
        signals: [S.count("0"), S.double("unread", "not computed", [])],
        dom: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          '<code>$effect</code> registers an <span class="hl-task">effect</span> and schedules it for after the component mounts. The callback has not run yet, so the effect does not know what it depends on.',
        activeLine: 4,
        doneLines: [2, 3],
        signals: [
          S.count("0"),
          S.double("unread", "not computed", []),
          S.fx("scheduled", []),
        ],
        dom: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'The compiler turned the text on line 9 into a <span class="hl-task">template effect</span>. Mounting clones the button and runs the effect: <code>$.get(count)</code> returns 0 and records the template effect as a reaction of <code>count</code>.',
        activeLine: 9,
        doneLines: [2, 3, 4],
        signals: [
          S.count("0"),
          S.double("unread", "not computed", []),
          S.tpl("running", ["count"]),
          S.fx("scheduled", []),
        ],
        dom: [btn("added"), btnText('""', "added")],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'The same template effect reads <code>double</code>. The derived is unread, so it <span class="hl-micro">pulls</span> now: it runs <code>count * 2</code>, subscribes itself to <code>count</code>, caches 0 and becomes clean. The template effect subscribes to <code>double</code> and writes the text node.',
        activeLine: 9,
        doneLines: [2, 3, 4],
        signals: [
          S.count("0"),
          S.double("clean", "0"),
          S.tpl("clean", ["count", "double"]),
          S.fx("scheduled", []),
        ],
        dom: [btn(), btnText('"0 x 2 = 0"', "updated")],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'Effects run in a <span class="hl-micro">microtask</span> after the DOM is in place. Reading <code>double</code> inside the callback returns the cached 0 without recomputing and subscribes the effect to <code>double</code>.',
        activeLine: 5,
        doneLines: [2, 3, 4, 9],
        signals: [
          S.count("0"),
          S.double("clean", "0"),
          S.tpl("clean", ["count", "double"]),
          S.fx("running", ["double"]),
        ],
        dom: [btn(), btnText('"0 x 2 = 0"')],
        consoleOutput: ["double is 0"],
      },
      {
        descriptionHtml:
          'Click. <code>count++</code> compiles to <code>$.set(count, $.get(count) + 1)</code>. The write is the <span class="hl-stack">push</span> half of push-pull: it bumps the version, marks <code>double</code> and the template effect dirty, marks <code>$effect</code> maybe-dirty because it only depends on a derived, and queues a flush. Nothing recomputes yet.',
        activeLine: 8,
        doneLines: [2, 3, 4, 5, 6, 9],
        signals: [
          S.count("1"),
          S.double("dirty", "0 (stale)"),
          S.tpl("dirty", ["count", "double"]),
          S.fx("maybe-dirty", ["double"]),
        ],
        dom: [btn(), btnText('"0 x 2 = 0"')],
        consoleOutput: ["double is 0"],
      },
      {
        descriptionHtml:
          'Flush. Template effects run before user effects. This one re-reads <code>count</code> (1) and <span class="hl-micro">pulls</span> <code>double</code>: the derived is dirty, so it recomputes to 2 and bumps its own version. The effect then calls <code>$.set_text</code> on the one text node it owns.',
        activeLine: 9,
        doneLines: [2, 3, 4, 5, 6, 8],
        signals: [
          S.count("1"),
          S.double("clean", "2"),
          S.tpl("running", ["count", "double"]),
          S.fx("maybe-dirty", ["double"]),
        ],
        dom: [btn(), btnText('"1 x 2 = 2"', "updated")],
        consoleOutput: ["double is 0"],
      },
      {
        descriptionHtml:
          '<code>$effect</code> was only maybe-dirty, so the flush checks its dependency first. The version of <code>double</code> changed, so the effect is promoted to dirty and runs. Had <code>double</code> recomputed to an equal value, the effect would have been skipped.',
        activeLine: 5,
        doneLines: [2, 3, 4, 6, 8, 9],
        signals: [
          S.count("1"),
          S.double("clean", "2"),
          S.tpl("clean", ["count", "double"]),
          S.fx("running", ["double"]),
        ],
        dom: [btn(), btnText('"1 x 2 = 2"')],
        consoleOutput: ["double is 0", "double is 2"],
      },
      {
        descriptionHtml:
          "Settled. Every node is clean. No virtual tree was built and nothing was diffed: the write pushed dirty flags along recorded edges, and each reaction pulled fresh values on demand.",
        activeLine: null,
        doneLines: [2, 3, 4, 5, 6, 8, 9],
        signals: [
          S.count("1"),
          S.double("clean", "2"),
          S.tpl("clean", ["count", "double"]),
          S.fx("clean", ["double"]),
        ],
        dom: [btn(), btnText('"1 x 2 = 2"')],
        consoleOutput: ["double is 0", "double is 2"],
      },
    ],
  },
  {
    id: "compiler",
    title: "Compiled output",
    description:
      "The compiler resolves which DOM node depends on which signal at build time, so an update is one set_text call.",
    kind: "compiler",
    codeLines: [
      { num: 1, text: "<script>" },
      { num: 2, text: "  let count = $state(0);" },
      { num: 3, text: "</script>" },
      { num: 4, text: "<h1>Counter</h1>" },
      { num: 5, text: "<button onclick={() => count++}>" },
      { num: 6, text: "  clicks: {count}" },
      { num: 7, text: "</button>" },
    ],
    compiledLines: [
      { num: 1, text: "import * as $ from 'svelte/internal/client';" },
      { num: 2, text: "var root = $.template('<h1>Counter</h1> <button> </button>');" },
      { num: 3, text: "export default function App($$anchor) {" },
      { num: 4, text: "  let count = $.state(0);" },
      { num: 5, text: "  var fragment = root();" },
      { num: 6, text: "  var button = $.sibling($.first_child(fragment), 2);" },
      { num: 7, text: "  var text = $.child(button);" },
      { num: 8, text: "  button.__click = () => $.update(count);" },
      { num: 9, text: "  $.template_effect(() => $.set_text(text, `clicks: ${$.get(count)}`));" },
      { num: 10, text: "  $.append($$anchor, fragment);" },
      { num: 11, text: "}" },
      { num: 12, text: "$.delegate(['click']);" },
    ],
    steps: [
      {
        descriptionHtml:
          'The compiler rewrites <code>$state(0)</code> to <code>$.state(0)</code>, which returns a <span class="hl-api">source signal</span> object. <code>count</code> is no longer a plain number, which is why every later read becomes <code>$.get(count)</code>.',
        activeLine: 2,
        doneLines: [],
        compiledActiveLine: 4,
        compiledDoneLines: [1],
        signals: [C.count("0")],
        dom: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'All of the markup becomes one string passed to <code>$.template</code>. The structure is fixed at build time, so Svelte can clone it as real DOM later. The space inside <code>&lt;button&gt;</code> is a placeholder text node for <code>{count}</code>.',
        activeLine: 4,
        doneLines: [2],
        compiledActiveLine: 2,
        compiledDoneLines: [1, 4],
        signals: [C.count("0")],
        dom: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          '<code>root()</code> clones the template with <code>cloneNode(true)</code>. This produces <span class="hl-api">real DOM nodes</span> immediately, not a description of DOM to diff later.',
        activeLine: 5,
        doneLines: [2, 4],
        compiledActiveLine: 5,
        compiledDoneLines: [1, 2, 4],
        signals: [C.count("0")],
        dom: [h1("added"), btn("added"), btnText('" "', "added")],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          '<code>$.sibling</code> and <code>$.child</code> walk to the text node once and keep a reference. The compiler knew at build time that only this node depends on <code>count</code>, so there is nothing to search for on update.',
        activeLine: 6,
        doneLines: [2, 4, 5],
        compiledActiveLine: 7,
        compiledDoneLines: [1, 2, 4, 5, 6],
        signals: [C.count("0")],
        dom: [h1(), btn(), btnText('" "', "active")],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          '<code>onclick={() =&gt; count++}</code> becomes a property assignment, <code>button.__click</code>. <code>$.delegate([\'click\'])</code> on the last line installs one root listener that walks up from the event target looking for <code>__click</code>, so no listener is attached per element.',
        activeLine: 5,
        doneLines: [2, 4, 6],
        compiledActiveLine: 8,
        compiledDoneLines: [1, 2, 4, 5, 6, 7],
        signals: [C.count("0")],
        dom: [h1(), btn("active"), btnText('" "')],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          '<code>$.template_effect</code> wraps the <code>{count}</code> expression and runs it right away. <code>$.get(count)</code> returns 0 and records this <span class="hl-task">template effect</span> as a reaction of <code>count</code>. <code>$.set_text</code> writes <code>text.nodeValue</code>.',
        activeLine: 6,
        doneLines: [2, 4, 5],
        compiledActiveLine: 9,
        compiledDoneLines: [1, 2, 4, 5, 6, 7, 8],
        signals: [C.count("0"), C.tpl("running")],
        dom: [h1(), btn(), btnText('"clicks: 0"', "updated")],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          "<code>$.append</code> inserts the fragment at the mount point. Setup is done: one signal, one template effect, and one recorded edge between them.",
        activeLine: 7,
        doneLines: [2, 4, 5, 6],
        compiledActiveLine: 10,
        compiledDoneLines: [1, 2, 4, 5, 6, 7, 8, 9],
        signals: [C.count("0"), C.tpl("clean")],
        dom: [h1(), btn(), btnText('"clicks: 0"')],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'Click. The delegated listener finds <code>__click</code> and calls <code>$.update(count)</code>, shorthand for <code>$.set(count, $.get(count) + 1)</code>. The write bumps the version, marks the template effect dirty and queues a <span class="hl-micro">microtask</span> flush. The DOM is untouched so far.',
        activeLine: 5,
        doneLines: [2, 4, 6, 7],
        compiledActiveLine: 8,
        compiledDoneLines: [1, 2, 4, 5, 6, 7, 9, 10, 12],
        signals: [C.count("1"), C.tpl("dirty")],
        dom: [h1(), btn(), btnText('"clicks: 0"')],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          "Flush. The template effect re-runs its closure: <code>$.get(count)</code> now returns 1 and <code>$.set_text</code> assigns the new string to the same text node. One property write on one node.",
        activeLine: 6,
        doneLines: [2, 4, 5, 7],
        compiledActiveLine: 9,
        compiledDoneLines: [1, 2, 4, 5, 6, 7, 8, 10, 12],
        signals: [C.count("1"), C.tpl("running")],
        dom: [h1(), btn(), btnText('"clicks: 1"', "updated")],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          "Settled. The <code>&lt;h1&gt;</code> and the <code>&lt;button&gt;</code> were never revisited because no effect reads them. There was no virtual tree to build and no diff to walk: the compiler resolved which node depends on which signal before the code ever ran.",
        activeLine: null,
        doneLines: [2, 4, 5, 6, 7],
        compiledActiveLine: null,
        compiledDoneLines: [1, 2, 4, 5, 6, 7, 8, 9, 10, 12],
        signals: [C.count("1"), C.tpl("clean")],
        dom: [h1(), btn(), btnText('"clicks: 1"')],
        consoleOutput: [],
      },
    ],
  },
  {
    id: "deep",
    title: "Deep state and proxies",
    description:
      "$state proxies objects and arrays so nested writes are tracked. $state.raw opts out and only reacts to reassignment.",
    kind: "deep",
    codeLines: [
      { num: 1, text: "<script>" },
      { num: 2, text: "  let todos = $state([{ text: 'write', done: false }]);" },
      { num: 3, text: "  let raw = $state.raw({ n: 0 });" },
      { num: 4, text: "  $effect(() => {" },
      { num: 5, text: "    console.log('open:', todos.filter(t => !t.done).length);" },
      { num: 6, text: "  });" },
      { num: 7, text: "  function add() { todos.push({ text: 'ship', done: false }); }" },
      { num: 8, text: "  function toggle() { todos[0].done = true; }" },
      { num: 9, text: "  function bump() { raw.n = 1; }" },
      { num: 10, text: "  function replace() { raw = { n: raw.n }; }" },
      { num: 11, text: "</script>" },
      { num: 12, text: "{#each todos as todo}" },
      { num: 13, text: "  <li>{todo.text} {todo.done ? 'done' : 'open'}</li>" },
      { num: 14, text: "{/each}" },
      { num: 15, text: "<p>raw: {raw.n}</p>" },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>$state</code> receives an array, so it wraps it in a <span class="hl-api">Proxy</span> and stores the proxy in the <code>todos</code> source. No per-property signals exist yet; the proxy creates one for each property the first time something reads it.',
        activeLine: 2,
        doneLines: [],
        signals: [D.todos()],
        dom: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          "<code>$state.raw</code> creates a source that holds the object as-is, with no proxy. Reassigning <code>raw</code> is tracked; writing <code>raw.n</code> is not, because there is no trap to observe it.",
        activeLine: 3,
        doneLines: [2],
        signals: [D.todos(), D.raw("{ n: 0 }")],
        dom: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          '<code>$effect</code> is registered and <span class="hl-task">scheduled</span> for after mount. Its dependencies will be whatever it reads when it runs.',
        activeLine: 4,
        doneLines: [2, 3],
        signals: [D.todos(), D.raw("{ n: 0 }"), D.fx("scheduled", [])],
        dom: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'Mount. The each block is a <span class="hl-task">template effect</span>. It reads <code>todos</code>, then <code>length</code> through the proxy get trap, which creates the <code>todos.length</code> source on demand and subscribes the block to it.',
        activeLine: 12,
        doneLines: [2, 3, 4],
        signals: [
          D.todos(),
          D.len("1"),
          D.raw("{ n: 0 }"),
          D.each("running"),
          D.fx("scheduled", []),
        ],
        dom: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'The block reads <code>todos[0]</code>, which creates an index source and wraps the nested object in its own proxy. The <code>&lt;li&gt;</code> template effect reads <code>done</code>, creating <code>todos[0].done</code> and subscribing to it.',
        activeLine: 13,
        doneLines: [2, 3, 4, 12],
        signals: [
          D.todos(),
          D.len("1"),
          D.i0(),
          D.i0done("false"),
          D.raw("{ n: 0 }"),
          D.each("clean"),
          D.li0("running"),
          D.fx("scheduled", []),
        ],
        dom: [li("li0", '"write open"', "added")],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'The <code>&lt;p&gt;</code> effect reads <code>raw</code>, so it subscribes to that source. The following <code>.n</code> read is a plain property access on a plain object, and the graph does not see it.',
        activeLine: 15,
        doneLines: [2, 3, 4, 12, 13, 14],
        signals: [
          D.todos(),
          D.len("1"),
          D.i0(),
          D.i0done("false"),
          D.raw("{ n: 0 }"),
          D.each("clean"),
          D.li0("clean"),
          D.p("running"),
          D.fx("scheduled", []),
        ],
        dom: [li("li0", '"write open"'), pRaw('"raw: 0"', "added")],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'The effect runs in a <span class="hl-micro">microtask</span> after the DOM is ready. <code>filter</code> reads <code>length</code> and each item\'s <code>done</code>, so the effect subscribes to every source it touched.',
        activeLine: 5,
        doneLines: [2, 3, 4, 12, 13, 14, 15],
        signals: [
          D.todos(),
          D.len("1"),
          D.i0(),
          D.i0done("false"),
          D.raw("{ n: 0 }"),
          D.each("clean"),
          D.li0("clean"),
          D.p("clean"),
          D.fx("running", ["todos.length", "todos[0].done"]),
        ],
        dom: [li("li0", '"write open"'), pRaw('"raw: 0"')],
        consoleOutput: ["open: 1"],
      },
      {
        descriptionHtml:
          '<code>push</code> goes through the proxy\'s set trap twice: it writes index 1, creating a <code>todos[1]</code> source, then writes <code>length</code> to 2. The reactions of <code>length</code>, the each block and <code>$effect</code>, are marked <span class="hl-stack">dirty</span> and a flush is queued. <code>li #0</code> is untouched.',
        activeLine: 7,
        doneLines: [2, 3, 4, 5, 6, 12, 13, 14, 15],
        signals: [
          D.todos(),
          D.len("2"),
          D.i0(),
          D.i0done("false"),
          D.i1(),
          D.raw("{ n: 0 }"),
          D.each("dirty"),
          D.li0("clean"),
          D.p("clean"),
          D.fx("dirty", ["todos.length", "todos[0].done"]),
        ],
        dom: [li("li0", '"write open"'), pRaw('"raw: 0"')],
        consoleOutput: ["open: 1"],
      },
      {
        descriptionHtml:
          "Flush. The each block sees length 2 and mounts one more <code>&lt;li&gt;</code> with its own template effect, which reads and creates <code>todos[1].done</code>. The first <code>&lt;li&gt;</code> keeps its DOM nodes.",
        activeLine: 13,
        doneLines: [2, 3, 4, 5, 6, 7, 12, 14, 15],
        signals: [
          D.todos(),
          D.len("2"),
          D.i0(),
          D.i0done("false"),
          D.i1(),
          D.i1done("false"),
          D.raw("{ n: 0 }"),
          D.each("running"),
          D.li0("clean"),
          D.li1("clean"),
          D.p("clean"),
          D.fx("dirty", ["todos.length", "todos[0].done"]),
        ],
        dom: [
          li("li0", '"write open"'),
          li("li1", '"ship open"', "added"),
          pRaw('"raw: 0"'),
        ],
        consoleOutput: ["open: 1"],
      },
      {
        descriptionHtml:
          "The effect re-runs and now also reads <code>todos[1].done</code>, so its dependency list grows. Dependencies are collected fresh on every run, never declared up front.",
        activeLine: 5,
        doneLines: [2, 3, 4, 7, 12, 13, 14, 15],
        signals: [
          D.todos(),
          D.len("2"),
          D.i0(),
          D.i0done("false"),
          D.i1(),
          D.i1done("false"),
          D.raw("{ n: 0 }"),
          D.each("clean"),
          D.li0("clean"),
          D.li1("clean"),
          D.p("clean"),
          D.fx("running", ["todos.length", "todos[0].done", "todos[1].done"]),
        ],
        dom: [li("li0", '"write open"'), li("li1", '"ship open"'), pRaw('"raw: 0"')],
        consoleOutput: ["open: 1", "open: 2"],
      },
      {
        descriptionHtml:
          '<code>todos[0].done = true</code> hits the nested proxy\'s set trap and writes the <code>todos[0].done</code> source. Only its reactions, <code>li #0</code> and <code>$effect</code>, are marked <span class="hl-stack">dirty</span>. The each block and <code>li #1</code> depend on other sources and stay clean.',
        activeLine: 8,
        doneLines: [2, 3, 4, 5, 6, 7, 12, 13, 14, 15],
        signals: [
          D.todos(),
          D.len("2"),
          D.i0(),
          D.i0done("true"),
          D.i1(),
          D.i1done("false"),
          D.raw("{ n: 0 }"),
          D.each("clean"),
          D.li0("dirty"),
          D.li1("clean"),
          D.p("clean"),
          D.fx("dirty", ["todos.length", "todos[0].done", "todos[1].done"]),
        ],
        dom: [li("li0", '"write open"'), li("li1", '"ship open"'), pRaw('"raw: 0"')],
        consoleOutput: ["open: 1", "open: 2"],
      },
      {
        descriptionHtml:
          "Flush. The <code>li #0</code> template effect re-evaluates its expression and calls <code>$.set_text</code> on its own text node. No list diff ran; the compiler tied this node to <code>todos[0].done</code> when it created it.",
        activeLine: 13,
        doneLines: [2, 3, 4, 5, 6, 7, 8, 12, 14, 15],
        signals: [
          D.todos(),
          D.len("2"),
          D.i0(),
          D.i0done("true"),
          D.i1(),
          D.i1done("false"),
          D.raw("{ n: 0 }"),
          D.each("clean"),
          D.li0("running"),
          D.li1("clean"),
          D.p("clean"),
          D.fx("dirty", ["todos.length", "todos[0].done", "todos[1].done"]),
        ],
        dom: [li("li0", '"write done"', "updated"), li("li1", '"ship open"'), pRaw('"raw: 0"')],
        consoleOutput: ["open: 1", "open: 2"],
      },
      {
        descriptionHtml:
          "The effect runs after the DOM update and logs the new count. Both consumers of <code>todos[0].done</code> ran exactly once for a single nested write.",
        activeLine: 5,
        doneLines: [2, 3, 4, 7, 8, 12, 13, 14, 15],
        signals: [
          D.todos(),
          D.len("2"),
          D.i0(),
          D.i0done("true"),
          D.i1(),
          D.i1done("false"),
          D.raw("{ n: 0 }"),
          D.each("clean"),
          D.li0("clean"),
          D.li1("clean"),
          D.p("clean"),
          D.fx("running", ["todos.length", "todos[0].done", "todos[1].done"]),
        ],
        dom: [li("li0", '"write done"'), li("li1", '"ship open"'), pRaw('"raw: 0"')],
        consoleOutput: ["open: 1", "open: 2", "open: 1"],
      },
      {
        descriptionHtml:
          "<code>raw.n = 1</code> is an ordinary property write on an ordinary object. No trap runs, no source is written, nothing is scheduled, and the <code>&lt;p&gt;</code> still shows 0. This is the trade: <code>$state.raw</code> skips proxy overhead for large or immutable data at the cost of tracking only reassignment.",
        activeLine: 9,
        doneLines: [2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15],
        signals: [
          D.todos(),
          D.len("2"),
          D.i0(),
          D.i0done("true"),
          D.i1(),
          D.i1done("false"),
          D.raw("{ n: 1 }", "write not tracked"),
          D.each("clean"),
          D.li0("clean"),
          D.li1("clean"),
          D.p("clean"),
          D.fx("clean", ["todos.length", "todos[0].done", "todos[1].done"]),
        ],
        dom: [li("li0", '"write done"'), li("li1", '"ship open"'), pRaw('"raw: 0"')],
        consoleOutput: ["open: 1", "open: 2", "open: 1"],
      },
      {
        descriptionHtml:
          "<code>raw = { n: raw.n }</code> is a reassignment, so the compiler emitted <code>$.set(raw, ...)</code>. That writes the source, marks the <code>&lt;p&gt;</code> effect dirty, and the flush sets the text to 1.",
        activeLine: 10,
        doneLines: [2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15],
        signals: [
          D.todos(),
          D.len("2"),
          D.i0(),
          D.i0done("true"),
          D.i1(),
          D.i1done("false"),
          D.raw("{ n: 1 }", "reassigned"),
          D.each("clean"),
          D.li0("clean"),
          D.li1("clean"),
          D.p("running"),
          D.fx("clean", ["todos.length", "todos[0].done", "todos[1].done"]),
        ],
        dom: [li("li0", '"write done"'), li("li1", '"ship open"'), pRaw('"raw: 1"', "updated")],
        consoleOutput: ["open: 1", "open: 2", "open: 1"],
      },
    ],
  },
];
