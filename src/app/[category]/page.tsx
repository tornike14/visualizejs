import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryTopicsPage } from "@/components/layout/CategoryTopicsPage";
import { CATEGORIES, CATEGORY_ORDER, isCategory } from "@/lib/categories";
import { createCategoryMetadata } from "@/lib/metadata";
import { getTopicsByCategory } from "@/lib/topics";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_ORDER.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  return createCategoryMetadata(
    CATEGORIES[category],
    getTopicsByCategory(category).length,
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  return <CategoryTopicsPage category={category} />;
}
