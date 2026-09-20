import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TopicProgressMark } from "@/components/progress/TopicProgressMark";
import { CATEGORIES } from "@/lib/categories";
import { DIFFICULTY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Topic } from "@/types";

interface TopicCardProps {
  topic: Topic;
  index?: number;
  showCategory?: boolean;
  className?: string;
}

export const TopicCard = ({
  topic,
  index,
  showCategory = false,
  className,
}: TopicCardProps) => {
  const category = CATEGORIES[topic.category];

  return (
    <Link
      href={topic.route}
      prefetch={false}
      className={cn("group block h-full", className)}
      style={{ "--card-glow": category.glowRgb } as React.CSSProperties}
    >
      <article className="topic-card app-surface flex h-full flex-col gap-3 rounded-3xl p-5 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {index != null && (
              <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                {String(index).padStart(2, "0")}
              </span>
            )}
            <h3 className="truncate text-base font-semibold text-[color:var(--app-text-primary)]">
              {topic.title}
            </h3>
            <TopicProgressMark topicId={topic.id} />
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {showCategory && (
              <Badge
                variant="outline"
                className={cn("text-[10px]", category.badgeClass)}
              >
                {category.label}
              </Badge>
            )}
            <Badge
              variant="outline"
              className={cn("text-[10px]", DIFFICULTY_COLORS[topic.difficulty])}
            >
              {topic.difficulty}
            </Badge>
          </div>
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-[color:var(--app-text-secondary)]">
          {topic.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors group-hover:text-[color:var(--app-text-primary)]">
          Open visualization
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </article>
    </Link>
  );
};
