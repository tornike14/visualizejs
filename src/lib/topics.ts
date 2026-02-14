import type { Topic } from "@/types";

export const topics: Topic[] = [
  {
    id: "event-loop",
    title: "Event Loop",
    category: "javascript",
    route: "/javascript/event-loop",
    description: "Visualize how JavaScript handles asynchronous operations",
    difficulty: "intermediate",
  },
  {
    id: "hoisting",
    title: "Hoisting",
    category: "javascript",
    route: "/javascript/hoisting",
    description: "Understand variable and function hoisting behavior",
    difficulty: "beginner",
  },
  {
    id: "execution-context-scope-chain",
    title: "Execution Context + Scope Chain",
    category: "javascript",
    route: "/javascript/execution-context-scope-chain",
    description:
      "Track execution contexts, lexical environments, and scope lookups step by step.",
    difficulty: "intermediate",
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
