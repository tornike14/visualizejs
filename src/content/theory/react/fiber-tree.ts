import type { TopicTheoryContent } from "@/content/theory/types";

export const fiberTreeTheory: TopicTheoryContent = {
  summary:
    "The fiber tree is React's internal data structure that represents the component hierarchy. Each fiber is a unit of work that React processes during rendering using a depth-first work loop.",
  whatItIs: [
    "A fiber is a plain JavaScript object that holds information about a component, its input props, its state, and its output. React maintains a tree of these fiber nodes that mirrors your component tree.",
    "Unlike the old stack-based reconciler, the fiber architecture lets React split rendering work into incremental units. Each fiber is a unit of work that can be paused, resumed, or aborted, enabling features like concurrent rendering and Suspense.",
    "React maintains two fiber trees at any time: the current tree (what is on screen) and the work-in-progress tree (being built during a render). Once rendering completes, React swaps the work-in-progress tree to become the current tree.",
  ],
  howItWorks: [
    "Step 1: a state update schedules work on a fiber. React creates a work-in-progress copy of that fiber and marks it as the next unit of work.",
    "Step 2: the work loop calls beginWork on the fiber. For function components this means calling the component function, processing hooks, and reconciling the returned children into child fibers.",
    "Step 3: if the fiber has a child, the loop moves down to it. If not, completeWork runs on the fiber (creating or updating its DOM node), and the loop checks for a sibling.",
    "Step 4: the loop continues: sibling fibers get beginWork, leaf fibers get completeWork, and the traversal walks back up via return pointers until the root is reached.",
  ],
  commonMistakes: [
    {
      title: "Assuming render is synchronous",
      explanation:
        "The fiber architecture allows React to pause and resume work. In concurrent mode, a render can be interrupted by higher-priority updates, meaning your component function may be called more than once before committing.",
      fix: "Keep component functions pure. Do not trigger side effects directly in the render body. Use useEffect or event handlers for side effects.",
    },
    {
      title: "Confusing fibers with React elements",
      explanation:
        "React elements (JSX) are lightweight descriptions of what to render. Fibers are mutable internal objects that persist across renders and hold state, effects, and DOM references.",
      fix: "Think of elements as blueprints and fibers as the living instances. You create elements; React manages fibers.",
    },
    {
      title: "Ignoring the two-tree model",
      explanation:
        "React always works on a work-in-progress tree, never mutating the current tree directly. If you try to read DOM state during render, you may see stale values from the current tree.",
      fix: "Use refs to access DOM nodes and read them in effects (after commit), not during render.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is a fiber in React?",
      answer:
        "A fiber is a JavaScript object that represents a unit of work in React's rendering pipeline. It holds information about a component's type, props, state, effects, and pointers to its child, sibling, and parent fibers.",
    },
    {
      question: "How does the React work loop traverse the fiber tree?",
      answer:
        "The work loop uses a depth-first traversal. It calls beginWork going down (processing each fiber and moving to its child), then completeWork going up (finalizing DOM nodes). When a fiber has no child, it checks for a sibling; when there is no sibling, it walks back up via the return pointer.",
      codeExample: {
        language: "jsx",
        code: `// Simplified work loop
while (workInProgress !== null) {
  // Process current fiber
  const next = beginWork(workInProgress);
  if (next !== null) {
    // Move to child
    workInProgress = next;
  } else {
    // No child: complete and find next
    completeUnitOfWork(workInProgress);
  }
}`,
      },
    },
    {
      question: "Why did React move from a stack reconciler to a fiber reconciler?",
      answer:
        "The stack reconciler processed the entire tree synchronously in one call, blocking the main thread. The fiber reconciler breaks work into units (fibers) that can be paused, prioritized, and resumed, enabling concurrent features like time-slicing and Suspense.",
    },
    {
      question: "What are the child, sibling, and return pointers on a fiber?",
      answer:
        "child points to the fiber's first child. sibling points to the next sibling fiber. return points to the parent fiber. Together they form a linked-list representation of the tree that the work loop traverses without recursion.",
    },
  ],
  relatedTopicIds: ["reconciliation", "hooks", "render-cycle", "execution-context", "heap-stack"],
};
