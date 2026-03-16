import type { SourceLine, TreeNodeData } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type ContextPropagationKind = "basic" | "nested" | "rerender";

export interface ContextEntry {
  name: string;
  value: string;
  providerId: string;
}

export interface ConsumerSubscription {
  consumerId: string;
  contextName: string;
  currentValue: string;
  isRerendering?: boolean;
}

export interface ContextPropagationStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  componentTree: TreeNodeData;
  activeNodeId?: string;
  contextRegistry: ContextEntry[];
  consumers: ConsumerSubscription[];
}

export interface ContextPropagationExample extends ExampleOption {
  kind: ContextPropagationKind;
  codeLines: SourceLine[];
  steps: ContextPropagationStep[];
}
