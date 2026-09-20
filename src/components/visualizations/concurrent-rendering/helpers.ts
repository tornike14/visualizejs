import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type {
  ConcurrentRenderingKind,
  FrameKind,
  LaneName,
  LaneStatus,
  UnitStatus,
  WorkPhase,
} from "./types";

export const kindBadgeClass = createKindBadgeClass<ConcurrentRenderingKind>({
  blocking: "bg-rose-500/15 text-rose-400 border-rose-500/25",
  transition: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  deferred: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<ConcurrentRenderingKind>({
  blocking: "blocking render",
  transition: "startTransition",
  deferred: "useDeferredValue",
});

/** Low 8 bits of the real lane constants: SyncLane = 2, DefaultLane = 32, TransitionLane1 = 128. */
export const LANE_MASKS: Record<LaneName, string> = {
  SyncLane: "0b00000010",
  DefaultLane: "0b00100000",
  TransitionLane: "0b10000000",
};

export const LANE_STYLES: Record<LaneName, string> = {
  SyncLane: "border-amber-300/40 bg-amber-400/10 text-amber-200",
  DefaultLane: "border-slate-500/40 bg-slate-500/10 text-slate-300",
  TransitionLane: "border-violet-300/40 bg-violet-400/10 text-violet-200",
};

export const LANE_STATUS_STYLES: Record<LaneStatus, string> = {
  queued: "text-slate-400",
  rendering: "text-cyan-300",
  committed: "text-emerald-300",
  discarded: "text-rose-300 line-through",
  suspended: "text-amber-300",
};

export const PHASE_STYLES: Record<WorkPhase, string> = {
  idle: "border-slate-500/30 bg-slate-500/8 text-slate-400",
  sync: "border-amber-300/40 bg-amber-400/10 text-amber-200",
  concurrent: "border-cyan-300/40 bg-cyan-400/10 text-cyan-200",
  yield: "border-pink-300/40 bg-pink-400/10 text-pink-200",
  commit: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
  discarded: "border-rose-300/40 bg-rose-400/10 text-rose-200",
  suspended: "border-amber-300/40 bg-amber-400/10 text-amber-200",
};

export const PHASE_LABELS: Record<WorkPhase, string> = {
  idle: "IDLE",
  sync: "RENDER (SYNC)",
  concurrent: "RENDER (CONCURRENT)",
  yield: "YIELD TO BROWSER",
  commit: "COMMIT",
  discarded: "DISCARDED",
  suspended: "SUSPENDED",
};

export const UNIT_STYLES: Record<UnitStatus, string> = {
  pending: "border-slate-600/50 bg-slate-800/50 text-slate-400",
  active:
    "border-cyan-300/50 bg-cyan-400/12 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.2)]",
  done: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
  skipped: "border-slate-700/40 bg-slate-900/40 text-slate-500",
  stale: "border-rose-400/40 bg-rose-400/10 text-rose-200 line-through",
};

export const FRAME_STYLES: Record<FrameKind, string> = {
  idle: "border-slate-600/40 bg-slate-800/40 text-slate-500",
  input: "border-amber-300/50 bg-amber-400/15 text-amber-200",
  blocked: "border-rose-400/50 bg-rose-500/20 text-rose-200",
  slice: "border-cyan-300/50 bg-cyan-400/15 text-cyan-200",
  commit: "border-emerald-300/50 bg-emerald-400/15 text-emerald-200",
};

export const FRAME_LEGEND: { kind: FrameKind; label: string }[] = [
  { kind: "input", label: "keystroke" },
  { kind: "blocked", label: "blocked" },
  { kind: "slice", label: "5 ms slices" },
  { kind: "commit", label: "commit" },
  { kind: "idle", label: "idle" },
];
