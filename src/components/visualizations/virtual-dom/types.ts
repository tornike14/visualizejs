import type { SourceLine, TreeNodeData, BaseStep } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type VirtualDomKind = "element" | "component" | "dynamic";

export interface CreateElementCall {
  id: string;
  code: string;
  highlight?: boolean;
}

export interface VirtualDomStep extends BaseStep {
  vdomTree: TreeNodeData | null;
  activeNodeId?: string;
  createElementCalls: CreateElementCall[];
  domOutput: string[];
}

export interface VirtualDomExample extends ExampleOption {
  kind: VirtualDomKind;
  codeLines: SourceLine[];
  steps: VirtualDomStep[];
}
