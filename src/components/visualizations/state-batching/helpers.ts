import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type {
  EventLoopRunKind,
  RenderLogKind,
  StateBatchingKind,
  UpdateStatus,
} from "./types";

export const kindBadgeClass = createKindBadgeClass<StateBatchingKind>({
  batch: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  updater: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  automatic: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
});

export const kindLabel = createKindLabel<StateBatchingKind>({
  batch: "one render",
  updater: "updater queue",
  automatic: "automatic batching",
});

const UPDATE_STATUS_STYLES: Record<UpdateStatus, string> = {
  queued: "border-amber-500/30 bg-amber-500/8 text-amber-200",
  applying:
    "border-cyan-400/40 bg-cyan-500/10 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.12)]",
  applied: "border-emerald-500/30 bg-emerald-500/8 text-emerald-200 opacity-70",
};

export const updateStatusStyle = (status: UpdateStatus) =>
  UPDATE_STATUS_STYLES[status];

const RENDER_LOG_STYLES: Record<RenderLogKind, string> = {
  render: "border-cyan-500/30 bg-cyan-500/8 text-cyan-200",
  commit: "border-emerald-500/30 bg-emerald-500/8 text-emerald-200",
  legacy: "border-rose-500/25 bg-rose-500/6 text-rose-200/80",
  note: "border-slate-500/30 bg-slate-500/8 text-slate-300",
};

const RENDER_LOG_TAGS: Record<RenderLogKind, string> = {
  render: "RENDER",
  commit: "COMMIT",
  legacy: "REACT 17",
  note: "NOTE",
};

export const renderLogStyle = (kind: RenderLogKind) => RENDER_LOG_STYLES[kind];
export const renderLogTag = (kind: RenderLogKind) => RENDER_LOG_TAGS[kind];

const RUN_KIND_STYLES: Record<EventLoopRunKind, string> = {
  idle: "border-slate-500/30 bg-slate-800/40 text-slate-400",
  task: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  microtask: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  react: "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
};

const RUN_KIND_LABELS: Record<EventLoopRunKind, string> = {
  idle: "idle",
  task: "task",
  microtask: "microtask",
  react: "react flush",
};

export const runKindStyle = (kind: EventLoopRunKind) => RUN_KIND_STYLES[kind];
export const runKindLabel = (kind: EventLoopRunKind) => RUN_KIND_LABELS[kind];

const PENDING_STYLES: Record<"task" | "microtask", string> = {
  task: "border-emerald-500/25 text-emerald-300/80",
  microtask: "border-violet-500/25 text-violet-300/80",
};

export const pendingStyle = (kind: "task" | "microtask") =>
  PENDING_STYLES[kind];
