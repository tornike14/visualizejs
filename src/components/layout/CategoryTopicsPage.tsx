import { CategoryHero } from "@/components/layout/CategoryHero";
import { TopicCard } from "@/components/layout/TopicCard";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";
import { getTopicsByCategory, groupTopics } from "@/lib/topics";
import type { Category } from "@/types";

interface CategoryTopicsPageProps {
  category: Category;
}

export const CategoryTopicsPage = ({ category }: CategoryTopicsPageProps) => {
  const topics = getTopicsByCategory(category);
  const groups = groupTopics(topics);
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

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            {config.headingLabel}
          </h2>
          <p className="text-sm text-[color:var(--app-text-secondary)]">
            {topics.length} topics, ordered from fundamentals to internals
          </p>
        </div>
        {groups.map((group, groupIndex) => {
          const offset = groups
            .slice(0, groupIndex)
            .reduce((sum, entry) => sum + entry.topics.length, 0);
          return (
            <div key={group.label ?? "all"} className="flex flex-col gap-3">
              {group.label && (
                <h3 className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-secondary)]">
                  {group.label}
                </h3>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {group.topics.map((topic, index) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    index={offset + index + 1}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
