export type Category = "javascript" | "react" | "frameworks" | "backend" | "ai";

export type Difficulty = "beginner" | "intermediate" | "advanced";

/** Which skeleton the page shell shows while the toolbar portal mounts. */
export type ToolbarVariant = "selector" | "simple";

/** A topic as authored in the registry. */
export interface TopicDefinition {
  id: string;
  title: string;
  category: Category;
  description: string;
  difficulty: Difficulty;
  docsUrl: string;
  /** Defaults to "selector"; topics without an example picker use "simple". */
  toolbar?: ToolbarVariant;
  /**
   * Sub-heading the topic is listed under on its category page and in the
   * sidebar, for example "Vue" inside Frameworks. Topics without a group
   * are listed flat.
   */
  group?: string;
}

/** A topic with its derived route. */
export interface Topic extends TopicDefinition {
  route: string;
}
