import type { Difficulty, Topic } from "@/types";

export const DIFFICULTY_ORDER: readonly Difficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** Query parameter that carries the selected level on category pages. */
export const DIFFICULTY_PARAM = "level";

export const isDifficulty = (value: unknown): value is Difficulty =>
  typeof value === "string" &&
  (DIFFICULTY_ORDER as readonly string[]).includes(value);

/** Parses a level from a query string; anything unknown means no filter. */
export const parseDifficultyParam = (search: string): Difficulty | null => {
  const value = new URLSearchParams(search).get(DIFFICULTY_PARAM);
  return isDifficulty(value) ? value : null;
};

/** The query string for a level, or an empty string for no filter. */
export const buildDifficultySearch = (level: Difficulty | null): string =>
  level ? `?${DIFFICULTY_PARAM}=${level}` : "";

export const countByDifficulty = (
  list: readonly Topic[],
): Record<Difficulty, number> => {
  const counts: Record<Difficulty, number> = {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  };
  for (const topic of list) counts[topic.difficulty] += 1;
  return counts;
};

/** Narrows a list to one level; null returns the list untouched. */
export const filterByDifficulty = (
  list: readonly Topic[],
  level: Difficulty | null,
): readonly Topic[] =>
  level ? list.filter((topic) => topic.difficulty === level) : list;
