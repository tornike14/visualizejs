import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { RateLimitKind, RequestDecision } from "./types";

export const kindBadgeClass = createKindBadgeClass<RateLimitKind>({
  bucket: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  fixed: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  sliding: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<RateLimitKind>({
  bucket: "token bucket",
  fixed: "fixed window",
  sliding: "sliding log",
});

const DECISION_STYLES: Record<RequestDecision, string> = {
  accepted: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  rejected: "border-rose-500/30 bg-rose-500/8 text-rose-300",
};

export const decisionStyle = (decision: RequestDecision) =>
  DECISION_STYLES[decision];
