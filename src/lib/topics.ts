import type { Topic } from "@/types";

export const topics: Topic[] = [
  /* ── Ordered by importance / popularity ── */
  {
    id: "event-loop",
    title: "Event Loop",
    category: "javascript",
    route: "/javascript/event-loop",
    description:
      "Interactive visualization of the JavaScript event loop. Watch the call stack, callback queue, and microtask queue process setTimeout, Promises, and async code step by step.",
    difficulty: "intermediate",
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
  },
  {
    id: "hoisting",
    title: "Hoisting",
    category: "javascript",
    route: "/javascript/hoisting",
    description:
      "Visualize JavaScript hoisting behavior for var, let, const, and function declarations. See the creation phase vs execution phase and understand the temporal dead zone.",
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
      "Step through how JavaScript creates and manages execution contexts. Visualize the global and function execution context stack, creation phase, and variable/lexical environments.",
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
      "Visualize how JavaScript closures work. See inner functions retain access to outer scope variables, understand lexical scoping, and learn common closure patterns for interviews.",
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
      "Interactive Promise visualization showing pending, fulfilled, and rejected states. Step through promise chaining, microtask scheduling, and async/await execution flow.",
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
      "Visualize how JavaScript determines the value of 'this'. Step through implicit, explicit, new, and arrow function binding rules with call, apply, and bind examples.",
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
      "Trace how JavaScript resolves variable names by walking the scope chain. Visualize global, function, and block scope lookups from inner to outer scopes step by step.",
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
      "Visualize JavaScript type coercion rules. Compare == vs === behavior, explore truthy/falsy values, and see edge cases with NaN, null, and undefined conversions.",
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
      "Visualize JavaScript destructuring assignment step by step. Unpack arrays by position, extract object properties by name, use default values, nested patterns, and parameter destructuring.",
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
      "Visualize JavaScript spread and rest syntax. See how spread expands arrays and objects, how rest parameters collect arguments, and how rest works in destructuring patterns.",
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
      "Trace JavaScript prototype chain lookups step by step. Visualize how objects delegate property access through __proto__, Object.create, and the instanceof operator.",
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
      "Visualize pass by value vs pass by reference in JavaScript. See how primitives are copied, objects share references, and compare shallow copy, deep copy, and structuredClone.",
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
      "Visualize the JavaScript memory model. See how primitives live on the stack, objects are allocated on the heap, and function call frames are created and destroyed.",
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
      "Visualize JavaScript garbage collection with the mark-and-sweep algorithm. Explore common memory leak patterns like closures, timers, and detached DOM nodes, plus WeakRef usage.",
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
      "Visualize JavaScript generator functions pausing with yield and resuming with .next(). Step through the iterator protocol, two-way data flow, and Symbol.iterator implementation.",
    difficulty: "advanced",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*",
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
