import type { Topic } from "@/types";

export const topics: Topic[] = [
  {
    id: "event-loop",
    title: "Event Loop",
    category: "javascript",
    route: "/javascript/event-loop",
    description: "Visualize how JavaScript handles asynchronous operations",
    difficulty: "intermediate",
    icon: "🔄",
  },
  {
    id: "hoisting",
    title: "Hoisting",
    category: "javascript",
    route: "/javascript/hoisting",
    description: "Understand variable and function hoisting behavior",
    difficulty: "beginner",
    icon: "⬆️",
  },
  {
    id: "virtual-dom",
    title: "Virtual DOM",
    category: "react",
    route: "/react/virtual-dom",
    description: "See how React efficiently updates the DOM",
    difficulty: "intermediate",
    icon: "🌳",
  },
  {
    id: "jwt",
    title: "JWT Authentication",
    category: "react",
    route: "/react/jwt",
    description: "Visualize JWT token-based authentication flow",
    difficulty: "advanced",
    icon: "🔐",
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
