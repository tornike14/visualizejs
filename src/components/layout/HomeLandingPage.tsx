import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DIFFICULTY_COLORS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { getTopicsByCategory } from "@/lib/topics";
import type { Category } from "@/types";

const CATEGORY_SECTIONS: { category: Category; heading: string; blurb: string }[] = [
  {
    category: "javascript",
    heading: "JavaScript concepts",
    blurb:
      "Runtime internals you get asked about in interviews and hit in real bugs.",
  },
  {
    category: "react",
    heading: "React concepts",
    blurb:
      "How React decides what to render, when to re-render, and what it commits to the DOM.",
  },
];

export const HomeLandingPage = () => {
  const javascriptTopics = getTopicsByCategory("javascript");
  const reactTopics = getTopicsByCategory("react");
  const allTopics = [...javascriptTopics, ...reactTopics];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${SITE_NAME}: JavaScript and React Visualizer`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allTopics.length,
      itemListElement: allTopics.map((topic, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: topic.title,
        url: `${SITE_URL}${topic.route}`,
        description: topic.description,
      })),
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-10 pt-6 lg:px-10 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="flex flex-col items-center gap-5 text-center">
        <p className="rounded-full border border-yellow-200/25 bg-yellow-200/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-100/90">
          Free and interactive
        </p>
        <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
          <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            JavaScript
          </span>{" "}
          <span className="text-slate-100/90">and</span>{" "}
          <span className="bg-gradient-to-r from-cyan-200 via-sky-200 to-cyan-400 bg-clip-text text-transparent">
            React
          </span>{" "}
          <span className="text-slate-100/90">Visualizer</span>
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-[color:var(--app-text-secondary)] lg:text-xl">
          Watch how JavaScript and React actually run. Step through the event
          loop, closures, hoisting, the virtual DOM, and {allTopics.length - 4}{" "}
          more concepts with animated visualizations, then read the theory and
          interview questions on the same page.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/javascript"
            className="group inline-flex items-center gap-2 rounded-lg border border-yellow-200/30 bg-yellow-200/10 px-4 py-2 text-sm font-medium text-yellow-100 transition-all hover:border-yellow-200/55 hover:bg-yellow-200/16"
          >
            Explore {javascriptTopics.length} JavaScript topics
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/react"
            className="group inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition-all hover:border-cyan-300/55 hover:bg-cyan-300/16"
          >
            Explore {reactTopics.length} React topics
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {CATEGORY_SECTIONS.map((section) => {
        const topics = getTopicsByCategory(section.category);

        return (
          <section key={section.category} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                {section.heading}
              </h2>
              <p className="text-sm text-[color:var(--app-text-secondary)]">
                {section.blurb}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <Link key={topic.id} href={topic.route} prefetch={false}>
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
        );
      })}
    </div>
  );
};
