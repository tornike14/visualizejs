import type { Metadata } from "next";
import { CategoryTopicsPage } from "@/components/layout/CategoryTopicsPage";

export const metadata: Metadata = {
  title: "JavaScript Concepts",
  description:
    "Interactive JavaScript visualizations for event loop, hoisting, and runtime behavior.",
  keywords: [
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
  ],
  alternates: {
    canonical: "/javascript",
  },
};

export default function JavaScriptIndexPage() {
  return <CategoryTopicsPage category="javascript" />;
}
