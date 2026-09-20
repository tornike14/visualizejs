import type { Metadata } from "next";
import {
  CATEGORIES,
  CATEGORY_LIST,
  type CategoryConfig,
} from "@/lib/categories";
import type { TopicId } from "@/lib/topics";
import type { Topic } from "@/types";
import {
  CREATOR_LINKEDIN_URL,
  CREATOR_NAME,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";

const CATEGORY_KEYWORDS: Record<Topic["category"], string[]> =
  Object.fromEntries(
    CATEGORY_LIST.map((category) => [category.id, category.keywords]),
  ) as Record<Topic["category"], string[]>;

const TOPIC_KEYWORDS: Record<TopicId, string[]> = {
  tokenization: [
    "tokenization explained",
    "byte pair encoding",
    "bpe tokenizer",
    "how llm tokenization works",
    "subword tokenization",
    "token ids explained",
    "why do llms count tokens",
  ],
  embeddings: [
    "embeddings explained",
    "word embeddings visualized",
    "cosine similarity explained",
    "vector representation of text",
    "embedding lookup table",
    "semantic search embeddings",
    "what is an embedding",
  ],
  attention: [
    "self attention explained",
    "attention mechanism visualized",
    "query key value explained",
    "transformer attention",
    "causal mask explained",
    "softmax attention weights",
    "multi head attention",
  ],
  "next-token-prediction": [
    "next token prediction explained",
    "llm sampling explained",
    "temperature top k top p",
    "how llms generate text",
    "logits to probabilities softmax",
    "autoregressive generation",
    "greedy decoding vs sampling",
  ],
  backpropagation: [
    "backpropagation explained",
    "gradient descent visualized",
    "chain rule neural network",
    "how neural networks learn",
    "loss function explained",
    "forward pass backward pass",
    "training loop explained",
  ],
  "http-request-lifecycle": [
    "http request lifecycle",
    "what happens when you type a url",
    "dns tcp tls handshake explained",
    "http request response cycle",
    "how a web server handles a request",
    "http headers status codes explained",
    "backend request flow",
  ],
  "database-indexing": [
    "database indexing explained",
    "b tree index visualized",
    "full table scan vs index",
    "how sql indexes work",
    "composite index explained",
    "index selectivity",
    "database performance basics",
  ],
  "caching-strategies": [
    "caching strategies explained",
    "cache aside vs write through",
    "lru cache visualized",
    "cache invalidation explained",
    "ttl cache expiry",
    "redis caching pattern",
    "cache hit miss ratio",
  ],
  "jwt-authentication": [
    "jwt authentication explained",
    "json web token visualized",
    "jwt header payload signature",
    "how jwt verification works",
    "access token refresh token flow",
    "jwt vs session auth",
    "stateless authentication",
  ],
  "rate-limiting": [
    "rate limiting explained",
    "token bucket algorithm visualized",
    "sliding window rate limiter",
    "fixed window vs sliding window",
    "429 too many requests",
    "api rate limiting strategies",
    "leaky bucket vs token bucket",
  ],
  "vue-reactivity": [
    "vue reactivity explained",
    "vue proxy reactivity",
    "vue ref vs reactive",
    "vue computed caching",
    "dependency tracking vue",
    "vue 3 reactivity system",
    "track and trigger vue",
  ],
  "svelte-runes": [
    "svelte runes explained",
    "svelte 5 signals",
    "$state $derived $effect",
    "svelte compiler explained",
    "fine grained reactivity svelte",
    "svelte vs react rendering",
    "no virtual dom svelte",
  ],
  "angular-change-detection": [
    "angular change detection explained",
    "zone.js explained",
    "onpush change detection",
    "angular signals explained",
    "angular zoneless",
    "angular dirty checking",
    "angular rendering internals",
  ],
  "async-await": [
    "async await explained",
    "how async await works under the hood",
    "await microtask queue",
    "async function execution order",
    "promise.all vs sequential await",
    "async await vs promises",
    "javascript async await visualizer",
  ],
  "debounce-throttle": [
    "debounce vs throttle",
    "debounce explained",
    "throttle explained",
    "debounce implementation javascript",
    "throttle implementation javascript",
    "search input debounce",
    "scroll handler throttle",
  ],
  "state-batching": [
    "react state batching explained",
    "automatic batching react 18",
    "setstate updater function",
    "why setstate is asynchronous",
    "react update queue",
    "multiple setstate one render",
    "react 18 batching timeouts",
  ],
  "concurrent-rendering": [
    "react concurrent rendering explained",
    "usetransition explained",
    "react lanes priority",
    "interruptible rendering react",
    "startTransition vs setState",
    "react scheduler explained",
    "time slicing react",
  ],
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
  "event-delegation": [
    "javascript event delegation explained",
    "event bubbling javascript",
    "event capturing javascript",
    "stopPropagation javascript",
    "event.target vs event.currentTarget",
    "DOM event propagation",
    "event delegation pattern javascript",
  ],
  "modules-imports": [
    "javascript modules explained",
    "ES modules import export",
    "javascript live bindings",
    "circular dependency javascript",
    "named vs default export",
    "import resolution javascript",
    "tree shaking javascript",
  ],
  "error-boundaries": [
    "react error boundary explained",
    "getDerivedStateFromError react",
    "componentDidCatch react",
    "react error handling",
    "react fallback ui",
    "nested error boundaries react",
    "error boundary recovery pattern",
  ],
  "use-effect-lifecycle": [
    "useEffect explained react",
    "useEffect dependency array",
    "useEffect cleanup function",
    "useEffect vs useLayoutEffect",
    "react effect lifecycle",
    "useEffect mount unmount",
    "useEffect common patterns",
  ],
};

const TOPIC_THEORY_DESCRIPTIONS: Record<TopicId, string> = {
  tokenization:
    "Learn how tokenizers split text into subword tokens with byte pair encoding, why token counts matter, and how ids feed the model.",
  embeddings:
    "Learn how token ids become vectors, why similar meanings land near each other, and how cosine similarity compares embeddings.",
  attention:
    "Learn how self-attention scores queries against keys, applies softmax and a causal mask, and mixes values so each token sees its context.",
  "next-token-prediction":
    "Learn how logits become a probability distribution, how temperature and top-p change sampling, and why generation runs one token at a time.",
  backpropagation:
    "Learn how a forward pass produces a loss, how the chain rule sends gradients backward, and how gradient descent nudges weights.",
  "http-request-lifecycle":
    "Learn the full path of an HTTP request: DNS, TCP and TLS handshakes, routing, middleware, the database call, and the response.",
  "database-indexing":
    "Learn how a B-tree index turns a full scan into a few page reads, how composite indexes match query order, and what indexes cost on writes.",
  "caching-strategies":
    "Learn cache-aside and write-through flows, how TTL and LRU eviction decide what stays, and why invalidation is the hard part.",
  "jwt-authentication":
    "Learn how a JWT is built from header, payload, and signature, how servers verify it without a session store, and how tampering and expiry are caught.",
  "rate-limiting":
    "Learn how token bucket, fixed window, and sliding window limiters decide which requests pass, and where each one lets bursts through.",
  "vue-reactivity":
    "Learn how Vue wraps state in a Proxy, records which effect read which property, and re-runs only those effects when a property changes.",
  "svelte-runes":
    "Learn how $state, $derived, and $effect form a signal graph and how the Svelte compiler emits direct DOM updates instead of diffing.",
  "angular-change-detection":
    "Learn how zone.js triggers change detection, how OnPush prunes the check, and how signals let Angular update only the components that read a value.",
  "async-await":
    "Learn how await suspends an async function, why the rest of the function runs as a microtask, and how sequential awaits differ from Promise.all.",
  "debounce-throttle":
    "Learn how debounce delays a call until events stop, how throttle caps the call rate, and how both are built from closures and timers.",
  "state-batching":
    "Learn how React queues state updates, why updater functions see the latest pending value, and how automatic batching produces one render.",
  "concurrent-rendering":
    "Learn how React assigns priority lanes, renders transitions in interruptible slices, and throws away stale work when an urgent update arrives.",
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
  "event-delegation":
    "DOM events propagate through the tree in three phases: capture (down), target, and bubble (up). Event delegation attaches one handler to a parent instead of many to children. Learn propagation, stopPropagation, and delegation patterns.",
  "modules-imports":
    "ES modules use static import/export syntax with live bindings that reference the exporter's variables. Learn named vs default exports, live bindings vs copies, circular dependency handling, and the module loading phases.",
  "error-boundaries":
    "React error boundaries are class components that catch render errors in their subtree and display fallback UI. Learn getDerivedStateFromError, componentDidCatch, nested boundaries, and recovery patterns.",
  "use-effect-lifecycle":
    "useEffect runs side effects after React commits DOM updates and the browser paints. Learn dependency array behavior, cleanup timing, mount/unmount patterns, and common useEffect recipes.",
};

/** schema.org TechArticle only defines Beginner and Expert. */
const PROFICIENCY_LEVELS: Record<Topic["difficulty"], "Beginner" | "Expert"> = {
  beginner: "Beginner",
  intermediate: "Beginner",
  advanced: "Expert",
};

function dedupeKeywords(...keywordGroups: string[][]): string[] {
  return [
    ...new Set(
      keywordGroups
        .flat()
        .map((k) => k.trim())
        .filter(Boolean),
    ),
  ];
}

/**
 * Curated keywords only. Search engines ignore the meta keywords tag, so
 * generated "X explained", "X faq" combinations added nothing but bytes.
 * The list still feeds the TechArticle keywords in structured data.
 */
export function getTopicKeywords(topic: Topic): string[] {
  return dedupeKeywords(
    [topic.title, topic.id.replace(/-/g, " ")],
    TOPIC_KEYWORDS[topic.id as TopicId],
    CATEGORY_KEYWORDS[topic.category],
  );
}

export function getTopicDescription(topic: Topic): string {
  return TOPIC_THEORY_DESCRIPTIONS[topic.id as TopicId];
}

export function createTopicMetadata(topic: Topic): Metadata {
  const categoryLabel = CATEGORIES[topic.category].label;
  const title = `${topic.title} in ${categoryLabel}, Visualized`;
  const canonicalUrl = `${SITE_URL}${topic.route}`;
  const keywords = getTopicKeywords(topic);
  const description = getTopicDescription(topic);

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
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export function createTopicStructuredData(topic: Topic, summary?: string) {
  const categoryLabel = CATEGORIES[topic.category].label;
  const categoryRoute = CATEGORIES[topic.category].route;
  const canonicalUrl = `${SITE_URL}${topic.route}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${topic.title} in ${categoryLabel}, Visualized`,
    description: summary ?? getTopicDescription(topic),
    url: canonicalUrl,
    inLanguage: "en-US",
    keywords: getTopicKeywords(topic).join(", "),
    proficiencyLevel: PROFICIENCY_LEVELS[topic.difficulty],
    about: {
      "@type": "Thing",
      name: topic.title,
      description: topic.description,
    },
    author: {
      "@type": "Person",
      name: CREATOR_NAME,
      url: CREATOR_LINKEDIN_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: canonicalUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `${categoryLabel} Concepts`,
        item: `${SITE_URL}${categoryRoute}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: topic.title,
        item: canonicalUrl,
      },
    ],
  };

  return [articleSchema, breadcrumbSchema];
}

export function createCategoryMetadata(
  category: CategoryConfig,
  topicCount: number,
): Metadata {
  const title = category.indexTitle;
  const description = `Explore ${topicCount} interactive ${category.label} visualizations. ${category.description}`;
  const canonicalUrl = `${SITE_URL}${category.route}`;

  return {
    title,
    description,
    keywords: dedupeKeywords(category.indexKeywords, category.keywords),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}
