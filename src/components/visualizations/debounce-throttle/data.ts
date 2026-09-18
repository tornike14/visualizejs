import type {
  ComparisonRow,
  DebounceThrottleExample,
  DebounceThrottleStep,
  StateEntry,
  TimelineState,
  TimelineTick,
} from "./types";

/* ── tick builders ── */
const ev = (t: number, label?: string): TimelineTick => ({ t, state: "event", label });
const ign = (t: number, label?: string): TimelineTick => ({ t, state: "ignored", label });
const pend = (t: number, label?: string): TimelineTick => ({ t, state: "pending", label });
const canc = (t: number, label?: string): TimelineTick => ({ t, state: "cancelled", label });
const call = (t: number, label?: string): TimelineTick => ({ t, state: "call", label });
const trail = (t: number, label?: string): TimelineTick => ({ t, state: "trailing", label });

const NONE: StateEntry["tone"] = "muted";

/* ═══════════════════════ Example 1: debounce ═══════════════════════ */

const KEYS = [
  { t: 0, v: "r" },
  { t: 80, v: "re" },
  { t: 160, v: "rea" },
  { t: 400, v: "reac" },
  { t: 480, v: "react" },
];

const keyEvents = (count: number) => KEYS.slice(0, count).map((k) => ev(k.t, `"${k.v}"`));

const debounceTimeline = (
  now: number | null,
  eventCount: number,
  calls: TimelineTick[],
  window?: TimelineState["window"],
): TimelineState => ({
  now,
  maxMs: 900,
  window,
  rows: [
    { id: "events", label: "keyup", ticks: keyEvents(eventCount) },
    { id: "calls", label: "fetch", ticks: calls },
  ],
});

const noTimer: StateEntry[] = [
  { key: "timeoutId", value: "null", tone: NONE },
  { key: "fires at", value: "none", tone: NONE },
  { key: "remaining", value: "none", tone: NONE },
];

const timer = (id: number, firesAt: number, now: number, tone: StateEntry["tone"] = "pending"): StateEntry[] => [
  { key: "timeoutId", value: String(id), tone },
  { key: "fires at", value: `t=${firesAt} ms`, tone },
  { key: "remaining", value: `${firesAt - now} ms`, tone },
];

const closure = (timeoutId: string, lastArgs: string, tone: StateEntry["tone"] = "active"): StateEntry[] => [
  { key: "timeoutId", value: timeoutId, tone: timeoutId === "null" ? NONE : tone },
  { key: "args", value: lastArgs, tone: lastArgs === "none" ? NONE : "active" },
  { key: "this", value: "input", tone: NONE },
];

const D = (
  descriptionHtml: string,
  activeLine: number | null,
  doneLines: number[],
  timeline: TimelineState,
  timerState: StateEntry[],
  closureState: StateEntry[],
  consoleOutput: string[] = [],
): DebounceThrottleStep => ({
  descriptionHtml,
  activeLine,
  doneLines,
  timeline,
  panelState: { timer: timerState, closure: closureState },
  comparison: [],
  consoleOutput,
});

const DEBOUNCE_STEPS: DebounceThrottleStep[] = [
  D(
    `<code>debounce(fn, 300)</code> runs once and returns a wrapper. The wrapper closes over <code>timeoutId</code>, so one variable survives across every keyup that follows.`,
    12,
    [1, 2],
    debounceTimeline(null, 0, []),
    noTimer,
    closure("null", "none"),
  ),
  D(
    `t=0: the user types <code>r</code>. The listener calls the wrapper with <code>"r"</code>, and <code>args</code> captures the value for this invocation.`,
    3,
    [1, 2, 12, 13, 14, 15],
    debounceTimeline(0, 1, []),
    noTimer,
    closure("null", `["r"]`),
  ),
  D(
    `<code>clearTimeout(null)</code> is a no-op, which is why the first call needs no special case. The wrapper always clears before it schedules.`,
    4,
    [1, 2, 3, 12, 13, 14, 15],
    debounceTimeline(0, 1, []),
    noTimer,
    closure("null", `["r"]`),
  ),
  D(
    `<span class="hl-api">setTimeout</span> registers timer <strong>1</strong> to fire at t=300 and stores the id in the closure. Nothing else runs; the wrapper returns and the stack empties.`,
    5,
    [1, 2, 3, 4, 12, 13, 14, 15],
    debounceTimeline(0, 1, [pend(300, "timer 1")], { start: 0, end: 300, label: "wait" }),
    timer(1, 300, 0),
    closure("1", `["r"]`),
  ),
  D(
    `t=80: <code>"re"</code> arrives with 220 ms still on timer 1. <code>clearTimeout(1)</code> <span class="hl-loop">removes it before it can fire</span>, so the pending fetch for "r" never happens.`,
    4,
    [1, 2, 3, 12, 13, 14, 15],
    debounceTimeline(80, 2, [canc(300, "timer 1")]),
    timer(1, 300, 80, "cleared"),
    closure("1", `["re"]`, "cleared"),
  ),
  D(
    `A fresh timer <strong>2</strong> is armed for t=380. The closure now holds the new id, and the 300 ms wait starts over from this keyup.`,
    5,
    [1, 2, 3, 4, 12, 13, 14, 15],
    debounceTimeline(80, 2, [canc(300, "timer 1"), pend(380, "timer 2")], { start: 80, end: 380, label: "wait" }),
    timer(2, 380, 80),
    closure("2", `["re"]`),
  ),
  D(
    `t=160: <code>"rea"</code> cancels timer 2 and arms timer <strong>3</strong> for t=460. Every keyup inside the wait window pushes the deadline forward by a full 300 ms.`,
    5,
    [1, 2, 3, 4, 12, 13, 14, 15],
    debounceTimeline(160, 3, [canc(300, "timer 1"), canc(380, "timer 2"), pend(460, "timer 3")], { start: 160, end: 460, label: "wait" }),
    timer(3, 460, 160),
    closure("3", `["rea"]`),
  ),
  D(
    `t=400: the user paused for 240 ms, not 300. Timer 3 still had 60 ms left, so <code>"reac"</code> cancels it and arms timer <strong>4</strong> for t=700. The pause was too short to count as silence.`,
    5,
    [1, 2, 3, 4, 12, 13, 14, 15],
    debounceTimeline(400, 4, [canc(300, "timer 1"), canc(380, "timer 2"), canc(460, "timer 3"), pend(700, "timer 4")], { start: 400, end: 700, label: "wait" }),
    timer(4, 700, 400),
    closure("4", `["reac"]`),
  ),
  D(
    `t=480: <code>"react"</code> cancels timer 4 and arms timer <strong>5</strong> for t=780. Typing stops here, so this timer is the first one that will survive.`,
    5,
    [1, 2, 3, 4, 12, 13, 14, 15],
    debounceTimeline(480, 5, [canc(300, "timer 1"), canc(380, "timer 2"), canc(460, "timer 3"), canc(700, "timer 4"), pend(780, "timer 5")], { start: 480, end: 780, label: "wait" }),
    timer(5, 780, 480),
    closure("5", `["react"]`),
  ),
  D(
    `t=780: the timer expires and its callback is queued as a <span class="hl-task">macrotask</span>. The <span class="hl-loop">event loop</span> runs it once the stack is empty, so a long synchronous task could delay it past 780.`,
    6,
    [1, 2, 3, 4, 5, 12, 13, 14, 15],
    debounceTimeline(780, 5, [canc(300, "timer 1"), canc(380, "timer 2"), canc(460, "timer 3"), canc(700, "timer 4"), pend(780, "timer 5")]),
    timer(5, 780, 780, "success"),
    closure("null", `["react"]`),
  ),
  D(
    `<code>fn.apply(this, args)</code> forwards the receiver and the arguments from the <strong>last</strong> invocation. Earlier values were overwritten in the closure, which is exactly the behaviour a search box wants.`,
    7,
    [1, 2, 3, 4, 5, 6, 12, 13, 14, 15],
    debounceTimeline(780, 5, [canc(300, "timer 1"), canc(380, "timer 2"), canc(460, "timer 3"), canc(700, "timer 4"), call(780, `fetch "react"`)]),
    noTimer,
    closure("null", `["react"]`),
    [`fetch react`],
  ),
  D(
    `Five keyups produced one call. This only works because the closure outlives every event. A debounced function created inside a React render body gets a new closure each render, so its timer is orphaned and it never fires; create it once with <code>useMemo</code> or <code>useRef</code>.`,
    null,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15],
    debounceTimeline(780, 5, [canc(300, "timer 1"), canc(380, "timer 2"), canc(460, "timer 3"), canc(700, "timer 4"), call(780, `fetch "react"`)]),
    noTimer,
    closure("null", `["react"]`),
    [`fetch react`],
  ),
];

/* ═══════════════════════ Example 2: throttle ═══════════════════════ */

const SCROLL_TIMES = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
const scrollY = (t: number) => t * 2;

const scrollEvents = (upTo: number, calledAt: number[]) =>
  SCROLL_TIMES.filter((t) => t <= upTo).map((t) =>
    calledAt.includes(t) ? ev(t, `y=${scrollY(t)}`) : ign(t, `y=${scrollY(t)}`),
  );

const throttleTimeline = (
  now: number | null,
  upTo: number,
  calledAt: number[],
  calls: TimelineTick[],
  window?: TimelineState["window"],
): TimelineState => ({
  now,
  maxMs: 700,
  window,
  rows: [
    { id: "events", label: "scroll", ticks: now === null ? [] : scrollEvents(upTo, calledAt) },
    { id: "calls", label: "handler", ticks: calls },
  ],
});

const throttleState = (
  inThrottle: boolean,
  pendingArgs: string,
  trailing: boolean,
): StateEntry[] => [
  { key: "inThrottle", value: String(inThrottle), tone: inThrottle ? "pending" : NONE },
  { key: "pendingArgs", value: pendingArgs, tone: pendingArgs === "null" ? NONE : trailing ? "active" : "muted" },
  { key: "trailing", value: String(trailing), tone: trailing ? "success" : NONE },
];

const T = (
  descriptionHtml: string,
  activeLine: number | null,
  doneLines: number[],
  timeline: TimelineState,
  timerState: StateEntry[],
  state: StateEntry[],
  consoleOutput: string[] = [],
): DebounceThrottleStep => ({
  descriptionHtml,
  activeLine,
  doneLines,
  timeline,
  panelState: { timer: timerState, throttle: state },
  comparison: [],
  consoleOutput,
});

const LEAD = [0, 200, 400];
const CALLS_0 = [call(0, "y=0")];
const CALLS_200 = [...CALLS_0, call(200, "y=400")];
const CALLS_400 = [...CALLS_200, call(400, "y=800")];
const SETUP_DONE = [1, 2, 3, 20, 21];

const THROTTLE_STEPS: DebounceThrottleStep[] = [
  T(
    `<code>throttle(fn, 200)</code> returns a wrapper that closes over <code>inThrottle</code> and <code>pendingArgs</code>. The page scrolls continuously, firing an event every 50 ms.`,
    20,
    [1, 2, 3, 15],
    throttleTimeline(null, 0, [], []),
    noTimer,
    throttleState(false, "null", false),
  ),
  T(
    `t=0: the first scroll event arrives. <code>inThrottle</code> is <code>false</code>, so the guard on line 16 does not return and the call proceeds to <code>run</code>.`,
    16,
    [...SETUP_DONE, 15],
    throttleTimeline(0, 0, LEAD, []),
    noTimer,
    throttleState(false, "null", false),
  ),
  T(
    `<code>fn.apply(ctx, args)</code> runs <strong>immediately</strong> with <code>y=0</code>. This is the leading edge: throttle reacts to the first event with zero delay, unlike debounce.`,
    5,
    [...SETUP_DONE, 4, 15, 16, 17],
    throttleTimeline(0, 0, LEAD, CALLS_0),
    noTimer,
    throttleState(false, "null", false),
    ["scrollY 0"],
  ),
  T(
    `<code>inThrottle</code> flips to <code>true</code> and <span class="hl-api">setTimeout</span> arms timer <strong>1</strong> for t=200. The window from 0 to 200 is now closed to further calls.`,
    7,
    [...SETUP_DONE, 4, 5, 6, 15, 16, 17],
    throttleTimeline(0, 0, LEAD, CALLS_0, { start: 0, end: 200, label: "window" }),
    timer(1, 200, 0),
    throttleState(true, "null", false),
    ["scrollY 0"],
  ),
  T(
    `t=50, 100, 150: three events hit the guard while <code>inThrottle</code> is true. Each one overwrites <code>pendingArgs</code> and returns. With <code>trailing</code> off, those args are stored but never used.`,
    16,
    [...SETUP_DONE, 4, 5, 6, 7, 15, 17],
    throttleTimeline(150, 150, LEAD, CALLS_0, { start: 0, end: 200, label: "window" }),
    timer(1, 200, 150),
    throttleState(true, "[300]", false),
    ["scrollY 0"],
  ),
  T(
    `t=200: timer 1 expires. Its callback is a <span class="hl-task">macrotask</span>, queued before the scroll event that fires at the same instant, so it runs first and resets <code>inThrottle</code> to <code>false</code>. Line 9 is skipped because <code>trailing</code> is false.`,
    8,
    [...SETUP_DONE, 4, 5, 6, 7, 15, 16, 17],
    throttleTimeline(200, 150, LEAD, CALLS_0),
    timer(1, 200, 200, "success"),
    throttleState(false, "[300]", false),
    ["scrollY 0"],
  ),
  T(
    `t=200: the scroll event at <code>y=400</code> now passes the guard. The handler runs, <code>inThrottle</code> is set again, and timer <strong>2</strong> closes the window until t=400.`,
    17,
    [...SETUP_DONE, 4, 5, 6, 7, 8, 15, 16],
    throttleTimeline(200, 200, LEAD, CALLS_200, { start: 200, end: 400, label: "window" }),
    timer(2, 400, 200),
    throttleState(true, "[300]", false),
    ["scrollY 0", "scrollY 400"],
  ),
  T(
    `t=250, 300, 350: ignored. The handler ran at most once per 200 ms regardless of how many events arrived, which is the whole contract of throttle.`,
    16,
    [...SETUP_DONE, 4, 5, 6, 7, 8, 15, 17],
    throttleTimeline(350, 350, LEAD, CALLS_200, { start: 200, end: 400, label: "window" }),
    timer(2, 400, 350),
    throttleState(true, "[700]", false),
    ["scrollY 0", "scrollY 400"],
  ),
  T(
    `t=400: timer 2 resets the flag, the event at <code>y=800</code> calls through, and timer <strong>3</strong> arms for t=600.`,
    17,
    [...SETUP_DONE, 4, 5, 6, 7, 8, 15, 16],
    throttleTimeline(400, 400, LEAD, CALLS_400, { start: 400, end: 600, label: "window" }),
    timer(3, 600, 400),
    throttleState(true, "[700]", false),
    ["scrollY 0", "scrollY 400", "scrollY 800"],
  ),
  T(
    `t=450, 500: ignored, and then scrolling stops. Eleven events became three calls, but the final position <code>y=1000</code> was never reported. Leading-only throttle can leave the UI one step stale.`,
    16,
    [...SETUP_DONE, 4, 5, 6, 7, 8, 15, 17],
    throttleTimeline(500, 500, LEAD, CALLS_400, { start: 400, end: 600, label: "window" }),
    timer(3, 600, 500),
    throttleState(true, "[1000]", false),
    ["scrollY 0", "scrollY 400", "scrollY 800"],
  ),
  T(
    `Rerun with <code>trailing = true</code>. t=0 calls on the leading edge as before; t=50 to 150 are ignored, but now <code>pendingArgs</code> holding <code>[300]</code> matters.`,
    16,
    [...SETUP_DONE, 4, 5, 6, 7, 15, 17],
    throttleTimeline(150, 150, [0], CALLS_0, { start: 0, end: 200, label: "window" }),
    timer(1, 200, 150),
    throttleState(true, "[300]", true),
    ["scrollY 0"],
  ),
  T(
    `t=200: the timer callback sees <code>trailing && pendingArgs</code>, clears the slot, and calls <code>run</code> with <code>y=300</code>. That <span class="hl-micro">trailing call</span> re-arms the window to t=400, so the event at t=200 is ignored instead of calling.`,
    11,
    [...SETUP_DONE, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17],
    throttleTimeline(200, 200, [0], [...CALLS_0, trail(200, "y=300")], { start: 200, end: 400, label: "window" }),
    timer(2, 400, 200),
    throttleState(true, "null", true),
    ["scrollY 0", "scrollY 300"],
  ),
  T(
    `The pattern repeats: trailing calls at t=400 with <code>y=700</code> and t=600 with <code>y=1000</code>. The last event always reaches the handler, at the cost of up to one window of delay. lodash enables leading and trailing together by default.`,
    11,
    [...SETUP_DONE, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19],
    throttleTimeline(600, 500, [0], [...CALLS_0, trail(200, "y=300"), trail(400, "y=700"), trail(600, "y=1000")]),
    noTimer,
    throttleState(false, "null", true),
    ["scrollY 0", "scrollY 300", "scrollY 700", "scrollY 1000"],
  ),
];

/* ═══════════════════════ Example 3: compare ═══════════════════════ */

const BURST = [0, 60, 120, 180, 500, 560, 620];

const compareTimeline = (
  now: number | null,
  upTo: number,
  debounce: TimelineTick[],
  throttle: TimelineTick[],
): TimelineState => ({
  now,
  maxMs: 900,
  rows: [
    { id: "events", label: "input", ticks: now === null ? [] : BURST.filter((t) => t <= upTo).map((t) => ev(t)) },
    { id: "debounce", label: "debounce", ticks: debounce },
    { id: "throttle", label: "throttle", ticks: throttle },
  ],
});

const throttleEvents = (upTo: number) =>
  BURST.filter((t) => t <= upTo).map((t) => (t === 0 || t === 500 ? call(t) : ign(t)));

const ROW_TIMING: ComparisonRow = { aspect: "fires", debounce: "after events stop", throttle: "at most once per window" };
const ROW_FIRST: ComparisonRow = { aspect: "first event", debounce: "delayed by wait", throttle: "immediate (leading)" };
const ROW_ARGS: ComparisonRow = { aspect: "args used", debounce: "last invocation", throttle: "first, or last with trailing" };
const ROW_USE: ComparisonRow = { aspect: "use for", debounce: "search, resize end, autosave", throttle: "scroll, mousemove, analytics" };
const ROW_CTRL: ComparisonRow = { aspect: "controls", debounce: "cancel, flush, maxWait", throttle: "leading, trailing" };

const C = (
  descriptionHtml: string,
  activeLine: number | null,
  doneLines: number[],
  timeline: TimelineState,
  comparison: ComparisonRow[],
  consoleOutput: string[] = [],
): DebounceThrottleStep => ({
  descriptionHtml,
  activeLine,
  doneLines,
  timeline,
  panelState: {},
  comparison,
  consoleOutput,
});

const DEB_BURST1_CANCELLED = [canc(200), canc(260), canc(320)];
const DEB_AFTER_1 = [...DEB_BURST1_CANCELLED, call(380)];
const DEB_BURST2_CANCELLED = [...DEB_AFTER_1, canc(700), canc(760)];

const COMPARE_STEPS: DebounceThrottleStep[] = [
  C(
    `Both wrappers get the same 200 ms setting and the same seven-event burst: four events 60 ms apart, a 320 ms pause, then three more. The rows below show what each wrapper lets through.`,
    1,
    [],
    compareTimeline(null, 0, [], []),
    [ROW_TIMING],
  ),
  C(
    `t=0: the first event. <span class="hl-api">Debounce</span> arms a timer for t=200 and does nothing else. <span class="hl-task">Throttle</span> calls the handler immediately and closes its window until t=200.`,
    2,
    [1],
    compareTimeline(0, 0, [pend(200)], throttleEvents(0)),
    [ROW_TIMING, ROW_FIRST],
    ["updatePosition(0)"],
  ),
  C(
    `t=60, 120, 180: debounce cancels and re-arms on every event, pushing its deadline to t=380. Throttle ignores all three because the window is still closed.`,
    5,
    [1, 2],
    compareTimeline(180, 180, [...DEB_BURST1_CANCELLED, pend(380)], throttleEvents(180)),
    [ROW_TIMING, ROW_FIRST],
    ["updatePosition(0)"],
  ),
  C(
    `t=200: the throttle window reopens, but no event is waiting, so nothing happens. t=380: 200 ms of silence have passed and debounce fires with the arguments from t=180.`,
    5,
    [1, 2],
    compareTimeline(380, 180, DEB_AFTER_1, throttleEvents(180)),
    [ROW_TIMING, ROW_FIRST, ROW_ARGS],
    ["updatePosition(0)", "fetchResults(query)"],
  ),
  C(
    `t=500 to 620: the second burst. Throttle calls at t=500 and ignores 560 and 620. Debounce restarts its cycle and lands on t=820, after the last event.`,
    9,
    [1, 2, 5],
    compareTimeline(620, 620, [...DEB_BURST2_CANCELLED, pend(820)], throttleEvents(620)),
    [ROW_TIMING, ROW_FIRST, ROW_ARGS],
    ["updatePosition(0)", "fetchResults(query)", "updatePosition(1)"],
  ),
  C(
    `t=820: debounce fires again. Both produced two calls from seven events, but throttle answered at the <strong>start</strong> of each burst and debounce at the <strong>end</strong>. That timing difference decides which one to use.`,
    9,
    [1, 2, 5],
    compareTimeline(820, 620, [...DEB_BURST2_CANCELLED, call(820)], throttleEvents(620)),
    [ROW_TIMING, ROW_FIRST, ROW_ARGS],
    ["updatePosition(0)", "fetchResults(query)", "updatePosition(1)", "fetchResults(query)"],
  ),
  C(
    `Use <span class="hl-api">debounce</span> when only the final state matters: search-as-you-type, recalculating layout after a resize ends, or autosaving a form once the user stops editing. Intermediate values are wasted work.`,
    6,
    [1, 2, 5, 9],
    compareTimeline(820, 620, [...DEB_BURST2_CANCELLED, call(820)], throttleEvents(620)),
    [ROW_TIMING, ROW_FIRST, ROW_ARGS, ROW_USE],
    ["updatePosition(0)", "fetchResults(query)", "updatePosition(1)", "fetchResults(query)"],
  ),
  C(
    `Use <span class="hl-task">throttle</span> when the UI must keep up during the stream: scroll position indicators, mousemove tracking, or batching analytics events. Debounce would freeze until the stream ended.`,
    10,
    [1, 2, 5, 6, 9],
    compareTimeline(820, 620, [...DEB_BURST2_CANCELLED, call(820)], throttleEvents(620)),
    [ROW_TIMING, ROW_FIRST, ROW_ARGS, ROW_USE],
    ["updatePosition(0)", "fetchResults(query)", "updatePosition(1)", "fetchResults(query)"],
  ),
  C(
    `Library versions expose the closure through methods. <code>cancel()</code> clears the pending timer, which a component must call on unmount to avoid a stale callback. <code>flush()</code> runs the pending call now, useful before navigating away.`,
    14,
    [1, 2, 5, 6, 9, 10, 13],
    compareTimeline(820, 620, [...DEB_BURST2_CANCELLED, call(820)], throttleEvents(620)),
    [ROW_TIMING, ROW_FIRST, ROW_ARGS, ROW_USE, ROW_CTRL],
    ["updatePosition(0)", "fetchResults(query)", "updatePosition(1)", "fetchResults(query)"],
  ),
  C(
    `<code>maxWait</code> guarantees a debounced call at least every N ms even while events keep coming, which is how lodash implements throttle: <code>_.throttle</code> is <code>_.debounce</code> with <code>maxWait = wait</code>. <code>leading</code> and <code>trailing</code> choose which edge of the window calls.`,
    16,
    [1, 2, 5, 6, 9, 10, 13, 14, 15],
    compareTimeline(820, 620, [...DEB_BURST2_CANCELLED, call(820)], throttleEvents(620)),
    [ROW_TIMING, ROW_FIRST, ROW_ARGS, ROW_USE, ROW_CTRL],
    ["updatePosition(0)", "fetchResults(query)", "updatePosition(1)", "fetchResults(query)"],
  ),
  C(
    `One rule for both: create the wrapper once. A wrapper built inside a render function or an inline listener gets a fresh closure every time, so its timer state resets and the pending call is lost. Keep it in module scope, <code>useMemo</code>, or <code>useRef</code>.`,
    null,
    [1, 2, 5, 6, 9, 10, 13, 14, 15, 16],
    compareTimeline(820, 620, [...DEB_BURST2_CANCELLED, call(820)], throttleEvents(620)),
    [ROW_TIMING, ROW_FIRST, ROW_ARGS, ROW_USE, ROW_CTRL],
    ["updatePosition(0)", "fetchResults(query)", "updatePosition(1)", "fetchResults(query)"],
  ),
];

/* ═══════════════════════ Examples ═══════════════════════ */

export const EXAMPLES: DebounceThrottleExample[] = [
  {
    id: "debounce-search",
    title: "Debounce a search input",
    description:
      "Five keyups in 480 ms, a 300 ms wait, and a single fetch. Watch the closure cancel and re-arm the timer on every keystroke.",
    kind: "debounce",
    codeLines: [
      { num: 1, text: "function debounce(fn, wait) {" },
      { num: 2, text: "  let timeoutId = null;" },
      { num: 3, text: "  return function (...args) {" },
      { num: 4, text: "    clearTimeout(timeoutId);" },
      { num: 5, text: "    timeoutId = setTimeout(() => {" },
      { num: 6, text: "      timeoutId = null;" },
      { num: 7, text: "      fn.apply(this, args);" },
      { num: 8, text: "    }, wait);" },
      { num: 9, text: "  };" },
      { num: 10, text: "}" },
      { num: 11, text: "" },
      { num: 12, text: "const search = debounce((q) => {" },
      { num: 13, text: "  console.log('fetch', q);" },
      { num: 14, text: "}, 300);" },
      { num: 15, text: "input.addEventListener('keyup', (e) => search(e.target.value));" },
    ],
    panelDefs: [
      { id: "timer", title: "Timer", tone: "cyan" },
      { id: "closure", title: "Closure State", tone: "violet" },
    ],
    steps: DEBOUNCE_STEPS,
  },
  {
    id: "throttle-scroll",
    title: "Throttle a scroll handler",
    description:
      "Scroll events every 50 ms, a 200 ms limit. Leading-edge calls first, then the trailing option that delivers the last event.",
    kind: "throttle",
    codeLines: [
      { num: 1, text: "function throttle(fn, limit, trailing = false) {" },
      { num: 2, text: "  let inThrottle = false;" },
      { num: 3, text: "  let pendingArgs = null;" },
      { num: 4, text: "  const run = (ctx, args) => {" },
      { num: 5, text: "    fn.apply(ctx, args);" },
      { num: 6, text: "    inThrottle = true;" },
      { num: 7, text: "    setTimeout(() => {" },
      { num: 8, text: "      inThrottle = false;" },
      { num: 9, text: "      if (trailing && pendingArgs) {" },
      { num: 10, text: "        const a = pendingArgs; pendingArgs = null;" },
      { num: 11, text: "        run(ctx, a);" },
      { num: 12, text: "      }" },
      { num: 13, text: "    }, limit);" },
      { num: 14, text: "  };" },
      { num: 15, text: "  return function (...args) {" },
      { num: 16, text: "    if (inThrottle) { pendingArgs = args; return; }" },
      { num: 17, text: "    run(this, args);" },
      { num: 18, text: "  };" },
      { num: 19, text: "}" },
      { num: 20, text: "const onScroll = throttle((y) => console.log('scrollY', y), 200);" },
      { num: 21, text: "addEventListener('scroll', () => onScroll(scrollY));" },
    ],
    panelDefs: [
      { id: "timer", title: "Timer", tone: "cyan" },
      { id: "throttle", title: "Throttle State", tone: "green" },
    ],
    steps: THROTTLE_STEPS,
  },
  {
    id: "compare",
    title: "Choosing between them",
    description:
      "The same burst through both wrappers side by side, plus when to pick which, cancel and flush, and the lodash options.",
    kind: "compare",
    codeLines: [
      { num: 1, text: "const search = debounce(fetchResults, 200);" },
      { num: 2, text: "const onScroll = throttle(updatePosition, 200);" },
      { num: 3, text: "" },
      { num: 4, text: "// debounce: wait until the user stops" },
      { num: 5, text: "input.addEventListener('input', search);" },
      { num: 6, text: "window.addEventListener('resize', debounce(relayout, 150));" },
      { num: 7, text: "" },
      { num: 8, text: "// throttle: at most once per window" },
      { num: 9, text: "window.addEventListener('scroll', onScroll);" },
      { num: 10, text: "window.addEventListener('mousemove', throttle(track, 100));" },
      { num: 11, text: "" },
      { num: 12, text: "// lodash options and controls" },
      { num: 13, text: "const save = _.debounce(persist, 1000, { maxWait: 5000 });" },
      { num: 14, text: "save.cancel(); // drop the pending call" },
      { num: 15, text: "save.flush();  // run the pending call now" },
      { num: 16, text: "_.throttle(fn, 200, { leading: true, trailing: false });" },
    ],
    panelDefs: [],
    steps: COMPARE_STEPS,
  },
];
