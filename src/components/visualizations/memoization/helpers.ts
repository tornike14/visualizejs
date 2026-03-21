import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { MemoizationKind, CacheStatus, RenderDecision } from "./types";

export const kindBadgeClass = createKindBadgeClass<MemoizationKind>({
  memo: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "use-memo": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "use-callback": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  invalidation: "bg-rose-500/15 text-rose-400 border-rose-500/25",
});

export const kindLabel = createKindLabel<MemoizationKind>({
  memo: "React.memo",
  "use-memo": "useMemo",
  "use-callback": "useCallback",
  invalidation: "invalidation",
});

const CACHE_STATUS_STYLES: Record<CacheStatus, string> = {
  empty: "border-slate-500/30 bg-slate-500/8 text-slate-400",
  hit: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  miss: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  stale: "border-rose-500/30 bg-rose-500/8 text-rose-300",
};

const CACHE_STATUS_LABELS: Record<CacheStatus, string> = {
  empty: "EMPTY",
  hit: "HIT",
  miss: "MISS",
  stale: "STALE",
};

export function cacheStatusStyle(status: CacheStatus) {
  return CACHE_STATUS_STYLES[status];
}

export function cacheStatusLabel(status: CacheStatus) {
  return CACHE_STATUS_LABELS[status];
}

const DECISION_STYLES: Record<RenderDecision["decision"], string> = {
  render: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  skip: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
};

const DECISION_LABELS: Record<RenderDecision["decision"], string> = {
  render: "RENDER",
  skip: "SKIP",
};

export function decisionStyle(decision: RenderDecision["decision"]) {
  return DECISION_STYLES[decision];
}

export function decisionLabel(decision: RenderDecision["decision"]) {
  return DECISION_LABELS[decision];
}
