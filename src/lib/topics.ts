import type { Topic } from "@/types";

export const topics: Topic[] = [
  /* ── Beginner: language fundamentals ── */
  {
    id: "hoisting",
    title: "Hoisting",
    category: "javascript",
    route: "/javascript/hoisting",
    description: "Understand variable and function hoisting behavior",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting",
  },
  {
    id: "type-coercion",
    title: "Type Coercion",
    category: "javascript",
    route: "/javascript/type-coercion",
    description:
      "Visualize how JavaScript converts types with == vs ===, truthy/falsy values, and edge cases like NaN and null",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality",
  },
  {
    id: "reference-value",
    title: "Reference vs Value",
    category: "javascript",
    route: "/javascript/reference-value",
    description:
      "Visualize how primitives are copied by value, objects by reference, and how shallow and deep copy work",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
  },
  /* ── Intermediate: scope, functions & objects ── */
  {
    id: "scope-chain",
    title: "Scope Chain",
    category: "javascript",
    route: "/javascript/scope-chain",
    description:
      "Trace how JavaScript resolves variable names by walking the scope chain from inner to outer scopes",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Glossary/Scope",
  },
  {
    id: "closures",
    title: "Closures",
    category: "javascript",
    route: "/javascript/closures",
    description:
      "See how inner functions retain access to outer scope variables",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
  },
  {
    id: "this-keyword",
    title: "this Keyword",
    category: "javascript",
    route: "/javascript/this-keyword",
    description:
      "Visualize how JavaScript determines the value of this using binding rules",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this",
  },
  {
    id: "prototypal-inheritance",
    title: "Prototypal Inheritance",
    category: "javascript",
    route: "/javascript/prototypal-inheritance",
    description:
      "Trace how JavaScript objects delegate property lookups through the prototype chain",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain",
  },
  /* ── Intermediate: memory model ── */
  {
    id: "heap-stack",
    title: "Heap & Stack",
    category: "javascript",
    route: "/javascript/heap-stack",
    description:
      "Visualize how JavaScript allocates primitives on the stack and objects on the heap, with function call frames and garbage collection",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management",
  },
  {
    id: "garbage-collection",
    title: "Garbage Collection",
    category: "javascript",
    route: "/javascript/garbage-collection",
    description:
      "Visualize the mark-and-sweep algorithm, common memory leak patterns, and how WeakRef enables garbage collection",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management",
  },
  /* ── Intermediate: async ── */
  {
    id: "promises",
    title: "Promises",
    category: "javascript",
    route: "/javascript/promises",
    description:
      "Understand Promise states, chaining, microtask scheduling, and async/await",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
  },
  {
    id: "event-loop",
    title: "Event Loop",
    category: "javascript",
    route: "/javascript/event-loop",
    description: "Visualize how JavaScript handles asynchronous operations",
    difficulty: "intermediate",
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
  },
  {
    id: "generators",
    title: "Generators & Iterators",
    category: "javascript",
    route: "/javascript/generators",
    description:
      "Visualize how generator functions pause with yield, resume with .next(), and implement the iterator protocol",
    difficulty: "intermediate",
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
