import type { Metadata } from "next";
import { CategoryTopicsPage } from "@/components/layout/CategoryTopicsPage";
import { getTopicsByCategory } from "@/lib/topics";

const topicCount = getTopicsByCategory("react").length;

export const metadata: Metadata = {
  title: "React Concepts, Visualized",
  description: `Explore ${topicCount} interactive React visualizations: virtual DOM, reconciliation, fiber, hooks, render cycle, and Suspense. Learn React internals step by step.`,
  keywords: [
    "react visualizer",
    "react visualization",
    "react concepts",
    "react fundamentals",
    "react reconciliation",
    "virtual DOM",
    "react re-rendering",
    "react internals",
    "react fiber",
    "react hooks",
    "react diffing algorithm",
  ],
  alternates: {
    canonical: "/react",
  },
};

export default function ReactIndexPage() {
  return <CategoryTopicsPage category="react" />;
}
