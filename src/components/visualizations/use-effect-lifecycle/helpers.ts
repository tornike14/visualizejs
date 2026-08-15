import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { EffectPhase, UseEffectKind } from "./types";

/* ── Helpers ── */

export const kindBadgeClass = createKindBadgeClass<UseEffectKind>({
  "mount-unmount": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  deps: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  cleanup: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  patterns: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
});

export const kindLabel = createKindLabel<UseEffectKind>({
  "mount-unmount": "mount/unmount",
  deps: "deps array",
  cleanup: "cleanup",
  patterns: "patterns",
});

export function phaseLabel(phase: EffectPhase): string {
  switch (phase) {
    case "render":
      return "Render";
    case "commit":
      return "Commit";
    case "paint":
      return "Paint";
    case "effect-run":
      return "Effect Runs";
    case "cleanup-run":
      return "Cleanup Runs";
    default:
      return "Idle";
  }
}

export function phaseColorClass(phase: EffectPhase): string {
  switch (phase) {
    case "render":
      return "text-amber-400 bg-amber-500/15";
    case "commit":
      return "text-cyan-400 bg-cyan-500/15";
    case "paint":
      return "text-emerald-400 bg-emerald-500/15";
    case "effect-run":
      return "text-violet-400 bg-violet-500/15";
    case "cleanup-run":
      return "text-rose-400 bg-rose-500/15";
    default:
      return "text-slate-400 bg-slate-500/15";
  }
}
