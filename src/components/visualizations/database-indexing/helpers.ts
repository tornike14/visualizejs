import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type {
  DatabaseIndexingKind,
  IndexColumnState,
  PlanStatus,
  TableRowState,
  WriteTone,
} from "./types";

export const kindBadgeClass = createKindBadgeClass<DatabaseIndexingKind>({
  scan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  composite: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  writes: "bg-rose-500/15 text-rose-400 border-rose-500/25",
});

export const kindLabel = createKindLabel<DatabaseIndexingKind>({
  scan: "scan vs index",
  composite: "composite index",
  writes: "write cost",
});

export const ROW_STYLES: Record<TableRowState, string> = {
  idle: "border-slate-700/40 bg-slate-900/40 text-slate-500",
  visited: "border-amber-400/30 bg-amber-400/8 text-amber-200",
  match: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
  new: "border-cyan-300/40 bg-cyan-400/10 text-cyan-100",
};

export const PLAN_STYLES: Record<PlanStatus, string> = {
  pending: "border-slate-600/40 bg-slate-800/40 text-slate-400",
  running: "border-cyan-300/40 bg-cyan-400/10 text-cyan-100",
  done: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
  rejected: "border-rose-400/40 bg-rose-400/10 text-rose-200",
};

export const PLAN_LABELS: Record<PlanStatus, string> = {
  pending: "PLAN",
  running: "RUN",
  done: "DONE",
  rejected: "SKIP",
};

export const COLUMN_STYLES: Record<IndexColumnState, string> = {
  idle: "border-slate-600/50 bg-slate-800/50 text-slate-300",
  used: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
  unused: "border-slate-700/40 bg-slate-900/40 text-slate-500",
  blocked: "border-rose-400/40 bg-rose-400/10 text-rose-200",
};

export const COLUMN_LABELS: Record<IndexColumnState, string> = {
  idle: "in index",
  used: "matched",
  unused: "not needed",
  blocked: "cannot use",
};

export const WRITE_STYLES: Record<WriteTone, string> = {
  heap: "border-cyan-300/40 bg-cyan-400/10 text-cyan-100",
  index: "border-violet-300/40 bg-violet-400/10 text-violet-200",
  split: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  wal: "border-slate-600/50 bg-slate-800/50 text-slate-300",
};

export const WRITE_LABELS: Record<WriteTone, string> = {
  heap: "HEAP",
  index: "INDEX",
  split: "SPLIT",
  wal: "WAL",
};
