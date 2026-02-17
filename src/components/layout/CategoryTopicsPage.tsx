import Link from "next/link";
import {
  CategoryHero,
  type CategoryHeroConfig,
} from "@/components/layout/CategoryHero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DIFFICULTY_COLORS, SITE_URL } from "@/lib/constants";
import { getTopicsByCategory } from "@/lib/topics";
import type { Category } from "@/types";

interface CategoryTopicsPageProps {
  category: Category;
}

const CATEGORY_CONFIG: Record<Category, CategoryHeroConfig> = {
  javascript: {
    iconSrc: "/icons/javascript.svg",
    iconAlt: "JavaScript logo",
    iconShellClass:
      "bg-[#f7df1e] p-1.5 shadow-[0_0_28px_rgba(247,223,30,0.46)]",
    title: "JavaScript Concepts",
    highlightedWord: "JavaScript",
    titleTail: "Concepts",
    description:
      "Core JavaScript internals and runtime behavior, visualized step by step.",
    titleAccentClass:
      "bg-gradient-to-r from-amber-200 via-yellow-300 to-yellow-500 bg-clip-text text-transparent",
    kicker: "Engine Room View",
    kickerClass:
      "border border-yellow-200/25 bg-yellow-200/10 text-yellow-100/90",
    heroStyle: {
      "--hero-accent": "247 223 30",
      "--hero-accent-soft": "253 230 138",
      "--hero-secondary": "56 189 248",
    },
  },
  react: {
    iconSrc: "/icons/react.svg",
    iconAlt: "React logo",
    iconShellClass:
      "border border-cyan-300/30 bg-[rgba(34,211,238,0.1)] p-1.5 shadow-[0_0_22px_rgba(34,211,238,0.24)]",
    title: "React Concepts",
    highlightedWord: "React",
    titleTail: "Concepts",
    description:
      "React rendering, reconciliation, and auth flows with interactive diagrams.",
    titleAccentClass:
      "bg-gradient-to-r from-cyan-200 via-sky-200 to-cyan-400 bg-clip-text text-transparent",
    kicker: "Rendering Playground",
    kickerClass: "border border-cyan-200/25 bg-cyan-200/10 text-cyan-100/90",
    heroStyle: {
      "--hero-accent": "34 211 238",
      "--hero-accent-soft": "103 232 249",
      "--hero-secondary": "192 132 252",
    },
  },
};

export function CategoryTopicsPage({ category }: CategoryTopicsPageProps) {
  const topics = getTopicsByCategory(category);
  const config = CATEGORY_CONFIG[category];
  const categoryUrl = `${SITE_URL}/${category}`;
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.title,
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
        <h2 className="text-2xl font-semibold tracking-tight">{config.title}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
            <Link key={topic.id} href={topic.route}>
              <Card className="app-surface group h-full cursor-pointer gap-3 rounded-3xl border-[color:var(--app-border)] py-5 transition-all hover:border-pink-300/35 hover:shadow-[0_0_24px_rgba(244,114,182,0.16)]">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-0">
                  <CardTitle className="text-base">{topic.title}</CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${DIFFICULTY_COLORS[topic.difficulty]}`}
                  >
                    {topic.difficulty}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-[color:var(--app-text-secondary)]">
                    {topic.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
