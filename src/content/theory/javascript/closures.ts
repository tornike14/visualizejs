import type { TopicTheoryContent } from "@/content/theory/types";

export const closuresTheory: TopicTheoryContent = {
  summary:
    "A closure is a function bundled with references to its lexical environment, allowing inner functions to keep using outer scope bindings even after the outer function returns.",
  whatItIs: [
    "When a function is defined, JavaScript stores a link to the scope where that function was created. That scope link is lexical and does not depend on how the function is later called.",
    "If the function outlives the scope where it was declared, JavaScript preserves the needed bindings so the function can still access them. This preserved access is closure behavior.",
    "Closures are fundamental for private state, function factories, memoization, and module patterns where internal details should not be exposed globally.",
  ],
  howItWorks: [
    "Step 1: an outer function creates local bindings and returns an inner function.",
    "Step 2: the inner function keeps a reference to the outer lexical environment.",
    "Step 3: later calls to the inner function read or update those captured bindings.",
    "Step 4: the captured environment is eligible for garbage collection only when nothing references the closure anymore.",
  ],
  commonMistakes: [
    {
      title: "Assuming closures capture values, not bindings",
      explanation:
        "Closures generally retain references to bindings, so later changes to a captured variable are visible to the closure.",
      fix: "Treat captured variables as shared state and create new bindings when isolation is required.",
    },
    {
      title: "Accidentally retaining large objects",
      explanation:
        "Closures can keep data alive longer than expected, which may increase memory usage if long-lived handlers capture heavy objects.",
      fix: "Capture only needed data and detach listeners or clear references when components unmount.",
    },
    {
      title: "Using var in loops with async callbacks",
      explanation:
        "var has function scope, so callbacks may all read the same final loop value instead of per-iteration values.",
      fix: "Use let for block-scoped loop variables or create a per-iteration factory function.",
    },
  ],
  interviewQuestions: [
    {
      question: "When is a closure created?",
      answer:
        "A closure is formed when a function is created, because the function stores a reference to its lexical environment at definition time.",
      codeExample: {
        language: "javascript",
        code: `function makeCounter() {
  let count = 0;
  return () => ++count;
}

const next = makeCounter();
next(); // 1
next(); // 2`,
      },
    },
    {
      question: "Do closures cause memory leaks by default?",
      answer:
        "No. They are normal language behavior. Problems happen when long-lived closures keep unnecessary references alive.",
    },
    {
      question: "Can closures implement private state?",
      answer:
        "Yes. Returning functions that access internal variables is a common way to expose behavior while keeping state inaccessible from outside.",
    },
    {
      question: "How do closures interact with async code?",
      answer:
        "Async callbacks still use lexical scoping, so they read the captured bindings that exist when they eventually execute.",
    },
  ],
  relatedTopicIds: ["scope-chain", "execution-context", "hoisting", "garbage-collection", "promises"],
};
