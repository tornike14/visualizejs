import type { SourceLine, TreeNodeData } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

/* ── Types ── */

export type UseEffectKind = "mount-unmount" | "deps" | "cleanup" | "patterns";

export type EffectPhase =
  | "idle"
  | "render"
  | "commit"
  | "paint"
  | "effect-run"
  | "cleanup-run";

export interface EffectEntry {
  id: string;
  label: string;
  phase: EffectPhase;
  deps?: string;
  cleanupPending?: boolean;
}

export interface UseEffectStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  componentTree: TreeNodeData;
  activeNodeId?: string;
  effects: EffectEntry[];
  currentPhase: EffectPhase;
}

export interface UseEffectExample extends ExampleOption {
  kind: UseEffectKind;
  codeLines: SourceLine[];
  steps: UseEffectStep[];
}
