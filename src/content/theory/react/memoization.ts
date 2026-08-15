import type { TopicTheoryContent } from "@/content/theory/types";

export const memoizationTheory: TopicTheoryContent = {
  summary:
    "React.memo, useMemo, and useCallback let you skip unnecessary work by caching component output, computed values, and function references between renders.",
  whatItIs: [
    "React re-renders a component whenever its parent re-renders, even if the component's own props have not changed. Memoization APIs give you tools to opt out of this default behavior when the cost is measurable.",
    "React.memo wraps a component and shallow-compares incoming props against the previous props. If all props are equal by Object.is, React reuses the last render output and skips the component function entirely.",
    "useMemo caches a computed value between renders. It accepts a factory function and a dependency array; the factory only re-runs when at least one dependency changes. useCallback is a shorthand for memoizing a function reference.",
  ],
  howItWorks: [
    "Step 1: a parent re-renders. React walks down the tree and reaches a child wrapped in React.memo.",
    "Step 2: React shallow-compares each prop from the previous render with the new prop using Object.is. If all match, React skips the child entirely and reuses the cached output.",
    "Step 3: inside a component, useMemo compares its dependency array element-by-element with the previous deps. If all are the same, it returns the cached value without running the factory.",
    "Step 4: useCallback works the same way as useMemo but caches the function itself. This is important when passing callbacks to memoized children, because a new function reference would defeat React.memo's shallow comparison.",
  ],
  commonMistakes: [
    {
      title: "Memoizing everything by default",
      explanation:
        "Adding React.memo, useMemo, or useCallback everywhere adds overhead (dependency comparisons, cache storage) without measurable benefit. Most components are cheap to re-render.",
      fix: "Profile first. Only memoize when you can measure a performance problem: expensive computations, large subtrees that re-render often, or components that appear in lists.",
    },
    {
      title: "Passing new object or array literals as props",
      explanation:
        "Writing <Child style={{ color: 'red' }} /> creates a new object every render, so React.memo always sees different props and never skips.",
      fix: "Hoist constant objects outside the component, or wrap dynamic objects in useMemo so the reference stays stable when the values have not changed.",
    },
    {
      title: "Missing dependencies in useMemo or useCallback",
      explanation:
        "Omitting a dependency causes the cached value to go stale. The hook returns an outdated result that does not reflect the current state or props.",
      fix: "Always include every value from the component scope that the factory reads. Use the react-hooks/exhaustive-deps ESLint rule to catch missing deps automatically.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is the difference between useMemo and useCallback?",
      answer:
        "useMemo caches the return value of a function, while useCallback caches the function itself. useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). useCallback is typically used to stabilize callback references passed to memoized children.",
      codeExample: {
        language: "jsx",
        code: `// useMemo: caches computed value
const total = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items]);

// useCallback: caches function reference
const handleClick = useCallback(() => { doSomething(id); }, [id]);`,
      },
    },
    {
      question: "When should you use React.memo?",
      answer:
        "Use React.memo when a component receives the same props frequently but its parent re-renders often, the component's render is expensive, or the component appears many times in a list. Always measure before and after to confirm the optimization helps.",
    },
    {
      question: "How does React.memo compare props?",
      answer:
        "By default, React.memo does a shallow comparison using Object.is on each prop. Primitives are compared by value; objects and functions are compared by reference. You can pass a custom comparison function as the second argument for deeper checks.",
      codeExample: {
        language: "jsx",
        code: `// Default: shallow comparison
const MemoChild = React.memo(Child);

// Custom: deep comparison on specific prop
const MemoChild = React.memo(Child, (prev, next) =>
  prev.config.id === next.config.id
);`,
      },
    },
    {
      question: "What happens if you call useMemo without a dependency array?",
      answer:
        "If you pass no dependency array, useMemo recalculates on every render, providing no caching benefit. If you pass an empty array [], it calculates once on mount and never recalculates, similar to a component-scoped constant.",
    },
  ],
  relatedTopicIds: [
    "reconciliation",
    "render-cycle",
    "hooks",
    "virtual-dom",
    "context-propagation",
  ],
};
