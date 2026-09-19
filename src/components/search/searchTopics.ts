import type { Category, Difficulty } from "@/types";

export interface SearchEntry {
  kind: "topic" | "category";
  id: string;
  title: string;
  subtitle: string;
  route: string;
  category: Category;
  difficulty?: Difficulty;
}

const normalize = (value: string) => value.toLowerCase().trim();

/**
 * Scores entries against a query. Title prefix matches rank first, then
 * title substrings, then id and category, then description words.
 */
export const filterTopics = (
  entries: SearchEntry[],
  query: string,
): SearchEntry[] => {
  const needle = normalize(query);
  if (!needle) return entries;

  const terms = needle.split(/\s+/).filter(Boolean);

  const scored = entries
    .map((entry) => {
      const title = normalize(entry.title);
      const haystack = normalize(
        `${entry.title} ${entry.id.replace(/-/g, " ")} ${entry.category} ${entry.subtitle}`,
      );
      let score = 0;
      for (const term of terms) {
        if (title.startsWith(term)) score += 6;
        else if (title.includes(term)) score += 4;
        else if (entry.id.includes(term) || entry.category.includes(term))
          score += 3;
        else if (haystack.includes(term)) score += 1;
        else return null;
      }
      if (entry.kind === "category") score += 0.5;
      return { entry, score };
    })
    .filter((item): item is { entry: SearchEntry; score: number } =>
      Boolean(item),
    )
    .sort((a, b) => b.score - a.score);

  return scored.map((item) => item.entry);
};
