import type { Metadata } from "next";
import type { Topic } from "@/types";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const GLOBAL_KEYWORDS = [
  "VisualizeJS",
  "javascript visualizer",
  "javascript concepts",
  "interactive javascript tutorial",
  "javascript interview preparation",
  "frontend fundamentals",
];

const CATEGORY_KEYWORDS: Record<Topic["category"], string[]> = {
  javascript: [
    "javascript fundamentals",
    "learn javascript visually",
    "js runtime",
    "js internals",
  ],
  react: ["react fundamentals", "react concepts"],
};

const TOPIC_KEYWORDS: Record<string, string[]> = {
  "event-loop": [
    "javascript event loop explained",
    "microtask queue vs macrotask queue",
    "settimeout vs promise then",
    "call stack task queue",
  ],
  hoisting: [
    "javascript hoisting explained",
    "var vs let vs const",
    "temporal dead zone",
    "function hoisting",
  ],
  closures: [
    "javascript closures explained",
    "lexical scope in javascript",
    "closure interview questions",
    "persistent state with closures",
  ],
  promises: [
    "javascript promises explained",
    "promise chaining",
    "async await explained",
    "promise microtask queue",
  ],
  "prototypal-inheritance": [
    "javascript prototype chain",
    "object create javascript",
    "prototype inheritance explained",
    "instanceof and prototype",
  ],
  "this-keyword": [
    "javascript this keyword explained",
    "this binding rules",
    "arrow function this",
    "call apply bind examples",
  ],
  "scope-chain": [
    "javascript scope chain",
    "execution context javascript",
    "global function block scope",
    "identifier lookup javascript",
  ],
  "type-coercion": [
    "javascript type coercion explained",
    "== vs === javascript",
    "truthy falsy values javascript",
    "NaN javascript",
    "null vs undefined javascript",
    "loose equality vs strict equality",
  ],
  "reference-value": [
    "javascript pass by reference vs value",
    "javascript object reference explained",
    "shallow copy vs deep copy javascript",
    "structuredClone javascript",
    "spread operator shallow copy",
    "javascript mutation explained",
  ],
  "heap-stack": [
    "javascript heap vs stack",
    "javascript memory model explained",
    "stack frame javascript",
    "javascript garbage collection",
    "javascript memory allocation",
    "call stack memory javascript",
  ],
  "garbage-collection": [
    "javascript garbage collection explained",
    "mark and sweep javascript",
    "javascript memory leak",
    "WeakRef javascript",
    "setInterval memory leak",
    "closure memory leak javascript",
  ],
};

function dedupeKeywords(...keywordGroups: string[][]): string[] {
  return [...new Set(keywordGroups.flat().map((k) => k.trim()).filter(Boolean))];
}

export function getTopicKeywords(topic: Topic): string[] {
  return dedupeKeywords(
    GLOBAL_KEYWORDS,
    CATEGORY_KEYWORDS[topic.category],
    [topic.title, topic.id.replace(/-/g, " "), `${topic.title} explained`],
    TOPIC_KEYWORDS[topic.id] ?? [],
  );
}

export function createTopicMetadata(topic: Topic): Metadata {
  const title = `${topic.title} Visualization`;
  const categoryLabel = topic.category === "javascript" ? "JavaScript" : "React";
  const canonicalUrl = `${SITE_URL}${topic.route}`;
  const keywords = getTopicKeywords(topic);

  return {
    title,
    description: topic.description,
    category: categoryLabel,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: topic.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: topic.description,
    },
  };
}
