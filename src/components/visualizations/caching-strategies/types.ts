import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { FlowMessage } from "@/components/visualization-ui/MessageFlow";
import type { MetricBar } from "@/components/visualization-ui/MetricBars";
import type { TokenChip } from "@/components/visualization-ui/TokenChips";

export type CachingKind = "aside" | "write" | "lru";

/** Visual state of a single cache entry. */
export type CacheEntryState =
  | "fresh"
  | "hit"
  | "stale"
  | "expired"
  | "pending"
  | "evicted";

export interface CacheEntry {
  key: string;
  value: string;
  /** Remaining TTL as display text, for example "55 s" or "none". */
  ttl: string;
  state: CacheEntryState;
}

/** A row in the source of truth, shown under the cache so drift is visible. */
export interface SourceRow {
  key: string;
  value: string;
}

export type WriteStatus = "pending" | "active" | "done";

export interface QueuedWrite {
  id: string;
  label: string;
  status: WriteStatus;
}

export interface CachingStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  cache: CacheEntry[];
  database: SourceRow[];
  messages: FlowMessage[];
  activeActorId?: string;
  stats: MetricBar[];
  queue: QueuedWrite[];
  recency: TokenChip[];
}

export interface CachingExample extends ExampleOption {
  kind: CachingKind;
  codeLines: SourceLine[];
  steps: CachingStep[];
}
