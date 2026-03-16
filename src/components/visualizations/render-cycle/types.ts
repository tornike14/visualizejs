import type { SourceLine, TreeNodeData } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type RenderCycleKind = "two-phases" | "batched-updates";

export type CyclePhase = "idle" | "render" | "commit";

export type EffectType = "useEffect" | "useLayoutEffect" | "DOM mutation";

export type EffectStatus = "pending" | "cleanup" | "running" | "done";

export interface EffectEntry {
  type: EffectType;
  label: string;
  status: EffectStatus;
}

export interface PhaseInfo {
  phase: CyclePhase;
  tags: string[];
}

export interface RenderCycleStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  phaseInfo: PhaseInfo;
  currentTree: TreeNodeData;
  wipTree: TreeNodeData | null;
  effects: EffectEntry[];
}

export interface RenderCycleExample extends ExampleOption {
  kind: RenderCycleKind;
  codeLines: SourceLine[];
  steps: RenderCycleStep[];
}
