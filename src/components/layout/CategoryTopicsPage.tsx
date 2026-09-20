import { CategoryHero } from "@/components/layout/CategoryHero";
import { CategoryTopicGrid } from "@/components/layout/CategoryTopicGrid";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";
import { getTopicsByCategory } from "@/lib/topics";
import type { Category } from "@/types";

interface CategoryTopicsPageProps {
  category: Category;
}

export const CategoryTopicsPage = ({ category }: CategoryTopicsPageProps) => {
  const topics = getTopicsByCategory(category);
  const config = CATEGORIES[category];
  const categoryUrl = `${SITE_URL}${config.route}`;
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.indexTitle,
    description: config.description,
    url: categoryUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: topics.map((topic, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: topic.title,
        url: `${SITE_URL}${topic.route}`,
        description: topic.description,
      })),
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-10 pt-3 lg:px-10 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      <CategoryHero config={config} />

      <CategoryTopicGrid heading={config.headingLabel} topics={topics} />
    </div>
  );
};
