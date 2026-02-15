export const SITE_NAME = "VisualizeJS";
export const SITE_DESCRIPTION =
  "Free, interactive platform for visualizing JavaScript and React concepts through animated demonstrations.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://visualizejs.com";

export const DIFFICULTY_COLORS = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
} as const;
