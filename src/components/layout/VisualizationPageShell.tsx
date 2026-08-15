import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TopicTheoryButton } from "@/components/layout/TopicTheoryButton";
import { TopicTheorySections } from "@/components/theory/TopicTheorySections";
import { ToolbarProvider, ToolbarSlot } from "./ToolbarPortal";
import { getRelatedTopicsFromTheory, getTheoryContent } from "@/content/theory";
import { createTopicStructuredData } from "@/lib/metadata";
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
  "virtual-dom",
  "reconciliation",
  "context-propagation",
  "destructuring",
  "spread-rest",
  "fiber-tree",
  "hooks",
  "render-cycle",
  "memoization",
  "suspense",
  "server-components",
  "event-delegation",
  "modules-imports",
  "error-boundaries",
  "use-effect-lifecycle",
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
  const theory = getTheoryContent(topic.id);
  const relatedTopics = getRelatedTopicsFromTheory(topic.id);
  const structuredData = createTopicStructuredData(topic, theory?.summary);

  return (
    <ToolbarProvider>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 pb-6 pt-3 lg:px-6 lg:pb-8 lg:pt-6">
        {structuredData.map((schema) => (
          <script
            key={schema["@type"]}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

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
              {topic.title}{" "}
              <span className="text-xl font-normal text-[color:var(--app-text-secondary)] lg:text-2xl">
                in {categoryLabel}
              </span>
            </h1>
            <div className="flex items-center gap-2">
              {theory && <TopicTheoryButton href="#theory" />}
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

          <p className="max-w-4xl text-sm leading-relaxed text-[color:var(--app-text-secondary)] lg:text-base">
            {topic.description}
          </p>
        </header>

        <div className="h-px bg-[color:var(--app-border)]" />

        <ToolbarSlot variant={toolbarSkeletonVariant} />

        <section className="app-surface rounded-2xl p-3 lg:p-4">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </section>

        {theory && (
          <TopicTheorySections
            topic={topic}
            content={theory}
            relatedTopics={relatedTopics}
          />
        )}
      </div>
    </ToolbarProvider>
  );
}
