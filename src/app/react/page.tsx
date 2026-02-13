import type { Metadata } from "next";
import { CategoryTopicsPage } from "@/components/layout/CategoryTopicsPage";

export const metadata: Metadata = {
  title: "React Concepts",
  description:
    "Interactive React visualizations for virtual DOM updates and JWT authentication flows.",
};

export default function ReactIndexPage() {
  return <CategoryTopicsPage category="react" />;
}
