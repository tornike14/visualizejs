import { CATEGORIES, CATEGORY_ORDER, isCategory } from "@/lib/categories";
import { SOCIAL_IMAGE_ALT } from "@/lib/constants";
import { renderSocialImage, SOCIAL_IMAGE_SIZE } from "@/lib/socialImage";
import { getTopicsByCategory } from "@/lib/topics";

export const alt = SOCIAL_IMAGE_ALT;
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return CATEGORY_ORDER.map((category) => ({ category }));
}

export default async function CategoryImage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const config = isCategory(category)
    ? CATEGORIES[category]
    : CATEGORIES.javascript;
  const count = getTopicsByCategory(config.id).length;

  return renderSocialImage({
    kicker: `${count} interactive topics`,
    title: config.indexTitle,
    subtitle: config.description,
    accentRgb: config.hero.accent,
  });
}
