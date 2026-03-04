import type { Metadata } from "next";
import type { Topic } from "@/types";
import {
  OPEN_GRAPH_IMAGE_URL,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_HEIGHT,
  SOCIAL_IMAGE_WIDTH,
  TWITTER_IMAGE_URL,
} from "@/lib/constants";

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
  "execution-context": [
    "javascript execution context explained",
    "execution context stack",
    "global execution context",
    "function execution context",
    "creation phase vs execution phase",
    "variable environment javascript",
    "lexical environment javascript",
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
  generators: [
    "javascript generators explained",
    "yield keyword javascript",
    "iterator protocol javascript",
    "function* generator",
    "generator next() method",
    "for of loop generator",
    "two-way data flow generator",
    "Symbol.iterator javascript",
  ],
  destructuring: [
    "javascript destructuring explained",
    "array destructuring javascript",
    "object destructuring javascript",
    "nested destructuring",
    "destructuring default values",
    "destructuring function parameters",
    "ES6 destructuring assignment",
  ],
  "spread-rest": [
    "javascript spread operator explained",
    "rest parameters javascript",
    "spread vs rest javascript",
    "object spread javascript",
    "array spread javascript",
    "rest in destructuring",
    "ES6 spread rest syntax",
  ],
};

const THEORY_INTENT_KEYWORDS = [
  "theory",
  "explained",
  "guide",
  "deep dive",
  "common mistakes",
  "faq",
];

const TOPIC_THEORY_DESCRIPTIONS: Record<string, string> = {
  "event-loop":
    "Deep dive into how the JavaScript event loop works: call stack, task queue, microtask queue, setTimeout vs Promises, and common async pitfalls explained with examples.",
  hoisting:
    "Complete guide to JavaScript hoisting: how var, let, const, and function declarations behave during the creation phase, temporal dead zone rules, and common interview questions.",
  "execution-context":
    "Learn how JavaScript execution contexts work: global vs function context, creation and execution phases, variable environment, scope chain setup, and the this binding.",
  closures:
    "Master JavaScript closures: how inner functions capture outer variables, lexical scoping rules, practical closure patterns, memory considerations, and interview preparation.",
  promises:
    "Comprehensive guide to JavaScript Promises: states and transitions, .then/.catch/.finally chaining, microtask scheduling, async/await under the hood, and error handling patterns.",
  "this-keyword":
    "Complete guide to the JavaScript 'this' keyword: default, implicit, explicit, and new binding rules, arrow function behavior, call/apply/bind usage, and common gotchas.",
  "scope-chain":
    "Understand JavaScript scope chain resolution: global, function, and block scope, lexical environment linking, identifier lookup algorithm, and closures through the scope chain.",
  "type-coercion":
    "Deep dive into JavaScript type coercion: == vs === rules, Abstract Equality Algorithm, truthy/falsy chart, ToString/ToNumber/ToBoolean conversions, and tricky edge cases.",
  "prototypal-inheritance":
    "Learn JavaScript prototypal inheritance: prototype chain lookups, Object.create, constructor functions, class syntax under the hood, and instanceof behavior explained.",
  "reference-value":
    "Understand reference vs value types in JavaScript: primitive copying, object reference sharing, shallow vs deep copy methods, structuredClone API, and mutation pitfalls.",
  "heap-stack":
    "Learn the JavaScript memory model: stack frames for primitives and call execution, heap allocation for objects, memory lifecycle, and how the engine manages memory.",
  "garbage-collection":
    "Deep dive into JavaScript garbage collection: mark-and-sweep algorithm, reference counting, memory leak patterns with closures/timers/DOM, WeakRef, and FinalizationRegistry.",
  generators:
    "Complete guide to JavaScript generators: function* syntax, yield/next() protocol, iterator interface, two-way data flow, delegating with yield*, and practical use cases.",
  destructuring:
    "Complete guide to JavaScript destructuring: array unpacking by position, object extraction by name, default values, nested patterns, renaming, and function parameter destructuring.",
  "spread-rest":
    "Deep dive into JavaScript spread and rest syntax: array and object spread for merging and copying, rest parameters for variadic functions, and rest in destructuring patterns.",
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
  const description = topic.description;

  return {
    title,
    description,
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
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      locale: "en_US",
      images: [
        {
          url: OPEN_GRAPH_IMAGE_URL,
          width: SOCIAL_IMAGE_WIDTH,
          height: SOCIAL_IMAGE_HEIGHT,
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [TWITTER_IMAGE_URL],
    },
  };
}

export function createTopicTheoryMetadata(topic: Topic): Metadata {
  const title = `${topic.title} Theory Guide`;
  const categoryLabel = topic.category === "javascript" ? "JavaScript" : "React";
  const canonicalUrl = `${SITE_URL}${topic.route}/theory`;
  const keywords = dedupeKeywords(
    getTopicKeywords(topic),
    THEORY_INTENT_KEYWORDS.map((intent) => `${topic.title} ${intent}`),
    [`${topic.id.replace(/-/g, " ")} theory`],
  );
  const description =
    TOPIC_THEORY_DESCRIPTIONS[topic.id] ??
    `In-depth theory for ${topic.title}: concepts, execution model, common mistakes, and interview questions.`;

  return {
    title,
    description,
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
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      locale: "en_US",
      images: [
        {
          url: OPEN_GRAPH_IMAGE_URL,
          width: SOCIAL_IMAGE_WIDTH,
          height: SOCIAL_IMAGE_HEIGHT,
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [TWITTER_IMAGE_URL],
    },
  };
}
