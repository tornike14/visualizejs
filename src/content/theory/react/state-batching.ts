import type { TopicTheoryContent } from "@/content/theory/types";

export const stateBatchingTheory: TopicTheoryContent = {
  summary:
    "State batching is how React collects every setState call made during one event handler or callback into a single render, so the UI updates once with the final result instead of once per call.",
  whatItIs: [
    "Calling setState does not change anything immediately. It records an update on the hook's queue and asks React to render later. Batching is the rule for when \"later\" is: React waits until the current handler or callback finishes, then processes every queued update in one render pass and commits once.",
    "Each render captures its state as a snapshot. The count variable inside an event handler is a plain constant captured by a closure, so three setCount(count + 1) calls in a row all compute the same number. To build on the pending value instead of the snapshot, you pass an updater function, setCount(c => c + 1), and React calls it with the result of the previous queued update.",
    "Before React 18, batching only applied inside React's own event handlers. Updates made in a setTimeout, a promise callback, or a native event listener each rendered synchronously on their own. React 18 introduced automatic batching for roots created with createRoot: updates are batched wherever they come from, with the batch boundary at the end of the callback that issued them.",
    "This design matters because rendering is the expensive part. One render per tick keeps intermediate states off the screen, avoids running effects for values nobody sees, and lets React treat the update queue as data it can reorder by priority under concurrent rendering. flushSync exists as the explicit escape hatch for the rare case where the DOM must be updated before the next line of code runs.",
  ],
  howItWorks: [
    "Step 1: a component renders and useState stores its current value in the hook object on the fiber. The event handlers created during that render close over the snapshot value.",
    "Step 2: an event fires. React runs the handler inside a batched context, so any setState call appends an update object to the hook's queue, marks the fiber as needing work, and returns without rendering.",
    "Step 3: each update records either a value or an updater function. A value replaces the state when its turn comes; an updater is stored uncalled and receives the pending state at that position in the queue.",
    "Step 4: the handler returns. React flushes the scheduled work: it calls the component again, and useState walks the queue in call order from the base state to compute the new memoizedState.",
    "Step 5: the render produces one new element tree and React commits it once. The DOM reflects the final state, the queue is cleared, and the new render creates fresh closures with the updated snapshot.",
    "Step 6: outside event handlers, React 18+ applies the same rule per callback. A microtask or timer callback that calls setState several times still produces a single flush when that callback ends. flushSync forces the flush to happen synchronously inside the call instead.",
  ],
  commonMistakes: [
    {
      title: "Expecting the next line to see the new state",
      explanation:
        "Logging count right after setCount prints the old value. The handler's count is a closure over the render that created it, and the render that would produce the new value has not run yet.",
      fix: "Compute the next value in a local variable and use that, or move logic that depends on the committed state into a useEffect keyed on that state.",
    },
    {
      title: "Calling setCount(count + 1) repeatedly",
      explanation:
        "Every call reads the same snapshot, so three calls queue three updates with the same payload and the final state increments by one.",
      fix: "Use the updater form, setCount(c => c + 1), whenever the next state depends on the previous state. React feeds each updater the result of the one before it.",
    },
    {
      title: "Assuming timeouts and promises batch on every React version",
      explanation:
        "On a React 17 legacy root, or a React 18 app still mounted with ReactDOM.render, each setState inside a setTimeout or .then callback triggers its own synchronous render.",
      fix: "Mount with createRoot to get automatic batching everywhere. If a component still needs several updates to land together on an older root, wrap them in unstable_batchedUpdates or combine them into one state object.",
    },
    {
      title: "Reaching for flushSync to fix ordering bugs",
      explanation:
        "flushSync forces a synchronous render and commit in the middle of the handler, which defeats batching and can noticeably hurt performance when overused.",
      fix: "Reserve flushSync for cases where the DOM must be current before the next statement, such as measuring a node or scrolling to a freshly inserted item. Everything else belongs in effects or derived state.",
    },
  ],
  interviewQuestions: [
    {
      question: "Why does this handler leave count at 1 instead of 3?",
      answer:
        "count is a constant captured when the component rendered with value 0. All three calls evaluate count + 1 to 1 and queue three replace-with-1 updates. React processes them in one render and the result is 1.",
      codeExample: {
        language: "jsx",
        code: `function handleClick() {
  setCount(count + 1); // queues 1
  setCount(count + 1); // queues 1
  setCount(count + 1); // queues 1
}
// one render, count === 1`,
      },
    },
    {
      question: "How does the updater form differ from passing a value?",
      answer:
        "A value update replaces the state outright when React reaches it in the queue. An updater is stored as a function and called during the render with the pending state at that point, so consecutive updaters chain: 0 to 1 to 2 to 3. Mixing them still runs in call order, so a trailing value overwrites whatever the updaters computed.",
      codeExample: {
        language: "jsx",
        code: `setCount(count + 5);   // queue: replace with 5  (count was 0)
setCount(c => c + 1);  // queue: 5 -> 6
setCount(42);          // queue: replace with 42
// one render, count === 42`,
      },
    },
    {
      question: "What changed about batching in React 18?",
      answer:
        "React 17 batched updates only inside React event handlers; updates in timeouts, promises, and native listeners each rendered on their own. React 18 with createRoot batches automatically in every callback, so two setState calls inside a .then produce one render instead of two.",
    },
    {
      question: "When would you use flushSync, and what does it cost?",
      answer:
        "flushSync runs its callback, then synchronously renders and commits any updates it queued before returning, so code after the call can read the updated DOM. It bypasses batching for that update and blocks the main thread for the render, so it should be limited to layout measurement or scroll positioning after a state change.",
      codeExample: {
        language: "jsx",
        code: `flushSync(() => {
  setItems([...items, newItem]);
});
// DOM already has the new row here
listRef.current.lastChild.scrollIntoView();`,
      },
    },
    {
      question: "How does batching relate to the event loop?",
      answer:
        "React does not use a timer to batch. Inside an event handler it holds updates until the handler returns and then flushes synchronously in the same task. For updates issued from a microtask or timer callback, React 18 schedules a flush that runs once that callback finishes, so the batch boundary lines up with a single unit of event loop work.",
    },
  ],
  relatedTopicIds: ["hooks", "render-cycle", "concurrent-rendering", "event-loop"],
};
