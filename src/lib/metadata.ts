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
  react: [
    "react fundamentals",
    "react concepts",
    "react internals",
    "react rendering",
    "learn react visually",
  ],
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
  "virtual-dom": [
    "react virtual dom explained",
    "jsx compiles to what",
    "react createElement explained",
    "virtual dom vs real dom",
    "how jsx works react",
    "react element tree",
  ],
  "context-propagation": [
    "react context explained",
    "useContext internals react",
    "react provider consumer pattern",
    "context re-render problem react",
    "react context propagation",
    "createContext useContext react",
  ],
  reconciliation: [
    "react reconciliation explained",
    "virtual DOM diffing algorithm",
    "react re-render explained",
    "react key prop explained",
    "react fiber reconciliation",
    "react dom updates",
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
  "fiber-tree": [
    "react fiber tree explained",
    "react fiber architecture",
    "beginWork completeWork react",
    "react work loop explained",
    "react unit of work",
    "react fiber node properties",
    "react fiber traversal",
  ],
  hooks: [
    "react hooks explained",
    "react hooks linked list",
    "rules of hooks react",
    "useState internals react",
    "why hooks order matters react",
    "react hook call order",
    "conditional hooks react error",
  ],
  "render-cycle": [
    "react render cycle explained",
    "react render vs commit phase",
    "react two-phase rendering",
    "react work-in-progress tree",
    "react batched state updates",
    "react useEffect execution order",
    "react useLayoutEffect vs useEffect",
  ],
  memoization: [
    "react memo explained",
    "useMemo vs useCallback",
    "react memo shallow comparison",
    "react skip re-render",
    "react performance optimization",
    "react memoization when to use",
    "useCallback explained react",
  ],
  suspense: [
    "react suspense explained",
    "react suspense fallback",
    "react suspense data fetching",
    "react suspense boundary",
    "react lazy loading suspense",
    "react suspense nested boundaries",
    "react concurrent rendering suspense",
  ],
  "server-components": [
    "react server components explained",
    "RSC vs SSR difference",
    "use client directive react",
    "react server components payload",
    "react server client boundary",
    "react server components composition",
    "react zero bundle server components",
  ],
};

const THEORY_INTENT_KEYWORDS = [
  "theory",
  "explained",
  "guide",
  "deep dive",
  "common mistakes",
  "faq",
  "how it works",
  "interview questions",
  "examples",
  "tutorial",
];

const TOPIC_THEORY_DESCRIPTIONS: Record<string, string> = {
  "event-loop":
    "The JavaScript event loop manages async code using a call stack, microtask queue, and macrotask queue. Learn how setTimeout, Promises, and async/await work with interactive examples.",
  hoisting:
    "JavaScript hoisting moves var, let, const, and function declarations to the top of their scope before execution. Learn the rules, temporal dead zone, and common interview pitfalls.",
  "execution-context":
    "A JavaScript execution context is the environment where code runs. Learn how global and function contexts are created, how the scope chain forms, and how this gets bound.",
  closures:
    "A JavaScript closure is a function that remembers variables from its outer scope. Learn how lexical scoping works, common closure patterns, and how to answer closure interview questions.",
  promises:
    "A JavaScript Promise represents a future value from an async operation. Learn .then/.catch chaining, microtask scheduling, async/await, and error handling with interactive examples.",
  "this-keyword":
    "The JavaScript this keyword refers to the object a function runs on. Learn the four binding rules, arrow function behavior, call/apply/bind, and common interview gotchas.",
  "scope-chain":
    "The JavaScript scope chain is how the engine looks up variables across nested scopes. Learn global, function, and block scope, lexical environments, and how closures use the chain.",
  "type-coercion":
    "JavaScript type coercion automatically converts values between types during operations. Learn == vs === rules, truthy/falsy values, ToNumber/ToString conversions, and tricky edge cases.",
  "prototypal-inheritance":
    "JavaScript uses prototypal inheritance where objects inherit directly from other objects. Learn the prototype chain, Object.create, constructor functions, and class syntax under the hood.",
  "reference-value":
    "JavaScript primitives are copied by value while objects are shared by reference. Learn shallow vs deep copy, structuredClone, the spread operator, and how to avoid mutation bugs.",
  "heap-stack":
    "JavaScript stores primitives on the stack and objects on the heap. Learn how stack frames work, how the engine allocates memory, and the lifecycle of values during execution.",
  "garbage-collection":
    "JavaScript garbage collection automatically frees unused memory using mark-and-sweep. Learn how memory leaks happen with closures, timers, and DOM references, plus WeakRef and FinalizationRegistry.",
  generators:
    "JavaScript generators are functions that can pause and resume with yield. Learn function* syntax, the iterator protocol, two-way data flow with next(), and practical use cases.",
  "virtual-dom":
    "React's virtual DOM is a lightweight JavaScript copy of the real DOM. Learn what JSX compiles to, how React.createElement builds element trees, and how diffing decides what to update.",
  "context-propagation":
    "React Context lets you pass data through the component tree without prop drilling. Learn how createContext, Provider, and useContext work, and why consumers re-render on value changes.",
  reconciliation:
    "React reconciliation is the diffing algorithm that compares virtual DOM trees to find minimal updates. Learn same-type vs cross-type diffs, key-based list matching, and DOM commit rules.",
  destructuring:
    "JavaScript destructuring extracts values from arrays and objects into variables. Learn array unpacking, object extraction, default values, nested patterns, and function parameter destructuring.",
  "spread-rest":
    "JavaScript spread (...) expands iterables and rest (...) collects remaining items. Learn array/object spread for copying, rest parameters for variadic functions, and destructuring rest patterns.",
  "fiber-tree":
    "React's fiber tree is the internal data structure that tracks component state and work. Learn how fibers represent components, the beginWork/completeWork loop, and unit-of-work processing.",
  hooks:
    "React hooks are stored as a linked list on each fiber node. Learn why hook call order matters, how useState and useEffect work internally, and why conditional hooks cause errors.",
  "render-cycle":
    "React renders in two phases: render (pure, interruptible diffing) and commit (synchronous DOM mutations). Learn useLayoutEffect vs useEffect timing and how state updates get batched.",
  memoization:
    "React memoization skips unnecessary re-renders and recalculations. Learn React.memo for component props, useMemo for expensive values, useCallback for stable references, and when to optimize.",
  suspense:
    "React Suspense lets components wait for async data with a declarative fallback UI. Learn how thrown Promises trigger boundaries, nested Suspense, parallel fetching, and content revealing.",
  "server-components":
    "React Server Components run on the server and send rendered output to the client with zero bundle cost. Learn the server/client split, RSC payload format, and the composition pattern.",
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
  const categoryLabel = topic.category === "javascript" ? "JavaScript" : "React";
  const title = `What is ${topic.title} in ${categoryLabel}? Explained with Examples`;
  const canonicalUrl = `${SITE_URL}${topic.route}/theory`;
  const keywords = dedupeKeywords(
    getTopicKeywords(topic),
    THEORY_INTENT_KEYWORDS.map((intent) => `${topic.title} ${intent}`),
    [
      `${topic.id.replace(/-/g, " ")} theory`,
      `what is ${topic.title.toLowerCase()} in ${categoryLabel.toLowerCase()}`,
      `${topic.title.toLowerCase()} ${categoryLabel.toLowerCase()} explained`,
      `${topic.title.toLowerCase()} interview questions`,
    ],
  );
  const description =
    TOPIC_THEORY_DESCRIPTIONS[topic.id] ??
    `Learn what ${topic.title} is in ${categoryLabel}, how it works under the hood, common mistakes to avoid, and interview questions with interactive examples.`;

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
