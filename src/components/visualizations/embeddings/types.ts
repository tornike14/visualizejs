import type { SourceLine, BaseStep } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { TokenChip } from "@/components/visualization-ui/TokenChips";

export type EmbeddingsKind = "lookup" | "similarity" | "position";

/** A small matrix of signed values with row and column labels. */
export interface VectorTable {
  rowLabels: string[];
  colLabels: string[];
  /** Signed values, rows first. `null` renders as an empty cell. */
  values: (number | null)[][];
  /** Row currently being read or written. */
  activeRow?: number | null;
  /** Rows that were already consumed earlier in the example. */
  doneRows?: number[];
}

/** One dimension of a vector rendered as a signed bar. */
export interface SignedBar {
  id: string;
  label: string;
  /** Signed value, expected within [-1, 1]. */
  value: number;
}

export interface EmbeddingsStep extends BaseStep {
  primaryTable: VectorTable | null;
  secondaryTable: VectorTable | null;
  chips: TokenChip[];
  bars: SignedBar[];
  computation: string[];
}

export interface EmbeddingsExample extends ExampleOption {
  kind: EmbeddingsKind;
  codeLines: SourceLine[];
  steps: EmbeddingsStep[];
}
