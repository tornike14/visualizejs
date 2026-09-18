import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type {
  CheckStatus,
  ClaimState,
  JwtKind,
  StoreEntryStatus,
  TokenPartId,
  TokenPartState,
} from "./types";

export const kindBadgeClass = createKindBadgeClass<JwtKind>({
  issue: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  verify: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  refresh: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<JwtKind>({
  issue: "issue token",
  verify: "verify token",
  refresh: "refresh and logout",
});

export const TOKEN_PART_LABELS: Record<TokenPartId, string> = {
  header: "header",
  payload: "payload",
  signature: "signature",
};

/** Base colour per part: amber header, cyan payload, violet signature. */
export const TOKEN_PART_BASE: Record<TokenPartId, string> = {
  header: "border-amber-400/30 bg-amber-400/8 text-amber-100",
  payload: "border-cyan-400/30 bg-cyan-400/8 text-cyan-100",
  signature: "border-violet-400/30 bg-violet-400/8 text-violet-100",
};

export const TOKEN_PART_LABEL_COLOR: Record<TokenPartId, string> = {
  header: "text-amber-300",
  payload: "text-cyan-300",
  signature: "text-violet-300",
};

/** State overrides layered on top of the base colour. */
export const TOKEN_PART_STATE: Record<TokenPartState, string> = {
  idle: "opacity-50",
  active: "ring-1 ring-pink-300/60 shadow-[0_0_18px_rgba(244,114,182,0.18)]",
  encoded: "",
  match:
    "border-emerald-300/50 bg-emerald-400/10 text-emerald-100 shadow-[0_0_16px_rgba(52,211,153,0.16)]",
  miss: "border-rose-400/50 bg-rose-400/10 text-rose-100 shadow-[0_0_16px_rgba(251,113,133,0.16)]",
};

export const CLAIM_ROW_STYLES: Record<ClaimState, string> = {
  neutral: "text-slate-300",
  active: "bg-cyan-400/8 text-cyan-100",
  ok: "bg-emerald-400/8 text-emerald-100",
  fail: "bg-rose-400/8 text-rose-100",
};

export const CHECK_STYLES: Record<CheckStatus, string> = {
  pending: "border-slate-700/50 bg-slate-900/40 text-slate-500",
  active:
    "border-cyan-300/50 bg-cyan-400/12 text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.16)]",
  pass: "border-emerald-300/30 bg-emerald-400/8 text-emerald-100",
  fail: "border-rose-400/40 bg-rose-400/10 text-rose-200",
  skipped: "border-slate-700/40 bg-slate-900/40 text-slate-600 line-through",
};

export const CHECK_MARKS: Record<CheckStatus, string> = {
  pending: "..",
  active: ">>",
  pass: "ok",
  fail: "no",
  skipped: "--",
};

export const STORE_STYLES: Record<StoreEntryStatus, string> = {
  active: "border-emerald-300/30 bg-emerald-400/8 text-emerald-100",
  rotated: "border-slate-700/40 bg-slate-900/40 text-slate-500 line-through",
  revoked: "border-rose-400/40 bg-rose-400/10 text-rose-200 line-through",
};
