import type { TopicTheoryContent } from "@/content/theory/types";

export const debounceThrottleTheory: TopicTheoryContent = {
  summary:
    "Debounce and throttle are wrapper functions that limit how often an event handler runs. Debounce waits for a pause in events before calling once; throttle guarantees at most one call per time window. Both are built from a closure and a timer.",
  whatItIs: [
    "Browsers emit some events far faster than an application can usefully respond to them. A user typing fires a keyup every 50 to 100 ms, scrolling fires dozens of events per second, and resizing a window fires continuously while the drag is in progress. Running a network request or a layout calculation on every one of those events wastes work and can make the page feel slower, not faster.",
    "Debounce solves this by postponing the call until the events stop. Each new event cancels the previous timer and starts a fresh one, so the wrapped function only runs after a full quiet period of the configured length. Throttle takes the opposite stance: it lets the first event through immediately, then ignores everything else until a fixed window has elapsed, so the handler runs at a steady maximum rate while the stream continues.",
    "Both are implemented with the same two ingredients. A closure holds state that must survive between calls, such as the current timeout id or an in-window flag, and setTimeout provides the clock. The wrapper returned by debounce or throttle is the only thing the caller sees, and it forwards the receiver and arguments to the real function with fn.apply so that method handlers and event arguments still work.",
    "The choice between them is about which moment matters. If only the final state is useful, such as the finished search query or the settled window size, debounce is correct because intermediate calls would be thrown away. If the UI must track the stream while it happens, such as a scroll position indicator or a drag preview, throttle is correct because debounce would freeze until the user stopped.",
  ],
  howItWorks: [
    "Step 1: the factory runs once. debounce(fn, wait) or throttle(fn, limit) executes a single time, declares its state variables, and returns an inner function. That inner function closes over the state, which is why the state persists across every later event.",
    "Step 2: an event invokes the wrapper. The wrapper receives the same this and arguments the listener would have received. Debounce stores them and clears any pending timer; throttle checks whether a window is currently open.",
    "Step 3: the wrapper schedules or skips. Debounce always calls setTimeout for a new deadline of wait milliseconds. Throttle either calls fn immediately and opens a window with setTimeout, or, if the window is still open, records the arguments as pending and returns without calling.",
    "Step 4: the timer callback is queued as a macrotask. When the timer expires, the callback joins the task queue and the event loop runs it once the call stack is empty. A long synchronous task can delay it past the nominal deadline.",
    "Step 5: the callback delivers the call. For debounce it invokes fn.apply(this, lastArgs) with whatever the most recent event provided. For throttle it closes the window, and with the trailing option enabled, it invokes fn with the pending arguments and opens a new window.",
    "Step 6: control methods act on the same closure. cancel() clears the pending timer so nothing fires, and flush() runs the pending call immediately. Both are needed for cleanup when a component unmounts or the user navigates away.",
  ],
  commonMistakes: [
    {
      title: "Creating the wrapper on every render",
      explanation:
        "Calling debounce inside a React component body, or inline in an event handler, produces a new closure with fresh state on each render. The previous timer belongs to a wrapper that no longer receives events, so the pending call either never fires or fires with stale data.",
      fix: "Create the debounced or throttled function once, at module scope, or inside useMemo or useRef with a stable dependency list. Cancel it in the cleanup of a useEffect.",
    },
    {
      title: "Using an arrow function and losing this",
      explanation:
        "If the returned wrapper is an arrow function, this is captured from the factory scope instead of the caller, so method-style handlers see the wrong receiver. Forwarding with fn(...args) instead of fn.apply(this, args) has the same effect.",
      fix: "Return a regular function expression from the factory and forward the receiver explicitly with fn.apply(this, args) or fn.call(this, ...args).",
    },
    {
      title: "Debouncing something that needs live feedback",
      explanation:
        "A debounced scroll or drag handler runs only after the user stops, so a progress indicator or a sticky header appears to lag behind and then jump. The wait time reads as unresponsiveness.",
      fix: "Use throttle for handlers that should track a stream in progress, and reserve debounce for work where only the final value matters.",
    },
    {
      title: "Forgetting the pending call on unmount",
      explanation:
        "The timer inside the closure keeps running after the component that created it is gone. When it fires it can call setState on an unmounted component or send a request that nobody will read.",
      fix: "Expose or use a cancel() method and call it in the effect cleanup. Use flush() first if the pending work should still be saved.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is the difference between debounce and throttle?",
      answer:
        "Debounce delays the call until a quiet period of the configured length has passed since the last event, so a burst of events produces one call at the end. Throttle calls at most once per time window while events continue, so a burst produces calls at a steady rate, starting with the first event.",
    },
    {
      question: "Implement debounce.",
      answer:
        "The factory declares a timeout id in its closure and returns a regular function. Each call clears the existing timer and schedules a new one for the wait period. The timer callback forwards this and the latest arguments to the wrapped function with apply.",
      codeExample: {
        language: "javascript",
        code: `function debounce(fn, wait) {
  let timeoutId = null;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn.apply(this, args);
    }, wait);
  };
}`,
      },
    },
    {
      question: "Implement a leading-edge throttle.",
      answer:
        "The closure holds a flag that marks an open window. If the flag is set the call returns immediately. Otherwise the wrapper calls the function, sets the flag, and schedules a timer to clear it after the limit. A trailing variant also records the last skipped arguments and calls with them when the window closes.",
      codeExample: {
        language: "javascript",
        code: `function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (inThrottle) return;
    fn.apply(this, args);
    inThrottle = true;
    setTimeout(() => {
      inThrottle = false;
    }, limit);
  };
}`,
      },
    },
    {
      question: "Why does a debounced function created inside a React render body never fire?",
      answer:
        "Each render calls debounce again and produces a new closure with its own timeoutId. The listener is attached to the newest wrapper, so events clear timers on a wrapper that was created this render and the previous render's timer is orphaned. If a render happens before the wait elapses, no single closure ever reaches its deadline. The fix is to create the wrapper once with useMemo or useRef.",
    },
    {
      question: "What do lodash's leading, trailing, and maxWait options do?",
      answer:
        "leading calls on the first event of a burst and trailing calls after the burst ends; debounce defaults to trailing only and throttle enables both. maxWait forces a debounced function to run at least every N milliseconds even if events never stop, which is how lodash builds throttle on top of debounce by setting maxWait equal to wait.",
    },
  ],
  relatedTopicIds: ["closures", "event-loop", "event-delegation", "async-await"],
};
