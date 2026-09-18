import type {
  EventLoopSnapshot,
  HookSnapshot,
  QueuedUpdate,
  RenderLogEntry,
  StateBatchingExample,
} from "./types";

/* ── small builders so each step stays a readable full snapshot ── */

const idle: EventLoopSnapshot = {
  running: null,
  runningKind: "idle",
  pending: [],
};

const clickTask = (pending: EventLoopSnapshot["pending"] = []): EventLoopSnapshot => ({
  running: "click event: handleClick()",
  runningKind: "task",
  pending,
});

const reactFlush = (
  label: string,
  pending: EventLoopSnapshot["pending"] = [],
): EventLoopSnapshot => ({
  running: label,
  runningKind: "react",
  pending,
});

const hook = (
  name: string,
  current: string,
  pending: string | null = null,
): HookSnapshot => ({ name, current, pending });

const value = (
  id: string,
  hookName: string,
  call: string,
  payload: string,
  status: QueuedUpdate["status"] = "queued",
  result?: string,
): QueuedUpdate => ({
  id,
  hook: hookName,
  call,
  payload,
  payloadKind: "value",
  status,
  result,
});

const updater = (
  id: string,
  hookName: string,
  call: string,
  payload: string,
  status: QueuedUpdate["status"] = "queued",
  result?: string,
): QueuedUpdate => ({
  id,
  hook: hookName,
  call,
  payload,
  payloadKind: "updater",
  status,
  result,
});

const render = (id: string, label: string, detail: string): RenderLogEntry => ({
  id,
  kind: "render",
  label,
  detail,
});

const commit = (id: string, label: string, detail: string): RenderLogEntry => ({
  id,
  kind: "commit",
  label,
  detail,
});

const legacy = (id: string, label: string, detail: string): RenderLogEntry => ({
  id,
  kind: "legacy",
  label,
  detail,
});

const note = (id: string, label: string, detail: string): RenderLogEntry => ({
  id,
  kind: "note",
  label,
  detail,
});

const MOUNT_LOG: RenderLogEntry[] = [
  render("r1", "Render #1", "mount, count = 0"),
  commit("c1", "Commit #1", "DOM shows 0"),
];

/* ── Example 1: three setState calls, one render ── */

const BATCH_QUEUE_QUEUED = (n: number): QueuedUpdate[] =>
  [1, 2, 3].slice(0, n).map((i) =>
    value(`b${i}`, "count", "setCount(count + 1)", "1"),
  );

const BATCH_QUEUE_APPLIED: QueuedUpdate[] = [1, 2, 3].map((i) =>
  value(`b${i}`, "count", "setCount(count + 1)", "1", "applied", "-> 1"),
);

const batchExample: StateBatchingExample = {
  id: "batch",
  title: "Three setState calls, one render",
  description:
    "Three setCount(count + 1) calls in one click handler queue three updates but produce one render, and count ends at 1, not 3.",
  kind: "batch",
  codeLines: [
    { num: 1, text: "function Counter() {" },
    { num: 2, text: "  const [count, setCount] = useState(0);" },
    { num: 3, text: "  function handleClick() {" },
    { num: 4, text: "    setCount(count + 1);" },
    { num: 5, text: "    setCount(count + 1);" },
    { num: 6, text: "    setCount(count + 1);" },
    { num: 7, text: "    console.log(count);" },
    { num: 8, text: "  }" },
    { num: 9, text: "  return <button onClick={handleClick}>{count}</button>;" },
    { num: 10, text: "}" },
  ],
  steps: [
    {
      descriptionHtml:
        "Mount render. <code>useState(0)</code> creates a hook object on the <span class=\"hl-stack\">fiber</span> with <code>memoizedState = 0</code> and an empty update queue. The render returns a button showing 0 and React commits it.",
      activeLine: 2,
      doneLines: [1],
      updateQueue: [],
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: reactFlush("React render: Counter() mount"),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "The committed render defined <code>handleClick</code> while <code>count</code> was <code>0</code>. That function closes over the constant <code>0</code>; nothing inside it can observe a newer value until React renders again and creates a new closure.",
      activeLine: 9,
      doneLines: [1, 2, 3, 8],
      updateQueue: [],
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: idle,
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "The user clicks. The browser runs the click event as a <span class=\"hl-task\">task</span>, React's root listener dispatches it, and <code>handleClick</code> runs inside React's batched event context. Any state updates issued before the handler returns are held, not rendered.",
      activeLine: 3,
      doneLines: [1, 2, 9],
      updateQueue: [],
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: clickTask(),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "<code>setCount(count + 1)</code> evaluates its argument first. <code>count</code> is the closure's <code>0</code>, so the call stores a value update with payload <code>1</code> on the hook's queue. The hook's <code>memoizedState</code> is untouched.",
      activeLine: 4,
      doneLines: [1, 2, 3, 9],
      updateQueue: BATCH_QUEUE_QUEUED(1),
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: clickTask(),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "The second call computes <code>count + 1</code> again. No render has happened, so <code>count</code> is still the snapshot value <code>0</code>, and a second update with payload <code>1</code> is appended. State is a snapshot per render, not a live variable.",
      activeLine: 5,
      doneLines: [1, 2, 3, 4, 9],
      updateQueue: BATCH_QUEUE_QUEUED(2),
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: clickTask(),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "Third call, same story: payload <code>1</code>. The queue now holds three updates that all say \"replace with 1\". Each <code>setCount</code> also schedules work on the root, but React sees it is inside a batched event and does not start rendering.",
      activeLine: 6,
      doneLines: [1, 2, 3, 4, 5, 9],
      updateQueue: BATCH_QUEUE_QUEUED(3),
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: clickTask(),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "<code>console.log(count)</code> prints <code>0</code>. The three queued updates have not been applied, and even if they had, this closure would still hold the value from the render that created it.",
      activeLine: 7,
      doneLines: [1, 2, 3, 4, 5, 6, 9],
      updateQueue: BATCH_QUEUE_QUEUED(3),
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: clickTask(),
      consoleOutput: ["0"],
    },
    {
      descriptionHtml:
        "The handler returns and the batched event context ends. React now flushes the sync work it scheduled: one render pass for <code>Counter</code>, regardless of how many <code>setState</code> calls happened in between.",
      activeLine: 8,
      doneLines: [1, 2, 3, 4, 5, 6, 7, 9],
      updateQueue: BATCH_QUEUE_QUEUED(3),
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: reactFlush("React flush: end of batched click event"),
      consoleOutput: ["0"],
    },
    {
      descriptionHtml:
        "React calls <code>Counter()</code> again. When <code>useState</code> runs, it walks the queue from the base state <code>0</code>: replace with 1, replace with 1, replace with 1. The result is <code>1</code>, and the render returns a button showing 1.",
      activeLine: 2,
      doneLines: [1, 3, 4, 5, 6, 7, 8, 9],
      updateQueue: BATCH_QUEUE_APPLIED,
      hooks: [hook("count", "0", "1")],
      renderLog: [
        ...MOUNT_LOG,
        render("r2", "Render #2", "queue 0 -> 1 -> 1 -> 1, count = 1"),
      ],
      eventLoop: reactFlush("React render: Counter() with queued updates"),
      consoleOutput: ["0"],
    },
    {
      descriptionHtml:
        "Commit. The DOM text node changes from 0 to 1, <code>memoizedState</code> becomes <code>1</code>, and the queue is cleared. Three calls, one render, one commit. To get 3 you need updater functions, shown in the next example.",
      activeLine: 9,
      doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
      updateQueue: [],
      hooks: [hook("count", "1")],
      renderLog: [
        ...MOUNT_LOG,
        render("r2", "Render #2", "queue 0 -> 1 -> 1 -> 1, count = 1"),
        commit("c2", "Commit #2", "DOM shows 1"),
      ],
      eventLoop: idle,
      consoleOutput: ["0"],
    },
  ],
};

/* ── Example 2: updater functions ── */

const TRIPLE_QUEUED = (n: number): QueuedUpdate[] =>
  [1, 2, 3].slice(0, n).map((i) =>
    updater(`t${i}`, "count", "setCount(c => c + 1)", "c => c + 1"),
  );

const TRIPLE_APPLIED: QueuedUpdate[] = [
  updater("t1", "count", "setCount(c => c + 1)", "c => c + 1", "applied", "0 -> 1"),
  updater("t2", "count", "setCount(c => c + 1)", "c => c + 1", "applied", "1 -> 2"),
  updater("t3", "count", "setCount(c => c + 1)", "c => c + 1", "applied", "2 -> 3"),
];

const MIXED_QUEUED: QueuedUpdate[] = [
  value("m1", "count", "setCount(count + 5)", "8"),
  updater("m2", "count", "setCount(c => c + 1)", "c => c + 1"),
  value("m3", "count", "setCount(42)", "42"),
];

const MIXED_APPLIED: QueuedUpdate[] = [
  value("m1", "count", "setCount(count + 5)", "8", "applied", "3 -> 8"),
  updater("m2", "count", "setCount(c => c + 1)", "c => c + 1", "applied", "8 -> 9"),
  value("m3", "count", "setCount(42)", "42", "applied", "9 -> 42"),
];

const UPDATER_LOG_AFTER_TRIPLE: RenderLogEntry[] = [
  ...MOUNT_LOG,
  render("r2", "Render #2", "queue 0 -> 1 -> 2 -> 3, count = 3"),
  commit("c2", "Commit #2", "DOM shows 3"),
];

const updaterExample: StateBatchingExample = {
  id: "updater",
  title: "Updater functions",
  description:
    "setCount(c => c + 1) queues a function instead of a value. React runs each one against the result of the previous update, so three calls give 3, and mixing values with updaters shows the difference.",
  kind: "updater",
  codeLines: [
    { num: 1, text: "function Counter() {" },
    { num: 2, text: "  const [count, setCount] = useState(0);" },
    { num: 3, text: "  function handleTriple() {" },
    { num: 4, text: "    setCount(c => c + 1);" },
    { num: 5, text: "    setCount(c => c + 1);" },
    { num: 6, text: "    setCount(c => c + 1);" },
    { num: 7, text: "  }" },
    { num: 8, text: "  function handleMixed() {" },
    { num: 9, text: "    setCount(count + 5);" },
    { num: 10, text: "    setCount(c => c + 1);" },
    { num: 11, text: "    setCount(42);" },
    { num: 12, text: "  }" },
    { num: 13, text: "  return (" },
    { num: 14, text: "    <>" },
    { num: 15, text: "      <button onClick={handleTriple}>+3</button>" },
    { num: 16, text: "      <button onClick={handleMixed}>mix</button>" },
    { num: 17, text: "      <span>{count}</span>" },
    { num: 18, text: "    </>" },
    { num: 19, text: "  );" },
    { num: 20, text: "}" },
  ],
  steps: [
    {
      descriptionHtml:
        "Mount render with <code>count = 0</code>. Both handlers are created during this render and close over <code>count === 0</code>. React commits the two buttons and the span.",
      activeLine: 2,
      doneLines: [1],
      updateQueue: [],
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: reactFlush("React render: Counter() mount"),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "The user clicks <code>+3</code>. <code>handleTriple</code> runs inside the batched click <span class=\"hl-task\">task</span>, so updates queue up and rendering waits until the handler returns.",
      activeLine: 3,
      doneLines: [1, 2, 13, 14, 15, 16, 17, 18, 19],
      updateQueue: [],
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: { ...clickTask(), running: "click event: handleTriple()" },
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "<code>setCount(c => c + 1)</code> does not call the function. It stores the function itself on the queue as an updater. Nothing is computed yet, so it does not matter what <code>count</code> is in this closure.",
      activeLine: 4,
      doneLines: [1, 2, 3, 13, 14, 15, 16, 17, 18, 19],
      updateQueue: TRIPLE_QUEUED(1),
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: { ...clickTask(), running: "click event: handleTriple()" },
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "A second updater is appended. The queue is a linked list on the hook object; each entry records whether it is a plain value or a function to call later.",
      activeLine: 5,
      doneLines: [1, 2, 3, 4, 13, 14, 15, 16, 17, 18, 19],
      updateQueue: TRIPLE_QUEUED(2),
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: { ...clickTask(), running: "click event: handleTriple()" },
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "Third updater queued. Three functions are waiting, and <code>memoizedState</code> is still <code>0</code>. Nothing has rendered because the click handler has not returned.",
      activeLine: 6,
      doneLines: [1, 2, 3, 4, 5, 13, 14, 15, 16, 17, 18, 19],
      updateQueue: TRIPLE_QUEUED(3),
      hooks: [hook("count", "0")],
      renderLog: MOUNT_LOG,
      eventLoop: { ...clickTask(), running: "click event: handleTriple()" },
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "The handler returns and React renders once. <code>useState</code> processes the queue in order, feeding each updater the result of the previous one: <code>0 -> 1</code>, <code>1 -> 2</code>, <code>2 -> 3</code>. The render sees <code>count = 3</code>.",
      activeLine: 2,
      doneLines: [1, 3, 4, 5, 6, 7, 13, 14, 15, 16, 17, 18, 19],
      updateQueue: TRIPLE_APPLIED,
      hooks: [hook("count", "0", "3")],
      renderLog: [
        ...MOUNT_LOG,
        render("r2", "Render #2", "queue 0 -> 1 -> 2 -> 3, count = 3"),
      ],
      eventLoop: reactFlush("React render: Counter() with 3 updaters"),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "Commit. The span shows 3 and the hook stores <code>3</code>. This render also created a fresh <code>handleMixed</code> whose closure now holds <code>count === 3</code>.",
      activeLine: 17,
      doneLines: [1, 2, 3, 4, 5, 6, 7, 13, 14, 15, 16, 18, 19],
      updateQueue: [],
      hooks: [hook("count", "3")],
      renderLog: UPDATER_LOG_AFTER_TRIPLE,
      eventLoop: idle,
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "The user clicks <code>mix</code>. <code>handleMixed</code> runs inside a new batched click <span class=\"hl-task\">task</span>. Its <code>count</code> is the snapshot from Render #2, which is <code>3</code>.",
      activeLine: 8,
      doneLines: [1, 2, 13, 14, 15, 16, 17, 18, 19],
      updateQueue: [],
      hooks: [hook("count", "3")],
      renderLog: UPDATER_LOG_AFTER_TRIPLE,
      eventLoop: { ...clickTask(), running: "click event: handleMixed()" },
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "<code>setCount(count + 5)</code> evaluates to <code>3 + 5</code> and queues the value <code>8</code>. A value update ignores whatever is pending ahead of it; it simply replaces the state when its turn comes.",
      activeLine: 9,
      doneLines: [1, 2, 8, 13, 14, 15, 16, 17, 18, 19],
      updateQueue: MIXED_QUEUED.slice(0, 1),
      hooks: [hook("count", "3")],
      renderLog: UPDATER_LOG_AFTER_TRIPLE,
      eventLoop: { ...clickTask(), running: "click event: handleMixed()" },
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "<code>setCount(c => c + 1)</code> queues an updater behind the value. When it runs, <code>c</code> will be the pending state at that point in the queue, which is <code>8</code>, not the closure's <code>3</code>.",
      activeLine: 10,
      doneLines: [1, 2, 8, 9, 13, 14, 15, 16, 17, 18, 19],
      updateQueue: MIXED_QUEUED.slice(0, 2),
      hooks: [hook("count", "3")],
      renderLog: UPDATER_LOG_AFTER_TRIPLE,
      eventLoop: { ...clickTask(), running: "click event: handleMixed()" },
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "<code>setCount(42)</code> queues a third entry, a plain value. Whatever the earlier updates compute, this one overwrites it, because queue order is call order.",
      activeLine: 11,
      doneLines: [1, 2, 8, 9, 10, 13, 14, 15, 16, 17, 18, 19],
      updateQueue: MIXED_QUEUED,
      hooks: [hook("count", "3")],
      renderLog: UPDATER_LOG_AFTER_TRIPLE,
      eventLoop: { ...clickTask(), running: "click event: handleMixed()" },
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "Handler returns, React renders once. The queue runs from base state <code>3</code>: replace with <code>8</code>, updater turns 8 into <code>9</code>, replace with <code>42</code>. Final value <code>42</code>, one render for three calls.",
      activeLine: 2,
      doneLines: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      updateQueue: MIXED_APPLIED,
      hooks: [hook("count", "3", "42")],
      renderLog: [
        ...UPDATER_LOG_AFTER_TRIPLE,
        render("r3", "Render #3", "queue 3 -> 8 -> 9 -> 42, count = 42"),
      ],
      eventLoop: reactFlush("React render: Counter() with mixed queue"),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "Commit. The span shows 42 and the queue is empty. Use an updater whenever the next state depends on the previous one; use a value when you are setting state to something you already know.",
      activeLine: 17,
      doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19],
      updateQueue: [],
      hooks: [hook("count", "42")],
      renderLog: [
        ...UPDATER_LOG_AFTER_TRIPLE,
        render("r3", "Render #3", "queue 3 -> 8 -> 9 -> 42, count = 42"),
        commit("c3", "Commit #3", "DOM shows 42"),
      ],
      eventLoop: idle,
      consoleOutput: [],
    },
  ],
};

/* ── Example 3: automatic batching outside events ── */

const TIMER_PENDING = { label: "setTimeout callback (after 0 ms)", kind: "task" as const };
const THEN_PENDING = { label: "promise .then callback", kind: "microtask" as const };

const AUTO_MOUNT_LOG: RenderLogEntry[] = [
  render("r1", "Render #1", "mount, count = 0, flag = false"),
  commit("c1", "Commit #1", "DOM shows 0"),
];

const AUTO_LOG_AFTER_FLUSH: RenderLogEntry[] = [
  ...AUTO_MOUNT_LOG,
  render("r2", "Render #2", "flushSync, count = 1"),
  commit("c2", "Commit #2", "DOM shows 1, synchronous"),
];

const AUTO_LOG_AFTER_THEN: RenderLogEntry[] = [
  ...AUTO_LOG_AFTER_FLUSH,
  legacy("l1", "extra render", "setCount in .then rendered on its own"),
  legacy("l2", "extra render", "setFlag in .then rendered on its own"),
  render("r3", "Render #3", "batched .then updates, count = 2, flag = true"),
  commit("c3", "Commit #3", "DOM shows 2"),
];

const AUTO_LOG_FINAL: RenderLogEntry[] = [
  ...AUTO_LOG_AFTER_THEN,
  legacy("l3", "extra render", "setCount in timeout rendered on its own"),
  legacy("l4", "extra render", "setFlag in timeout rendered on its own"),
  render("r4", "Render #4", "batched timeout updates, count = 3, flag = false"),
  commit("c4", "Commit #4", "DOM shows 3"),
];

const automaticExample: StateBatchingExample = {
  id: "automatic",
  title: "Automatic batching outside events",
  description:
    "React 17 rendered once per setState inside timeouts and promises. React 18+ batches those too, and flushSync forces a render mid-handler when you need one.",
  kind: "automatic",
  codeLines: [
    { num: 1, text: "function Counter() {" },
    { num: 2, text: "  const [count, setCount] = useState(0);" },
    { num: 3, text: "  const [flag, setFlag] = useState(false);" },
    { num: 4, text: "  function handleClick() {" },
    { num: 5, text: "    setTimeout(() => {" },
    { num: 6, text: "      setCount(c => c + 1);" },
    { num: 7, text: "      setFlag(f => !f);" },
    { num: 8, text: "    }, 0);" },
    { num: 9, text: "    Promise.resolve().then(() => {" },
    { num: 10, text: "      setCount(c => c + 1);" },
    { num: 11, text: "      setFlag(f => !f);" },
    { num: 12, text: "    });" },
    { num: 13, text: "    flushSync(() => setCount(1));" },
    { num: 14, text: "    console.log('after flushSync');" },
    { num: 15, text: "  }" },
    { num: 16, text: "  return <button onClick={handleClick}>{count}</button>;" },
    { num: 17, text: "}" },
  ],
  steps: [
    {
      descriptionHtml:
        "Mount render creates two hooks on the fiber: <code>count = 0</code> and <code>flag = false</code>. The Render Log will count renders under React 17 (legacy root) and React 18+ (<code>createRoot</code>) side by side.",
      activeLine: 3,
      doneLines: [1, 2],
      updateQueue: [],
      hooks: [hook("count", "0"), hook("flag", "false")],
      renderLog: AUTO_MOUNT_LOG,
      renderTotals: { react17: 1, react18: 1 },
      eventLoop: reactFlush("React render: Counter() mount"),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "The user clicks. <code>handleClick</code> runs inside the click <span class=\"hl-task\">task</span>, in React's batched event context. In both React 17 and 18, updates made directly in this handler would be batched.",
      activeLine: 4,
      doneLines: [1, 2, 3, 16],
      updateQueue: [],
      hooks: [hook("count", "0"), hook("flag", "false")],
      renderLog: AUTO_MOUNT_LOG,
      renderTotals: { react17: 1, react18: 1 },
      eventLoop: clickTask(),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "<code>setTimeout</code> hands the callback to the browser's timer. After 0 ms it will be placed on the <span class=\"hl-task\">task queue</span>, to run in a later turn of the event loop, long after this handler has returned.",
      activeLine: 5,
      doneLines: [1, 2, 3, 4, 16],
      updateQueue: [],
      hooks: [hook("count", "0"), hook("flag", "false")],
      renderLog: AUTO_MOUNT_LOG,
      renderTotals: { react17: 1, react18: 1 },
      eventLoop: clickTask([TIMER_PENDING]),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "<code>Promise.resolve().then(cb)</code> is already resolved, so <code>cb</code> is queued as a <span class=\"hl-micro\">microtask</span> immediately. Microtasks run as soon as the current task finishes, so this callback will run before the timer callback.",
      activeLine: 9,
      doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 16],
      updateQueue: [],
      hooks: [hook("count", "0"), hook("flag", "false")],
      renderLog: AUTO_MOUNT_LOG,
      renderTotals: { react17: 1, react18: 1 },
      eventLoop: clickTask([THEN_PENDING, TIMER_PENDING]),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "<code>flushSync</code> runs its callback, which queues <code>setCount(1)</code>, then forces React to render and commit synchronously before returning. Render #2 happens right here, in the middle of the handler, with <code>count = 1</code>.",
      activeLine: 13,
      doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16],
      updateQueue: [value("f1", "count", "setCount(1)", "1", "applied", "0 -> 1")],
      hooks: [hook("count", "0", "1"), hook("flag", "false")],
      renderLog: [
        ...AUTO_MOUNT_LOG,
        render("r2", "Render #2", "flushSync, count = 1"),
      ],
      renderTotals: { react17: 2, react18: 2 },
      eventLoop: reactFlush("React render: flushSync inside handleClick()", [
        THEN_PENDING,
        TIMER_PENDING,
      ]),
      consoleOutput: [],
    },
    {
      descriptionHtml:
        "<code>flushSync</code> has returned and the DOM already shows 1. <code>console.log</code> runs after the commit, which is the point of <code>flushSync</code>: use it when code right after the update needs the DOM to be current, such as measuring or scrolling.",
      activeLine: 14,
      doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16],
      updateQueue: [],
      hooks: [hook("count", "1"), hook("flag", "false")],
      renderLog: AUTO_LOG_AFTER_FLUSH,
      renderTotals: { react17: 2, react18: 2 },
      eventLoop: clickTask([THEN_PENDING, TIMER_PENDING]),
      consoleOutput: ["after flushSync"],
    },
    {
      descriptionHtml:
        "The handler returns and the click task ends with nothing left in React's queue. The <span class=\"hl-loop\">event loop</span> now drains microtasks before taking another task, so the <code>.then</code> callback is next.",
      activeLine: 15,
      doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16],
      updateQueue: [],
      hooks: [hook("count", "1"), hook("flag", "false")],
      renderLog: AUTO_LOG_AFTER_FLUSH,
      renderTotals: { react17: 2, react18: 2 },
      eventLoop: {
        running: null,
        runningKind: "idle",
        pending: [THEN_PENDING, TIMER_PENDING],
      },
      consoleOutput: ["after flushSync"],
    },
    {
      descriptionHtml:
        "The <span class=\"hl-micro\">microtask</span> runs, outside any React event handler. <code>setCount(c => c + 1)</code> queues an updater. React 17 has no batching context here, so it renders synchronously inside this call. React 18 queues the update and schedules one flush for after the callback.",
      activeLine: 10,
      doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16],
      updateQueue: [updater("p1", "count", "setCount(c => c + 1)", "c => c + 1")],
      hooks: [hook("count", "1"), hook("flag", "false")],
      renderLog: [
        ...AUTO_LOG_AFTER_FLUSH,
        legacy("l1", "extra render", "setCount in .then rendered on its own"),
      ],
      renderTotals: { react17: 3, react18: 2 },
      eventLoop: {
        running: "promise .then callback",
        runningKind: "microtask",
        pending: [TIMER_PENDING],
      },
      consoleOutput: ["after flushSync"],
    },
    {
      descriptionHtml:
        "<code>setFlag(f => !f)</code> queues an updater on the second hook. React 17 renders again, a second render for this callback. React 18 appends to the pending work; the flush it already scheduled will pick up both hooks at once.",
      activeLine: 11,
      doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16],
      updateQueue: [
        updater("p1", "count", "setCount(c => c + 1)", "c => c + 1"),
        updater("p2", "flag", "setFlag(f => !f)", "f => !f"),
      ],
      hooks: [hook("count", "1"), hook("flag", "false")],
      renderLog: [
        ...AUTO_LOG_AFTER_FLUSH,
        legacy("l1", "extra render", "setCount in .then rendered on its own"),
        legacy("l2", "extra render", "setFlag in .then rendered on its own"),
      ],
      renderTotals: { react17: 4, react18: 2 },
      eventLoop: {
        running: "promise .then callback",
        runningKind: "microtask",
        pending: [TIMER_PENDING],
      },
      consoleOutput: ["after flushSync"],
    },
    {
      descriptionHtml:
        "The callback returns and React 18's scheduled flush runs. One render processes both queues: <code>count 1 -> 2</code>, <code>flag false -> true</code>. One commit instead of two. This is automatic batching: the batch boundary is the end of the callback, not the event handler.",
      activeLine: 2,
      doneLines: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      updateQueue: [
        updater("p1", "count", "setCount(c => c + 1)", "c => c + 1", "applied", "1 -> 2"),
        updater("p2", "flag", "setFlag(f => !f)", "f => !f", "applied", "false -> true"),
      ],
      hooks: [hook("count", "1", "2"), hook("flag", "false", "true")],
      renderLog: AUTO_LOG_AFTER_THEN,
      renderTotals: { react17: 4, react18: 3 },
      eventLoop: reactFlush("React flush: batched .then updates", [TIMER_PENDING]),
      consoleOutput: ["after flushSync"],
    },
    {
      descriptionHtml:
        "Microtasks are drained, so the <span class=\"hl-loop\">event loop</span> takes the timer <span class=\"hl-task\">task</span>. <code>setCount(c => c + 1)</code> queues an updater. Again React 17 renders immediately while React 18 schedules a single flush.",
      activeLine: 6,
      doneLines: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      updateQueue: [updater("s1", "count", "setCount(c => c + 1)", "c => c + 1")],
      hooks: [hook("count", "2"), hook("flag", "true")],
      renderLog: [
        ...AUTO_LOG_AFTER_THEN,
        legacy("l3", "extra render", "setCount in timeout rendered on its own"),
      ],
      renderTotals: { react17: 5, react18: 3 },
      eventLoop: {
        running: "setTimeout callback",
        runningKind: "task",
        pending: [],
      },
      consoleOutput: ["after flushSync"],
    },
    {
      descriptionHtml:
        "<code>setFlag(f => !f)</code> queues the second updater. React 17 is now on its sixth render in total, with intermediate states the user never needed to see. React 18 is still holding two updates for one pass.",
      activeLine: 7,
      doneLines: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      updateQueue: [
        updater("s1", "count", "setCount(c => c + 1)", "c => c + 1"),
        updater("s2", "flag", "setFlag(f => !f)", "f => !f"),
      ],
      hooks: [hook("count", "2"), hook("flag", "true")],
      renderLog: [
        ...AUTO_LOG_AFTER_THEN,
        legacy("l3", "extra render", "setCount in timeout rendered on its own"),
        legacy("l4", "extra render", "setFlag in timeout rendered on its own"),
      ],
      renderTotals: { react17: 6, react18: 3 },
      eventLoop: {
        running: "setTimeout callback",
        runningKind: "task",
        pending: [],
      },
      consoleOutput: ["after flushSync"],
    },
    {
      descriptionHtml:
        "The timer callback returns and React 18 flushes: <code>count 2 -> 3</code>, <code>flag true -> false</code> in one render and one commit. Total for this click: React 17 rendered 6 times, React 18 rendered 4 times, and the DOM ended up identical.",
      activeLine: 2,
      doneLines: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      updateQueue: [
        updater("s1", "count", "setCount(c => c + 1)", "c => c + 1", "applied", "2 -> 3"),
        updater("s2", "flag", "setFlag(f => !f)", "f => !f", "applied", "true -> false"),
      ],
      hooks: [hook("count", "2", "3"), hook("flag", "true", "false")],
      renderLog: AUTO_LOG_FINAL,
      renderTotals: { react17: 6, react18: 4 },
      eventLoop: reactFlush("React flush: batched timeout updates"),
      consoleOutput: ["after flushSync"],
    },
    {
      descriptionHtml:
        "Everything is committed and the event loop is idle. The rule in React 18+: updates are batched per callback wherever they come from, and <code>flushSync</code> is the explicit opt-out when you need the DOM updated before the next line runs.",
      activeLine: 16,
      doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      updateQueue: [],
      hooks: [hook("count", "3"), hook("flag", "false")],
      renderLog: AUTO_LOG_FINAL,
      renderTotals: { react17: 6, react18: 4 },
      eventLoop: idle,
      consoleOutput: ["after flushSync"],
    },
  ],
};

void note;

export const EXAMPLES: StateBatchingExample[] = [
  batchExample,
  updaterExample,
  automaticExample,
];
