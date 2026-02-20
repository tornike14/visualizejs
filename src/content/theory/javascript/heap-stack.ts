import type { TopicTheoryContent } from "@/content/theory/types";

export const heapStackTheory: TopicTheoryContent = {
  summary:
    "The stack tracks execution frames and quick local access, while the heap stores dynamically allocated objects, together forming the practical memory model behind JavaScript runtime behavior.",
  whatItIs: [
    "The call stack represents active execution contexts. Each function call pushes a frame, and returning pops it.",
    "The heap is a larger memory region for objects, arrays, and functions that need dynamic lifetime management.",
    "Variables in stack frames may hold primitives directly or references pointing into heap objects. This relationship explains identity, mutation, and garbage collection behavior.",
  ],
  howItWorks: [
    "Step 1: function invocation pushes a new stack frame with local bindings and execution state.",
    "Step 2: object creation allocates memory in the heap and stores a reference in a variable.",
    "Step 3: nested calls continue stacking frames until functions return.",
    "Step 4: when frames pop, unreachable heap allocations become eligible for garbage collection.",
  ],
  commonMistakes: [
    {
      title: "Treating stack and heap as strict language guarantees for every value",
      explanation:
        "The model is conceptual and implementation details can vary by engine optimization strategy.",
      fix: "Use stack and heap as a mental model for behavior, not as a strict byte-level storage contract.",
    },
    {
      title: "Ignoring call stack growth",
      explanation:
        "Deep or unbounded recursion can exhaust stack space and throw stack overflow errors.",
      fix: "Use iterative patterns or tail-friendly designs where recursion depth is unknown.",
    },
    {
      title: "Assuming local variables are always isolated from shared state",
      explanation:
        "Local variables can still hold references to shared heap objects, so mutation can affect other parts of the app.",
      fix: "Track object identity explicitly and avoid hidden shared mutations.",
    },
  ],
  interviewQuestions: [
    {
      question: "Does JavaScript expose direct stack and heap control?",
      answer:
        "No. Memory layout is managed by the engine. Developers reason about behavior through high-level constructs and performance tools.",
      codeExample: {
        language: "javascript",
        code: `function update(user) {
  user.name = "Ada";
}

const person = { name: "Tornike" };
update(person);
console.log(person.name); // "Ada"`,
      },
    },
    {
      question: "Why can two variables mutate the same object?",
      answer:
        "Because both variables can hold references to the same heap object identity.",
    },
    {
      question: "What usually causes stack overflow in JavaScript?",
      answer:
        "Unbounded recursion or cyclic call chains that do not terminate before stack limits are reached.",
    },
    {
      question: "How is heap memory reclaimed?",
      answer:
        "Garbage collection reclaims heap objects that are no longer reachable from active roots.",
    },
  ],
  relatedTopicIds: ["execution-context", "reference-value", "garbage-collection", "closures", "event-loop"],
};
