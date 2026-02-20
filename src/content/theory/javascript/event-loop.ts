import type { TopicTheoryContent } from "@/content/theory/types";

export const eventLoopTheory: TopicTheoryContent = {
  summary:
    "The JavaScript event loop coordinates synchronous code, microtasks, and macrotasks so one thread can handle many async workflows without blocking UI updates.",
  whatItIs: [
    "JavaScript in the browser runs on a single call stack for regular code execution. When async work is scheduled, JavaScript delegates that work to browser or runtime APIs and keeps executing other code.",
    "The event loop continuously checks whether the call stack is empty. If it is empty, it first flushes the microtask queue, then takes the next macrotask, and repeats this cycle.",
    "This model is why JavaScript can feel concurrent even though most user code is single-threaded. Understanding queue priority explains why Promise callbacks can run before setTimeout callbacks.",
  ],
  howItWorks: [
    "Step 1: synchronous code executes immediately on the call stack in top-to-bottom order.",
    "Step 2: async operations register callbacks. For example, setTimeout queues a macrotask after its delay, while Promise.then queues a microtask once resolved.",
    "Step 3: when the call stack is empty, the event loop drains all pending microtasks before pulling one macrotask.",
    "Step 4: after each macrotask, the runtime can render updates, then starts the cycle again with microtasks first.",
  ],
  commonMistakes: [
    {
      title: "Assuming setTimeout(0) runs immediately",
      explanation:
        "setTimeout(0) still waits for the current call stack and queued microtasks to finish. It only runs when the loop reaches the macrotask queue.",
      fix: "Use queueMicrotask or Promise.resolve().then only when microtask priority is truly required.",
    },
    {
      title: "Creating infinite microtask chains",
      explanation:
        "Recursively scheduling microtasks can starve rendering and user input because the loop must drain microtasks before macrotasks and paint.",
      fix: "Break heavy work into chunks with macrotasks or requestAnimationFrame to keep the UI responsive.",
    },
    {
      title: "Blocking the main thread with long sync work",
      explanation:
        "Long loops or expensive parsing block the stack, so no queued callbacks or paint steps can run until the work completes.",
      fix: "Split heavy work, defer non-critical tasks, or move compute-heavy logic to Web Workers.",
    },
  ],
  interviewQuestions: [
    {
      question: "Why does Promise.then run before setTimeout callbacks?",
      answer:
        "Promise.then uses the microtask queue, which is drained before the event loop processes the next macrotask such as setTimeout.",
      codeExample: {
        language: "javascript",
        code: `console.log("A");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("microtask"));
console.log("B");
// Order: A, B, microtask, timeout`,
      },
    },
    {
      question: "Does setTimeout delay guarantee exact execution time?",
      answer:
        "No. The delay is a minimum threshold. Actual execution depends on call stack load, queue backlog, and timer clamping rules.",
    },
    {
      question: "When should I prefer requestAnimationFrame?",
      answer:
        "Use requestAnimationFrame for visual updates tied to painting. It aligns work with browser render timing for smoother animations.",
    },
    {
      question: "Can async/await avoid event loop behavior?",
      answer:
        "No. async/await is syntax over Promises, so continuation after await still resumes through microtasks.",
    },
  ],
  relatedTopicIds: ["promises", "closures", "scope-chain", "heap-stack"],
};
