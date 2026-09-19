import type { SourceLine, BaseStep } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { MetricBar } from "@/components/visualization-ui/MetricBars";

export type AttentionKind = "scores" | "mask" | "heads";

export type VectorTone = "neutral" | "active" | "muted";

/** One token row in the vectors table. Cells are labelled column values. */
export interface VectorRow {
  id: string;
  token: string;
  cells: { label: string; value: string }[];
  tone?: VectorTone;
}

/**
 * A table of pre-softmax numbers. A null cell is not computed yet, a
 * masked cell renders as -inf.
 */
export interface ScoreGrid {
  id: string;
  label: string;
  rowLabels: string[];
  colLabels: string[];
  values: (number | null)[][];
  masked?: boolean[][];
  activeRow?: number;
  activeCol?: number;
}

/** A softmax weight matrix rendered as a heatmap, values in 0 to 1. */
export interface WeightGrid {
  id: string;
  label: string;
  rowLabels: string[];
  colLabels: string[];
  values: number[][];
  mask?: boolean[][];
  activeRow?: number;
  activeCol?: number;
  colorRgb?: string;
}

export type WorkTone = "neutral" | "active" | "result";

export interface WorkLine {
  id: string;
  text: string;
  tone: WorkTone;
}

export interface AttentionStep extends BaseStep {
  vectors: VectorRow[];
  scores: ScoreGrid[];
  weights: WeightGrid[];
  work: WorkLine[];
  output: MetricBar[];
}

export interface AttentionExample extends ExampleOption {
  kind: AttentionKind;
  codeLines: SourceLine[];
  steps: AttentionStep[];
}
