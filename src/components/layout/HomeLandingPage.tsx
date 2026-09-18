import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Keyboard, Layers3, BookOpenText } from "lucide-react";
import { TopicCard } from "@/components/layout/TopicCard";
import { ProgressSummary } from "@/components/progress/ProgressSummary";
import { CATEGORY_LIST } from "@/lib/categories";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { getTopicsByCategory, topics } from "@/lib/topics";
import { cn } from "@/lib/utils";

const FEATURED_TOPIC_IDS = [
  "event-loop",
  "closures",
  "reconciliation",
  "attention",
  "http-request-lifecycle",
  "vue-reactivity",
];

const HOW_IT_WORKS = [
  {
    icon: Layers3,
    title: "Watch the state change",
    body: "Every step shows the call stack, the tree, the queue, or the tensor as the engine sees it.",
  },
  {
    icon: Keyboard,
    title: "Drive it yourself",
    body: "Play, pause, scrub to any step, or use the arrow keys. Some topics let you edit the code.",
  },
  {
    icon: BookOpenText,
    title: "Then read the theory",
    body: "Mechanism, common mistakes, and interview questions live on the same page as the animation.",
  },
];

export const HomeLandingPage = () => {
  const featured = FEATURED_TOPIC_IDS.map((id) =>
    topics.find((topic) => topic.id === id),
  ).filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${SITE_NAME}: JavaScript, React, Backend, and AI Visualizer`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: topics.length,
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-12 pt-6 lg:px-10 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="home-hero relative overflow-hidden rounded-3xl px-6 py-12 text-center lg:px-12 lg:py-16">
        <div aria-hidden className="home-hero-grid pointer-events-none absolute inset-0" />
        <div className="relative flex flex-col items-center gap-5">
          <p className="rounded-full border border-yellow-200/25 bg-yellow-200/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-100/90">
            Free and interactive. {topics.length} topics
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight lg:text-6xl">
            See how{" "}
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              JavaScript
            </span>
            ,{" "}
            <span className="bg-gradient-to-r from-cyan-200 via-sky-200 to-cyan-400 bg-clip-text text-transparent">
              React
            </span>
            , the{" "}
            <span className="bg-gradient-to-r from-violet-200 via-purple-300 to-violet-400 bg-clip-text text-transparent">
              backend
            </span>
            , and{" "}
            <span className="bg-gradient-to-r from-pink-200 via-rose-300 to-pink-400 bg-clip-text text-transparent">
              AI models
            </span>{" "}
            actually run
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-[color:var(--app-text-secondary)] lg:text-xl">
            Step-by-step animations of the mechanisms behind the code: the
            event loop, closures, reconciliation, HTTP requests, database
            indexes, attention heads, and more. Then read the theory and
            interview questions on the same page.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {CATEGORY_LIST.map((category) => {
              const count = getTopicsByCategory(category.id).length;
              return (
                <Link
                  key={category.id}
                  href={category.route}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all",
                    category.ctaClass,
                  )}
                >
                  <Image
                    src={category.iconSrc}
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4 object-contain"
                  />
                  {category.label}
                  <span className="font-mono text-[11px] opacity-70">{count}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
          <p className="text-xs text-slate-500">
            Press{" "}
            <kbd className="rounded border border-slate-600/60 bg-slate-900/70 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
              &#8984;K
            </kbd>{" "}
            anywhere to search topics
          </p>
        </div>
      </section>

      <ProgressSummary />

      <section className="grid gap-4 md:grid-cols-3">
        {HOW_IT_WORKS.map((item) => (
          <div
            key={item.title}
            className="app-surface-subtle flex flex-col gap-2 rounded-2xl px-5 py-4"
          >
            <item.icon className="h-5 w-5 text-cyan-300" />
            <h2 className="text-sm font-semibold text-slate-100">{item.title}</h2>
            <p className="text-sm leading-relaxed text-[color:var(--app-text-secondary)]">
              {item.body}
            </p>
          </div>
        ))}
      </section>

      {featured.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">Start here</h2>
            <p className="text-sm text-[color:var(--app-text-secondary)]">
              One topic from each area, picked to show what the site does.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((topic) => (
              <TopicCard key={topic.id} topic={topic} showCategory />
            ))}
          </div>
        </section>
      )}

      {CATEGORY_LIST.map((category) => {
        const categoryTopics = getTopicsByCategory(category.id);
        if (categoryTopics.length === 0) return null;

        return (
          <section key={category.id} className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    category.iconShellClass,
                  )}
                >
                  <Image
                    src={category.iconSrc}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                </span>
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {category.headingLabel}
                  </h2>
                  <p className="text-sm text-[color:var(--app-text-secondary)]">
                    {category.tagline}
                  </p>
                </div>
              </div>
              <Link
                href={category.route}
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-100"
              >
                All {categoryTopics.length} topics
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTopics.map((topic, index) => (
                <TopicCard key={topic.id} topic={topic} index={index + 1} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
