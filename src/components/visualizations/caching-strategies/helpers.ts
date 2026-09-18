import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { CacheEntryState, CachingKind, WriteStatus } from "./types";

export const kindBadgeClass = createKindBadgeClass<CachingKind>({
  aside: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  write: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  lru: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<CachingKind>({
  aside: "cache-aside",
  write: "write policies",
  lru: "lru eviction",
});

export const ENTRY_STYLES: Record<CacheEntryState, string> = {
  fresh: "border-cyan-300/40 bg-cyan-400/10 text-cyan-100",
  hit: "border-emerald-300/40 bg-emerald-400/10 text-emerald-100",
  stale: "border-rose-400/40 bg-rose-400/10 text-rose-100",
  expired: "border-slate-700/40 bg-slate-900/40 text-slate-500 line-through",
  pending: "border-amber-300/40 bg-amber-400/10 text-amber-100",
  evicted: "border-slate-700/40 bg-slate-900/40 text-slate-500 line-through",
};

export const ENTRY_LABELS: Record<CacheEntryState, string> = {
  fresh: "fresh",
  hit: "hit",
  stale: "stale",
  expired: "expired",
  pending: "not in db",
  evicted: "evicted",
};

export const QUEUE_STYLES: Record<WriteStatus, string> = {
  pending: "border-amber-300/40 bg-amber-400/10 text-amber-100",
  active: "border-cyan-300/50 bg-cyan-400/12 text-cyan-100",
  done: "border-emerald-300/40 bg-emerald-400/10 text-emerald-100",
};

export const QUEUE_LABELS: Record<WriteStatus, string> = {
  pending: "queued",
  active: "flushing",
  done: "durable",
};
