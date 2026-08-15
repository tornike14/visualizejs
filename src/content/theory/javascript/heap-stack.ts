import type { TopicTheoryContent } from "@/content/theory/types";

export const heapStackTheory: TopicTheoryContent = {
  summary:
    "The stack tracks execution frames and quick local access, while the heap stores dynamically allocated objects, together forming the practical memory model behind JavaScript runtime behavior.",
  whatItIs: [
    "The call stack represents active execution contexts. Each function call pushes a frame, and returning pops it.",
    "The heap is a larger memory region for objects, arrays, and functions that need dynamic lifetime management.",
    "Variables in stack frames may hold primitives directly or references pointing into heap objects. This relationship explains identity, mutation, and garbage collection behavior.",
    "The two regions differ in cost. Stack allocation is close to free because the engine only moves a pointer, and cleanup is automatic when the frame pops. Heap allocation has to find free space, and cleanup depends on the garbage collector deciding an object is no longer reachable.",
    "They also differ in size. The stack is small and fixed, usually a few hundred thousand frames deep, which is why runaway recursion throws long before the heap is anywhere near full. The heap is large and grows on demand up to an engine limit.",
    "Primitives like numbers, strings, and booleans behave as if they live in the frame itself, so copying one copies the value. Objects, arrays, and functions live in the heap, so copying a variable copies only the reference and both names point at the same object.",
  ],
  howItWorks: [
    "Step 1: function invocation pushes a new stack frame with local bindings and execution state.",
    "Step 2: object creation allocates memory in the heap and stores a reference in a variable.",
    "Step 3: assigning that variable to another name copies the reference, not the object, so both names reach the same heap allocation.",
    "Step 4: nested calls continue stacking frames until functions return.",
    "Step 5: when frames pop, their local bindings disappear and any heap object nothing else references becomes unreachable.",
    "Step 6: unreachable heap allocations become eligible for garbage collection, which runs on the engine's schedule rather than at the moment the frame popped.",
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
    {
      title: "Expecting memory to be freed the moment a function returns",
      explanation:
        "Popping a frame only removes that frame's bindings. If a closure, a timer, or a cache still references the object, it stays in the heap.",
      fix: "Look for what still holds a reference before assuming a leak is a garbage collector problem.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is the difference between stack and heap memory in JavaScript?",
      answer:
        "The stack holds execution frames and local bindings in last-in-first-out order, with fast automatic cleanup and a small fixed size. The heap holds objects with dynamic lifetimes, costs more to allocate, and is reclaimed by the garbage collector when nothing reachable references the object.",
      codeExample: {
        language: "javascript",
        code: `function run() {
  let count = 1;              // primitive, lives with the frame
  const config = { retries: 3 }; // object in the heap
  const alias = config;          // copies the reference only

  alias.retries = 5;
  console.log(config.retries);   // 5
}

run(); // frame pops, config becomes unreachable`,
      },
    },
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
      question: "Where are primitives stored?",
      answer:
        "Treat primitives as living with the frame that declares them, which is why assigning one copies the value. Engines are free to optimize this, including boxing values into the heap, so the rule describes observable behavior rather than physical layout.",
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
