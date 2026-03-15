import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { HooksKind, HookNodeStatus } from "./types";

export const kindBadgeClass = createKindBadgeClass<HooksKind>({
  "linked-list": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "order-violation": "bg-rose-500/15 text-rose-400 border-rose-500/25",
});

export const kindLabel = createKindLabel<HooksKind>({
  "linked-list": "linked list",
  "order-violation": "order violation",
});

const STATUS_STYLES: Record<HookNodeStatus, string> = {
  idle: "border-slate-500/30 bg-slate-500/8 text-slate-400",
  creating: "border-green-500/30 bg-green-500/8 text-green-300",
  reading: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  error: "border-rose-500/30 bg-rose-500/8 text-rose-300",
};

export function statusStyle(status: HookNodeStatus) {
  return STATUS_STYLES[status];
}
