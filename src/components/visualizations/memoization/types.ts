import type { SourceLine, TreeNodeData } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type MemoizationKind = "memo" | "use-memo" | "use-callback" | "invalidation";

export type CacheStatus = "empty" | "hit" | "miss" | "stale";

export interface MemoEntry {
  id: string;
  hook: "React.memo" | "useMemo" | "useCallback";
  label: string;
  deps: string[];
  prevDeps?: string[];
  cachedValue: string;
  status: CacheStatus;
}

export interface RenderDecision {
  componentId: string;
  label: string;
  decision: "render" | "skip";
  reason: string;
}

export interface MemoizationStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  componentTree: TreeNodeData;
  activeNodeId?: string;
  memoEntries: MemoEntry[];
  renderDecisions: RenderDecision[];
}

export interface MemoizationExample extends ExampleOption {
  kind: MemoizationKind;
  codeLines: SourceLine[];
  steps: MemoizationStep[];
}
