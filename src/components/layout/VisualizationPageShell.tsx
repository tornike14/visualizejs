import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ToolbarProvider, ToolbarSlot } from "./ToolbarPortal";
import type { Topic } from "@/types";

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

  return (
    <ToolbarProvider>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 pb-6 pt-3 lg:px-6 lg:pb-8 lg:pt-6">
        <header className="flex flex-col gap-3">
          <Link
            href={categoryRoute}
            className="inline-flex w-fit items-center gap-2 text-sm text-[color:var(--app-text-secondary)] transition-colors hover:text-[color:var(--app-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {categoryLabel} topics
          </Link>

          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
              {topic.title}
            </h1>
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
        </header>

        <div className="h-px bg-[color:var(--app-border)]" />

        <ToolbarSlot />

        <section className="app-surface rounded-2xl p-3 lg:p-4">
          {children}
        </section>
      </div>
    </ToolbarProvider>
  );
}
