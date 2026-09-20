import type { SourceLine, BaseStep } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { NeonTone } from "@/components/visualization-ui/NeonPanel";

export type DebounceThrottleKind = "debounce" | "throttle" | "compare";

export type TickState =
  | "event"
  | "ignored"
  | "pending"
  | "cancelled"
  | "call"
  | "trailing";

export interface TimelineTick {
  t: number;
  state: TickState;
  label?: string;
}

export interface TimelineRow {
  id: string;
  label: string;
  ticks: TimelineTick[];
}

export interface TimelineWindow {
  start: number;
  end: number;
  label: string;
}

export interface TimelineState {
  now: number | null;
  maxMs: number;
  rows: TimelineRow[];
  window?: TimelineWindow;
}

export type EntryTone = "active" | "pending" | "cleared" | "success" | "muted";

export interface StateEntry {
  key: string;
  value: string;
  tone?: EntryTone;
}

export interface StatePanelDef {
  id: string;
  title: string;
  tone: NeonTone;
}

export interface ComparisonRow {
  aspect: string;
  debounce: string;
  throttle: string;
}

export interface DebounceThrottleStep extends BaseStep {
  timeline: TimelineState;
  panelState: Record<string, StateEntry[]>;
  comparison: ComparisonRow[];
  consoleOutput: string[];
}

export interface DebounceThrottleExample extends ExampleOption {
  kind: DebounceThrottleKind;
  codeLines: SourceLine[];
  panelDefs: StatePanelDef[];
  steps: DebounceThrottleStep[];
}
