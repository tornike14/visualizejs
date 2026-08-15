import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

/* ── Types ── */

export type EventDelegationKind = "bubbling" | "stop-propagation" | "delegation";

export type EventPhase = "capture" | "target" | "bubble";

export type NodeHighlight =
  | "idle"
  | "capture-active"
  | "target-active"
  | "bubble-active"
  | "stopped";

export interface DOMNodeData {
  tag: string;
  id: string;
  label: string;
  highlight: NodeHighlight;
  hasHandler: boolean;
  handlerPhase?: "capture" | "bubble";
  children: DOMNodeData[];
}

export interface EventPathEntry {
  nodeLabel: string;
  phase: EventPhase;
  handlerFired: boolean;
  stopped: boolean;
}

export interface EventDelegationStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  domTree: DOMNodeData;
  eventPath: EventPathEntry[];
  currentPhaseLabel: string | null;
}

export interface EventDelegationExample extends ExampleOption {
  kind: EventDelegationKind;
  codeLines: SourceLine[];
  steps: EventDelegationStep[];
}
