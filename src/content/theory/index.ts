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
  reconciliation: reconciliationTheory,
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
