import type { PromiseExample } from "./types";

export const EXAMPLES: PromiseExample[] = [
  {
    id: "resolve-reject",
    title: "Resolve & Reject",
    kind: "basic",
    description:
      "How the Promise constructor works: the executor runs synchronously, resolve() transitions state, and .then() callbacks are scheduled as microtasks.",
    codeLines: [
      { num: 1, text: "const promise = new Promise((resolve, reject) => {" },
      { num: 2, text: '  console.log("executor");' },
      { num: 3, text: '  resolve("done");' },
      { num: 4, text: "});" },
      { num: 5, text: "" },
      { num: 6, text: "promise.then((val) => {" },
      { num: 7, text: "  console.log(val);" },
      { num: 8, text: "});" },
      { num: 9, text: "" },
      { num: 10, text: 'console.log("after");' },
    ],
    steps: [
      {
        descriptionHtml:
          `<code>new Promise()</code> is called. The executor function is invoked <strong>synchronously</strong>. <code>promise</code> is created in <strong>pending</strong> state.`,
        activeLine: 1,
        doneLines: [],
        promises: [{ name: "promise", state: "pending", value: "\u2013" }],
        microtasks: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `Inside the executor: <code>console.log("executor")</code> runs immediately. The executor is not deferred \u2014 it runs as part of the <code>new Promise()</code> call.`,
        activeLine: 2,
        doneLines: [1],
        promises: [{ name: "promise", state: "pending", value: "\u2013" }],
        microtasks: [],
        consoleOutput: ["executor"],
      },
      {
        descriptionHtml:
          `<code>resolve("done")</code> is called. <code>promise</code> transitions from <strong>pending</strong> to <strong>fulfilled</strong> with value <code>"done"</code>. This is irreversible.`,
        activeLine: 3,
        doneLines: [1, 2],
        promises: [{ name: "promise", state: "fulfilled", value: '"done"' }],
        microtasks: [],
        consoleOutput: ["executor"],
      },
      {
        descriptionHtml:
          `<code>.then()</code> is registered on the already-fulfilled <code>promise</code>. Since it is resolved, the callback is immediately scheduled as a <span class="hl-micro">microtask</span>.`,
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        promises: [{ name: "promise", state: "fulfilled", value: '"done"' }],
        microtasks: ["(val) => log(val)"],
        consoleOutput: ["executor"],
      },
      {
        descriptionHtml:
          `<code>console.log("after")</code> runs synchronously. Microtasks are still waiting \u2014 synchronous code always finishes first.`,
        activeLine: 10,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        promises: [{ name: "promise", state: "fulfilled", value: '"done"' }],
        microtasks: ["(val) => log(val)"],
        consoleOutput: ["executor", "after"],
      },
      {
        descriptionHtml:
          `Synchronous code is done. The <span class="hl-micro">microtask queue</span> drains: <code>.then()</code> callback fires with <code>val = "done"</code> and logs it.`,
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6, 8, 9, 10],
        promises: [{ name: "promise", state: "fulfilled", value: '"done"' }],
        microtasks: [],
        consoleOutput: ["executor", "after", "done"],
      },
      {
        descriptionHtml:
          `<strong>Done.</strong> Output: executor \u2192 after \u2192 done. The executor ran synchronously, but <code>.then()</code> callbacks always run as <span class="hl-micro">microtasks</span> \u2014 even if the Promise is already resolved.`,
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        promises: [{ name: "promise", state: "fulfilled", value: '"done"' }],
        microtasks: [],
        consoleOutput: ["executor", "after", "done"],
      },
    ],
  },

  {
    id: "chaining",
    title: "Promise Chaining",
    kind: "chaining",
    description:
      "Each .then() returns a new Promise. Return values flow through the chain as each callback fulfills the next Promise.",
    codeLines: [
      { num: 1, text: "Promise.resolve(1)" },
      { num: 2, text: "  .then((val) => {" },
      { num: 3, text: "    console.log(val);" },
      { num: 4, text: "    return val * 2;" },
      { num: 5, text: "  })" },
      { num: 6, text: "  .then((val) => {" },
      { num: 7, text: "    console.log(val);" },
      { num: 8, text: "    return val * 2;" },
      { num: 9, text: "  })" },
      { num: 10, text: "  .then((val) => {" },
      { num: 11, text: "    console.log(val);" },
      { num: 12, text: "  });" },
    ],
    steps: [
      {
        descriptionHtml:
          `<code>Promise.resolve(1)</code> creates a Promise already fulfilled with value <code>1</code>.`,
        activeLine: 1,
        doneLines: [],
        promises: [{ name: "p1", state: "fulfilled", value: "1" }],
        microtasks: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `First <code>.then()</code> registers a callback. Since <code>p1</code> is fulfilled, the callback is queued as a <span class="hl-micro">microtask</span>. <code>.then()</code> returns a new Promise <code>p2</code> (pending).`,
        activeLine: 2,
        doneLines: [1],
        promises: [
          { name: "p1", state: "fulfilled", value: "1" },
          { name: "p2", state: "pending", value: "\u2013" },
        ],
        microtasks: ["then #1 (val=1)"],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `<span class="hl-micro">Microtask</span> runs: first callback receives <code>1</code> and logs it.`,
        activeLine: 3,
        doneLines: [1, 2, 5],
        promises: [
          { name: "p1", state: "fulfilled", value: "1" },
          { name: "p2", state: "pending", value: "\u2013" },
        ],
        microtasks: [],
        consoleOutput: ["1"],
      },
      {
        descriptionHtml:
          `Callback returns <code>1 * 2 = 2</code>. This fulfills <code>p2</code> with <code>2</code>, creating <code>p3</code> (pending) and scheduling the second <code>.then()</code> as a <span class="hl-micro">microtask</span>.`,
        activeLine: 4,
        doneLines: [1, 2, 3, 5],
        promises: [
          { name: "p1", state: "fulfilled", value: "1" },
          { name: "p2", state: "fulfilled", value: "2" },
          { name: "p3", state: "pending", value: "\u2013" },
        ],
        microtasks: ["then #2 (val=2)"],
        consoleOutput: ["1"],
      },
      {
        descriptionHtml:
          `Second callback receives <code>2</code>, logs it, returns <code>4</code>. <code>p3</code> is fulfilled with <code>4</code>. Third callback is scheduled.`,
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6, 9],
        promises: [
          { name: "p1", state: "fulfilled", value: "1" },
          { name: "p2", state: "fulfilled", value: "2" },
          { name: "p3", state: "fulfilled", value: "4" },
        ],
        microtasks: ["then #3 (val=4)"],
        consoleOutput: ["1", "2"],
      },
      {
        descriptionHtml:
          `Third callback receives <code>4</code> and logs it. No return value, so the chain ends.`,
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
        promises: [
          { name: "p1", state: "fulfilled", value: "1" },
          { name: "p2", state: "fulfilled", value: "2" },
          { name: "p3", state: "fulfilled", value: "4" },
        ],
        microtasks: [],
        consoleOutput: ["1", "2", "4"],
      },
      {
        descriptionHtml:
          `<strong>Done.</strong> Output: 1 \u2192 2 \u2192 4. Each <code>.then()</code> created a new Promise and passed its return value forward through the chain.`,
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        promises: [
          { name: "p1", state: "fulfilled", value: "1" },
          { name: "p2", state: "fulfilled", value: "2" },
          { name: "p3", state: "fulfilled", value: "4" },
        ],
        microtasks: [],
        consoleOutput: ["1", "2", "4"],
      },
    ],
  },

  {
    id: "async-await",
    title: "async/await",
    kind: "async-await",
    description:
      "async/await is syntactic sugar over Promises. await pauses the function and yields control back to the caller.",
    codeLines: [
      { num: 1, text: "async function fetchData() {" },
      { num: 2, text: '  console.log("before");' },
      { num: 3, text: '  const val = await Promise.resolve("data");' },
      { num: 4, text: "  console.log(val);" },
      { num: 5, text: "  return val;" },
      { num: 6, text: "}" },
      { num: 7, text: "" },
      { num: 8, text: "const result = fetchData();" },
      { num: 9, text: 'console.log("after");' },
    ],
    steps: [
      {
        descriptionHtml:
          `<code>fetchData()</code> is called. The async function starts executing synchronously. It implicitly returns a Promise <code>result</code> (pending).`,
        activeLine: 8,
        doneLines: [1, 6, 7],
        promises: [{ name: "result", state: "pending", value: "\u2013" }],
        microtasks: [],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `Inside <code>fetchData</code>: <code>console.log("before")</code> runs synchronously, just like in any normal function.`,
        activeLine: 2,
        doneLines: [1, 6, 7, 8],
        promises: [{ name: "result", state: "pending", value: "\u2013" }],
        microtasks: [],
        consoleOutput: ["before"],
      },
      {
        descriptionHtml:
          `<code>await Promise.resolve("data")</code> \u2014 the engine sees the resolved Promise, but <code>await</code> still pauses <code>fetchData</code> and schedules a <span class="hl-micro">microtask</span> to resume it. Execution returns to the caller.`,
        activeLine: 3,
        doneLines: [1, 2, 6, 7, 8],
        promises: [
          { name: "result", state: "pending", value: "\u2013" },
          { name: "awaited", state: "fulfilled", value: '"data"' },
        ],
        microtasks: ["resume fetchData"],
        consoleOutput: ["before"],
      },
      {
        descriptionHtml:
          `Back in the caller: <code>console.log("after")</code> runs synchronously while <code>fetchData</code> is still suspended.`,
        activeLine: 9,
        doneLines: [1, 2, 3, 6, 7, 8],
        promises: [
          { name: "result", state: "pending", value: "\u2013" },
          { name: "awaited", state: "fulfilled", value: '"data"' },
        ],
        microtasks: ["resume fetchData"],
        consoleOutput: ["before", "after"],
      },
      {
        descriptionHtml:
          `Synchronous code is done. <span class="hl-micro">Microtask</span> drains: <code>fetchData</code> resumes. <code>val</code> receives <code>"data"</code> and it is logged.`,
        activeLine: 4,
        doneLines: [1, 2, 3, 6, 7, 8, 9],
        promises: [{ name: "result", state: "pending", value: "\u2013" }],
        microtasks: [],
        consoleOutput: ["before", "after", "data"],
      },
      {
        descriptionHtml:
          `<code>return val</code> \u2014 the async function returns, which fulfills <code>result</code> with <code>"data"</code>.`,
        activeLine: 5,
        doneLines: [1, 2, 3, 4, 6, 7, 8, 9],
        promises: [{ name: "result", state: "fulfilled", value: '"data"' }],
        microtasks: [],
        consoleOutput: ["before", "after", "data"],
      },
      {
        descriptionHtml:
          `<strong>Done.</strong> Output: before \u2192 after \u2192 data. <code>await</code> pauses the async function and yields back to synchronous code, just like <code>.then()</code> schedules a microtask.`,
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        promises: [{ name: "result", state: "fulfilled", value: '"data"' }],
        microtasks: [],
        consoleOutput: ["before", "after", "data"],
      },
    ],
  },
];
