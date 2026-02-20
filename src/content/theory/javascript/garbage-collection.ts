import type { TopicTheoryContent } from "@/content/theory/types";

export const garbageCollectionTheory: TopicTheoryContent = {
  summary:
    "JavaScript garbage collection automatically reclaims heap memory for unreachable objects, typically using tracing strategies like mark-and-sweep to prevent manual memory management.",
  whatItIs: [
    "JavaScript engines track object reachability from roots such as global objects, active stack frames, and live closures.",
    "If an object can no longer be reached through any reference path, it becomes collectible and its memory can be reused.",
    "Automatic collection reduces manual memory bugs, but developers still influence memory behavior through references, caches, listeners, and long-lived closures.",
  ],
  howItWorks: [
    "Step 1: the collector starts from roots and marks reachable objects.",
    "Step 2: it recursively traverses references to mark everything still in use.",
    "Step 3: unmarked objects are considered unreachable and reclaimed.",
    "Step 4: the runtime may compact memory and repeat collection cycles incrementally over time.",
  ],
  commonMistakes: [
    {
      title: "Expecting immediate memory release after setting a variable to null",
      explanation:
        "Nulling a reference only makes an object eligible for collection if no other reachable references exist.",
      fix: "Remove all strong references and let the collector run naturally.",
    },
    {
      title: "Leaking memory via timers and event listeners",
      explanation:
        "Uncleared intervals or listeners can keep closures and large object graphs reachable indefinitely.",
      fix: "Pair every registration with cleanup logic during teardown or component unmount.",
    },
    {
      title: "Misunderstanding WeakMap and WeakRef semantics",
      explanation:
        "Weak references are not deterministic cleanup mechanisms and should not be used for critical program flow.",
      fix: "Use weak structures for cache hints only, not required lifecycle guarantees.",
    },
  ],
  interviewQuestions: [
    {
      question: "Can JavaScript guarantee exactly when an object is collected?",
      answer:
        "No. Collection timing is engine-controlled and non-deterministic, optimized for throughput and responsiveness.",
      codeExample: {
        language: "javascript",
        code: `let cache = { payload: new Array(1_000_000).fill("x") };
cache = null; // eligible for GC when no other refs remain
// Collection timing is runtime-dependent.`,
      },
    },
    {
      question: "Do circular references always leak memory?",
      answer:
        "No. Modern tracing collectors handle unreachable cycles correctly. Leaks occur when references remain reachable from roots.",
    },
    {
      question: "How can I diagnose memory leaks?",
      answer:
        "Use browser devtools heap snapshots, allocation timelines, and retained-size analysis to find unexpectedly reachable objects.",
    },
    {
      question: "Is manual delete enough to avoid leaks?",
      answer:
        "Deleting properties can help remove references, but leak prevention depends on the full reachability graph, not one operation.",
    },
  ],
  relatedTopicIds: ["heap-stack", "reference-value", "closures", "event-loop"],
};
