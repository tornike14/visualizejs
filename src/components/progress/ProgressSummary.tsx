"use client";

import { useTopicProgress } from "@/hooks/useTopicProgress";
import { CATEGORY_LIST } from "@/lib/categories";
import { topics } from "@/lib/topics";
import { cn } from "@/lib/utils";

/** Landing page strip showing how much of each category has been completed. */
export const ProgressSummary = () => {
  const progress = useTopicProgress();
  const completedIds = new Set(Object.keys(progress));
  const completedTotal = topics.filter((topic) =>
    completedIds.has(topic.id),
  ).length;

  if (completedTotal === 0) return null;

  return (
    <section className="app-surface-subtle flex flex-col gap-3 rounded-2xl px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">Your progress</p>
        <p className="font-mono text-xs text-[color:var(--app-text-secondary)]">
          {completedTotal} / {topics.length} topics completed
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-5">
        {CATEGORY_LIST.map((category) => {
          const categoryTopics = topics.filter(
            (topic) => topic.category === category.id,
          );
          const done = categoryTopics.filter((topic) =>
            completedIds.has(topic.id),
          ).length;
          const percent = categoryTopics.length
            ? Math.round((done / categoryTopics.length) * 100)
            : 0;
          return (
            <div key={category.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">{category.label}</span>
                <span className="font-mono text-slate-500">
                  {done}/{categoryTopics.length}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800/80">
                <div
                  className={cn("h-full rounded-full transition-all")}
                  style={{
                    width: `${percent}%`,
                    background: `rgb(${category.glowRgb})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
