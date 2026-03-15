import type { RenderCycleExample } from "./types";

export const EXAMPLES: RenderCycleExample[] = [
  /* ── Two Phases ── */
  {
    id: "two-phases",
    title: "Render vs Commit",
    description:
      "A state update triggers the render phase (build WIP tree), then the commit phase (apply DOM changes and run effects).",
    kind: "two-phases",
    codeLines: [
      { num: 1, text: "function Counter() {" },
      { num: 2, text: "  const [count, setCount] = useState(0);" },
      { num: 3, text: "  useLayoutEffect(() => {" },
      { num: 4, text: "    console.log('layout effect:', count);" },
      { num: 5, text: "  }, [count]);" },
      { num: 6, text: "  useEffect(() => {" },
      { num: 7, text: "    console.log('effect:', count);" },
      { num: 8, text: "  }, [count]);" },
      { num: 9, text: "  return <p>{count}</p>;" },
      { num: 10, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Component is idle. User clicks a button that calls <code>setCount(1)</code>. React schedules a re-render.",
        activeLine: 2,
        doneLines: [1],
        phaseInfo: { phase: "idle", tags: [] },
        currentTree: {
          id: "counter",
          label: "<Counter>",
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"0"' }] },
          ],
        },
        wipTree: null,
        effects: [],
      },
      {
        descriptionHtml:
          "<span class=\"hl-api\">Render phase</span> begins. React calls <code>Counter()</code> to produce new elements. This phase is <strong>pure</strong> and can be interrupted.",
        activeLine: 1,
        doneLines: [],
        phaseInfo: { phase: "render", tags: ["Pure", "No side effects", "Interruptible"] },
        currentTree: {
          id: "counter",
          label: "<Counter>",
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"0"' }] },
          ],
        },
        wipTree: {
          id: "counter",
          label: "<Counter>",
          highlight: "active",
          children: [],
        },
        effects: [],
      },
      {
        descriptionHtml:
          "React processes hooks (<code>useState</code> returns <code>1</code>), records effects, and reconciles children.",
        activeLine: 2,
        doneLines: [1],
        phaseInfo: { phase: "render", tags: ["Pure", "No side effects", "Interruptible"] },
        currentTree: {
          id: "counter",
          label: "<Counter>",
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"0"' }] },
          ],
        },
        wipTree: {
          id: "counter",
          label: "<Counter>",
          highlight: "active",
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"1"' }] },
          ],
        },
        effects: [
          { type: "useLayoutEffect", label: "log layout effect", status: "pending" },
          { type: "useEffect", label: "log effect", status: "pending" },
        ],
      },
      {
        descriptionHtml:
          "Render phase complete. The <span class=\"hl-task\">work-in-progress tree</span> is built. React is ready to commit.",
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        phaseInfo: { phase: "render", tags: ["Pure", "No side effects", "Interruptible"] },
        currentTree: {
          id: "counter",
          label: "<Counter>",
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"0"' }] },
          ],
        },
        wipTree: {
          id: "counter",
          label: "<Counter>",
          highlight: "updated",
          children: [
            { id: "p", label: "<p>", highlight: "updated", children: [{ id: "text", label: '"1"', highlight: "updated" }] },
          ],
        },
        effects: [
          { type: "useLayoutEffect", label: "log layout effect", status: "pending" },
          { type: "useEffect", label: "log effect", status: "pending" },
        ],
      },
      {
        descriptionHtml:
          "<span class=\"hl-api\">Commit phase</span> begins. React applies <span class=\"hl-stack\">DOM mutations</span> synchronously. The text node changes from \"0\" to \"1\".",
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        phaseInfo: { phase: "commit", tags: ["Synchronous", "DOM mutations", "Cannot be interrupted"] },
        currentTree: {
          id: "counter",
          label: "<Counter>",
          highlight: "updated",
          children: [
            { id: "p", label: "<p>", highlight: "updated", children: [{ id: "text", label: '"1"', highlight: "updated" }] },
          ],
        },
        wipTree: null,
        effects: [
          { type: "DOM mutation", label: "text: \"0\" -> \"1\"", status: "running" },
          { type: "useLayoutEffect", label: "log layout effect", status: "pending" },
          { type: "useEffect", label: "log effect", status: "pending" },
        ],
      },
      {
        descriptionHtml:
          "DOM updated. <code>useLayoutEffect</code> runs <strong>synchronously before paint</strong>. The browser has not painted yet.",
        activeLine: 3,
        doneLines: [1, 2, 9, 10],
        phaseInfo: { phase: "commit", tags: ["Synchronous", "Before paint"] },
        currentTree: {
          id: "counter",
          label: "<Counter>",
          highlight: "updated",
          children: [
            { id: "p", label: "<p>", highlight: "updated", children: [{ id: "text", label: '"1"', highlight: "updated" }] },
          ],
        },
        wipTree: null,
        effects: [
          { type: "DOM mutation", label: "text: \"0\" -> \"1\"", status: "done" },
          { type: "useLayoutEffect", label: "log layout effect", status: "running" },
          { type: "useEffect", label: "log effect", status: "pending" },
        ],
      },
      {
        descriptionHtml:
          "Layout effects done. The <span class=\"hl-loop\">browser paints</span> the updated DOM to the screen.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 9, 10],
        phaseInfo: { phase: "commit", tags: ["Browser paint"] },
        currentTree: {
          id: "counter",
          label: "<Counter>",
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"1"' }] },
          ],
        },
        wipTree: null,
        effects: [
          { type: "DOM mutation", label: "text: \"0\" -> \"1\"", status: "done" },
          { type: "useLayoutEffect", label: "log layout effect", status: "done" },
          { type: "useEffect", label: "log effect", status: "pending" },
        ],
      },
      {
        descriptionHtml:
          "<code>useEffect</code> runs <strong>asynchronously after paint</strong>. This is why it does not block visual updates.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5, 9, 10],
        phaseInfo: { phase: "commit", tags: ["After paint", "Asynchronous"] },
        currentTree: {
          id: "counter",
          label: "<Counter>",
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"1"' }] },
          ],
        },
        wipTree: null,
        effects: [
          { type: "DOM mutation", label: "text: \"0\" -> \"1\"", status: "done" },
          { type: "useLayoutEffect", label: "log layout effect", status: "done" },
          { type: "useEffect", label: "log effect", status: "running" },
        ],
      },
      {
        descriptionHtml:
          "All effects complete. The cycle returns to <span class=\"hl-api\">idle</span>. Order: render, DOM mutation, useLayoutEffect, paint, useEffect.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        phaseInfo: { phase: "idle", tags: [] },
        currentTree: {
          id: "counter",
          label: "<Counter>",
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"1"' }] },
          ],
        },
        wipTree: null,
        effects: [
          { type: "DOM mutation", label: "text: \"0\" -> \"1\"", status: "done" },
          { type: "useLayoutEffect", label: "log layout effect", status: "done" },
          { type: "useEffect", label: "log effect", status: "done" },
        ],
      },
    ],
  },

  /* ── Batched Updates ── */
  {
    id: "batched-updates",
    title: "Batched Updates",
    description:
      "Multiple setState calls in the same event handler are batched into a single render + commit cycle.",
    kind: "batched-updates",
    codeLines: [
      { num: 1, text: "function Form() {" },
      { num: 2, text: "  const [name, setName] = useState('');" },
      { num: 3, text: "  const [age, setAge] = useState(0);" },
      { num: 4, text: "  function handleSubmit() {" },
      { num: 5, text: "    setName('Alice');" },
      { num: 6, text: "    setAge(30);" },
      { num: 7, text: "    // Only ONE re-render happens" },
      { num: 8, text: "  }" },
      { num: 9, text: "  return <div>{name}, {age}</div>;" },
      { num: 10, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Initial state: <code>name = ''</code>, <code>age = 0</code>. User triggers <code>handleSubmit()</code>.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        phaseInfo: { phase: "idle", tags: [] },
        currentTree: {
          id: "form",
          label: "<Form>",
          children: [
            { id: "div", label: "<div>", children: [{ id: "text", label: "', 0'" }] },
          ],
        },
        wipTree: null,
        effects: [],
      },
      {
        descriptionHtml:
          "<code>setName('Alice')</code> is called. React <span class=\"hl-task\">queues</span> the update but does not re-render yet.",
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        phaseInfo: { phase: "idle", tags: ["Update queued: name"] },
        currentTree: {
          id: "form",
          label: "<Form>",
          children: [
            { id: "div", label: "<div>", children: [{ id: "text", label: "', 0'" }] },
          ],
        },
        wipTree: null,
        effects: [],
      },
      {
        descriptionHtml:
          "<code>setAge(30)</code> is called. React queues this update too. Both updates are <span class=\"hl-api\">batched</span>.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        phaseInfo: { phase: "idle", tags: ["Update queued: name", "Update queued: age"] },
        currentTree: {
          id: "form",
          label: "<Form>",
          children: [
            { id: "div", label: "<div>", children: [{ id: "text", label: "', 0'" }] },
          ],
        },
        wipTree: null,
        effects: [],
      },
      {
        descriptionHtml:
          "Event handler finishes. React processes <strong>both queued updates</strong> in a single render phase.",
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        phaseInfo: { phase: "render", tags: ["Batched: 2 updates", "Single render pass"] },
        currentTree: {
          id: "form",
          label: "<Form>",
          children: [
            { id: "div", label: "<div>", children: [{ id: "text", label: "', 0'" }] },
          ],
        },
        wipTree: {
          id: "form",
          label: "<Form>",
          highlight: "active",
          children: [],
        },
        effects: [],
      },
      {
        descriptionHtml:
          "React calls <code>Form()</code> once. <code>useState</code> returns <code>'Alice'</code> and <code>30</code>. Both updates applied.",
        activeLine: 1,
        doneLines: [],
        phaseInfo: { phase: "render", tags: ["Batched: 2 updates", "Single render pass"] },
        currentTree: {
          id: "form",
          label: "<Form>",
          children: [
            { id: "div", label: "<div>", children: [{ id: "text", label: "', 0'" }] },
          ],
        },
        wipTree: {
          id: "form",
          label: "<Form>",
          highlight: "active",
          children: [
            { id: "div", label: "<div>", children: [{ id: "text", label: "'Alice, 30'" }] },
          ],
        },
        effects: [],
      },
      {
        descriptionHtml:
          "Render phase complete. WIP tree shows the final state. Only <strong>one render</strong> for two state changes.",
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        phaseInfo: { phase: "render", tags: ["1 render for 2 updates"] },
        currentTree: {
          id: "form",
          label: "<Form>",
          children: [
            { id: "div", label: "<div>", children: [{ id: "text", label: "', 0'" }] },
          ],
        },
        wipTree: {
          id: "form",
          label: "<Form>",
          highlight: "updated",
          children: [
            { id: "div", label: "<div>", highlight: "updated", children: [{ id: "text", label: "'Alice, 30'", highlight: "updated" }] },
          ],
        },
        effects: [],
      },
      {
        descriptionHtml:
          "<span class=\"hl-api\">Commit phase</span>. React applies the DOM mutation: text changes from <code>', 0'</code> to <code>'Alice, 30'</code>.",
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        phaseInfo: { phase: "commit", tags: ["Synchronous", "DOM mutations"] },
        currentTree: {
          id: "form",
          label: "<Form>",
          highlight: "updated",
          children: [
            { id: "div", label: "<div>", highlight: "updated", children: [{ id: "text", label: "'Alice, 30'", highlight: "updated" }] },
          ],
        },
        wipTree: null,
        effects: [
          { type: "DOM mutation", label: "text: \", 0\" -> \"Alice, 30\"", status: "running" },
        ],
      },
      {
        descriptionHtml:
          "Commit complete. Back to idle. Two <code>setState</code> calls resulted in exactly one render and one commit.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        phaseInfo: { phase: "idle", tags: [] },
        currentTree: {
          id: "form",
          label: "<Form>",
          children: [
            { id: "div", label: "<div>", children: [{ id: "text", label: "'Alice, 30'" }] },
          ],
        },
        wipTree: null,
        effects: [
          { type: "DOM mutation", label: "text: \", 0\" -> \"Alice, 30\"", status: "done" },
        ],
      },
    ],
  },
];
