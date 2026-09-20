import type { SourceLine, BaseStep } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type VueReactivityKind = "track" | "computed" | "pitfalls";

export type TrapOp = "get" | "set";

/** What the interceptor did with the access. */
export type TrapResult = "track" | "trigger" | "noop" | "miss";

export interface TrapEntry {
  id: string;
  op: TrapOp;
  /** Variable name holding the proxy or ref, e.g. "state" or "count". */
  target: string;
  key: string;
  /** Written value for set, read value for get. */
  value: string;
  result: TrapResult;
  note: string;
  /** True when the access went through a ref accessor rather than a Proxy trap. */
  isRef?: boolean;
}

export type DepStatus = "idle" | "tracking" | "triggering";

export interface DepEntry {
  target: string;
  key: string;
  effects: string[];
  status: DepStatus;
}

export interface SchedulerState {
  activeEffect: string | null;
  queue: string[];
  /** Whether a flushJobs microtask has been queued and not yet run. */
  flushPending: boolean;
  /** Effects that ran synchronously in this step, e.g. flush: "sync" effects. */
  ranNow: string[];
}

export interface ComputedState {
  name: string;
  dirty: boolean;
  cached: string;
  evaluations: number;
  /** Subscribers of the computed itself (effects that read .value). */
  subscribers: string[];
}

export type BindingKind = "reactive" | "ref" | "plain" | "toRef";

export interface BindingEntry {
  name: string;
  kind: BindingKind;
  value: string;
  /** Short note on whether reads of this binding can be tracked. */
  note: string;
}

export interface VueReactivityStep extends BaseStep {
  traps: TrapEntry[];
  deps: DepEntry[];
  scheduler: SchedulerState;
  computed: ComputedState | null;
  bindings: BindingEntry[] | null;
  consoleOutput: string[];
}

export interface VueReactivityExample extends ExampleOption {
  kind: VueReactivityKind;
  codeLines: SourceLine[];
  steps: VueReactivityStep[];
}
