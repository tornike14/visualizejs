import type { Metadata } from "next";
import { CategoryTopicsPage } from "@/components/layout/CategoryTopicsPage";

export const metadata: Metadata = {
  title: "JavaScript Concepts",
  description:
    "Interactive JavaScript visualizations for event loop, hoisting, and runtime behavior.",
};

export default function JavaScriptIndexPage() {
  return <CategoryTopicsPage category="javascript" />;
}
