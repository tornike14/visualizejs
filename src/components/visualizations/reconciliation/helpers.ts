import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { ReconciliationKind, DiffOperation } from "./types";

export const kindBadgeClass = createKindBadgeClass<ReconciliationKind>({
  "same-type": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "different-type": "bg-rose-500/15 text-rose-400 border-rose-500/25",
  "key-list": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
});

export const kindLabel = createKindLabel<ReconciliationKind>({
  "same-type": "same type",
  "different-type": "different type",
  "key-list": "keyed list",
});

const OPERATION_STYLES: Record<DiffOperation["type"], string> = {
  update:
    "border-amber-500/30 bg-amber-500/8 text-amber-300",
  insert:
    "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  remove:
    "border-rose-500/30 bg-rose-500/8 text-rose-300",
  move:
    "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  noop:
    "border-slate-500/30 bg-slate-500/8 text-slate-400",
};

const OPERATION_LABELS: Record<DiffOperation["type"], string> = {
  update: "UPDATE",
  insert: "INSERT",
  remove: "REMOVE",
  move: "MOVE",
  noop: "SKIP",
};

export function operationStyle(type: DiffOperation["type"]) {
  return OPERATION_STYLES[type];
}

export function operationLabel(type: DiffOperation["type"]) {
  return OPERATION_LABELS[type];
}
