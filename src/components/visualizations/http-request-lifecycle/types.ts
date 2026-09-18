import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { PipelineStage } from "@/components/visualization-ui/PipelineDiagram";
import type {
  FlowActor,
  FlowMessage,
} from "@/components/visualization-ui/MessageFlow";

export type HttpRequestKind = "roundtrip" | "server" | "errors";

export type TableRowTone = "neutral" | "active" | "done" | "failed" | "muted";

export interface TableRow {
  key: string;
  value: string;
  tone?: TableRowTone;
}

export interface HttpRequestStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  /** Cumulative wall-clock time shown next to the pipeline, e.g. "80 ms". */
  elapsed?: string;
  stages: PipelineStage[];
  messages: FlowMessage[];
  activeActorId?: string;
  /** Rows for the Headers / Request Object / Response panel. */
  tableRows: TableRow[];
}

export interface HttpRequestExample extends ExampleOption {
  kind: HttpRequestKind;
  pipelineTitle: string;
  pipelineOrientation: "horizontal" | "vertical";
  tableTitle: string;
  actors: FlowActor[];
  codeLines: SourceLine[];
  steps: HttpRequestStep[];
}
