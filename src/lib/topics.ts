import type { Topic } from "@/types";

export const topics: Topic[] = [
  /* ── Ordered by importance / popularity ── */
  {
    id: "event-loop",
    title: "Event Loop",
    category: "javascript",
    route: "/javascript/event-loop",
    description:
      "See how the JavaScript event loop works with an interactive visualization. Watch the call stack, microtask queue, and callback queue process setTimeout, Promises, and async/await step by step.",
    difficulty: "intermediate",
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
  },
  {
    id: "hoisting",
    title: "Hoisting",
    category: "javascript",
    route: "/javascript/hoisting",
    description:
      "See how JavaScript hoisting works for var, let, const, and function declarations. Interactive visualization of the creation phase vs execution phase and the temporal dead zone.",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting",
  },
  {
    id: "execution-context",
    title: "Execution Context",
    category: "javascript",
    route: "/javascript/execution-context",
    description:
      "See how JavaScript execution contexts work with an interactive visualization. Step through the global and function context stack, creation phase, scope chain, and variable environments.",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this#function_context",
  },
  {
    id: "closures",
    title: "Closures",
    category: "javascript",
    route: "/javascript/closures",
    description:
      "See how JavaScript closures work with an interactive visualization. Watch inner functions capture outer scope variables, understand lexical scoping, and learn closure patterns for interviews.",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
  },
  {
    id: "promises",
    title: "Promises",
    category: "javascript",
    route: "/javascript/promises",
    description:
      "See how JavaScript Promises work with an interactive visualization. Step through pending, fulfilled, and rejected states, promise chaining, microtask scheduling, and async/await flow.",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
  },
  {
    id: "this-keyword",
    title: "this Keyword",
    category: "javascript",
    route: "/javascript/this-keyword",
    description:
      "See how the JavaScript this keyword works with an interactive visualization. Step through implicit, explicit, new, and arrow function binding rules with call, apply, and bind examples.",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this",
  },
  {
    id: "scope-chain",
    title: "Scope Chain",
    category: "javascript",
    route: "/javascript/scope-chain",
    description:
      "See how the JavaScript scope chain works with an interactive visualization. Trace variable lookups across global, function, and block scopes from inner to outer step by step.",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Glossary/Scope",
  },
  {
    id: "type-coercion",
    title: "Type Coercion",
    category: "javascript",
    route: "/javascript/type-coercion",
    description:
      "See how JavaScript type coercion works with an interactive visualization. Compare == vs === behavior, explore truthy/falsy values, and see edge cases with NaN, null, and undefined.",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality",
  },
  {
    id: "destructuring",
    title: "Destructuring",
    category: "javascript",
    route: "/javascript/destructuring",
    description:
      "See how JavaScript destructuring works with an interactive visualization. Unpack arrays by position, extract object properties by name, use default values, nested patterns, and parameter destructuring.",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment",
  },
  {
    id: "spread-rest",
    title: "Spread & Rest",
    category: "javascript",
    route: "/javascript/spread-rest",
    description:
      "See how JavaScript spread and rest syntax works with an interactive visualization. Watch spread expand arrays/objects, rest collect arguments, and rest in destructuring patterns.",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax",
  },
  {
    id: "prototypal-inheritance",
    title: "Prototypal Inheritance",
    category: "javascript",
    route: "/javascript/prototypal-inheritance",
    description:
      "See how JavaScript prototypal inheritance works with an interactive visualization. Trace prototype chain lookups, __proto__ delegation, Object.create, and the instanceof operator step by step.",
    difficulty: "advanced",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain",
  },
  {
    id: "reference-value",
    title: "Reference vs Value",
    category: "javascript",
    route: "/javascript/reference-value",
    description:
      "See how pass by value vs pass by reference works in JavaScript with an interactive visualization. Watch primitives copy, objects share references, and compare shallow copy, deep copy, and structuredClone.",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
  },
  {
    id: "heap-stack",
    title: "Heap & Stack",
    category: "javascript",
    route: "/javascript/heap-stack",
    description:
      "See how the JavaScript memory model works with an interactive visualization. Watch primitives live on the stack, objects get allocated on the heap, and call frames get created and destroyed.",
    difficulty: "advanced",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management",
  },
  {
    id: "garbage-collection",
    title: "Garbage Collection",
    category: "javascript",
    route: "/javascript/garbage-collection",
    description:
      "See how JavaScript garbage collection works with an interactive visualization. Watch the mark-and-sweep algorithm, explore memory leak patterns with closures, timers, and DOM nodes, plus WeakRef.",
    difficulty: "advanced",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management",
  },
  {
    id: "generators",
    title: "Generators & Iterators",
    category: "javascript",
    route: "/javascript/generators",
    description:
      "See how JavaScript generators work with an interactive visualization. Watch generator functions pause with yield and resume with .next(), step through the iterator protocol and two-way data flow.",
    difficulty: "advanced",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*",
  },
  {
    id: "event-delegation",
    title: "Event Delegation",
    category: "javascript",
    route: "/javascript/event-delegation",
    description:
      "See how DOM events propagate through the tree with an interactive visualization. Watch capture and bubble phases, stopPropagation, and the delegation pattern where one parent handler replaces many child handlers.",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Event_bubbling",
  },
  {
    id: "modules-imports",
    title: "Modules & Imports",
    category: "javascript",
    route: "/javascript/modules-imports",
    description:
      "See how JavaScript ES modules work with an interactive visualization. Watch the module graph build, import bindings resolve, live references update, and circular dependencies get handled step by step.",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
  },
  /* ── React ── */
  {
    id: "virtual-dom",
    title: "Virtual DOM",
    category: "react",
    route: "/react/virtual-dom",
    description:
      "See how React's virtual DOM works with an interactive visualization. Watch JSX compile to React.createElement calls, build a virtual DOM object tree, and diff to find real DOM updates.",
    difficulty: "beginner",
    docsUrl: "https://react.dev/learn/writing-markup-with-jsx",
  },
  {
    id: "reconciliation",
    title: "Reconciliation",
    category: "react",
    route: "/react/reconciliation",
    description:
      "See how React reconciliation works with an interactive visualization. Watch the virtual DOM diffing algorithm compare element trees: same-type updates, cross-type remounts, and key-based list matching.",
    difficulty: "intermediate",
    docsUrl: "https://react.dev/learn/preserving-and-resetting-state",
  },
  {
    id: "context-propagation",
    title: "Context Propagation",
    category: "react",
    route: "/react/context-propagation",
    description:
      "See how React Context works with an interactive visualization. Watch provider value storage, consumer subscription, value propagation through the component tree, and why all consumers re-render.",
    difficulty: "intermediate",
    docsUrl: "https://react.dev/learn/passing-data-deeply-with-context",
  },
  {
    id: "fiber-tree",
    title: "Fiber Tree",
    category: "react",
    route: "/react/fiber-tree",
    description:
      "See how React's fiber tree works with an interactive visualization. Watch beginWork go down and completeWork go up as the work loop processes each fiber as a unit of work.",
    difficulty: "advanced",
    docsUrl: "https://react.dev/learn/render-and-commit",
  },
  {
    id: "hooks",
    title: "Hooks",
    category: "react",
    route: "/react/hooks",
    description:
      "See how React hooks work with an interactive visualization. Watch hooks stored as a linked list on each fiber, understand why call order matters, and what breaks with conditional hooks.",
    difficulty: "intermediate",
    docsUrl: "https://react.dev/reference/rules/rules-of-hooks",
  },
  {
    id: "render-cycle",
    title: "Render Cycle",
    category: "react",
    route: "/react/render-cycle",
    description:
      "See how React's render cycle works with an interactive visualization. Step through the render phase (pure, interruptible diffing) and the commit phase (synchronous DOM mutations, effects, paint).",
    difficulty: "advanced",
    docsUrl: "https://react.dev/learn/render-and-commit",
  },
  {
    id: "memoization",
    title: "Memoization",
    category: "react",
    route: "/react/memoization",
    description:
      "See how React.memo, useMemo, and useCallback prevent unnecessary work with an interactive visualization. Step through dependency checks, cache hits and misses, and which components skip re-renders.",
    difficulty: "intermediate",
    docsUrl: "https://react.dev/reference/react/memo",
  },
  {
    id: "suspense",
    title: "Suspense",
    category: "react",
    route: "/react/suspense",
    description:
      "See how React Suspense handles async boundaries with an interactive visualization. Step through fallback rendering, promise throwing, and content revealing to understand loading states.",
    difficulty: "intermediate",
    docsUrl: "https://react.dev/reference/react/Suspense",
  },
  {
    id: "server-components",
    title: "Server Components",
    category: "react",
    route: "/react/server-components",
    description:
      "See how React Server Components split rendering between server and client with an interactive visualization. Step through the server render pass, payload serialization, and client hydration.",
    difficulty: "advanced",
    docsUrl: "https://react.dev/reference/rsc/server-components",
  },
  {
    id: "error-boundaries",
    title: "Error Boundaries",
    category: "react",
    route: "/react/error-boundaries",
    description:
      "See how React error boundaries work with an interactive visualization. Watch errors propagate up the component tree, getDerivedStateFromError trigger, fallback UI render, and recovery patterns step by step.",
    difficulty: "intermediate",
    docsUrl:
      "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary",
  },
  {
    id: "use-effect-lifecycle",
    title: "useEffect Lifecycle",
    category: "react",
    route: "/react/use-effect-lifecycle",
    description:
      "See how React useEffect works with an interactive visualization. Step through the render-commit-paint-effect timeline, dependency array comparisons, cleanup function timing, and common patterns.",
    difficulty: "beginner",
    docsUrl: "https://react.dev/reference/react/useEffect",
  },
];

export function getTopicsByCategory(category: "javascript" | "react") {
  return topics.filter((topic) => topic.category === category);
}

export function getTopicById(id: string) {
  return topics.find((topic) => topic.id === id);
}

export function getTopicOrThrow(id: string): Topic {
  const topic = getTopicById(id);
  if (!topic) {
    throw new Error(`Missing topic configuration for ${id}`);
  }
  return topic;
}
