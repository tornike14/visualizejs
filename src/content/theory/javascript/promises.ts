import type { TopicTheoryContent } from "@/content/theory/types";

export const promisesTheory: TopicTheoryContent = {
  summary:
    "Promises represent the eventual result of asynchronous work, enabling deterministic chaining, centralized error handling, and readable async flows with async and await.",
  whatItIs: [
    "A Promise has three states: pending, fulfilled, and rejected. Once settled, its state and value are immutable.",
    "Handlers registered with then, catch, and finally do not run immediately. They are queued as microtasks and executed after the current call stack clears.",
    "Promises allow composition of async operations so data flow and failure paths are explicit instead of deeply nested callbacks.",
  ],
  howItWorks: [
    "Step 1: async code returns or creates a Promise that starts in pending state.",
    "Step 2: when async work completes, the Promise settles by calling resolve or reject.",
    "Step 3: queued handlers run as microtasks and may return values or new Promises.",
    "Step 4: the chain continues with propagated results or errors until handled.",
  ],
  commonMistakes: [
    {
      title: "Not returning inside then chains",
      explanation:
        "If a then callback starts async work but does not return the Promise, the outer chain continues early and loses proper sequencing.",
      fix: "Always return the next value or Promise from then callbacks.",
    },
    {
      title: "Mixing async styles without error propagation",
      explanation:
        "Combining then chains and async/await carelessly can create unhandled rejections or swallowed errors.",
      fix: "Use one style consistently per flow and ensure errors are handled with catch or try/catch.",
    },
    {
      title: "Wrapping existing Promises in new Promise unnecessarily",
      explanation:
        "Manual wrapping adds complexity and increases risk of never resolving or rejecting correctly.",
      fix: "Prefer direct chaining and Promise utilities like Promise.all, allSettled, and race.",
    },
  ],
  interviewQuestions: [
    {
      question: "Why do Promise callbacks run before setTimeout callbacks?",
      answer:
        "Promise handlers are microtasks, and the event loop drains microtasks before moving to the next macrotask queue item like setTimeout.",
      codeExample: {
        language: "javascript",
        code: `Promise.resolve()
  .then(() => "A")
  .then((value) => console.log(value))
  .catch((error) => console.error(error));`,
      },
    },
    {
      question: "Does catch handle errors thrown in then callbacks?",
      answer:
        "Yes. Thrown errors in then callbacks reject the next Promise in the chain, and catch can handle that rejection.",
    },
    {
      question: "What is the difference between Promise.all and Promise.allSettled?",
      answer:
        "Promise.all fails fast on the first rejection, while Promise.allSettled waits for all Promises and returns each outcome.",
    },
    {
      question: "Does async/await replace Promises?",
      answer:
        "No. async/await is syntax built on top of Promises; underlying scheduling and resolution behavior still follows Promise rules.",
    },
  ],
  relatedTopicIds: ["event-loop", "closures", "generators", "type-coercion"],
};
