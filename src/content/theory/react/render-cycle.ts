import type { TopicTheoryContent } from "@/content/theory/types";

export const renderCycleTheory: TopicTheoryContent = {
  summary:
    "React rendering has two distinct phases: the render phase (pure, interruptible, builds a work-in-progress tree) and the commit phase (synchronous, applies DOM mutations and runs effects).",
  whatItIs: [
    "When state changes, React does not immediately update the DOM. Instead, it goes through a two-phase process. The render phase calls your component functions to produce a new virtual tree, and the commit phase applies the resulting changes to the real DOM.",
    "The render phase is pure: React may call your component multiple times, pause, or restart the work. No side effects should happen here. The commit phase is synchronous and cannot be interrupted, ensuring the DOM stays consistent.",
    "After DOM mutations, React runs useLayoutEffect callbacks synchronously (before the browser paints), then yields to the browser for painting, and finally runs useEffect callbacks asynchronously. This ordering gives you fine-grained control over when side effects execute.",
  ],
  howItWorks: [
    "Step 1: a state update (via setState, dispatch, or a store change) schedules a re-render. React enters the render phase and calls the component function to get new JSX elements.",
    "Step 2: React builds a work-in-progress (WIP) fiber tree by reconciling the new elements against the current fiber tree. It marks fibers that need DOM updates with effect tags.",
    "Step 3: the commit phase begins. React walks the WIP tree and applies DOM mutations (inserts, updates, deletions) synchronously. The WIP tree becomes the new current tree.",
    "Step 4: React runs useLayoutEffect callbacks synchronously, then yields for the browser to paint. After paint, useEffect callbacks run asynchronously in a microtask.",
  ],
  commonMistakes: [
    {
      title: "Running side effects during render",
      explanation:
        "Code that mutates external state, triggers network requests, or modifies the DOM inside the component body runs during the render phase. Since React may call your component multiple times or discard results, these side effects can fire unexpectedly.",
      fix: "Move side effects into useEffect, useLayoutEffect, or event handlers. Keep the render body pure: compute and return JSX only.",
    },
    {
      title: "Using useLayoutEffect for non-layout work",
      explanation:
        "useLayoutEffect runs synchronously before paint, blocking visual updates. Using it for expensive operations (data fetching, heavy computation) delays the browser from painting, causing visible jank.",
      fix: "Use useEffect for most side effects. Reserve useLayoutEffect only for DOM measurements or mutations that must happen before the user sees the update (e.g., measuring element size, preventing flicker).",
    },
    {
      title: "Expecting multiple renders from batched setState",
      explanation:
        "In React 18+, all state updates are automatically batched, even inside setTimeout, promises, and native event handlers. Calling setState twice does not cause two separate renders.",
      fix: "Rely on batching. If you need to force a synchronous update (rare), use flushSync from react-dom. Otherwise, trust that React will process all queued updates in one render pass.",
    },
  ],
  interviewQuestions: [
    {
      question: "What are the two phases of React rendering?",
      answer:
        "The render phase and the commit phase. The render phase is pure and interruptible: React calls component functions and builds a work-in-progress tree. The commit phase is synchronous: React applies DOM mutations, runs useLayoutEffect, yields for paint, then runs useEffect.",
    },
    {
      question: "What is the difference between useEffect and useLayoutEffect?",
      answer:
        "useLayoutEffect runs synchronously after DOM mutations but before the browser paints. useEffect runs asynchronously after paint. Use useLayoutEffect for DOM measurements that must happen before the user sees the update; use useEffect for everything else.",
      codeExample: {
        language: "jsx",
        code: `// Execution order after a state update:
// 1. Render phase (call component)
// 2. Commit: DOM mutations
// 3. useLayoutEffect (before paint)
// 4. Browser paint
// 5. useEffect (after paint)`,
      },
    },
    {
      question: "How does automatic batching work in React 18?",
      answer:
        "React 18 batches all state updates by default, regardless of where they originate (event handlers, timeouts, promises, native events). Multiple setState calls in the same execution context are collected and processed in a single render pass, improving performance.",
      codeExample: {
        language: "jsx",
        code: `function handleClick() {
  setName('Alice');  // queued
  setAge(30);        // queued
  // Only ONE re-render happens
}`,
      },
    },
    {
      question: "Why is the render phase called 'pure'?",
      answer:
        "The render phase must be free of side effects because React may invoke component functions multiple times, pause rendering, or throw away incomplete work (e.g., when a higher-priority update arrives). Any side effect in this phase would execute unpredictably.",
    },
  ],
  relatedTopicIds: [
    "fiber-tree",
    "hooks",
    "reconciliation",
    "event-loop",
    "use-effect-lifecycle",
  ],
};
