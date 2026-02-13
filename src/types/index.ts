export type Category = "javascript" | "react";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Topic {
  id: string;
  title: string;
  category: Category;
  route: string;
  description: string;
  difficulty: Difficulty;
  icon: string;
}
