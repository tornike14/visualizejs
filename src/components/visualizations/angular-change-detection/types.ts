import type { SourceLine, TreeNodeData, BaseStep } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { PipelineStage } from "@/components/visualization-ui/PipelineDiagram";

export type AngularKind = "zone" | "onpush" | "signals";

export type CheckResult =
  | "changed"
  | "same"
  | "skipped"
  | "traversed"
  | "stale"
  | "pass";

export interface CheckRecord {
  id: string;
  component: string;
  binding: string;
  oldValue: string;
  newValue: string;
  result: CheckResult;
}

export interface TriggerState {
  /** What kicked off this change detection run, for example "click" or "count.set(1)". */
  source: string;
  /** One-line note under the source, for example "patched by zone.js". */
  note: string;
  stages: PipelineStage[];
}

export type SignalNodeKind = "signal" | "computed" | "view";
export type SignalNodeState = "clean" | "dirty" | "updated" | "reading";

export interface SignalNode {
  id: string;
  label: string;
  kind: SignalNodeKind;
  value: string;
  state: SignalNodeState;
}

export interface AngularStep extends BaseStep {
  tree: TreeNodeData;
  activeNodeId?: string;
  trigger: TriggerState;
  checks: CheckRecord[];
  signals: SignalNode[];
}

export interface AngularExample extends ExampleOption {
  kind: AngularKind;
  codeLines: SourceLine[];
  steps: AngularStep[];
}
