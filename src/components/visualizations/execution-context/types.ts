import type { SourceLine, BaseStep } from "@/types/visualization";

export type { SourceLine };

export interface Binding {
  name: string;
  value: string;
  kind: "var" | "function" | "param";
  /** True when the variable has been assigned its runtime value. */
  initialized: boolean;
}

export interface ScopeLink {
  from: string;
  to: string;
  active?: boolean;
}

export interface ExecutionContextEntry {
  id: string;
  label: string;
  type: "global" | "function";
  phase: "creation" | "execution";
  thisValue: string;
  variableEnv: Binding[];
  outerEnvLabel: string | null;
}

export interface PhaseDetail {
  label: string;
  items: string[];
}

export interface ECStep extends BaseStep {
  highlightLines: number[];
  stack: ExecutionContextEntry[];
  scopeLinks: ScopeLink[];
  phaseDetail: PhaseDetail | null;
  returnValue: string | null;
  consoleOutput: string[];
}
