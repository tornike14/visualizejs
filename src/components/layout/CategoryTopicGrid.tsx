"use client";

import { useCallback } from "react";
import { DifficultyFilter } from "@/components/layout/DifficultyFilter";
import { TopicCard } from "@/components/layout/TopicCard";
import {
  buildDifficultySearch,
  countByDifficulty,
  filterByDifficulty,
  parseDifficultyParam,
} from "@/lib/difficulty";
import { groupTopics } from "@/lib/topics";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import type { Difficulty, Topic } from "@/types";

interface CategoryTopicGridProps {
  heading: string;
  topics: readonly Topic[];
}

/**
 * The topic list for a category with a difficulty filter. The selected level
 * lives in the `level` query parameter so a filtered view can be shared, but
 * the page itself stays static: the first render shows every topic and the
 * filter is applied once the URL is read on the client.
 */
export const CategoryTopicGrid = ({
  heading,
  topics,
}: CategoryTopicGridProps) => {
  const { search, replace } = useLocationSearch();
  const level = parseDifficultyParam(search);

  const handleChange = useCallback(
    (next: Difficulty | null) => replace(buildDifficultySearch(next)),
    [replace],
  );

  const counts = countByDifficulty(topics);
  const visible = filterByDifficulty(topics, level);
  const groups = groupTopics(visible);
  const indexById = new Map(
    topics.map((topic, index) => [topic.id, index + 1]),
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
          <p
            className="text-sm text-[color:var(--app-text-secondary)]"
            aria-live="polite"
          >
            {level
              ? `${visible.length} of ${topics.length} topics`
              : `${topics.length} topics, ordered from fundamentals to internals`}
          </p>
        </div>
        <DifficultyFilter
          value={level}
          counts={counts}
          total={topics.length}
          onChange={handleChange}
        />
      </div>
      {groups.map((group) => (
        <div key={group.label ?? "all"} className="flex flex-col gap-3">
          {group.label && (
            <h3 className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-secondary)]">
              {group.label}
            </h3>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {group.topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={indexById.get(topic.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
