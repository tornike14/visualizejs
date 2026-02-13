import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DIFFICULTY_COLORS } from "@/lib/constants";
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
  const categoryClass =
    topic.category === "javascript"
      ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
      : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 lg:p-10">
      <header className="flex flex-col gap-4">
        <Link
          href={categoryRoute}
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {categoryLabel} topics
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={categoryClass}>
                {categoryLabel}
              </Badge>
              <Badge
                variant="outline"
                className={`text-[10px] ${DIFFICULTY_COLORS[topic.difficulty]}`}
              >
                {topic.difficulty}
              </Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
              {topic.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground lg:text-base">
              {topic.description}
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-card/50 p-4 shadow-sm backdrop-blur-sm lg:p-6">
        {children}
      </section>
    </div>
  );
}
