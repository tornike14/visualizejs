import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { RSCKind, RenderPhase, PayloadEntry } from "./types";

export const kindBadgeClass = createKindBadgeClass<RSCKind>({
  basic: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  payload: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  composition: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<RSCKind>({
  basic: "basic",
  payload: "payload",
  composition: "composition",
});

const PHASE_STYLES: Record<RenderPhase, string> = {
  idle: "border-slate-500/30 bg-slate-500/8 text-slate-400",
  "server-render": "border-amber-500/30 bg-amber-500/8 text-amber-300",
  serialization: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  "client-hydration": "border-violet-500/30 bg-violet-500/8 text-violet-300",
  complete: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
};

const PHASE_LABELS: Record<RenderPhase, string> = {
  idle: "Idle",
  "server-render": "Server Render",
  serialization: "Serialization",
  "client-hydration": "Client Hydration",
  complete: "Complete",
};

export function phaseStyle(phase: RenderPhase) {
  return PHASE_STYLES[phase];
}

export function phaseLabel(phase: RenderPhase) {
  return PHASE_LABELS[phase];
}

const PAYLOAD_TYPE_STYLES: Record<PayloadEntry["type"], string> = {
  "html-chunk": "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  "client-reference": "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  "serialized-props": "border-amber-500/30 bg-amber-500/8 text-amber-300",
};

const PAYLOAD_TYPE_LABELS: Record<PayloadEntry["type"], string> = {
  "html-chunk": "HTML",
  "client-reference": "CLIENT REF",
  "serialized-props": "PROPS",
};

export function payloadTypeStyle(type: PayloadEntry["type"]) {
  return PAYLOAD_TYPE_STYLES[type];
}

export function payloadTypeLabel(type: PayloadEntry["type"]) {
  return PAYLOAD_TYPE_LABELS[type];
}
