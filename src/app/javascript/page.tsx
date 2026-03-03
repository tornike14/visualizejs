import type { Metadata } from "next";
import { CategoryTopicsPage } from "@/components/layout/CategoryTopicsPage";

export const metadata: Metadata = {
  title: "JavaScript Concepts",
  description:
    "Explore 13 interactive JavaScript visualizations: Event Loop, Closures, Hoisting, Promises, Scope Chain, Prototypal Inheritance, Garbage Collection, and more. Learn JS internals step by step.",
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
