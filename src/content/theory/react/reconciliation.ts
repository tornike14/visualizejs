import type { TopicTheoryContent } from "@/content/theory/types";

export const reconciliationTheory: TopicTheoryContent = {
  summary:
    "Reconciliation is the algorithm React uses to diff two virtual DOM trees and determine the minimal set of DOM operations needed to update the UI after a state change.",
  whatItIs: [
    "When state or props change, React renders your component again to produce a new tree of React elements. Reconciliation is the process of comparing this new tree with the previous one to figure out what actually changed.",
    "React uses two key heuristics to achieve O(n) diffing instead of O(n\u00B3): elements of different types produce entirely different subtrees, and the key prop lets developers hint which child elements remain stable across renders.",
    "After diffing, React produces a minimal list of DOM mutations (insert, update, remove) and applies them in a single batch during the commit phase. This avoids expensive full-page re-renders.",
  ],
  howItWorks: [
    "Step 1: a state update triggers a re-render. React calls your component function again to get a new element tree.",
    "Step 2: React compares the root elements of the old and new trees. If the element type is the same (e.g., both are <div>), React keeps the DOM node and updates only changed attributes.",
    "Step 3: if the element type is different (e.g., <LoginForm> vs <Dashboard>), React destroys the old subtree entirely and builds the new one from scratch, including re-running all mount effects.",
    "Step 4: for lists of children, React uses the key prop to match elements between the old and new arrays. Matched elements are reused; missing keys trigger unmounts; new keys trigger fresh mounts.",
  ],
  commonMistakes: [
    {
      title: "Using array index as key",
      explanation:
        "When items are reordered, inserted, or deleted, index-based keys cause React to mismatch elements. It may update the wrong DOM nodes, leading to stale state or visual bugs.",
      fix: "Use a stable, unique identifier from your data (e.g., database ID, UUID) as the key prop. Only use index when the list is static and never reordered.",
    },
    {
      title: "Changing component type unintentionally",
      explanation:
        "Defining a component inside another component creates a new function reference every render. React sees it as a different type and remounts the entire subtree, destroying all state.",
      fix: "Always define components at the module level, not inside render functions. If you need to parameterize behavior, use props or composition instead.",
    },
    {
      title: "Wrapping elements in different containers conditionally",
      explanation:
        "Switching between <div> and <section> (or any different element types) in a conditional causes React to unmount and remount the entire subtree, losing component state.",
      fix: "Keep the container element type consistent across conditional branches. Change only attributes or children, not the element type itself.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is reconciliation in React?",
      answer:
        "Reconciliation is the algorithm React uses to compare the previous and new virtual DOM trees (element trees) after a re-render, producing the minimum set of DOM operations needed to update the UI.",
    },
    {
      question: "What are React's two main diffing heuristics?",
      answer:
        "First, elements of different types produce entirely different subtrees and trigger a full remount. Second, the key prop allows developers to signal which children are stable across renders, enabling efficient list diffing.",
      codeExample: {
        language: "jsx",
        code: `// Heuristic 1: different types → full remount
{isLoggedIn ? <Dashboard /> : <LoginForm />}

// Heuristic 2: keys → stable identity
{items.map(item => <li key={item.id}>{item.text}</li>)}`,
      },
    },
    {
      question: "Why should you avoid using array index as a key?",
      answer:
        "Index keys break when items are reordered, inserted, or removed. React uses keys to match elements, so index-based keys can cause it to reuse the wrong DOM nodes, leading to stale state and visual bugs.",
      codeExample: {
        language: "jsx",
        code: `// Bad: index key breaks on reorder
{items.map((item, i) => <li key={i}>{item.text}</li>)}

// Good: stable unique key
{items.map(item => <li key={item.id}>{item.text}</li>)}`,
      },
    },
    {
      question: "What happens when React encounters different element types during reconciliation?",
      answer:
        "React tears down the entire old subtree (unmounting all components, running cleanup effects, destroying DOM nodes) and builds the new subtree from scratch. No diffing of children occurs across type boundaries.",
    },
  ],
  relatedTopicIds: ["reference-value", "execution-context"],
};
