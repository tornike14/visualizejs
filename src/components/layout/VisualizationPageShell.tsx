import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TopicTheoryButton } from "@/components/layout/TopicTheoryButton";
import { TopicPagerNav } from "@/components/layout/TopicPagerNav";
import { KeyboardHint } from "@/components/layout/KeyboardHint";
import { TopicProgressProvider } from "@/components/progress/TopicProgressContext";
import { TopicTheorySections } from "@/components/theory/TopicTheorySections";
import { Badge } from "@/components/ui/badge";
import { ToolbarProvider, ToolbarSlot } from "./ToolbarPortal";
import { getRelatedTopicsFromTheory, getTheoryContent } from "@/content/theory";
import { CATEGORIES } from "@/lib/categories";
import { DIFFICULTY_COLORS } from "@/lib/constants";
import { createTopicStructuredData } from "@/lib/metadata";
import { getAdjacentTopics } from "@/lib/topics";
import { cn } from "@/lib/utils";
import type { Topic } from "@/types";

interface VisualizationPageShellProps {
  topic: Topic;
  children: ReactNode;
}

export const VisualizationPageShell = ({
  topic,
  children,
}: VisualizationPageShellProps) => {
  const category = CATEGORIES[topic.category];
  const toolbarSkeletonVariant = topic.toolbar ?? "selector";
  const theory = getTheoryContent(topic.id);
  const relatedTopics = getRelatedTopicsFromTheory(topic.id);
  const structuredData = createTopicStructuredData(topic, theory?.summary);
  const { previous, next } = getAdjacentTopics(topic.id);

  return (
    <ToolbarProvider>
      <TopicProgressProvider topicId={topic.id}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 pb-6 pt-3 lg:px-6 lg:pb-8 lg:pt-6">
          {structuredData.map((schema) => (
            <script
              key={schema["@type"]}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
          ))}

          <header className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={category.route}
                className="inline-flex w-fit items-center gap-2 text-sm text-[color:var(--app-text-secondary)] transition-colors hover:text-[color:var(--app-text-primary)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to {category.label} topics
              </Link>
              <KeyboardHint />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                  {topic.title}{" "}
                  <span className="text-xl font-normal text-[color:var(--app-text-secondary)] lg:text-2xl">
                    in {category.label}
                  </span>
                </h1>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px]",
                    DIFFICULTY_COLORS[topic.difficulty],
                  )}
                >
                  {topic.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {theory && <TopicTheoryButton href="#theory" />}
                <a
                  href={topic.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-200"
                  aria-label={`Read ${topic.title} documentation`}
                  title={`Open ${category.docsLabel}`}
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
            <ErrorBoundary>{children}</ErrorBoundary>
          </section>

          <TopicPagerNav previous={previous} next={next} />

          {theory && (
            <TopicTheorySections
              topic={topic}
              content={theory}
              relatedTopics={relatedTopics}
            />
          )}

          <TopicPagerNav previous={previous} next={next} placement="bottom" />
        </div>
      </TopicProgressProvider>
    </ToolbarProvider>
  );
};
