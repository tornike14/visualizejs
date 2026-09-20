import type { BaseStep } from "@/types/visualization";
export interface ScopeEntry {
  name: string;
  vars: Record<string, string>;
}

export interface ClosureStep extends BaseStep {
  stack: string[];
  scope: ScopeEntry[];
  consoleOutput: string[];
}
