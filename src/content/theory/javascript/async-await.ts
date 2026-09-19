import type { TopicTheoryContent } from "@/content/theory/types";

export const asyncAwaitTheory: TopicTheoryContent = {
  summary:
    "async/await is syntax that lets a function pause on a promise and resume later without callbacks. Under the hood it is promise.then plus a suspended stack frame, scheduled through the microtask queue.",
  whatItIs: [
    "An async function is a normal function with two guarantees: it always returns a promise, and it can use await inside its body. Callers get a promise immediately, even if the body has not finished, and the eventual return value or thrown error becomes that promise's fulfillment value or rejection reason.",
    "await takes any value, converts it to a promise, and suspends the function until that promise settles. The engine saves the current stack frame, registers the rest of the function as the promise's reaction, and returns control to whoever called the async function. When the promise settles, the reaction runs as a microtask and the frame is restored with the awaited value in place of the await expression.",
    "The mechanism is the same one generators use. A generator pauses on yield and resumes on next(); an async function pauses on await and is resumed by a promise reaction. Early transpilers literally compiled async/await into a generator driven by a promise loop, and V8's implementation still shares the suspend and resume machinery.",
    "Because resumption happens through microtasks, async code interleaves with other work at predictable points. Everything before the first await runs synchronously on the caller's stack. Everything after runs later, after the current synchronous code finishes and before any timer or I/O callback, because the event loop drains the microtask queue between tasks.",
  ],
  howItWorks: [
    "Step 1: calling an async function creates its result promise, then runs the body synchronously on the current call stack. Any code before the first await, including side effects and console output, executes right away.",
    "Step 2: at an await, the operand is passed through PromiseResolve. A native promise is used as is; a non-promise such as null or a number is wrapped in an already fulfilled promise, so awaiting a plain value still suspends and still costs one microtask tick.",
    "Step 3: the engine attaches the continuation to that promise as a reaction, saves the stack frame, and returns the pending result promise to the caller. The caller keeps running as if the function had returned normally.",
    "Step 4: when the awaited promise settles, its reaction job is queued in the microtask queue. The event loop runs it after the current task completes and before picking up the next task, restoring the frame and resuming execution after the await.",
    "Step 5: if the awaited promise rejected, resumption throws the rejection reason at the await expression. A surrounding try/catch inside the async function catches it exactly as it would a synchronous throw.",
    "Step 6: when the body returns, the result promise resolves with the return value. Returning a promise makes the result promise adopt it, which takes extra microtask ticks. Throwing rejects the result promise, and a rejection nobody handles is reported by the host as an unhandled rejection.",
  ],
  commonMistakes: [
    {
      title: "Awaiting independent calls in sequence",
      explanation:
        "Writing const a = await f(); const b = await g(); means g() does not even start until f() has settled. Two 100 ms requests take 200 ms, because each timer is created only after the previous await resumes.",
      fix: "Start every independent promise first, then await them together with Promise.all (or Promise.allSettled when partial failure is acceptable). Reserve sequential awaits for calls that depend on earlier results.",
    },
    {
      title: "Forgetting to await or catch",
      explanation:
        "Calling an async function without await and without .catch discards its promise. If that promise rejects, the error never reaches any handler, the host reports an unhandled rejection, and Node exits with a non-zero code by default.",
      fix: "Either await the call inside a try/catch, attach .catch at the call site, or deliberately mark it with void and a catch handler when fire-and-forget is intended.",
    },
    {
      title: "return promise instead of return await inside try",
      explanation:
        "return fetchData() inside a try block returns the promise without inspecting it. The try completes normally, the catch never runs, and the rejection is only visible to the caller. Adopting the returned promise also costs extra microtask ticks compared with awaiting it.",
      fix: "Use return await when the function has a try/catch or finally that must observe the rejection. Outside of try blocks, plain return promise is fine and marginally cheaper.",
    },
    {
      title: "Assuming await blocks the thread",
      explanation:
        "await suspends only the async function it appears in. The caller, other tasks, and other async functions keep running. Code that reads shared state after an await may see values changed by something that ran in between.",
      fix: "Treat every await as a point where other code can run. Re-read state after resuming rather than caching it before the await, and avoid holding assumptions across suspension points.",
    },
  ],
  interviewQuestions: [
    {
      question:
        "What does an async function return, and when does its body start running?",
      answer:
        "It always returns a promise. The body starts immediately and runs synchronously on the caller's stack until the first await. Only then does the function suspend and hand a pending promise back to the caller.",
      codeExample: {
        language: "javascript",
        code: `console.log('A');
async function run() {
  console.log('B');
  await null;
  console.log('C');
}
run();
console.log('D');
// A, B, D, C`,
      },
    },
    {
      question: "Why does await null still yield to the caller?",
      answer:
        "await wraps its operand with PromiseResolve, so a non-promise becomes an already fulfilled promise. The continuation is still scheduled as a microtask rather than running inline, so the function suspends for one tick even though there was nothing to wait for.",
    },
    {
      question: "How does async/await relate to generators?",
      answer:
        "Both suspend a stack frame and resume it later. A generator pauses at yield and is resumed by next(); an async function pauses at await and is resumed by a promise reaction. async/await can be expressed as a generator driven by a loop that awaits each yielded promise, and that is how early transpilers implemented it.",
      codeExample: {
        language: "javascript",
        code: `function run(gen) {
  const it = gen();
  const step = (value) => {
    const { value: p, done } = it.next(value);
    return done ? p : Promise.resolve(p).then(step);
  };
  return step();
}
run(function* () {
  const a = yield fetchUser(1);
  console.log(a);
});`,
      },
    },
    {
      question: "When does return await matter?",
      answer:
        "Inside a try/catch or finally. return promise exits the try before the promise settles, so a rejection skips the local catch and surfaces to the caller instead. return await rethrows the rejection at the await, where the catch can handle it.",
      codeExample: {
        language: "javascript",
        code: `async function leaky() {
  try { return fail(); } catch { /* never runs */ }
}
async function safe() {
  try { return await fail(); } catch (e) { return 'handled'; }
}`,
      },
    },
    {
      question:
        "Two independent requests each take 100 ms. How long do sequential awaits take versus Promise.all, and why?",
      answer:
        "Sequential awaits take about 200 ms because the second request is not created until the first has resolved. Promise.all takes about 100 ms because both requests are started before the function suspends, so their timers overlap and the total is the slowest one.",
    },
  ],
  relatedTopicIds: ["promises", "event-loop", "generators", "closures"],
};
