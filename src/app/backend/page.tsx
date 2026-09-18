import type { Metadata } from "next";
import { CategoryTopicsPage } from "@/components/layout/CategoryTopicsPage";
import { CATEGORIES } from "@/lib/categories";
import { createCategoryMetadata } from "@/lib/metadata";
import { getTopicsByCategory } from "@/lib/topics";

const category = CATEGORIES.backend;

export const metadata: Metadata = createCategoryMetadata(
  category,
  getTopicsByCategory(category.id).length,
);

export default function CategoryIndexPage() {
  return <CategoryTopicsPage category={category.id} />;
}
