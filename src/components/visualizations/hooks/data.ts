import type { HooksExample } from "./types";

export const EXAMPLES: HooksExample[] = [
  /* ── Linked List (Mount + Re-render) ── */
  {
    id: "linked-list",
    title: "Hook Linked List",
    description:
      "On mount, hooks are created as a linked list. On re-render, React walks the list in order.",
    kind: "linked-list",
    codeLines: [
      { num: 1, text: "function Counter() {" },
      { num: 2, text: "  const [count, setCount] = useState(0);" },
      { num: 3, text: "  const [name, setName] = useState('React');" },
      { num: 4, text: "  useEffect(() => {" },
      { num: 5, text: "    document.title = `${name}: ${count}`;" },
      { num: 6, text: "  }, [count, name]);" },
      { num: 7, text: "  return <button onClick={() => setCount(count + 1)}>+</button>;" },
      { num: 8, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Mount begins. React calls <code>Counter()</code> for the first time. The hooks linked list is empty.",
        activeLine: 1,
        doneLines: [],
        hookNodes: [],
        fiberState: { fiberLabel: "Counter fiber", memoizedStatePointer: null, hookCount: 0, currentHookIndex: null },
      },
      {
        descriptionHtml:
          "First <code>useState(0)</code> call. React <span class=\"hl-api\">creates hook #0</span> and appends it to the list. Initial state: <code>0</code>.",
        activeLine: 2,
        doneLines: [1],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "0", status: "creating" },
        ],
        fiberState: { fiberLabel: "Counter fiber", memoizedStatePointer: 0, hookCount: 1, currentHookIndex: 0 },
      },
      {
        descriptionHtml:
          "Second <code>useState('React')</code> call. React creates hook #1 and links it after #0.",
        activeLine: 3,
        doneLines: [1, 2],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "0", status: "idle" },
          { index: 1, hookType: "useState", memoizedState: "'React'", status: "creating" },
        ],
        fiberState: { fiberLabel: "Counter fiber", memoizedStatePointer: 0, hookCount: 2, currentHookIndex: 1 },
      },
      {
        descriptionHtml:
          "<code>useEffect</code> call. React creates hook #2 with the effect callback and dependency array <code>[count, name]</code>.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "0", status: "idle" },
          { index: 1, hookType: "useState", memoizedState: "'React'", status: "idle" },
          { index: 2, hookType: "useEffect", memoizedState: "[0, 'React']", status: "creating" },
        ],
        fiberState: { fiberLabel: "Counter fiber", memoizedStatePointer: 0, hookCount: 3, currentHookIndex: 2 },
      },
      {
        descriptionHtml:
          "Mount complete. The fiber's <code>memoizedState</code> points to hook #0, which links to #1, which links to #2. Three hooks total.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "0", status: "mounted" },
          { index: 1, hookType: "useState", memoizedState: "'React'", status: "mounted" },
          { index: 2, hookType: "useEffect", memoizedState: "[0, 'React']", status: "mounted" },
        ],
        fiberState: { fiberLabel: "Counter fiber", memoizedStatePointer: 0, hookCount: 3 },
      },
      {
        descriptionHtml:
          "User clicks the button. <code>setCount(1)</code> triggers a re-render. React calls <code>Counter()</code> again and resets the hook cursor to #0.",
        activeLine: 1,
        doneLines: [],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "0", status: "idle" },
          { index: 1, hookType: "useState", memoizedState: "'React'", status: "idle" },
          { index: 2, hookType: "useEffect", memoizedState: "[0, 'React']", status: "idle" },
        ],
        fiberState: { fiberLabel: "Counter fiber", memoizedStatePointer: 0, hookCount: 3, currentHookIndex: null },
      },
      {
        descriptionHtml:
          "First <code>useState</code> on re-render. React <span class=\"hl-task\">reads hook #0</span> from the existing list. Returns updated state: <code>1</code>.",
        activeLine: 2,
        doneLines: [1],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "1", status: "reading" },
          { index: 1, hookType: "useState", memoizedState: "'React'", status: "idle" },
          { index: 2, hookType: "useEffect", memoizedState: "[0, 'React']", status: "idle" },
        ],
        fiberState: { fiberLabel: "Counter fiber", memoizedStatePointer: 0, hookCount: 3, currentHookIndex: 0 },
      },
      {
        descriptionHtml:
          "Second <code>useState</code> reads hook #1. State unchanged: <code>'React'</code>. Cursor advances.",
        activeLine: 3,
        doneLines: [1, 2],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "1", status: "idle" },
          { index: 1, hookType: "useState", memoizedState: "'React'", status: "reading" },
          { index: 2, hookType: "useEffect", memoizedState: "[0, 'React']", status: "idle" },
        ],
        fiberState: { fiberLabel: "Counter fiber", memoizedStatePointer: 0, hookCount: 3, currentHookIndex: 1 },
      },
      {
        descriptionHtml:
          "<code>useEffect</code> reads hook #2. Dependencies changed (<code>count</code> is now 1), so React schedules the effect to run after commit.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "1", status: "idle" },
          { index: 1, hookType: "useState", memoizedState: "'React'", status: "idle" },
          { index: 2, hookType: "useEffect", memoizedState: "[1, 'React']", status: "reading" },
        ],
        fiberState: { fiberLabel: "Counter fiber", memoizedStatePointer: 0, hookCount: 3, currentHookIndex: 2 },
      },
      {
        descriptionHtml:
          "Re-render complete. All three hooks were read in the same order as mount. The linked list structure stays consistent.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "1", status: "mounted" },
          { index: 1, hookType: "useState", memoizedState: "'React'", status: "mounted" },
          { index: 2, hookType: "useEffect", memoizedState: "[1, 'React']", status: "mounted" },
        ],
        fiberState: { fiberLabel: "Counter fiber", memoizedStatePointer: 0, hookCount: 3 },
      },
    ],
  },

  /* ── Order Violation ── */
  {
    id: "order-violation",
    title: "Order Violation",
    description:
      "Calling hooks conditionally breaks the linked list. React reads the wrong hook on re-render.",
    kind: "order-violation",
    codeLines: [
      { num: 1, text: "function Form({ showName }) {" },
      { num: 2, text: "  const [email, setEmail] = useState('');" },
      { num: 3, text: "  if (showName) {" },
      { num: 4, text: "    const [name, setName] = useState('');" },
      { num: 5, text: "  }" },
      { num: 6, text: "  const [submitted, setSubmitted] = useState(false);" },
      { num: 7, text: "  return <form>...</form>;" },
      { num: 8, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "First render with <code>showName = true</code>. React calls <code>Form()</code> and starts building the hook list.",
        activeLine: 1,
        doneLines: [],
        hookNodes: [],
        fiberState: { fiberLabel: "Form fiber", memoizedStatePointer: null, hookCount: 0, currentHookIndex: null },
      },
      {
        descriptionHtml:
          "Hook #0: <code>useState('')</code> for email. Created and appended to the list.",
        activeLine: 2,
        doneLines: [1],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "''", status: "creating" },
        ],
        fiberState: { fiberLabel: "Form fiber", memoizedStatePointer: 0, hookCount: 1, currentHookIndex: 0 },
      },
      {
        descriptionHtml:
          "<code>showName</code> is true, so the conditional runs. Hook #1: <code>useState('')</code> for name.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "''", status: "idle" },
          { index: 1, hookType: "useState", memoizedState: "''", status: "creating" },
        ],
        fiberState: { fiberLabel: "Form fiber", memoizedStatePointer: 0, hookCount: 2, currentHookIndex: 1 },
      },
      {
        descriptionHtml:
          "Hook #2: <code>useState(false)</code> for submitted. Three hooks created in order: email, name, submitted.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "''", status: "idle" },
          { index: 1, hookType: "useState", memoizedState: "''", status: "idle" },
          { index: 2, hookType: "useState", memoizedState: "false", status: "creating" },
        ],
        fiberState: { fiberLabel: "Form fiber", memoizedStatePointer: 0, hookCount: 3, currentHookIndex: 2 },
      },
      {
        descriptionHtml:
          "Mount complete with 3 hooks. Now <code>showName</code> changes to <code>false</code> and React re-renders.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "''", status: "mounted" },
          { index: 1, hookType: "useState", memoizedState: "''", status: "mounted" },
          { index: 2, hookType: "useState", memoizedState: "false", status: "mounted" },
        ],
        fiberState: { fiberLabel: "Form fiber", memoizedStatePointer: 0, hookCount: 3 },
      },
      {
        descriptionHtml:
          "Re-render begins. Hook cursor at #0. First <code>useState</code> reads hook #0 correctly: email state.",
        activeLine: 2,
        doneLines: [1],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "''", status: "reading" },
          { index: 1, hookType: "useState", memoizedState: "''", status: "idle" },
          { index: 2, hookType: "useState", memoizedState: "false", status: "idle" },
        ],
        fiberState: { fiberLabel: "Form fiber", memoizedStatePointer: 0, hookCount: 3, currentHookIndex: 0 },
      },
      {
        descriptionHtml:
          "<code>showName</code> is false. The conditional <span class=\"hl-api\">skips hook #1</span>. Cursor stays at position 1.",
        activeLine: 3,
        doneLines: [1, 2],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "''", status: "idle" },
          { index: 1, hookType: "useState", memoizedState: "''", status: "idle" },
          { index: 2, hookType: "useState", memoizedState: "false", status: "idle" },
        ],
        fiberState: { fiberLabel: "Form fiber", memoizedStatePointer: 0, hookCount: 3, currentHookIndex: 1 },
      },
      {
        descriptionHtml:
          "<code>useState(false)</code> for submitted now reads hook #1 (the <span class=\"hl-api\">name hook</span>). It gets <code>''</code> instead of <code>false</code>. <strong>Wrong state!</strong>",
        activeLine: 6,
        doneLines: [1, 2, 3, 5],
        hookNodes: [
          { index: 0, hookType: "useState", memoizedState: "''", status: "idle" },
          { index: 1, hookType: "useState", memoizedState: "''", status: "error" },
          { index: 2, hookType: "useState", memoizedState: "false", status: "idle" },
        ],
        fiberState: { fiberLabel: "Form fiber", memoizedStatePointer: 0, hookCount: 3, currentHookIndex: 1 },
        errorMessage: "Hook mismatch: expected useState(false) at #1 but found name state ''",
      },
    ],
  },
];
