import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TopicTheoryButton } from "@/components/layout/TopicTheoryButton";
import { ToolbarProvider, ToolbarSlot } from "./ToolbarPortal";
import { hasTheoryContent } from "@/content/theory";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getTopicKeywords } from "@/lib/metadata";
import type { Topic } from "@/types";

const SELECTOR_TOOLBAR_TOPIC_IDS = new Set([
  "hoisting",
  "promises",
  "prototypal-inheritance",
  "scope-chain",
  "this-keyword",
  "type-coercion",
  "reference-value",
  "heap-stack",
  "garbage-collection",
  "generators",
  "reconciliation",
  "destructuring",
  "spread-rest",
  "fiber-tree",
  "hooks",
  "render-cycle",
]);

interface VisualizationPageShellProps {
  topic: Topic;
  children: ReactNode;
}

export function VisualizationPageShell({
  topic,
  children,
}: VisualizationPageShellProps) {
  const categoryLabel = topic.category === "javascript" ? "JavaScript" : "React";
  const categoryRoute =
    topic.category === "javascript" ? "/javascript" : "/react";
  const toolbarSkeletonVariant = SELECTOR_TOOLBAR_TOPIC_IDS.has(topic.id)
    ? "selector"
    : "simple";
  const canonicalUrl = `${SITE_URL}${topic.route}`;
  const topicKeywords = getTopicKeywords(topic);
  const hasTheoryPage = hasTheoryContent(topic.id);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${topic.title} Visualization`,
    description: topic.description,
    url: canonicalUrl,
    keywords: topicKeywords.join(", "),
    inLanguage: "en-US",
    proficiencyLevel: topic.difficulty === "beginner" ? "Beginner" : "Intermediate",
    about: {
      "@type": "Thing",
      name: topic.title,
      description: topic.description,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: canonicalUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${categoryLabel} Concepts`,
        item: `${SITE_URL}${categoryRoute}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: topic.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <ToolbarProvider>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 pb-6 pt-3 lg:px-6 lg:pb-8 lg:pt-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <header className="flex flex-col gap-3">
          <Link
            href={categoryRoute}
            className="inline-flex w-fit items-center gap-2 text-sm text-[color:var(--app-text-secondary)] transition-colors hover:text-[color:var(--app-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {categoryLabel} topics
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
              {topic.title}
            </h1>
            <div className="flex items-center gap-2">
              {hasTheoryPage && (
                <TopicTheoryButton href={`${topic.route}/theory`} />
              )}
              <a
                href={topic.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-200"
                aria-label={`Read ${topic.title} documentation`}
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </header>

        <div className="h-px bg-[color:var(--app-border)]" />

        <ToolbarSlot variant={toolbarSkeletonVariant} />

        <section className="app-surface rounded-2xl p-3 lg:p-4">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </section>
      </div>
    </ToolbarProvider>
  );
}
