import type { TopicTheoryContent } from "@/content/theory/types";

export const hooksTheory: TopicTheoryContent = {
  summary:
    "React hooks are stored as a linked list on each fiber node. The call order must stay the same between renders so React can match each hook call to the correct node in the list.",
  whatItIs: [
    "When you call useState, useEffect, or any other hook inside a component, React does not use the variable name to identify it. Instead, it relies on the order in which hooks are called during each render.",
    "Internally, each hook call creates (on mount) or reads (on re-render) a hook object stored in a linked list attached to the component's fiber. The fiber's memoizedState property points to the first hook, and each hook has a next pointer to the following one.",
    "This linked-list design is why the Rules of Hooks exist: hooks must be called at the top level, never inside conditions or loops. If the call order changes between renders, React reads the wrong hook object and returns mismatched state.",
  ],
  howItWorks: [
    "Step 1: on mount, each hook call creates a new hook object with fields for memoizedState, queue (for state updates), and next (pointer to the next hook). These are appended to the fiber's linked list.",
    "Step 2: on re-render, React resets an internal cursor to the first hook in the list. Each hook call advances the cursor by one, reading memoizedState from the corresponding hook object.",
    "Step 3: for useState, React processes any queued updates and returns the new state. For useEffect, React compares the dependency array with the previous one to decide whether to schedule the effect.",
    "Step 4: after all hooks are processed, React uses the returned JSX to reconcile children. Scheduled effects run after the commit phase.",
  ],
  commonMistakes: [
    {
      title: "Calling hooks inside conditions",
      explanation:
        "If a hook call is inside an if-block that runs on mount but not on re-render, React's cursor skips over that position. Every subsequent hook reads the wrong node, causing state mismatches or crashes.",
      fix: "Always call hooks at the top level of your component. If you need conditional logic, put the condition inside the hook (e.g., inside useEffect's callback), not around the hook call.",
    },
    {
      title: "Calling hooks inside loops",
      explanation:
        "A loop may execute a different number of hook calls on each render, breaking the fixed-order requirement. React has no way to match hook objects when the count changes.",
      fix: "Extract the loop body into a separate component. Each instance of that component maintains its own hook list with a fixed call order.",
    },
    {
      title: "Forgetting dependency arrays in useEffect",
      explanation:
        "Omitting the dependency array makes useEffect run after every render. An empty array makes it run only on mount. Wrong dependencies can cause stale closures or infinite re-render loops.",
      fix: "List every reactive value used inside the effect in the dependency array. Use the react-hooks/exhaustive-deps ESLint rule to catch missing dependencies.",
    },
  ],
  interviewQuestions: [
    {
      question: "Why must hooks be called in the same order every render?",
      answer:
        "React identifies hooks by their call position, not by name. Hooks are stored as a linked list on the fiber. On re-render, React walks the list sequentially. If the order changes, each hook reads the wrong node and returns incorrect state.",
    },
    {
      question: "How are hooks stored internally?",
      answer:
        "Each hook is a plain object with memoizedState (the stored value), a queue (for pending state updates), and a next pointer to the following hook. The fiber's memoizedState field points to the first hook in the chain.",
      codeExample: {
        language: "jsx",
        code: `// Simplified hook object structure
{
  memoizedState: currentValue,
  queue: { pending: null },
  next: nextHookOrNull,
}`,
      },
    },
    {
      question: "What happens if you call useState inside an if-statement?",
      answer:
        "On renders where the condition is false, that useState call is skipped. React's hook cursor falls out of sync with the linked list: every hook after the skipped one reads the wrong node. React will throw an error in development: 'Rendered fewer hooks than expected.'",
    },
    {
      question: "How does useEffect decide whether to re-run?",
      answer:
        "React shallow-compares each value in the current dependency array with the corresponding value from the previous render. If any value has changed (using Object.is), React schedules the effect to run after the next commit. If all values are the same, the effect is skipped.",
    },
  ],
  relatedTopicIds: ["fiber-tree", "render-cycle", "reconciliation", "closures", "scope-chain"],
};
