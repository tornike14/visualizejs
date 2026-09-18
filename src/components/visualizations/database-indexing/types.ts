import type { SourceLine, TreeNodeData } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type DatabaseIndexingKind = "scan" | "composite" | "writes";

/** Visual state of one heap row in the Table Pages panel. */
export type TableRowState = "idle" | "visited" | "match" | "new";

export interface TableRow {
  id: number;
  /** The value shown next to the row id, an email or "Last, First". */
  key: string;
  state: TableRowState;
}

export interface TablePage {
  id: string;
  label: string;
  rows: TableRow[];
}

export type PlanStatus = "pending" | "running" | "done" | "rejected";

export interface PlanEntry {
  id: string;
  operation: string;
  detail: string;
  /** Page reads so far, as display text. */
  reads: string;
  /** Rows or keys compared so far, as display text. */
  rows: string;
  elapsed?: string;
  status: PlanStatus;
}

export type IndexColumnState = "idle" | "used" | "unused" | "blocked";

export interface IndexColumn {
  name: string;
  position: number;
  state: IndexColumnState;
}

export type WriteTone = "heap" | "index" | "split" | "wal";

export interface WriteLogEntry {
  id: string;
  target: string;
  detail: string;
  tone: WriteTone;
}

export interface DatabaseIndexingStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  pages: TablePage[];
  tree: TreeNodeData | null;
  activeNodeId?: string;
  plan: PlanEntry[];
  indexColumns: IndexColumn[];
  writeLog: WriteLogEntry[];
}

export interface DatabaseIndexingExample extends ExampleOption {
  kind: DatabaseIndexingKind;
  /** Name of the index drawn in the B-tree panel. */
  indexName: string;
  codeLines: SourceLine[];
  steps: DatabaseIndexingStep[];
}
