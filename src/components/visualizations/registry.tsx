"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import type { TopicId } from "@/lib/topics";

const loading = () => <VisualizationLoading />;

/**
 * Lazily loaded visualization for every topic. Typed by TopicId so adding a
 * topic to the registry without a component here fails to compile.
 *
 * This is a client module on purpose: dynamic() calls made from a server
 * module are bundled into the shared page chunk, which would ship every
 * topic's step data on every topic page. From a client module each import()
 * becomes its own chunk.
 */
const VISUALIZATIONS: Record<TopicId, ComponentType> = {
  "angular-change-detection": dynamic(
    () =>
      import("./angular-change-detection").then(
        (module) => module.AngularChangeDetection,
      ),
    { loading },
  ),
  "async-await": dynamic(
    () => import("./async-await").then((module) => module.AsyncAwait),
    { loading },
  ),
  attention: dynamic(
    () => import("./attention").then((module) => module.Attention),
    { loading },
  ),
  backpropagation: dynamic(
    () => import("./backpropagation").then((module) => module.Backpropagation),
    { loading },
  ),
  "caching-strategies": dynamic(
    () =>
      import("./caching-strategies").then((module) => module.CachingStrategies),
    { loading },
  ),
  closures: dynamic(
    () => import("./closures").then((module) => module.Closures),
    { loading },
  ),
  "concurrent-rendering": dynamic(
    () =>
      import("./concurrent-rendering").then(
        (module) => module.ConcurrentRendering,
      ),
    { loading },
  ),
  "context-propagation": dynamic(
    () =>
      import("./context-propagation").then(
        (module) => module.ContextPropagation,
      ),
    { loading },
  ),
  "database-indexing": dynamic(
    () =>
      import("./database-indexing").then((module) => module.DatabaseIndexing),
    { loading },
  ),
  "debounce-throttle": dynamic(
    () =>
      import("./debounce-throttle").then((module) => module.DebounceThrottle),
    { loading },
  ),
  destructuring: dynamic(
    () => import("./destructuring").then((module) => module.Destructuring),
    { loading },
  ),
  embeddings: dynamic(
    () => import("./embeddings").then((module) => module.Embeddings),
    { loading },
  ),
  "error-boundaries": dynamic(
    () => import("./error-boundaries").then((module) => module.ErrorBoundaries),
    { loading },
  ),
  "event-delegation": dynamic(
    () => import("./event-delegation").then((module) => module.EventDelegation),
    { loading },
  ),
  "event-loop": dynamic(
    () => import("./event-loop").then((module) => module.EventLoop),
    { loading },
  ),
  "execution-context": dynamic(
    () =>
      import("./execution-context").then((module) => module.ExecutionContext),
    { loading },
  ),
  "fiber-tree": dynamic(
    () => import("./fiber-tree").then((module) => module.FiberTree),
    { loading },
  ),
  "garbage-collection": dynamic(
    () =>
      import("./garbage-collection").then((module) => module.GarbageCollection),
    { loading },
  ),
  generators: dynamic(
    () => import("./generators").then((module) => module.Generators),
    { loading },
  ),
  "heap-stack": dynamic(
    () => import("./heap-stack").then((module) => module.HeapStack),
    { loading },
  ),
  hoisting: dynamic(
    () => import("./hoisting").then((module) => module.Hoisting),
    { loading },
  ),
  hooks: dynamic(() => import("./hooks").then((module) => module.Hooks), {
    loading,
  }),
  "http-request-lifecycle": dynamic(
    () =>
      import("./http-request-lifecycle").then(
        (module) => module.HttpRequestLifecycle,
      ),
    { loading },
  ),
  "jwt-authentication": dynamic(
    () =>
      import("./jwt-authentication").then((module) => module.JwtAuthentication),
    { loading },
  ),
  memoization: dynamic(
    () => import("./memoization").then((module) => module.Memoization),
    { loading },
  ),
  "modules-imports": dynamic(
    () => import("./modules-imports").then((module) => module.ModulesImports),
    { loading },
  ),
  "next-token-prediction": dynamic(
    () =>
      import("./next-token-prediction").then(
        (module) => module.NextTokenPrediction,
      ),
    { loading },
  ),
  promises: dynamic(
    () => import("./promises").then((module) => module.Promises),
    { loading },
  ),
  "prototypal-inheritance": dynamic(
    () =>
      import("./prototypal-inheritance").then(
        (module) => module.PrototypalInheritance,
      ),
    { loading },
  ),
  "rate-limiting": dynamic(
    () => import("./rate-limiting").then((module) => module.RateLimiting),
    { loading },
  ),
  reconciliation: dynamic(
    () => import("./reconciliation").then((module) => module.Reconciliation),
    { loading },
  ),
  "reference-value": dynamic(
    () => import("./reference-value").then((module) => module.ReferenceValue),
    { loading },
  ),
  "render-cycle": dynamic(
    () => import("./render-cycle").then((module) => module.RenderCycle),
    { loading },
  ),
  "scope-chain": dynamic(
    () => import("./scope-chain").then((module) => module.ScopeChain),
    { loading },
  ),
  "server-components": dynamic(
    () =>
      import("./server-components").then((module) => module.ServerComponents),
    { loading },
  ),
  "spread-rest": dynamic(
    () => import("./spread-rest").then((module) => module.SpreadRest),
    { loading },
  ),
  "state-batching": dynamic(
    () => import("./state-batching").then((module) => module.StateBatching),
    { loading },
  ),
  suspense: dynamic(
    () => import("./suspense").then((module) => module.Suspense),
    { loading },
  ),
  "svelte-runes": dynamic(
    () => import("./svelte-runes").then((module) => module.SvelteRunes),
    { loading },
  ),
  "this-keyword": dynamic(
    () => import("./this-keyword").then((module) => module.ThisKeyword),
    { loading },
  ),
  tokenization: dynamic(
    () => import("./tokenization").then((module) => module.Tokenization),
    { loading },
  ),
  "type-coercion": dynamic(
    () => import("./type-coercion").then((module) => module.TypeCoercion),
    { loading },
  ),
  "use-effect-lifecycle": dynamic(
    () =>
      import("./use-effect-lifecycle").then(
        (module) => module.UseEffectLifecycle,
      ),
    { loading },
  ),
  "virtual-dom": dynamic(
    () => import("./virtual-dom").then((module) => module.VirtualDom),
    { loading },
  ),
  "vue-reactivity": dynamic(
    () => import("./vue-reactivity").then((module) => module.VueReactivity),
    { loading },
  ),
};

interface TopicVisualizationProps {
  topicId: TopicId;
}

/** Renders the lazily loaded visualization for a topic. */
export const TopicVisualization = ({ topicId }: TopicVisualizationProps) => {
  const Visualization = VISUALIZATIONS[topicId];
  return <Visualization />;
};
