import type {
  SourceLine,
  ChainHighlight,
  BaseStep,
} from "@/types/visualization";

export type ScopeExampleKind = "lookup" | "block" | "lexical";

export interface ScopeEntry {
  label: string;
  type: "global" | "function" | "block";
  bindings: { name: string; value: string }[];
  highlight?: ChainHighlight;
  activeBinding?: string;
}

export interface LookupState {
  identifier: string;
  path: string[];
  result: "searching" | "found" | "error";
  foundIn?: string;
}

export interface ScopeStep extends BaseStep {
  scopes: ScopeEntry[];
  activeLink?: number;
  lookup: LookupState | null;
  consoleOutput: string[];
}

export interface ScopeExample {
  id: string;
  title: string;
  kind: ScopeExampleKind;
  description: string;
  codeLines: SourceLine[];
  steps: ScopeStep[];
}
