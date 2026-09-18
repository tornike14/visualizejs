import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { MetricBar } from "@/components/visualization-ui/MetricBars";
import type { TokenChip } from "@/components/visualization-ui/TokenChips";

export type RateLimitKind = "bucket" | "fixed" | "sliding";

export type RequestDecision = "accepted" | "rejected";

export interface RequestLogEntry {
  id: string;
  /** Request time in seconds, formatted for display, e.g. "t=9.8 s". */
  time: string;
  decision: RequestDecision;
  status: 200 | 429;
  /** Limiter state after the decision, e.g. "tokens 1.5 / 5". */
  detail: string;
}

export interface RateLimitStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  /** Bars for the bucket level or window counter. Empty for the sliding log. */
  bars: MetricBar[];
  /** Timestamp chips for the sliding log. Empty for bucket and fixed window. */
  stateChips: TokenChip[];
  /** One line of context under the state panel, e.g. the window bounds. */
  stateNote: string;
  log: RequestLogEntry[];
  timeline: TokenChip[];
}

export interface RateLimitExample extends ExampleOption {
  kind: RateLimitKind;
  stateTitle: string;
  codeLines: SourceLine[];
  steps: RateLimitStep[];
}
