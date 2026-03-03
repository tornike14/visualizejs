export const SITE_NAME = "VisualizeJS";
export const SITE_DESCRIPTION =
  "Free, interactive platform for visualizing JavaScript and React concepts through animated demonstrations.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://visualizejs.com";
export const SOCIAL_IMAGE_ALT =
  "VisualizeJS - Interactive JavaScript and React visualizations";
export const SOCIAL_IMAGE_WIDTH = 1200;
export const SOCIAL_IMAGE_HEIGHT = 630;
export const OPEN_GRAPH_IMAGE_URL = `${SITE_URL}/opengraph-image`;
export const TWITTER_IMAGE_URL = `${SITE_URL}/twitter-image`;
export const CREATOR_LINKEDIN_URL =
  process.env.NEXT_PUBLIC_CREATOR_LINKEDIN_URL ||
  "https://www.linkedin.com/in/tornike-nizharadze/";
export const CREATOR_AVATAR_SRC =
  process.env.NEXT_PUBLIC_CREATOR_AVATAR_SRC || "/personal-image.png";

export const DIFFICULTY_COLORS = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
} as const;
