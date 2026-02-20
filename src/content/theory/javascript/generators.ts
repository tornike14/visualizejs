import type { TopicTheoryContent } from "@/content/theory/types";

export const generatorsTheory: TopicTheoryContent = {
  summary:
    "Generators are pause-and-resume functions that produce iterator objects, enabling lazy evaluation, controlled sequencing, and two-way communication through next calls.",
  whatItIs: [
    "A generator function is declared with function* and returns an iterator when invoked. The function body does not run immediately on creation.",
    "Each yield pauses execution and emits a value. Subsequent next calls resume from the exact paused point with preserved local state.",
    "Generators unify iterable protocols and stateful control flow, making them useful for custom iteration, step-by-step workflows, and stream-like data consumption.",
  ],
  howItWorks: [
    "Step 1: calling a generator function returns an iterator object.",
    "Step 2: iterator.next starts execution until the first yield or return.",
    "Step 3: each next call resumes execution and can pass data back into the generator.",
    "Step 4: when done is true, iteration completes and no further yielded values are produced.",
  ],
  commonMistakes: [
    {
      title: "Expecting generator body to execute on function call",
      explanation:
        "Generator functions are lazy. Execution begins only when next is called on the returned iterator.",
      fix: "Always reason about generators as state machines driven by iterator calls.",
    },
    {
      title: "Reusing exhausted iterators",
      explanation:
        "Once an iterator finishes, additional next calls stay done and do not restart the sequence.",
      fix: "Create a new iterator by calling the generator function again when a fresh run is needed.",
    },
    {
      title: "Ignoring error and completion channels",
      explanation:
        "Generators support throw and return, and failing to handle these channels can break control flow assumptions.",
      fix: "Design generator consumers to account for done state and possible thrown errors.",
    },
  ],
  interviewQuestions: [
    {
      question: "Are generators asynchronous by default?",
      answer:
        "No. Standard generators are synchronous. Async generators use async function* and integrate with for await...of.",
      codeExample: {
        language: "javascript",
        code: `function* ids() {
  yield 1;
  yield 2;
}

const it = ids();
console.log(it.next()); // { value: 1, done: false }`,
      },
    },
    {
      question: "How do generators relate to iterables?",
      answer:
        "Generator iterators implement the iterator protocol and are also iterable, so they work directly with for...of and spread in many cases.",
    },
    {
      question: "Can next pass data into a generator?",
      answer:
        "Yes. The value passed to next becomes the result of the suspended yield expression inside the generator.",
    },
    {
      question: "When should I choose generators over arrays?",
      answer:
        "Use generators for lazy sequences, large or infinite streams, and scenarios where you need incremental processing without eager allocation.",
    },
  ],
  relatedTopicIds: ["promises", "event-loop", "closures", "scope-chain"],
};
