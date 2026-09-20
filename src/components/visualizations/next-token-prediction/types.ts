import type { SourceLine, BaseStep } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { PipelineStage } from "@/components/visualization-ui/PipelineDiagram";
import type { TokenChip } from "@/components/visualization-ui/TokenChips";

export type NextTokenKind = "softmax" | "temperature" | "truncation";

/** What the Candidates panel is currently plotting. */
export type CandidateMode = "logit" | "scaled" | "exp" | "prob";

export type CandidateStatus =
  | "neutral"
  | "active"
  | "kept"
  | "chosen"
  | "dropped";

export interface CandidateRow {
  id: string;
  token: string;
  /** Text shown at the end of the bar. */
  display: string;
  /** Bar fill in the 0 to 1 range. */
  bar: number;
  status: CandidateStatus;
}

export type TableRowTone = "neutral" | "kept" | "chosen" | "dropped" | "muted";

export interface TableRow {
  cells: string[];
  tone?: TableRowTone;
}

export interface DetailTable {
  columns: string[];
  rows: TableRow[];
}

export interface NextTokenStep extends BaseStep {
  pipeline: PipelineStage[];
  candidateMode: CandidateMode;
  candidates: CandidateRow[];
  /** One line under the bars, for example the sum or a rounding note. */
  candidateNote: string | null;
  table: DetailTable | null;
  sequence: TokenChip[];
}

export interface NextTokenExample extends ExampleOption {
  kind: NextTokenKind;
  /** Title of the violet table panel, varies per example. */
  tablePanelTitle: string;
  codeLines: SourceLine[];
  steps: NextTokenStep[];
}
