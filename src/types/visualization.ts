/**
 * Shared types used across multiple visualization components.
 */

/** A single line of source code displayed in a CodeBlock. */
export interface SourceLine {
  num: number;
  text: string;
}

/** Fields every step in a source-driven visualization carries. */
export interface BaseStep {
  /** Trusted HTML authored in the topic's data file, shown in the step pill. */
  descriptionHtml: string;
  /**
   * Optional plain-language version of descriptionHtml for readers who are
   * new to the subject. When any step in a topic sets it, the toolbar offers
   * a Simple / Detailed toggle.
   */
  simpleHtml?: string;
  activeLine: number | null;
  doneLines: number[];
}

/** An entry in the example selector. */
export interface ExampleOption {
  id: string;
  title: string;
  description: string;
}

/** A selectable example: source lines plus the steps that walk through them. */
export interface SourceExample<
  TStep extends BaseStep = BaseStep,
> extends ExampleOption {
  codeLines: SourceLine[];
  steps: TStep[];
}

/**
 * Highlight state used by scope-chain-style visualizations
 * (ScopeChain, PrototypalInheritance).
 */
export type ChainHighlight = "active" | "searching" | "found" | "none";

/**
 * Highlight state used by tree-style visualizations
 * (Reconciliation, Re-rendering, Fiber Architecture).
 */
export type TreeNodeHighlight =
  | "unchanged"
  | "updated"
  | "added"
  | "removed"
  | "active";

/** A single node in a component/element tree diagram. */
export interface TreeNodeData {
  id: string;
  label: string;
  props?: { key: string; value: string }[];
  children?: TreeNodeData[];
  highlight?: TreeNodeHighlight;
}
