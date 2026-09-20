import type { TopicTheoryContent } from "@/content/theory/types";

export const concurrentRenderingTheory: TopicTheoryContent = {
  summary:
    "Concurrent rendering lets React prepare a new tree in small interruptible chunks, so urgent updates like typing can cut in front of slow ones, and half-finished work can be thrown away without the user ever seeing it.",
  whatItIs: [
    "Before React 18, every state update produced one synchronous render: React called your components from the root down and did not return control to the browser until the whole tree was built and committed. A slow render of a large list meant dropped frames, and a keystroke that arrived during it waited until the render finished. Concurrent rendering changes the shape of that work without changing what your components look like.",
    "The core idea is priority. Every update is stamped with a lane, one bit in a 31-bit mask defined in ReactFiberLane. A state update inside a click or keypress gets SyncLane. An update wrapped in startTransition, or the catch-up render scheduled by useDeferredValue, gets a TransitionLane. When React decides what to render next it picks the highest priority pending lane, and it renders only the updates that belong to that lane, leaving lower priority updates queued for a later pass.",
    "Transition lanes are rendered by workLoopConcurrent, which processes one fiber at a time and asks the Scheduler package whether it should yield. The Scheduler answers yes roughly every 5 ms. React then exits the loop and posts a MessageChannel message to resume, which gives the browser a chance to paint and dispatch events. If a higher priority update arrives during one of those gaps, React abandons the work-in-progress tree and starts again with the new state.",
    "Throwing work away is safe because the render phase is pure: it only builds fibers in memory and never touches the DOM or runs effects. The commit phase, which does touch the DOM, is still synchronous and cannot be interrupted, so the screen never shows a partially applied update. Concurrent behaviour is opted into per update through startTransition, useTransition, and useDeferredValue. Plain setState calls in event handlers are still rendered synchronously, exactly as before.",
  ],
  howItWorks: [
    "Step 1: a setState call creates an update object and asks requestUpdateLane for a lane. Discrete events yield SyncLane; a call made while startTransition's flag is set yields a TransitionLane. The lane is merged into the root's pendingLanes bitmask.",
    "Step 2: ensureRootIsScheduled reads getNextLanes and schedules the right work loop. SyncLane work runs in a microtask through performSyncWorkOnRoot; transition work is handed to the Scheduler as a normal-priority task that calls performConcurrentWorkOnRoot.",
    "Step 3: the concurrent loop calls performUnitOfWork on each fiber and checks shouldYield between them. Once about 5 ms have passed the loop returns, the Scheduler yields to the browser, and rendering resumes in a later task from the fiber where it stopped.",
    "Step 4: if a higher priority lane becomes pending mid-render, React calls prepareFreshStack, which drops the current work-in-progress tree. The queued update objects remain in each hook's queue, so the restart processes them all in order against the latest state.",
    "Step 5: when the tree is complete React enters commitRoot. All DOM mutations, ref attachments, and layout effects run synchronously in one block, then passive effects are scheduled. useTransition's isPending flips back to false in this commit.",
    "Step 6: if a component suspends during a transition render, React does not commit the fallback for content that is already visible. It marks the root as suspended, keeps the current tree on screen, and retries when the thrown promise pings. A suspension during a sync render commits the nearest fallback immediately.",
  ],
  commonMistakes: [
    {
      title: "Wrapping the controlled input in the transition",
      explanation:
        "If setQuery for a controlled input is placed inside startTransition, the input's value is rendered at low priority and can lag behind the user's typing, which is the opposite of the intended effect.",
      fix: "Keep the state that drives the input urgent, and put only the expensive derived state, such as the filter that renders a large list, inside the transition. Alternatively read the list from useDeferredValue(query).",
    },
    {
      title: "Expecting a transition to speed up rendering",
      explanation:
        "A transition still does the same amount of work; it only splits it into interruptible slices and lets urgent updates go first. Total render time stays the same or grows slightly because of the yields.",
      fix: "Use transitions to keep the UI responsive, and use memoization, virtualization, or smaller components to make the render itself cheaper.",
    },
    {
      title: "Relying on render-phase side effects",
      explanation:
        "Concurrent React may call a component several times before committing, and may discard a render entirely. Code that mutates a ref, writes to a global, or logs analytics during render will run an unpredictable number of times.",
      fix: "Keep render pure. Move side effects into useEffect or event handlers, and treat StrictMode's double render as a test for this property.",
    },
    {
      title: "Calling setState asynchronously inside startTransition",
      explanation:
        "The transition flag is only set for the synchronous duration of the callback. A setState that runs after an await inside the callback is scheduled with the default lane, not a transition lane, and does not get transition semantics.",
      fix: "Call the state setter synchronously inside the callback, or wrap the specific setter call after the await in its own startTransition.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is a lane in React, and why is it a bitmask?",
      answer:
        "A lane is a priority level represented as a single bit in a 31-bit integer. Bitmasks let React store many pending priorities on one root, test for the highest one with a cheap bit operation, and merge several updates into one render by OR-ing their lanes together. SyncLane is the lowest set bit and therefore the highest priority.",
    },
    {
      question: "How does React interrupt a render, and why is that safe?",
      answer:
        "The concurrent work loop checks shouldYield between fibers and returns to the Scheduler about every 5 ms. If a higher priority lane appears, React discards the work-in-progress tree and restarts. This is safe because the render phase only builds fibers in memory; nothing is written to the DOM until the synchronous commit phase, so no partial state is ever visible.",
      codeExample: {
        language: "javascript",
        code: `function workLoopConcurrent() {
  // Process fibers until the Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}`,
      },
    },
    {
      question:
        "What is the difference between startTransition and useDeferredValue?",
      answer:
        "startTransition marks specific state updates as low priority at the point where they are dispatched, and useTransition adds an isPending flag. useDeferredValue works on a value instead: during an urgent render it returns the previous value and schedules a transition-priority re-render with the new one. Use startTransition when you own the setter, and useDeferredValue when the value comes from props or a parent you cannot change.",
      codeExample: {
        language: "jsx",
        code: `// Owning the setter
const [isPending, startTransition] = useTransition();
startTransition(() => setFilter(value));

// Receiving the value from a parent
const deferredQuery = useDeferredValue(query);
<Results query={deferredQuery} />`,
      },
    },
    {
      question:
        "Why does a transition that suspends not show the Suspense fallback?",
      answer:
        "When a transition render suspends, React treats replacing already visible content with a fallback as a worse outcome than waiting. It leaves the current tree committed, marks the root as suspended, and retries the render when the promise resolves. A sync update that suspends has no such option and commits the nearest fallback, which is why data fetching triggered by user input is usually wrapped in a transition.",
    },
    {
      question: "Is concurrent rendering a mode you turn on for the whole app?",
      answer:
        "No. With createRoot every app has the concurrent renderer, but individual updates still default to synchronous behaviour. Only updates marked through startTransition, useTransition, useDeferredValue, or a suspending Suspense boundary render in interruptible slices. This per-update design lets a codebase adopt concurrency one hot path at a time.",
    },
  ],
  relatedTopicIds: ["fiber-tree", "render-cycle", "suspense", "state-batching"],
};
