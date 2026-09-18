import type {
  ConcurrentRenderingExample,
  DomState,
  FrameEntry,
  FrameKind,
  UnitStatus,
  WorkUnit,
} from "./types";

/* ── small builders so each step stays a readable full snapshot ── */

const frames = (...spec: (FrameKind | [FrameKind, string])[]): FrameEntry[] =>
  spec.map((entry, index) =>
    typeof entry === "string"
      ? { id: `f${index}`, kind: entry }
      : { id: `f${index}`, kind: entry[0], marker: entry[1] },
  );

const unit = (label: string, status: UnitStatus): WorkUnit => ({
  id: label,
  label,
  status,
});

const IDLE_WORK = { phase: "idle" as const, lane: null, units: [], progress: 0, note: null };

const LIST_COUNTS: Record<string, number> = { "": 5000, a: 1834, ab: 212 };

const dom = (
  inputValue: string,
  listQuery: string,
  extra: Partial<DomState> = {},
): DomState => ({
  inputValue,
  listQuery,
  listCount: LIST_COUNTS[listQuery],
  listDimmed: false,
  isPending: null,
  suspense: null,
  ...extra,
});

/* ── shared unit lists ── */

const BLOCKING_UNITS = (list: UnitStatus, rows: UnitStatus[]) => [
  unit("Search", list === "pending" ? "pending" : "done"),
  unit("<input>", list === "pending" ? "pending" : "done"),
  unit("List", list),
  unit("rows 1-1250", rows[0]),
  unit("rows 1251-2500", rows[1]),
  unit("rows 2501-3750", rows[2]),
  unit("rows 3751-5000", rows[3]),
];

export const EXAMPLES: ConcurrentRenderingExample[] = [
  /* ── 1. Blocking render ── */
  {
    id: "blocking",
    title: "Blocking render",
    description:
      "A plain setState on every keystroke re-renders 5,000 rows synchronously, so the second keystroke waits behind the first render.",
    kind: "blocking",
    codeLines: [
      { num: 1, text: "function Search({ items }) {" },
      { num: 2, text: '  const [query, setQuery] = useState("");' },
      { num: 3, text: "  const filtered = items.filter((item) =>" },
      { num: 4, text: "    item.name.includes(query)" },
      { num: 5, text: "  );" },
      { num: 6, text: "  return (" },
      { num: 7, text: "    <>" },
      { num: 8, text: "      <input" },
      { num: 9, text: "        value={query}" },
      { num: 10, text: "        onChange={(e) => setQuery(e.target.value)}" },
      { num: 11, text: "      />" },
      { num: 12, text: "      <List items={filtered} /> {/* 5,000 rows */}" },
      { num: 13, text: "    </>" },
      { num: 14, text: "  );" },
      { num: 15, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "The list is mounted with an empty query, so all 5,000 rows are on screen. Nothing is scheduled: the <span class=\"hl-loop\">work loop</span> is idle and every 16 ms frame is free for the browser.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        lanes: [],
        workLoop: IDLE_WORK,
        frames: frames("idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("", ""),
      },
      {
        descriptionHtml:
          "The user types <code>a</code>. <code>onChange</code> runs inside a discrete browser event, so <code>setQuery(\"a\")</code> is stamped with <span class=\"hl-stack\">SyncLane</span>. A lane is one bit in a 31-bit mask; the lower the bit, the higher the priority, and SyncLane is bit 1.",
        activeLine: 10,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        lanes: [{ id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "queued" }],
        workLoop: IDLE_WORK,
        frames: frames(["input", "a"], "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("", ""),
      },
      {
        descriptionHtml:
          "React processes SyncLane with <code>performSyncWorkOnRoot</code>. This work loop never calls <code>shouldYield()</code>, so once it starts it holds the main thread until the whole tree is built. <code>Search</code> re-runs, the filter keeps 1,834 items, and <code>List</code> begins rendering them.",
        activeLine: 3,
        doneLines: [1, 2, 8, 9, 10, 11],
        lanes: [{ id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "rendering" }],
        workLoop: {
          phase: "sync",
          lane: "SyncLane",
          units: BLOCKING_UNITS("active", ["active", "pending", "pending", "pending"]),
          progress: 0.15,
          note: "workLoopSync: no yield checks",
        },
        frames: frames(["input", "a"], "blocked", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("", ""),
      },
      {
        descriptionHtml:
          "Halfway through the 120 ms render the user types <code>b</code>. The browser cannot dispatch the event because the JavaScript thread is busy, so the keydown sits in the task queue and the input does not echo the character. Frames 2 through 8 are dropped.",
        activeLine: 12,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        lanes: [{ id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "rendering" }],
        workLoop: {
          phase: "sync",
          lane: "SyncLane",
          units: BLOCKING_UNITS("active", ["done", "done", "active", "pending"]),
          progress: 0.6,
          note: "60 ms elapsed, event queue blocked",
        },
        frames: frames(["input", "a"], "blocked", "blocked", "blocked", ["blocked", "b"], "blocked", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("", ""),
      },
      {
        descriptionHtml:
          "The render finishes and React commits the work-in-progress tree in the same task. The input finally shows <code>a</code> and the list shows 1,834 rows, roughly 120 ms after the keystroke. The browser paints once for all of it.",
        activeLine: 12,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15],
        lanes: [{ id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" }],
        workLoop: {
          phase: "commit",
          lane: "SyncLane",
          units: BLOCKING_UNITS("done", ["done", "done", "done", "done"]),
          progress: 1,
          note: "commitRoot after 120 ms",
        },
        frames: frames(["input", "a"], "blocked", "blocked", "blocked", ["blocked", "b"], "blocked", "blocked", "blocked", "commit", "idle", "idle", "idle"),
        dom: dom("a", "a"),
      },
      {
        descriptionHtml:
          "Only now does the browser run the queued keydown. <code>onChange</code> fires with <code>ab</code> and <code>setQuery(\"ab\")</code> is scheduled, again on <span class=\"hl-stack\">SyncLane</span>. From the user's point of view the second character appeared late and the field felt stuck.",
        activeLine: 10,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "q-ab", update: 'setQuery("ab")', lane: "SyncLane", status: "queued" },
        ],
        workLoop: IDLE_WORK,
        frames: frames(["input", "a"], "blocked", "blocked", "blocked", ["blocked", "b"], "blocked", "blocked", "blocked", "commit", ["input", "b"], "idle", "idle"),
        dom: dom("a", "a"),
      },
      {
        descriptionHtml:
          "The second sync render runs the same way: 212 matching rows, no yield, main thread held for the whole pass. Note that the render phase itself is pure, so React could in principle pause it. The SyncLane is what forbids it, not the work.",
        activeLine: 3,
        doneLines: [1, 2, 8, 9, 10, 11],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "q-ab", update: 'setQuery("ab")', lane: "SyncLane", status: "rendering" },
        ],
        workLoop: {
          phase: "sync",
          lane: "SyncLane",
          units: BLOCKING_UNITS("active", ["done", "active", "pending", "pending"]),
          progress: 0.4,
          note: "workLoopSync: no yield checks",
        },
        frames: frames(["input", "a"], "blocked", "blocked", "blocked", ["blocked", "b"], "blocked", "blocked", "blocked", "commit", ["input", "b"], "blocked", "blocked"),
        dom: dom("a", "a"),
      },
      {
        descriptionHtml:
          "Commit. Two keystrokes cost about 200 ms of blocked frames. The fix is not a faster filter but a way to tell React that the list update is less urgent than the input update. That is what lanes and <span class=\"hl-api\">startTransition</span> provide in the next example.",
        activeLine: 12,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "q-ab", update: 'setQuery("ab")', lane: "SyncLane", status: "committed" },
        ],
        workLoop: {
          phase: "commit",
          lane: "SyncLane",
          units: BLOCKING_UNITS("done", ["done", "done", "done", "done"]),
          progress: 1,
          note: "second commit, 12 frames used",
        },
        frames: frames(["input", "a"], "blocked", "blocked", "blocked", ["blocked", "b"], "blocked", "blocked", "blocked", "commit", ["input", "b"], "blocked", "commit"),
        dom: dom("ab", "ab"),
      },
    ],
  },

  /* ── 2. startTransition ── */
  {
    id: "transition",
    title: "startTransition",
    description:
      "The input update stays urgent while the list update moves to a transition lane that renders in 5 ms slices and restarts when newer input arrives.",
    kind: "transition",
    codeLines: [
      { num: 1, text: "function Search({ items }) {" },
      { num: 2, text: '  const [query, setQuery] = useState("");' },
      { num: 3, text: '  const [filter, setFilter] = useState("");' },
      { num: 4, text: "  const [isPending, startTransition] = useTransition();" },
      { num: 5, text: "  const onChange = (e) => {" },
      { num: 6, text: "    setQuery(e.target.value); // SyncLane" },
      { num: 7, text: "    startTransition(() => {" },
      { num: 8, text: "      setFilter(e.target.value); // TransitionLane" },
      { num: 9, text: "    });" },
      { num: 10, text: "  };" },
      { num: 11, text: "  const filtered = items.filter((i) => i.name.includes(filter));" },
      { num: 12, text: "  return (" },
      { num: 13, text: "    <>" },
      { num: 14, text: "      <input value={query} onChange={onChange} />" },
      { num: 15, text: "      <List items={filtered} dimmed={isPending} />" },
      { num: 16, text: "    </>" },
      { num: 17, text: "  );" },
      { num: 18, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Mounted and idle. The component now has two pieces of state: <code>query</code> drives the input and <code>filter</code> drives the list. Splitting them is what lets React give each update its own priority.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        lanes: [],
        workLoop: IDLE_WORK,
        frames: frames("idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("", "", { isPending: false }),
      },
      {
        descriptionHtml:
          "Keystroke <code>a</code>. <code>setQuery(\"a\")</code> is called directly in the event handler, so it gets <span class=\"hl-stack\">SyncLane</span>, the same urgent priority as before.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        lanes: [{ id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "queued" }],
        workLoop: IDLE_WORK,
        frames: frames(["input", "a"], "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("", "", { isPending: false }),
      },
      {
        descriptionHtml:
          "<code>startTransition</code> sets a module-level flag while its callback runs, so <code>setFilter(\"a\")</code> is stamped with a <span class=\"hl-micro\">TransitionLane</span> instead. Concurrent behaviour is opted into per update, not switched on globally. <code>isPending</code> will be true until this lane commits.",
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "queued" },
          { id: "f-a", update: 'setFilter("a")', lane: "TransitionLane", status: "queued" },
        ],
        workLoop: IDLE_WORK,
        frames: frames(["input", "a"], "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("", "", { isPending: false }),
      },
      {
        descriptionHtml:
          "<code>getNextLanes</code> picks the highest priority pending lane, SyncLane. React renders with <code>query = \"a\"</code> but skips the transition update, so <code>filter</code> is still <code>\"\"</code>. The list props barely change, so this pass is cheap and blocks for only a few milliseconds.",
        activeLine: 14,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "rendering" },
          { id: "f-a", update: 'setFilter("a")', lane: "TransitionLane", status: "queued" },
        ],
        workLoop: {
          phase: "sync",
          lane: "SyncLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "active"),
            unit("List (dimmed)", "pending"),
          ],
          progress: 0.6,
          note: "transition update skipped for now",
        },
        frames: frames(["input", "a"], "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("", "", { isPending: false }),
      },
      {
        descriptionHtml:
          "The urgent render commits inside the same frame as the keystroke. The input echoes <code>a</code> immediately and <code>isPending</code> flips to true, so <code>List</code> renders dimmed while still showing the old 5,000 rows.",
        activeLine: 15,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "f-a", update: 'setFilter("a")', lane: "TransitionLane", status: "queued" },
        ],
        workLoop: {
          phase: "commit",
          lane: "SyncLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("List (dimmed)", "done"),
          ],
          progress: 1,
          note: "commit in 3 ms",
        },
        frames: frames(["commit", "a"], "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("a", "", { isPending: true, listDimmed: true }),
      },
      {
        descriptionHtml:
          "Now the <span class=\"hl-micro\">TransitionLane</span> is next. React schedules <code>performConcurrentWorkOnRoot</code> through the Scheduler package as a normal-priority task. <code>workLoopConcurrent</code> processes one fiber at a time and calls <code>shouldYield()</code> between fibers, which returns true after 5 ms.",
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "f-a", update: 'setFilter("a")', lane: "TransitionLane", status: "rendering" },
        ],
        workLoop: {
          phase: "concurrent",
          lane: "TransitionLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("List", "done"),
            unit("rows 1-450", "active"),
            unit("rows 451-900", "pending"),
            unit("rows 901-1350", "pending"),
            unit("rows 1351-1834", "pending"),
          ],
          progress: 0.2,
          note: "slice 1, 5 ms budget",
        },
        frames: frames(["commit", "a"], "slice", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("a", "", { isPending: true, listDimmed: true }),
      },
      {
        descriptionHtml:
          "<code>shouldYield()</code> returns true. The loop exits, the Scheduler posts a <code>MessageChannel</code> message to continue later, and control returns to the browser. It can paint and dispatch events in the gap. Pausing is safe because the <span class=\"hl-loop\">render phase</span> only builds the work-in-progress tree and touches no DOM.",
        activeLine: 15,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "f-a", update: 'setFilter("a")', lane: "TransitionLane", status: "rendering" },
        ],
        workLoop: {
          phase: "yield",
          lane: "TransitionLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("List", "done"),
            unit("rows 1-450", "done"),
            unit("rows 451-900", "active"),
            unit("rows 901-1350", "pending"),
            unit("rows 1351-1834", "pending"),
          ],
          progress: 0.45,
          note: "slice 2 done, main thread free",
        },
        frames: frames(["commit", "a"], "slice", "slice", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("a", "", { isPending: true, listDimmed: true }),
      },
      {
        descriptionHtml:
          "During a yield the user types <code>b</code>. The browser dispatches it at once, <code>onChange</code> schedules <code>setQuery(\"ab\")</code> on <span class=\"hl-stack\">SyncLane</span> and <code>setFilter(\"ab\")</code> on the <span class=\"hl-micro\">TransitionLane</span>. A higher priority lane is now pending than the one being rendered.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "f-a", update: 'setFilter("a")', lane: "TransitionLane", status: "rendering" },
          { id: "q-ab", update: 'setQuery("ab")', lane: "SyncLane", status: "queued" },
          { id: "f-ab", update: 'setFilter("ab")', lane: "TransitionLane", status: "queued" },
        ],
        workLoop: {
          phase: "yield",
          lane: "TransitionLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("List", "done"),
            unit("rows 1-450", "done"),
            unit("rows 451-900", "active"),
            unit("rows 901-1350", "pending"),
            unit("rows 1351-1834", "pending"),
          ],
          progress: 0.45,
          note: "input event handled mid-render",
        },
        frames: frames(["commit", "a"], "slice", "slice", ["input", "b"], "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("a", "", { isPending: true, listDimmed: true }),
      },
      {
        descriptionHtml:
          "React interrupts the transition. <code>prepareFreshStack</code> throws away the half-built work-in-progress tree for <code>filter = \"a\"</code>; nothing from it was ever committed, so discarding it has no visible side effect. The update objects themselves stay in the hook queue and will be reprocessed.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "f-a", update: 'setFilter("a")', lane: "TransitionLane", status: "discarded" },
          { id: "q-ab", update: 'setQuery("ab")', lane: "SyncLane", status: "queued" },
          { id: "f-ab", update: 'setFilter("ab")', lane: "TransitionLane", status: "queued" },
        ],
        workLoop: {
          phase: "discarded",
          lane: "TransitionLane",
          units: [
            unit("Search", "stale"),
            unit("<input>", "stale"),
            unit("List", "stale"),
            unit("rows 1-450", "stale"),
            unit("rows 451-900", "stale"),
            unit("rows 901-1350", "skipped"),
            unit("rows 1351-1834", "skipped"),
          ],
          progress: 0,
          note: "WIP tree dropped, 9 ms of work lost",
        },
        frames: frames(["commit", "a"], "slice", "slice", ["input", "b"], "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("a", "", { isPending: true, listDimmed: true }),
      },
      {
        descriptionHtml:
          "SyncLane goes first again: a short render with <code>query = \"ab\"</code> commits within the frame, so the input shows <code>ab</code> with no lag. The list still displays the stale 5,000 rows, dimmed, because both transition updates remain pending.",
        activeLine: 14,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "f-a", update: 'setFilter("a")', lane: "TransitionLane", status: "discarded" },
          { id: "q-ab", update: 'setQuery("ab")', lane: "SyncLane", status: "committed" },
          { id: "f-ab", update: 'setFilter("ab")', lane: "TransitionLane", status: "queued" },
        ],
        workLoop: {
          phase: "commit",
          lane: "SyncLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("List (dimmed)", "done"),
          ],
          progress: 1,
          note: "commit in 3 ms",
        },
        frames: frames(["commit", "a"], "slice", "slice", ["commit", "b"], "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("ab", "", { isPending: true, listDimmed: true }),
      },
      {
        descriptionHtml:
          "The transition restarts from the root. Both queued <code>setFilter</code> updates share the same lane, so the hook processes them in order and lands on <code>filter = \"ab\"</code>. Only 212 rows match now, and the work is again split into 5 ms slices.",
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "f-a", update: 'setFilter("a")', lane: "TransitionLane", status: "discarded" },
          { id: "q-ab", update: 'setQuery("ab")', lane: "SyncLane", status: "committed" },
          { id: "f-ab", update: 'setFilter("ab")', lane: "TransitionLane", status: "rendering" },
        ],
        workLoop: {
          phase: "concurrent",
          lane: "TransitionLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("List", "active"),
            unit("rows 1-106", "pending"),
            unit("rows 107-212", "pending"),
          ],
          progress: 0.3,
          note: "restart, slice 1",
        },
        frames: frames(["commit", "a"], "slice", "slice", ["commit", "b"], "slice", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("ab", "", { isPending: true, listDimmed: true }),
      },
      {
        descriptionHtml:
          "Slices continue with a yield after each one. No new input arrives, so nothing interrupts. Every frame in this stretch still had time left for painting and scrolling.",
        activeLine: 15,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "f-a", update: 'setFilter("a")', lane: "TransitionLane", status: "discarded" },
          { id: "q-ab", update: 'setQuery("ab")', lane: "SyncLane", status: "committed" },
          { id: "f-ab", update: 'setFilter("ab")', lane: "TransitionLane", status: "rendering" },
        ],
        workLoop: {
          phase: "yield",
          lane: "TransitionLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("List", "done"),
            unit("rows 1-106", "done"),
            unit("rows 107-212", "active"),
          ],
          progress: 0.8,
          note: "slice 2 done, no interruption",
        },
        frames: frames(["commit", "a"], "slice", "slice", ["commit", "b"], "slice", "slice", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("ab", "", { isPending: true, listDimmed: true }),
      },
      {
        descriptionHtml:
          "The transition finishes its last fiber and commits. Commit is always synchronous and atomic, so the DOM never shows a half-updated list. <code>isPending</code> returns to false, the dimming clears, and the 212 rows appear. Typing never blocked, and the stale <code>\"a\"</code> result was never painted.",
        activeLine: 15,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "f-a", update: 'setFilter("a")', lane: "TransitionLane", status: "discarded" },
          { id: "q-ab", update: 'setQuery("ab")', lane: "SyncLane", status: "committed" },
          { id: "f-ab", update: 'setFilter("ab")', lane: "TransitionLane", status: "committed" },
        ],
        workLoop: {
          phase: "commit",
          lane: "TransitionLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("List", "done"),
            unit("rows 1-106", "done"),
            unit("rows 107-212", "done"),
          ],
          progress: 1,
          note: "commitRoot, 0 frames blocked",
        },
        frames: frames(["commit", "a"], "slice", "slice", ["commit", "b"], "slice", "slice", "commit", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("ab", "ab", { isPending: false }),
      },
    ],
  },

  /* ── 3. useDeferredValue and Suspense ── */
  {
    id: "deferred",
    title: "useDeferredValue and Suspense",
    description:
      "A deferred value lags one render behind at transition priority, and a transition that suspends keeps the old UI on screen instead of showing the fallback.",
    kind: "deferred",
    codeLines: [
      { num: 1, text: "function Search() {" },
      { num: 2, text: '  const [query, setQuery] = useState("");' },
      { num: 3, text: "  const deferredQuery = useDeferredValue(query);" },
      { num: 4, text: "  const isStale = query !== deferredQuery;" },
      { num: 5, text: "  return (" },
      { num: 6, text: "    <>" },
      { num: 7, text: "      <input value={query} onChange={(e) => setQuery(e.target.value)} />" },
      { num: 8, text: "      <Suspense fallback={<Spinner />}>" },
      { num: 9, text: "        <Results query={deferredQuery} dimmed={isStale} />" },
      { num: 10, text: "      </Suspense>" },
      { num: 11, text: "    </>" },
      { num: 12, text: "  );" },
      { num: 13, text: "}" },
      { num: 14, text: "// Results calls use(fetchResults(query)) and suspends" },
      { num: 15, text: "// until the promise for that query has resolved." },
    ],
    steps: [
      {
        descriptionHtml:
          "Mounted with an empty query. <code>Results</code> already has data for <code>\"\"</code> cached, so the Suspense boundary shows content. <code>useDeferredValue</code> returns the same value as <code>query</code> when nothing is pending.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        lanes: [],
        workLoop: IDLE_WORK,
        frames: frames("idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("", "", { suspense: { status: "content", note: "Results ready for \"\"" } }),
      },
      {
        descriptionHtml:
          "Keystroke <code>a</code>. <code>setQuery(\"a\")</code> is scheduled on <span class=\"hl-stack\">SyncLane</span>. There is no <code>startTransition</code> in this handler; the split between urgent and deferred work will come from the hook instead.",
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        lanes: [{ id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "queued" }],
        workLoop: IDLE_WORK,
        frames: frames(["input", "a"], "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("", "", { suspense: { status: "content", note: "Results ready for \"\"" } }),
      },
      {
        descriptionHtml:
          "In the urgent render <code>useDeferredValue</code> notices the value changed. It returns the previous value <code>\"\"</code> and schedules its own re-render on a <span class=\"hl-micro\">TransitionLane</span> to catch up. <code>Results</code> receives the old query, so it does not suspend and this pass is cheap.",
        activeLine: 3,
        doneLines: [1, 2, 7],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "rendering" },
          { id: "d-a", update: 'deferredQuery -> "a"', lane: "TransitionLane", status: "queued" },
        ],
        workLoop: {
          phase: "sync",
          lane: "SyncLane",
          units: [
            unit("Search", "active"),
            unit("<input>", "pending"),
            unit("Suspense", "pending"),
            unit('Results("")', "pending"),
          ],
          progress: 0.25,
          note: "deferred value lags one render",
        },
        frames: frames(["input", "a"], "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("", "", { suspense: { status: "content", note: "Results ready for \"\"" } }),
      },
      {
        descriptionHtml:
          "The urgent render commits in the same frame. The input shows <code>a</code>, and because <code>query !== deferredQuery</code> the old results render dimmed. This is the same visual contract as <code>isPending</code>, without wrapping the setter.",
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "d-a", update: 'deferredQuery -> "a"', lane: "TransitionLane", status: "queued" },
        ],
        workLoop: {
          phase: "commit",
          lane: "SyncLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("Suspense", "done"),
            unit('Results("")', "done"),
          ],
          progress: 1,
          note: "commit in 2 ms",
        },
        frames: frames(["commit", "a"], "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("a", "", { listDimmed: true, suspense: { status: "content", note: "Results ready for \"\"" } }),
      },
      {
        descriptionHtml:
          "The deferred render starts at transition priority with <code>deferredQuery = \"a\"</code>. <code>Results</code> calls <code>use(fetchResults(\"a\"))</code>; the promise is still pending, so the hook throws it and the fiber <span class=\"hl-task\">suspends</span>.",
        activeLine: 14,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "d-a", update: 'deferredQuery -> "a"', lane: "TransitionLane", status: "suspended" },
        ],
        workLoop: {
          phase: "suspended",
          lane: "TransitionLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("Suspense", "done"),
            unit('Results("a")', "active"),
          ],
          progress: 0.75,
          note: "use() threw a pending promise",
        },
        frames: frames(["commit", "a"], "slice", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("a", "", { listDimmed: true, suspense: { status: "content", note: "Results ready for \"\"" } }),
      },
      {
        descriptionHtml:
          "Because this render is on a <span class=\"hl-micro\">TransitionLane</span>, React does not commit the fallback. Replacing visible content with a spinner would be worse than waiting, so it marks the root as suspended, keeps the current tree on screen, and attaches a ping to the promise.",
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "d-a", update: 'deferredQuery -> "a"', lane: "TransitionLane", status: "suspended" },
        ],
        workLoop: {
          phase: "suspended",
          lane: "TransitionLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("Suspense", "done"),
            unit('Results("a")', "active"),
          ],
          progress: 0.75,
          note: "no commit: old UI stays, waiting for ping",
        },
        frames: frames(["commit", "a"], "slice", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"),
        dom: dom("a", "", { listDimmed: true, suspense: { status: "content", note: "old results kept, fallback skipped" } }),
      },
      {
        descriptionHtml:
          "The fetch resolves and the ping wakes the root. React retries the transition render; this time <code>use()</code> returns the data synchronously and <code>Results(\"a\")</code> completes in slices like any other concurrent render.",
        activeLine: 15,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "d-a", update: 'deferredQuery -> "a"', lane: "TransitionLane", status: "rendering" },
        ],
        workLoop: {
          phase: "concurrent",
          lane: "TransitionLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("Suspense", "done"),
            unit('Results("a")', "active"),
          ],
          progress: 0.9,
          note: "retry after ping, data resolved",
        },
        frames: frames(["commit", "a"], "slice", "idle", "idle", "idle", "idle", "idle", "slice", "idle", "idle", "idle", "idle"),
        dom: dom("a", "", { listDimmed: true, suspense: { status: "content", note: "old results kept, fallback skipped" } }),
      },
      {
        descriptionHtml:
          "Commit. <code>deferredQuery</code> now equals <code>query</code>, so the dimming clears and 1,834 results appear. The user saw old content, then new content, and never a spinner.",
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "d-a", update: 'deferredQuery -> "a"', lane: "TransitionLane", status: "committed" },
        ],
        workLoop: {
          phase: "commit",
          lane: "TransitionLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("Suspense", "done"),
            unit('Results("a")', "done"),
          ],
          progress: 1,
          note: "commitRoot, content swapped in place",
        },
        frames: frames(["commit", "a"], "slice", "idle", "idle", "idle", "idle", "idle", "slice", "commit", "idle", "idle", "idle"),
        dom: dom("a", "a", { suspense: { status: "content", note: "Results ready for \"a\"" } }),
      },
      {
        descriptionHtml:
          "Contrast: suppose line 9 passed <code>query</code> straight through. Keystroke <code>b</code> would put <code>Results(\"ab\")</code> into the <span class=\"hl-stack\">SyncLane</span> render, and it would suspend on a fresh fetch. A sync render cannot wait for a promise.",
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "d-a", update: 'deferredQuery -> "a"', lane: "TransitionLane", status: "committed" },
          { id: "q-ab", update: 'setQuery("ab") without defer', lane: "SyncLane", status: "suspended" },
        ],
        workLoop: {
          phase: "suspended",
          lane: "SyncLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("Suspense", "active"),
            unit('Results("ab")', "active"),
          ],
          progress: 0.75,
          note: "sync render hit a pending promise",
        },
        frames: frames(["commit", "a"], "slice", "idle", "idle", "idle", "idle", "idle", "slice", "commit", ["input", "b"], "idle", "idle"),
        dom: dom("a", "a", { suspense: { status: "content", note: "Results ready for \"a\"" } }),
      },
      {
        descriptionHtml:
          "For a non-transition update React commits the nearest Suspense boundary in its fallback state: the results are hidden and <code>Spinner</code> takes their place until the fetch resolves. Transitions avoid this flash, which is why data-driven updates belong in a transition or behind a deferred value.",
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15],
        lanes: [
          { id: "q-a", update: 'setQuery("a")', lane: "SyncLane", status: "committed" },
          { id: "d-a", update: 'deferredQuery -> "a"', lane: "TransitionLane", status: "committed" },
          { id: "q-ab", update: 'setQuery("ab") without defer', lane: "SyncLane", status: "committed" },
        ],
        workLoop: {
          phase: "commit",
          lane: "SyncLane",
          units: [
            unit("Search", "done"),
            unit("<input>", "done"),
            unit("Suspense (fallback)", "done"),
            unit('Results("ab")', "skipped"),
          ],
          progress: 1,
          note: "fallback committed, content hidden",
        },
        frames: frames(["commit", "a"], "slice", "idle", "idle", "idle", "idle", "idle", "slice", "commit", ["commit", "b"], "idle", "idle"),
        dom: dom("ab", "a", { suspense: { status: "fallback", note: "Spinner shown while \"ab\" loads" } }),
      },
    ],
  },
];
