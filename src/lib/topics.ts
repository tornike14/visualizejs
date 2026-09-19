import type { Category, Topic, TopicDefinition } from "@/types";

/**
 * Every topic on the site, in the order it appears within its category.
 * `route` is derived from category and id so the two can never disagree.
 * TopicId is derived from this list, which lets the theory, keyword, and
 * component registries require an entry for every topic at compile time.
 */
const TOPIC_DEFINITIONS = [
  /* ── Ordered by importance / popularity ── */
  {
    id: "event-loop",
    toolbar: "simple",
    title: "Event Loop",
    category: "javascript",
    description:
      "See how the JavaScript event loop works with an interactive visualization. Watch the call stack, microtask queue, and callback queue process setTimeout, Promises, and async/await step by step.",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
  },
  {
    id: "hoisting",
    title: "Hoisting",
    category: "javascript",
    description:
      "See how JavaScript hoisting works for var, let, const, and function declarations. Interactive visualization of the creation phase vs execution phase and the temporal dead zone.",
    difficulty: "beginner",
    docsUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting",
  },
  {
    id: "execution-context",
    toolbar: "simple",
    title: "Execution Context",
    category: "javascript",
    description:
      "See how JavaScript execution contexts work with an interactive visualization. Step through the global and function context stack, creation phase, scope chain, and variable environments.",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this#function_context",
  },
  {
    id: "closures",
    toolbar: "simple",
    title: "Closures",
    category: "javascript",
    description:
      "See how JavaScript closures work with an interactive visualization. Watch inner functions capture outer scope variables, understand lexical scoping, and learn closure patterns for interviews.",
    difficulty: "intermediate",
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
  },
  {
    id: "promises",
    title: "Promises",
    category: "javascript",
    description:
      "See how JavaScript Promises work with an interactive visualization. Step through pending, fulfilled, and rejected states, promise chaining, microtask scheduling, and async/await flow.",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
  },
  {
    id: "this-keyword",
    title: "this Keyword",
    category: "javascript",
    description:
      "See how the JavaScript this keyword works with an interactive visualization. Step through implicit, explicit, new, and arrow function binding rules with call, apply, and bind examples.",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this",
  },
  {
    id: "scope-chain",
    title: "Scope Chain",
    category: "javascript",
    description:
      "See how the JavaScript scope chain works with an interactive visualization. Trace variable lookups across global, function, and block scopes from inner to outer step by step.",
    difficulty: "intermediate",
    docsUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Scope",
  },
  {
    id: "type-coercion",
    title: "Type Coercion",
    category: "javascript",
    description:
      "See how JavaScript type coercion works with an interactive visualization. Compare == vs === behavior, explore truthy/falsy values, and see edge cases with NaN, null, and undefined.",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality",
  },
  {
    id: "destructuring",
    title: "Destructuring",
    category: "javascript",
    description:
      "See how JavaScript destructuring works with an interactive visualization. Unpack arrays by position, extract object properties by name, use default values, nested patterns, and parameter destructuring.",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment",
  },
  {
    id: "spread-rest",
    title: "Spread & Rest",
    category: "javascript",
    description:
      "See how JavaScript spread and rest syntax works with an interactive visualization. Watch spread expand arrays/objects, rest collect arguments, and rest in destructuring patterns.",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax",
  },
  {
    id: "prototypal-inheritance",
    title: "Prototypal Inheritance",
    category: "javascript",
    description:
      "See how JavaScript prototypal inheritance works with an interactive visualization. Trace prototype chain lookups, __proto__ delegation, Object.create, and the instanceof operator step by step.",
    difficulty: "advanced",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain",
  },
  {
    id: "reference-value",
    title: "Reference vs Value",
    category: "javascript",
    description:
      "See how pass by value vs pass by reference works in JavaScript with an interactive visualization. Watch primitives copy, objects share references, and compare shallow copy, deep copy, and structuredClone.",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
  },
  {
    id: "heap-stack",
    title: "Heap & Stack",
    category: "javascript",
    description:
      "See how the JavaScript memory model works with an interactive visualization. Watch primitives live on the stack, objects get allocated on the heap, and call frames get created and destroyed.",
    difficulty: "advanced",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management",
  },
  {
    id: "garbage-collection",
    title: "Garbage Collection",
    category: "javascript",
    description:
      "See how JavaScript garbage collection works with an interactive visualization. Watch the mark-and-sweep algorithm, explore memory leak patterns with closures, timers, and DOM nodes, plus WeakRef.",
    difficulty: "advanced",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management",
  },
  {
    id: "generators",
    title: "Generators & Iterators",
    category: "javascript",
    description:
      "See how JavaScript generators work with an interactive visualization. Watch generator functions pause with yield and resume with .next(), step through the iterator protocol and two-way data flow.",
    difficulty: "advanced",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*",
  },
  {
    id: "event-delegation",
    title: "Event Delegation",
    category: "javascript",
    description:
      "See how DOM events propagate through the tree with an interactive visualization. Watch capture and bubble phases, stopPropagation, and the delegation pattern where one parent handler replaces many child handlers.",
    difficulty: "beginner",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Event_bubbling",
  },
  {
    id: "modules-imports",
    title: "Modules & Imports",
    category: "javascript",
    description:
      "See how JavaScript ES modules work with an interactive visualization. Watch the module graph build, import bindings resolve, live references update, and circular dependencies get handled step by step.",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
  },
  {
    id: "async-await",
    title: "Async/Await",
    category: "javascript",
    description:
      "See how async/await works with an interactive visualization. Watch an async function pause at await, hand control back to the caller, resume from the microtask queue, and compare sequential awaits with Promise.all.",
    difficulty: "intermediate",
    docsUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
  },
  {
    id: "debounce-throttle",
    title: "Debounce & Throttle",
    category: "javascript",
    description:
      "See how debounce and throttle control event handlers with an interactive visualization. Watch a burst of input events on a timeline, see debounce wait for silence, throttle fire at a fixed rate, and the timers that make it work.",
    difficulty: "beginner",
    docsUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Debounce",
  },
  /* ── React ── */
  {
    id: "virtual-dom",
    title: "Virtual DOM",
    category: "react",
    description:
      "See how React's virtual DOM works with an interactive visualization. Watch JSX compile to React.createElement calls, build a virtual DOM object tree, and diff to find real DOM updates.",
    difficulty: "beginner",
    docsUrl: "https://react.dev/learn/writing-markup-with-jsx",
  },
  {
    id: "reconciliation",
    title: "Reconciliation",
    category: "react",
    description:
      "See how React reconciliation works with an interactive visualization. Watch the virtual DOM diffing algorithm compare element trees: same-type updates, cross-type remounts, and key-based list matching.",
    difficulty: "intermediate",
    docsUrl: "https://react.dev/learn/preserving-and-resetting-state",
  },
  {
    id: "context-propagation",
    title: "Context Propagation",
    category: "react",
    description:
      "See how React Context works with an interactive visualization. Watch provider value storage, consumer subscription, value propagation through the component tree, and why all consumers re-render.",
    difficulty: "intermediate",
    docsUrl: "https://react.dev/learn/passing-data-deeply-with-context",
  },
  {
    id: "fiber-tree",
    title: "Fiber Tree",
    category: "react",
    description:
      "See how React's fiber tree works with an interactive visualization. Watch beginWork go down and completeWork go up as the work loop processes each fiber as a unit of work.",
    difficulty: "advanced",
    docsUrl: "https://react.dev/learn/render-and-commit",
  },
  {
    id: "hooks",
    title: "Hooks",
    category: "react",
    description:
      "See how React hooks work with an interactive visualization. Watch hooks stored as a linked list on each fiber, understand why call order matters, and what breaks with conditional hooks.",
    difficulty: "intermediate",
    docsUrl: "https://react.dev/reference/rules/rules-of-hooks",
  },
  {
    id: "render-cycle",
    title: "Render Cycle",
    category: "react",
    description:
      "See how React's render cycle works with an interactive visualization. Step through the render phase (pure, interruptible diffing) and the commit phase (synchronous DOM mutations, effects, paint).",
    difficulty: "advanced",
    docsUrl: "https://react.dev/learn/render-and-commit",
  },
  {
    id: "memoization",
    title: "Memoization",
    category: "react",
    description:
      "See how React.memo, useMemo, and useCallback prevent unnecessary work with an interactive visualization. Step through dependency checks, cache hits and misses, and which components skip re-renders.",
    difficulty: "intermediate",
    docsUrl: "https://react.dev/reference/react/memo",
  },
  {
    id: "suspense",
    title: "Suspense",
    category: "react",
    description:
      "See how React Suspense handles async boundaries with an interactive visualization. Step through fallback rendering, promise throwing, and content revealing to understand loading states.",
    difficulty: "intermediate",
    docsUrl: "https://react.dev/reference/react/Suspense",
  },
  {
    id: "server-components",
    title: "Server Components",
    category: "react",
    description:
      "See how React Server Components split rendering between server and client with an interactive visualization. Step through the server render pass, payload serialization, and client hydration.",
    difficulty: "advanced",
    docsUrl: "https://react.dev/reference/rsc/server-components",
  },
  {
    id: "error-boundaries",
    title: "Error Boundaries",
    category: "react",
    description:
      "See how React error boundaries work with an interactive visualization. Watch errors propagate up the component tree, getDerivedStateFromError trigger, fallback UI render, and recovery patterns step by step.",
    difficulty: "intermediate",
    docsUrl:
      "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary",
  },
  {
    id: "use-effect-lifecycle",
    title: "useEffect Lifecycle",
    category: "react",
    description:
      "See how React useEffect works with an interactive visualization. Step through the render-commit-paint-effect timeline, dependency array comparisons, cleanup function timing, and common patterns.",
    difficulty: "beginner",
    docsUrl: "https://react.dev/reference/react/useEffect",
  },
  {
    id: "state-batching",
    title: "State Batching",
    category: "react",
    description:
      "See how React batches state updates with an interactive visualization. Watch multiple setState calls queue up, updater functions run in order against the pending value, and one render commit for all of them, including inside timeouts and promises.",
    difficulty: "intermediate",
    docsUrl: "https://react.dev/learn/queueing-a-series-of-state-updates",
  },
  {
    id: "concurrent-rendering",
    title: "Concurrent Rendering",
    category: "react",
    description:
      "See how React concurrent rendering works with an interactive visualization. Watch a transition render at low priority, an urgent input interrupt it, React discard the stale work and restart, and the final commit land without blocking typing.",
    difficulty: "advanced",
    docsUrl: "https://react.dev/reference/react/useTransition",
  },
  /* ── Frameworks ── */
  {
    id: "vue-reactivity",
    group: "Vue",
    title: "Vue Reactivity",
    category: "frameworks",
    description:
      "See how Vue reactivity works with an interactive visualization. Watch a Proxy intercept property reads to track dependencies, writes trigger the effects that depend on them, and computed values cache until a dependency changes.",
    difficulty: "intermediate",
    docsUrl: "https://vuejs.org/guide/extras/reactivity-in-depth.html",
  },
  {
    id: "svelte-runes",
    group: "Svelte",
    title: "Svelte Runes",
    category: "frameworks",
    description:
      "See how Svelte 5 runes work with an interactive visualization. Watch $state create a signal, $derived build a dependency graph, $effect subscribe, and the compiler turn a component into surgical DOM updates with no virtual DOM.",
    difficulty: "intermediate",
    docsUrl: "https://svelte.dev/docs/svelte/what-are-runes",
  },
  {
    id: "angular-change-detection",
    group: "Angular",
    title: "Angular Change Detection",
    category: "frameworks",
    description:
      "See how Angular change detection works with an interactive visualization. Compare zone.js triggering a full tree check, OnPush skipping unchanged subtrees, and signals marking only the exact components that read a changed value.",
    difficulty: "advanced",
    docsUrl: "https://angular.dev/guide/signals",
  },
  /* ── Backend ── */
  {
    id: "http-request-lifecycle",
    title: "HTTP Request Lifecycle",
    category: "backend",
    description:
      "See what happens when a browser makes an HTTP request with an interactive visualization. Follow DNS resolution, the TCP and TLS handshakes, the request hitting a server route, middleware, the database, and the response coming back.",
    difficulty: "beginner",
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
  },
  {
    id: "database-indexing",
    title: "Database Indexing",
    category: "backend",
    description:
      "See how database indexes speed up queries with an interactive visualization. Compare a full table scan against a B-tree lookup, watch the tree descend to a leaf, and see why writes get slower as indexes pile up.",
    difficulty: "intermediate",
    docsUrl: "https://use-the-index-luke.com/sql/anatomy",
  },
  {
    id: "caching-strategies",
    title: "Caching Strategies",
    category: "backend",
    description:
      "See how caching works with an interactive visualization. Watch cache-aside hits and misses, write-through updates, TTL expiry, LRU eviction, and the stale data problem that makes invalidation hard.",
    difficulty: "intermediate",
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",
  },
  {
    id: "jwt-authentication",
    title: "JWT Authentication",
    category: "backend",
    description:
      "See how JWT authentication works with an interactive visualization. Watch login produce a signed token, the header, payload, and signature get encoded, a protected route verify the signature, and an expired or tampered token get rejected.",
    difficulty: "intermediate",
    docsUrl: "https://datatracker.ietf.org/doc/html/rfc7519",
  },
  {
    id: "rate-limiting",
    title: "Rate Limiting",
    category: "backend",
    description:
      "See how rate limiting protects an API with an interactive visualization. Watch a token bucket refill and drain, a fixed window reset at the boundary, a sliding window smooth out bursts, and requests get accepted or rejected with 429.",
    difficulty: "intermediate",
    docsUrl:
      "https://cloud.google.com/architecture/rate-limiting-strategies-techniques",
  },
  /* ── AI ── */
  {
    id: "tokenization",
    title: "Tokenization",
    category: "ai",
    description:
      "See how a language model turns text into tokens with an interactive visualization. Watch byte pair encoding merge characters into subwords, map tokens to ids, and see why token counts differ from word counts.",
    difficulty: "beginner",
    docsUrl: "https://huggingface.co/learn/llm-course/chapter2/4",
  },
  {
    id: "embeddings",
    title: "Embeddings",
    category: "ai",
    description:
      "See how embeddings turn tokens into vectors with an interactive visualization. Watch a lookup table map token ids to numbers, compare vectors with cosine similarity, and see how meaning becomes geometry.",
    difficulty: "beginner",
    docsUrl:
      "https://developers.google.com/machine-learning/crash-course/embeddings",
  },
  {
    id: "attention",
    title: "Attention",
    category: "ai",
    description:
      "See how self-attention works with an interactive visualization. Watch queries score keys, softmax turn scores into weights, the causal mask hide future tokens, and weighted values mix into a new representation.",
    difficulty: "intermediate",
    docsUrl: "https://arxiv.org/abs/1706.03762",
  },
  {
    id: "next-token-prediction",
    title: "Next Token Prediction",
    category: "ai",
    description:
      "See how a language model picks the next token with an interactive visualization. Watch logits become probabilities, compare greedy, temperature, top-k, and top-p sampling, and follow the autoregressive loop token by token.",
    difficulty: "intermediate",
    docsUrl: "https://huggingface.co/blog/how-to-generate",
  },
  {
    id: "backpropagation",
    title: "Backpropagation",
    category: "ai",
    description:
      "See how neural networks learn with an interactive visualization. Step through a forward pass, the loss, gradients flowing backward through the chain rule, and a gradient descent weight update on a tiny network.",
    difficulty: "advanced",
    docsUrl: "https://cs231n.github.io/optimization-2/",
  },
] as const satisfies readonly TopicDefinition[];

export type TopicId = (typeof TOPIC_DEFINITIONS)[number]["id"];

export const topics: readonly Topic[] = TOPIC_DEFINITIONS.map((definition) => ({
  ...definition,
  route: `/${definition.category}/${definition.id}`,
}));

export const isTopicId = (value: string): value is TopicId =>
  topics.some((topic) => topic.id === value);

export const getTopicsByCategory = (category: Category): Topic[] =>
  topics.filter((topic) => topic.category === category);

export interface TopicGroup {
  /** Group label, or null for topics that have no group. */
  label: string | null;
  topics: Topic[];
}

/**
 * Topics split by their `group`, in first-appearance order. Ungrouped topics
 * come first under a null label so a category without groups yields a single
 * entry and callers can render the flat case and the grouped case alike.
 */
export const groupTopics = (list: readonly Topic[]): TopicGroup[] => {
  const groups = new Map<string | null, Topic[]>();
  for (const topic of list) {
    const key = topic.group ?? null;
    const bucket = groups.get(key);
    if (bucket) bucket.push(topic);
    else groups.set(key, [topic]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (a === null ? -1 : b === null ? 1 : 0))
    .map(([label, topics]) => ({ label, topics }));
};

export const getTopicById = (id: string): Topic | undefined =>
  topics.find((topic) => topic.id === id);

/** Previous and next topics within the same category, in registry order. */
export const getAdjacentTopics = (
  topicId: string,
): { previous: Topic | null; next: Topic | null } => {
  const topic = getTopicById(topicId);
  if (!topic) {
    return { previous: null, next: null };
  }
  const siblings = getTopicsByCategory(topic.category);
  const index = siblings.findIndex((entry) => entry.id === topicId);
  return {
    previous: index > 0 ? siblings[index - 1] : null,
    next:
      index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null,
  };
};
