import type { TopicTheoryContent } from "@/content/theory/types";
import { attentionTheory } from "@/content/theory/ai/attention";
import { backpropagationTheory } from "@/content/theory/ai/backpropagation";
import { embeddingsTheory } from "@/content/theory/ai/embeddings";
import { nextTokenPredictionTheory } from "@/content/theory/ai/next-token-prediction";
import { tokenizationTheory } from "@/content/theory/ai/tokenization";
import { cachingStrategiesTheory } from "@/content/theory/backend/caching-strategies";
import { databaseIndexingTheory } from "@/content/theory/backend/database-indexing";
import { httpRequestLifecycleTheory } from "@/content/theory/backend/http-request-lifecycle";
import { jwtAuthenticationTheory } from "@/content/theory/backend/jwt-authentication";
import { rateLimitingTheory } from "@/content/theory/backend/rate-limiting";
import { angularChangeDetectionTheory } from "@/content/theory/frameworks/angular-change-detection";
import { svelteRunesTheory } from "@/content/theory/frameworks/svelte-runes";
import { vueReactivityTheory } from "@/content/theory/frameworks/vue-reactivity";
import { asyncAwaitTheory } from "@/content/theory/javascript/async-await";
import { closuresTheory } from "@/content/theory/javascript/closures";
import { debounceThrottleTheory } from "@/content/theory/javascript/debounce-throttle";
import { destructuringTheory } from "@/content/theory/javascript/destructuring";
import { eventDelegationTheory } from "@/content/theory/javascript/event-delegation";
import { eventLoopTheory } from "@/content/theory/javascript/event-loop";
import { executionContextTheory } from "@/content/theory/javascript/execution-context";
import { garbageCollectionTheory } from "@/content/theory/javascript/garbage-collection";
import { generatorsTheory } from "@/content/theory/javascript/generators";
import { heapStackTheory } from "@/content/theory/javascript/heap-stack";
import { hoistingTheory } from "@/content/theory/javascript/hoisting";
import { modulesImportsTheory } from "@/content/theory/javascript/modules-imports";
import { promisesTheory } from "@/content/theory/javascript/promises";
import { prototypalInheritanceTheory } from "@/content/theory/javascript/prototypal-inheritance";
import { referenceValueTheory } from "@/content/theory/javascript/reference-value";
import { scopeChainTheory } from "@/content/theory/javascript/scope-chain";
import { spreadRestTheory } from "@/content/theory/javascript/spread-rest";
import { thisKeywordTheory } from "@/content/theory/javascript/this-keyword";
import { typeCoercionTheory } from "@/content/theory/javascript/type-coercion";
import { concurrentRenderingTheory } from "@/content/theory/react/concurrent-rendering";
import { contextPropagationTheory } from "@/content/theory/react/context-propagation";
import { errorBoundariesTheory } from "@/content/theory/react/error-boundaries";
import { fiberTreeTheory } from "@/content/theory/react/fiber-tree";
import { hooksTheory } from "@/content/theory/react/hooks";
import { memoizationTheory } from "@/content/theory/react/memoization";
import { reconciliationTheory } from "@/content/theory/react/reconciliation";
import { renderCycleTheory } from "@/content/theory/react/render-cycle";
import { serverComponentsTheory } from "@/content/theory/react/server-components";
import { stateBatchingTheory } from "@/content/theory/react/state-batching";
import { suspenseTheory } from "@/content/theory/react/suspense";
import { useEffectLifecycleTheory } from "@/content/theory/react/use-effect-lifecycle";
import { virtualDomTheory } from "@/content/theory/react/virtual-dom";
import { getTopicById, getTopicsByCategory, type TopicId } from "@/lib/topics";
import type { Category, Topic } from "@/types";

const THEORY_CONTENT_BY_TOPIC_ID: Record<TopicId, TopicTheoryContent> = {
  "angular-change-detection": angularChangeDetectionTheory,
  "async-await": asyncAwaitTheory,
  attention: attentionTheory,
  backpropagation: backpropagationTheory,
  "caching-strategies": cachingStrategiesTheory,
  closures: closuresTheory,
  "concurrent-rendering": concurrentRenderingTheory,
  "context-propagation": contextPropagationTheory,
  "database-indexing": databaseIndexingTheory,
  "debounce-throttle": debounceThrottleTheory,
  destructuring: destructuringTheory,
  embeddings: embeddingsTheory,
  "error-boundaries": errorBoundariesTheory,
  "event-delegation": eventDelegationTheory,
  "event-loop": eventLoopTheory,
  "execution-context": executionContextTheory,
  "fiber-tree": fiberTreeTheory,
  "garbage-collection": garbageCollectionTheory,
  generators: generatorsTheory,
  "heap-stack": heapStackTheory,
  hoisting: hoistingTheory,
  hooks: hooksTheory,
  "http-request-lifecycle": httpRequestLifecycleTheory,
  "jwt-authentication": jwtAuthenticationTheory,
  memoization: memoizationTheory,
  "modules-imports": modulesImportsTheory,
  "next-token-prediction": nextTokenPredictionTheory,
  promises: promisesTheory,
  "prototypal-inheritance": prototypalInheritanceTheory,
  "rate-limiting": rateLimitingTheory,
  reconciliation: reconciliationTheory,
  "reference-value": referenceValueTheory,
  "render-cycle": renderCycleTheory,
  "scope-chain": scopeChainTheory,
  "server-components": serverComponentsTheory,
  "spread-rest": spreadRestTheory,
  "state-batching": stateBatchingTheory,
  suspense: suspenseTheory,
  "svelte-runes": svelteRunesTheory,
  "this-keyword": thisKeywordTheory,
  tokenization: tokenizationTheory,
  "type-coercion": typeCoercionTheory,
  "use-effect-lifecycle": useEffectLifecycleTheory,
  "virtual-dom": virtualDomTheory,
  "vue-reactivity": vueReactivityTheory,
};

export const getTheoryContent = (
  topicId: string,
): TopicTheoryContent | undefined =>
  THEORY_CONTENT_BY_TOPIC_ID[topicId as TopicId];

export const hasTheoryContent = (topicId: string): boolean =>
  Boolean(getTheoryContent(topicId));

export const getTheoryTopicsByCategory = (category: Category): Topic[] =>
  getTopicsByCategory(category).filter((topic) => hasTheoryContent(topic.id));

/** Related topics in authored order, skipping self references and duplicates. */
export const getRelatedTopicsFromTheory = (topicId: string): Topic[] => {
  const theory = getTheoryContent(topicId);
  if (!theory) return [];

  const ids = [...new Set(theory.relatedTopicIds)].filter(
    (id) => id !== topicId,
  );
  return ids
    .map((id) => getTopicById(id))
    .filter((topic): topic is Topic => Boolean(topic));
};
