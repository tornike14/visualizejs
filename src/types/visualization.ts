/**
 * Shared types used across multiple visualization components.
 */

/** A single line of source code displayed in a CodeBlock. */
export interface SourceLine {
  num: number;
  text: string;
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
