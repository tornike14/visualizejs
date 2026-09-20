import type { PlaybackSpeedLevel } from "./types";

export const SPEED_LABELS: Record<PlaybackSpeedLevel, string> = {
  1: "0.25x",
  2: "0.5x",
  3: "0.75x",
  4: "1x",
  5: "1.5x",
  6: "2x",
};

export const SPEED_TO_DELAY_MS: Record<PlaybackSpeedLevel, number> = {
  1: 5000,
  2: 2500,
  3: 1800,
  4: 1200,
  5: 700,
  6: 400,
};

export const SPEED_OPTIONS = (
  Object.keys(SPEED_LABELS).map(Number) as PlaybackSpeedLevel[]
).map((level) => ({ level, label: SPEED_LABELS[level] }));

export const iconBtnBase =
  "inline-flex cursor-pointer items-center justify-center rounded-lg border p-2 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/70 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0";

export const iconBtnDefault =
  "border-slate-600/85 bg-slate-900/65 text-slate-100 hover:border-slate-500";

export const iconBtnPrimary =
  "border-amber-300/45 bg-gradient-to-br from-amber-500/30 to-violet-400/18 text-slate-100 hover:border-amber-300/70 hover:shadow-[0_0_16px_rgba(251,191,36,0.2)]";
