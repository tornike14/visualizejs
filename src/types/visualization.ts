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
