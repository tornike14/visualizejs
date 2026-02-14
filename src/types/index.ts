export type Category = "javascript" | "react";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Topic {
  id: string;
  title: string;
  category: Category;
  route: string;
  description: string;
  difficulty: Difficulty;
  /** External URL to authoritative documentation for this topic. */
  docsUrl: string;
}
