import type { SourceLine, TreeNodeData } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type RSCKind = "basic" | "payload" | "composition";

export type RenderPhase =
  | "idle"
  | "server-render"
  | "serialization"
  | "client-hydration"
  | "complete";

export interface PayloadEntry {
  id: string;
  type: "html-chunk" | "client-reference" | "serialized-props";
  label: string;
  detail: string;
  status: "pending" | "streaming" | "sent";
}

export interface RSCStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  componentTree: TreeNodeData;
  activeNodeId?: string;
  renderPhase: RenderPhase;
  payload: PayloadEntry[];
}

export interface RSCExample extends ExampleOption {
  kind: RSCKind;
  codeLines: SourceLine[];
  steps: RSCStep[];
}
