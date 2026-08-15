import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { BoundaryPhase, ErrorBoundaryKind } from "./types";

/* ── Helpers ── */

export const kindBadgeClass = createKindBadgeClass<ErrorBoundaryKind>({
  basic: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  nested: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  recovery: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
});

export const kindLabel = createKindLabel<ErrorBoundaryKind>({
  basic: "basic",
  nested: "nested",
  recovery: "recovery",
});

export function phaseLabel(phase: BoundaryPhase): string {
  switch (phase) {
    case "normal":
      return "Normal";
    case "error-thrown":
      return "Error Thrown";
    case "getDerivedStateFromError":
      return "getDerivedStateFromError";
    case "componentDidCatch":
      return "componentDidCatch";
    case "fallback-rendered":
      return "Fallback Rendered";
    case "recovered":
      return "Recovered";
    default:
      return "Unknown";
  }
}

export function phaseColorClass(phase: BoundaryPhase): string {
  switch (phase) {
    case "normal":
      return "text-emerald-400 bg-emerald-500/15";
    case "error-thrown":
      return "text-rose-400 bg-rose-500/15";
    case "getDerivedStateFromError":
      return "text-amber-400 bg-amber-500/15";
    case "componentDidCatch":
      return "text-violet-400 bg-violet-500/15";
    case "fallback-rendered":
      return "text-cyan-400 bg-cyan-500/15";
    case "recovered":
      return "text-emerald-400 bg-emerald-500/15";
    default:
      return "text-slate-400 bg-slate-500/15";
  }
}
