import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { ModulePhase, ModulesKind } from "./types";

/* ── Helpers ── */

export const kindBadgeClass = createKindBadgeClass<ModulesKind>({
  "named-default": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "live-bindings": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  circular: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<ModulesKind>({
  "named-default": "named/default",
  "live-bindings": "live bindings",
  circular: "circular",
});

export function phaseLabel(phase: ModulePhase): string {
  switch (phase) {
    case "unlinked":
      return "Unlinked";
    case "linking":
      return "Linking";
    case "linked":
      return "Linked";
    case "evaluating":
      return "Evaluating";
    case "evaluated":
      return "Evaluated";
    default:
      return "Unknown";
  }
}

export function phaseColorClass(phase: ModulePhase): string {
  switch (phase) {
    case "unlinked":
      return "text-slate-400 bg-slate-500/15";
    case "linking":
      return "text-amber-400 bg-amber-500/15";
    case "linked":
      return "text-cyan-400 bg-cyan-500/15";
    case "evaluating":
      return "text-violet-400 bg-violet-500/15";
    case "evaluated":
      return "text-emerald-400 bg-emerald-500/15";
    default:
      return "text-slate-400 bg-slate-500/15";
  }
}
