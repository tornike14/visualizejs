import type { PlaybackSpeedLevel } from "./types";

export const SPEED_OPTIONS: { level: PlaybackSpeedLevel; label: string }[] = [
  { level: 1, label: "0.25x" },
  { level: 2, label: "0.5x" },
  { level: 3, label: "0.75x" },
  { level: 4, label: "1x" },
  { level: 5, label: "1.5x" },
  { level: 6, label: "2x" },
];

export const iconBtnBase =
  "inline-flex cursor-pointer items-center justify-center rounded-lg border p-2 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/70 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0";

export const iconBtnDefault =
  "border-slate-600/85 bg-slate-900/65 text-slate-100 hover:border-slate-500";

export const iconBtnPrimary =
  "border-amber-300/45 bg-gradient-to-br from-amber-500/30 to-violet-400/18 text-slate-100 hover:border-amber-300/70 hover:shadow-[0_0_16px_rgba(251,191,36,0.2)]";
