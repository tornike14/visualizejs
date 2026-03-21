import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { SuspenseKind, BoundaryStatus } from "./types";

export const kindBadgeClass = createKindBadgeClass<SuspenseKind>({
  single: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  nested: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  parallel: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<SuspenseKind>({
  single: "single",
  nested: "nested",
  parallel: "parallel",
});

const BOUNDARY_STATUS_STYLES: Record<BoundaryStatus, string> = {
  idle: "border-slate-500/30 bg-slate-500/8 text-slate-400",
  suspended: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  "fallback-visible": "border-rose-500/30 bg-rose-500/8 text-rose-300",
  resolved: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
};

const BOUNDARY_STATUS_LABELS: Record<BoundaryStatus, string> = {
  idle: "IDLE",
  suspended: "SUSPENDED",
  "fallback-visible": "FALLBACK",
  resolved: "RESOLVED",
};

export function boundaryStatusStyle(status: BoundaryStatus) {
  return BOUNDARY_STATUS_STYLES[status];
}

export function boundaryStatusLabel(status: BoundaryStatus) {
  return BOUNDARY_STATUS_LABELS[status];
}
