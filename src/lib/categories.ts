import type { Category } from "@/types";

/**
 * Category registry. Every place that needs a label, route, colour, or hero
 * copy for a category reads it from here. Adding a category means adding one
 * entry below, an icon in public/icons, and a route folder under src/app.
 */

export interface CategoryHeroPalette {
  /** RGB triplet, e.g. "247 223 30", used by the category hero CSS variables. */
  accent: string;
  accentSoft: string;
  secondary: string;
}

export interface CategoryConfig {
  id: Category;
  /** Display label, e.g. "JavaScript". */
  label: string;
  /** Used in headings like "React concepts". */
  headingLabel: string;
  route: string;
  /** Short line under the category heading on the landing page. */
  tagline: string;
  /** Hero and meta description for the category index page. */
  description: string;
  /** Small uppercase label above the hero title. */
  kicker: string;
  iconSrc: string;
  iconAlt: string;
  /** Label for the external documentation link on the topic page. */
  docsLabel: string;
  /** Tailwind classes for the gradient-clipped word in titles. */
  titleAccentClass: string;
  /** Tailwind classes for the kicker pill. */
  kickerClass: string;
  /** Tailwind classes for the icon container. */
  iconShellClass: string;
  /** Tailwind classes for the active state of the sidebar category toggle. */
  toggleActiveClass: string;
  /** Tailwind classes for a small category badge. */
  badgeClass: string;
  /** Tailwind classes for the landing page call to action button. */
  ctaClass: string;
  /** RGB triplet used for hover glows on topic cards. */
  glowRgb: string;
  hero: CategoryHeroPalette;
  /** Search phrases merged into every topic's keywords in this category. */
  keywords: string[];
  /** Keywords for the category index page itself. */
  indexKeywords: string[];
  /** Meta title of the category index page. */
  indexTitle: string;
}

export const CATEGORY_ORDER: Category[] = [
  "javascript",
  "react",
  "frameworks",
  "backend",
  "ai",
];

export const CATEGORIES: Record<Category, CategoryConfig> = {
  javascript: {
    id: "javascript",
    label: "JavaScript",
    headingLabel: "JavaScript concepts",
    route: "/javascript",
    tagline:
      "Runtime internals you get asked about in interviews and hit in real bugs.",
    description:
      "Core JavaScript internals and runtime behavior, visualized step by step.",
    kicker: "Engine Room View",
    iconSrc: "/icons/javascript.svg",
    iconAlt: "JavaScript logo",
    docsLabel: "MDN",
    titleAccentClass:
      "bg-gradient-to-r from-amber-200 via-yellow-300 to-yellow-500 bg-clip-text text-transparent",
    kickerClass:
      "border border-yellow-200/25 bg-yellow-200/10 text-yellow-100/90",
    iconShellClass:
      "bg-[#f7df1e] p-1.5 shadow-[0_0_28px_rgba(247,223,30,0.46)]",
    toggleActiveClass:
      "border border-yellow-300/30 bg-yellow-400/15 shadow-[0_0_16px_rgba(251,191,36,0.16)]",
    badgeClass: "border-yellow-300/30 bg-yellow-400/10 text-yellow-200",
    ctaClass:
      "border-yellow-200/30 bg-yellow-200/10 text-yellow-100 hover:border-yellow-200/55 hover:bg-yellow-200/16",
    glowRgb: "251 191 36",
    hero: {
      accent: "247 223 30",
      accentSoft: "253 230 138",
      secondary: "56 189 248",
    },
    keywords: [
      "javascript fundamentals",
      "learn javascript visually",
      "javascript internals",
    ],
    indexKeywords: [
      "javascript visualizer",
      "javascript visualization",
      "javascript concepts",
      "javascript fundamentals",
      "event loop",
      "hoisting",
      "closures",
      "promises",
      "prototype chain",
      "this keyword",
      "scope chain",
      "async await",
      "garbage collection javascript",
      "type coercion",
      "execution context",
    ],
    indexTitle: "JavaScript Concepts, Visualized",
  },
  react: {
    id: "react",
    label: "React",
    headingLabel: "React concepts",
    route: "/react",
    tagline:
      "How React decides what to render, when to re-render, and what it commits to the DOM.",
    description:
      "React rendering, reconciliation, hooks, and scheduling with interactive diagrams.",
    kicker: "Rendering Playground",
    iconSrc: "/icons/react.svg",
    iconAlt: "React logo",
    docsLabel: "react.dev",
    titleAccentClass:
      "bg-gradient-to-r from-cyan-200 via-sky-200 to-cyan-400 bg-clip-text text-transparent",
    kickerClass: "border border-cyan-200/25 bg-cyan-200/10 text-cyan-100/90",
    iconShellClass:
      "border border-cyan-300/30 bg-[rgba(34,211,238,0.1)] p-1.5 shadow-[0_0_22px_rgba(34,211,238,0.24)]",
    toggleActiveClass:
      "border border-cyan-300/30 bg-cyan-400/15 shadow-[0_0_16px_rgba(34,211,238,0.16)]",
    badgeClass: "border-cyan-300/30 bg-cyan-400/10 text-cyan-200",
    ctaClass:
      "border-cyan-300/30 bg-cyan-400/10 text-cyan-200 hover:border-cyan-300/55 hover:bg-cyan-300/16",
    glowRgb: "34 211 238",
    hero: {
      accent: "34 211 238",
      accentSoft: "103 232 249",
      secondary: "192 132 252",
    },
    keywords: [
      "react fundamentals",
      "react concepts",
      "react internals",
      "react rendering",
      "learn react visually",
    ],
    indexKeywords: [
      "react visualizer",
      "react visualization",
      "react concepts",
      "react fundamentals",
      "react reconciliation",
      "virtual DOM",
      "react re-rendering",
      "react internals",
      "react fiber",
      "react hooks",
      "react diffing algorithm",
      "react state batching",
      "concurrent rendering",
    ],
    indexTitle: "React Concepts, Visualized",
  },
  frameworks: {
    id: "frameworks",
    label: "Frameworks",
    headingLabel: "Framework internals",
    route: "/frameworks",
    tagline:
      "How Vue, Svelte, and Angular track changes and update the DOM, compared side by side.",
    description:
      "Reactivity and change detection in Vue, Svelte, and Angular, visualized so the differences are obvious.",
    kicker: "Reactivity Lab",
    iconSrc: "/icons/frameworks.svg",
    iconAlt: "Frameworks icon",
    docsLabel: "official docs",
    titleAccentClass:
      "bg-gradient-to-r from-emerald-200 via-green-300 to-emerald-400 bg-clip-text text-transparent",
    kickerClass:
      "border border-emerald-200/25 bg-emerald-200/10 text-emerald-100/90",
    iconShellClass:
      "border border-emerald-300/30 bg-[rgba(52,211,153,0.1)] p-1.5 shadow-[0_0_22px_rgba(52,211,153,0.24)]",
    toggleActiveClass:
      "border border-emerald-300/30 bg-emerald-400/15 shadow-[0_0_16px_rgba(52,211,153,0.16)]",
    badgeClass: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
    ctaClass:
      "border-emerald-300/30 bg-emerald-400/10 text-emerald-200 hover:border-emerald-300/55 hover:bg-emerald-300/16",
    glowRgb: "52 211 153",
    hero: {
      accent: "52 211 153",
      accentSoft: "110 231 183",
      secondary: "56 189 248",
    },
    keywords: [
      "frontend framework internals",
      "reactivity explained",
      "learn frameworks visually",
    ],
    indexKeywords: [
      "vue reactivity explained",
      "svelte runes explained",
      "angular change detection",
      "signals explained",
      "frontend framework internals",
      "vue vs svelte vs angular",
      "fine grained reactivity",
    ],
    indexTitle: "Framework Internals, Visualized",
  },
  backend: {
    id: "backend",
    label: "Backend",
    headingLabel: "Backend principles",
    route: "/backend",
    tagline:
      "What happens between a request leaving the browser and a response coming back.",
    description:
      "HTTP, databases, caching, auth, and rate limiting, traced one step at a time.",
    kicker: "Server Side View",
    iconSrc: "/icons/backend.svg",
    iconAlt: "Backend icon",
    docsLabel: "reference",
    titleAccentClass:
      "bg-gradient-to-r from-violet-200 via-purple-300 to-violet-400 bg-clip-text text-transparent",
    kickerClass:
      "border border-violet-200/25 bg-violet-200/10 text-violet-100/90",
    iconShellClass:
      "border border-violet-300/30 bg-[rgba(167,139,250,0.12)] p-1.5 shadow-[0_0_22px_rgba(167,139,250,0.26)]",
    toggleActiveClass:
      "border border-violet-300/30 bg-violet-400/15 shadow-[0_0_16px_rgba(167,139,250,0.18)]",
    badgeClass: "border-violet-300/30 bg-violet-400/10 text-violet-200",
    ctaClass:
      "border-violet-300/30 bg-violet-400/10 text-violet-200 hover:border-violet-300/55 hover:bg-violet-300/16",
    glowRgb: "167 139 250",
    hero: {
      accent: "167 139 250",
      accentSoft: "196 181 253",
      secondary: "34 211 238",
    },
    keywords: [
      "backend fundamentals",
      "system design basics",
      "learn backend visually",
    ],
    indexKeywords: [
      "backend visualizer",
      "http request lifecycle",
      "database indexing explained",
      "caching strategies",
      "jwt authentication flow",
      "rate limiting explained",
      "backend interview questions",
      "system design fundamentals",
    ],
    indexTitle: "Backend Principles, Visualized",
  },
  ai: {
    id: "ai",
    label: "AI",
    headingLabel: "AI under the hood",
    route: "/ai",
    tagline:
      "What a language model actually does with your text, from tokens to the next word.",
    description:
      "Tokenization, embeddings, attention, sampling, and training, shown as the numbers move.",
    kicker: "Model Internals",
    iconSrc: "/icons/ai.svg",
    iconAlt: "AI icon",
    docsLabel: "paper",
    titleAccentClass:
      "bg-gradient-to-r from-pink-200 via-rose-300 to-pink-400 bg-clip-text text-transparent",
    kickerClass: "border border-pink-200/25 bg-pink-200/10 text-pink-100/90",
    iconShellClass:
      "border border-pink-300/30 bg-[rgba(244,114,182,0.12)] p-1.5 shadow-[0_0_22px_rgba(244,114,182,0.26)]",
    toggleActiveClass:
      "border border-pink-300/30 bg-pink-400/15 shadow-[0_0_16px_rgba(244,114,182,0.18)]",
    badgeClass: "border-pink-300/30 bg-pink-400/10 text-pink-200",
    ctaClass:
      "border-pink-300/30 bg-pink-400/10 text-pink-200 hover:border-pink-300/55 hover:bg-pink-300/16",
    glowRgb: "244 114 182",
    hero: {
      accent: "244 114 182",
      accentSoft: "249 168 212",
      secondary: "167 139 250",
    },
    keywords: [
      "how llms work",
      "ai internals explained",
      "learn machine learning visually",
    ],
    indexKeywords: [
      "how do llms work",
      "transformer explained",
      "attention mechanism visualized",
      "tokenization explained",
      "embeddings explained",
      "backpropagation visualized",
      "how chatgpt works under the hood",
      "ai visualizer",
    ],
    indexTitle: "AI Under the Hood, Visualized",
  },
};

export const CATEGORY_LIST: CategoryConfig[] = CATEGORY_ORDER.map(
  (id) => CATEGORIES[id],
);

export function getCategory(id: Category): CategoryConfig {
  return CATEGORIES[id];
}

export function isCategory(value: string): value is Category {
  return Object.hasOwn(CATEGORIES, value);
}

export function categoryFromPathname(pathname: string): Category {
  const segment = pathname.split("/")[1] ?? "";
  return isCategory(segment) ? segment : "javascript";
}
