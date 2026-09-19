import type { SourceLine, TreeNodeData, BaseStep } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type ReconciliationKind = "same-type" | "different-type" | "key-list";

export interface DiffOperation {
  type: "update" | "insert" | "remove" | "move" | "noop";
  target: string;
  detail: string;
}

export interface ReconciliationStep extends BaseStep {
  previousTree: TreeNodeData;
  newTree: TreeNodeData;
  activeNodeId?: string;
  operations: DiffOperation[];
}

export interface ReconciliationExample extends ExampleOption {
  kind: ReconciliationKind;
  codeLines: SourceLine[];
  steps: ReconciliationStep[];
}
