import type { Metadata } from "next";
import { CategoryTopicsPage } from "@/components/layout/CategoryTopicsPage";
import { getTopicsByCategory } from "@/lib/topics";

const topicCount = getTopicsByCategory("javascript").length;

export const metadata: Metadata = {
  title: "JavaScript Concepts, Visualized",
  description: `Explore ${topicCount} interactive JavaScript visualizations: event loop, closures, hoisting, promises, scope chain, and prototypes. Learn JS internals step by step.`,
  keywords: [
    "javascript visualizer",
    "javascript visualization",
    "javascript concepts",
    "javascript fundamentals",
    "event loop",
    "hoisting",
    "closures",
    "promises",
    "prototype chain",
    "this keyword",
    "scope chain",
    "var vs let vs const",
    "garbage collection javascript",
    "type coercion",
    "execution context",
    "heap and stack",
    "reference vs value",
    "generators iterators",
  ],
  alternates: {
    canonical: "/javascript",
  },
};

export default function JavaScriptIndexPage() {
  return <CategoryTopicsPage category="javascript" />;
}
