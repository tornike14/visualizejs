import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type SvelteRunesKind = "signals" | "compiler" | "deep";

/** Node kinds in the reactive graph. Template effects are the compiler's render effects. */
export type SignalNodeType = "source" | "derived" | "template" | "effect";

/**
 * Status flags modelled on the Svelte 5 internals:
 * unread is a derived that has never been pulled, maybe-dirty is a reaction
 * whose only changed dependency is a derived that may recompute to an equal value.
 */
export type SignalStatus =
  | "clean"
  | "unread"
  | "dirty"
  | "maybe-dirty"
  | "scheduled"
  | "running";

export interface SignalNode {
  id: string;
  name: string;
  type: SignalNodeType;
  status: SignalStatus;
  value?: string;
  /** Names of the signals this node read on its last run. */
  deps: string[];
  note?: string;
}

export type DomNodeState = "unchanged" | "added" | "updated" | "active";

export interface DomNode {
  id: string;
  label: string;
  text?: string;
  state: DomNodeState;
  depth?: number;
}

export interface SvelteRunesStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  signals: SignalNode[];
  dom: DomNode[];
  consoleOutput: string[];
  compiledActiveLine?: number | null;
  compiledDoneLines?: number[];
}

export interface SvelteRunesExample extends ExampleOption {
  kind: SvelteRunesKind;
  codeLines: SourceLine[];
  compiledLines?: SourceLine[];
  steps: SvelteRunesStep[];
}
