import type { SourceLine, TreeNodeData } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type FiberTreeKind = "work-loop" | "unit-of-work";

export type WorkLoopPhase = "idle" | "beginWork" | "completeWork";

export interface FiberNodeState {
  tag: string;
  stateNode: string | null;
  child: string | null;
  sibling: string | null;
  return: string | null;
}

export interface FiberTreeStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  tree: TreeNodeData;
  activeNodeId?: string;
  phase: WorkLoopPhase;
  currentFiber: string | null;
  pendingWork: string[];
  fiberDetail: FiberNodeState | null;
}

export interface FiberTreeExample extends ExampleOption {
  kind: FiberTreeKind;
  codeLines: SourceLine[];
  steps: FiberTreeStep[];
}
