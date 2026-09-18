import type { TopicTheoryContent } from "@/content/theory/types";
import { closuresTheory } from "@/content/theory/javascript/closures";
import { eventLoopTheory } from "@/content/theory/javascript/event-loop";
import { executionContextTheory } from "@/content/theory/javascript/execution-context";
import { garbageCollectionTheory } from "@/content/theory/javascript/garbage-collection";
import { generatorsTheory } from "@/content/theory/javascript/generators";
import { heapStackTheory } from "@/content/theory/javascript/heap-stack";
import { hoistingTheory } from "@/content/theory/javascript/hoisting";
import { promisesTheory } from "@/content/theory/javascript/promises";
import { prototypalInheritanceTheory } from "@/content/theory/javascript/prototypal-inheritance";
import { referenceValueTheory } from "@/content/theory/javascript/reference-value";
import { scopeChainTheory } from "@/content/theory/javascript/scope-chain";
import { thisKeywordTheory } from "@/content/theory/javascript/this-keyword";
import { typeCoercionTheory } from "@/content/theory/javascript/type-coercion";
import { reconciliationTheory } from "@/content/theory/react/reconciliation";
import { virtualDomTheory } from "@/content/theory/react/virtual-dom";
import { contextPropagationTheory } from "@/content/theory/react/context-propagation";
import { destructuringTheory } from "@/content/theory/javascript/destructuring";
import { spreadRestTheory } from "@/content/theory/javascript/spread-rest";
import { fiberTreeTheory } from "@/content/theory/react/fiber-tree";
import { hooksTheory } from "@/content/theory/react/hooks";
import { renderCycleTheory } from "@/content/theory/react/render-cycle";
import { memoizationTheory } from "@/content/theory/react/memoization";
import { suspenseTheory } from "@/content/theory/react/suspense";
import { serverComponentsTheory } from "@/content/theory/react/server-components";
import { eventDelegationTheory } from "@/content/theory/javascript/event-delegation";
import { modulesImportsTheory } from "@/content/theory/javascript/modules-imports";
import { errorBoundariesTheory } from "@/content/theory/react/error-boundaries";
import { useEffectLifecycleTheory } from "@/content/theory/react/use-effect-lifecycle";
import { tokenizationTheory } from "@/content/theory/ai/tokenization";
import { embeddingsTheory } from "@/content/theory/ai/embeddings";
import { attentionTheory } from "@/content/theory/ai/attention";
import { nextTokenPredictionTheory } from "@/content/theory/ai/next-token-prediction";
import { backpropagationTheory } from "@/content/theory/ai/backpropagation";
import { httpRequestLifecycleTheory } from "@/content/theory/backend/http-request-lifecycle";
import { databaseIndexingTheory } from "@/content/theory/backend/database-indexing";
import { cachingStrategiesTheory } from "@/content/theory/backend/caching-strategies";
import { jwtAuthenticationTheory } from "@/content/theory/backend/jwt-authentication";
import { rateLimitingTheory } from "@/content/theory/backend/rate-limiting";
import { vueReactivityTheory } from "@/content/theory/frameworks/vue-reactivity";
import { svelteRunesTheory } from "@/content/theory/frameworks/svelte-runes";
import { angularChangeDetectionTheory } from "@/content/theory/frameworks/angular-change-detection";
import { asyncAwaitTheory } from "@/content/theory/javascript/async-await";
import { debounceThrottleTheory } from "@/content/theory/javascript/debounce-throttle";
import { stateBatchingTheory } from "@/content/theory/react/state-batching";
import { concurrentRenderingTheory } from "@/content/theory/react/concurrent-rendering";
import { getTopicById, getTopicsByCategory } from "@/lib/topics";
import type { Category, Topic } from "@/types";

const THEORY_CONTENT_BY_TOPIC_ID: Record<string, TopicTheoryContent> = {
  closures: closuresTheory,
  "event-loop": eventLoopTheory,
  "execution-context": executionContextTheory,
  "garbage-collection": garbageCollectionTheory,
  generators: generatorsTheory,
  "heap-stack": heapStackTheory,
  hoisting: hoistingTheory,
  promises: promisesTheory,
  "prototypal-inheritance": prototypalInheritanceTheory,
  "reference-value": referenceValueTheory,
  "scope-chain": scopeChainTheory,
  "this-keyword": thisKeywordTheory,
  "type-coercion": typeCoercionTheory,
  "virtual-dom": virtualDomTheory,
  "context-propagation": contextPropagationTheory,
  reconciliation: reconciliationTheory,
  destructuring: destructuringTheory,
  "spread-rest": spreadRestTheory,
  "fiber-tree": fiberTreeTheory,
  hooks: hooksTheory,
  "render-cycle": renderCycleTheory,
  memoization: memoizationTheory,
  suspense: suspenseTheory,
  "server-components": serverComponentsTheory,
  "event-delegation": eventDelegationTheory,
  "modules-imports": modulesImportsTheory,
  "error-boundaries": errorBoundariesTheory,
  "use-effect-lifecycle": useEffectLifecycleTheory,
  "tokenization": tokenizationTheory,
  "embeddings": embeddingsTheory,
  "attention": attentionTheory,
  "next-token-prediction": nextTokenPredictionTheory,
  "backpropagation": backpropagationTheory,
  "http-request-lifecycle": httpRequestLifecycleTheory,
  "database-indexing": databaseIndexingTheory,
  "caching-strategies": cachingStrategiesTheory,
  "jwt-authentication": jwtAuthenticationTheory,
  "rate-limiting": rateLimitingTheory,
  "vue-reactivity": vueReactivityTheory,
  "svelte-runes": svelteRunesTheory,
  "angular-change-detection": angularChangeDetectionTheory,
  "async-await": asyncAwaitTheory,
  "debounce-throttle": debounceThrottleTheory,
  "state-batching": stateBatchingTheory,
  "concurrent-rendering": concurrentRenderingTheory,
};

export function getTheoryContent(topicId: string): TopicTheoryContent | undefined {
  return THEORY_CONTENT_BY_TOPIC_ID[topicId];
}

export function hasTheoryContent(topicId: string): boolean {
  return Boolean(THEORY_CONTENT_BY_TOPIC_ID[topicId]);
}

export function getTheoryTopicsByCategory(category: Category): Topic[] {
  return getTopicsByCategory(category).filter((topic) => hasTheoryContent(topic.id));
}

export function getRelatedTopicsFromTheory(topicId: string): Topic[] {
  const theory = getTheoryContent(topicId);
  if (!theory) {
    return [];
  }

  const seen = new Set<string>();

  return theory.relatedTopicIds
    .filter((relatedTopicId) => {
      if (relatedTopicId === topicId || seen.has(relatedTopicId)) {
        return false;
      }
      seen.add(relatedTopicId);
      return true;
    })
    .map((relatedTopicId) => getTopicById(relatedTopicId))
    .filter((topic): topic is Topic => Boolean(topic));
}
