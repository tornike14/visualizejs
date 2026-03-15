export interface ScopeEntry {
  name: string;
  vars: Record<string, string>;
}

export interface ClosureStep {
  descriptionHtml: string;
  activeLine: number;
  doneLines: number[];
  stack: string[];
  scope: ScopeEntry[];
  consoleOutput: string[];
}
