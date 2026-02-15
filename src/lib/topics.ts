import type { Topic } from "@/types";

export const topics: Topic[] = [
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
