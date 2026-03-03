import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { GCKind, GCRoot, HeapObject } from "./types";

export const kindBadgeClass = createKindBadgeClass<GCKind>({
  algorithm: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  leak: "bg-red-500/15 text-red-400 border-red-500/25",
  weak: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
});

export const kindLabel = createKindLabel<GCKind>({
  algorithm: "algorithm",
  leak: "leak",
  weak: "weak",
});

export const ROOT_TONE_MAP = {
  amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
} as const;

export const HEAP_STATUS_MAP = {
  alive: "",
  unreachable: "opacity-50 ring-1 ring-red-400/40",
  collected: "hidden",
} as const;

export const HEAP_TONE_MAP = {
  amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  violet: "border-violet-500/30 bg-violet-500/8 text-violet-300",
} as const;

/** Stable fingerprint for a root - changes only when root data changes. */
export function rootFingerprint(root: GCRoot): string {
  return `${root.label}|${root.tone}|${root.refsTo.join(",")}`;
}

/** Stable fingerprint for a heap object - changes only when object data changes. */
export function heapFingerprint(obj: HeapObject): string {
  return `${obj.label}|${obj.tone}|${obj.status}|${obj.props.map((p) => `${p.key}:${p.value}`).join(",")}`;
}
