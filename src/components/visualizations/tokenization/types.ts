import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { TokenChip } from "@/components/visualization-ui/TokenChips";
import type { MetricBar } from "@/components/visualization-ui/MetricBars";

export type TokenizationKind = "bpe" | "encode" | "edge-cases";

export type StatTone = "cyan" | "green" | "amber" | "rose" | "slate";

/** A labelled row of chips, for example one corpus word or the output ids. */
export interface SegmentGroup {
  id: string;
  label: string;
  chips: TokenChip[];
  showIndex?: boolean;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  tone?: StatTone;
}

export interface TokenizationStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  /** Tokens or per-word segmentation. */
  segments: SegmentGroup[];
  /** Vocabulary entries or merge rules applied so far. */
  rules: TokenChip[];
  /** Pair frequencies, used by the BPE training example only. */
  bars: MetricBar[];
  /** UTF-8 bytes of the piece being encoded, empty during training. */
  bytes: TokenChip[];
  stats: StatItem[];
}

export interface TokenizationExample extends ExampleOption {
  kind: TokenizationKind;
  codeLines: SourceLine[];
  steps: TokenizationStep[];
}
