import type { Metadata } from "next";
import { CategoryTopicsPage } from "@/components/layout/CategoryTopicsPage";

export const metadata: Metadata = {
  title: "React Concepts",
  description:
    "Interactive React visualizations: reconciliation, virtual DOM diffing, re-rendering behavior, and more. Understand React internals step by step.",
  keywords: [
    "react concepts",
    "react fundamentals",
    "react reconciliation",
    "virtual DOM",
    "react re-rendering",
    "react internals",
    "react fiber",
    "react diffing algorithm",
  ],
  alternates: {
    canonical: "/react",
  },
};

export default function ReactIndexPage() {
  return <CategoryTopicsPage category="react" />;
}
