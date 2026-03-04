import type { GeneratorExample } from "./types";

export const EXAMPLES: GeneratorExample[] = [
  /* ─── Example 1: Basic yield ─── */
  {
    id: "basic-yield",
    title: "Basic yield",
    kind: "basic",
    description:
      "A generator function creates a pausable iterator. Each .next() call resumes execution until the next yield.",
    codeLines: [
      { num: 1, text: "function* counter() {" },
      { num: 2, text: "  yield 1;" },
      { num: 3, text: "  yield 2;" },
      { num: 4, text: "  yield 3;" },
      { num: 5, text: "}" },
      { num: 6, text: "" },
      { num: 7, text: "const gen = counter();" },
      { num: 8, text: "console.log(gen.next());" },
      { num: 9, text: "console.log(gen.next());" },
      { num: 10, text: "console.log(gen.next());" },
      { num: 11, text: "console.log(gen.next());" },
    ],
    steps: [
      {
        descriptionHtml:
          'The engine registers the <code>counter</code> generator function (<code>function*</code>). The body is <strong>not</strong> executed yet.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        generatorState: null,
        callFlow: [],
      },
      {
        descriptionHtml:
          '<code>counter()</code> is called. Unlike a normal function, the body does <strong>not</strong> execute. Instead, a <span class="hl-task">generator object</span> is returned in <strong>suspended</strong> state.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: [],
        generatorState: { status: "created", done: false },
        callFlow: [],
      },
      {
        descriptionHtml:
          '<span class="hl-api">gen.next()</span> resumes the generator. Execution enters the function body and runs until <code>yield 1</code>. The generator <span class="hl-task">pauses</span> and returns <span class="hl-micro">{ value: 1, done: false }</span>.',
        activeLine: 2,
        doneLines: [1, 5, 7],
        consoleOutput: ["{ value: 1, done: false }"],
        generatorState: {
          status: "suspended",
          yieldValue: "1",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          'Second <span class="hl-api">gen.next()</span> resumes from where the generator paused. Execution continues past <code>yield 1</code> and pauses at <code>yield 2</code>.',
        activeLine: 3,
        doneLines: [1, 2, 5, 7, 8],
        consoleOutput: [
          "{ value: 1, done: false }",
          "{ value: 2, done: false }",
        ],
        generatorState: {
          status: "suspended",
          yieldValue: "2",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: "gen.next()",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          'Third <span class="hl-api">gen.next()</span> resumes from <code>yield 2</code> and pauses at <code>yield 3</code>. Each yield is like a checkpoint the generator returns to.',
        activeLine: 4,
        doneLines: [1, 2, 3, 5, 7, 8, 9],
        consoleOutput: [
          "{ value: 1, done: false }",
          "{ value: 2, done: false }",
          "{ value: 3, done: false }",
        ],
        generatorState: {
          status: "suspended",
          yieldValue: "3",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: "gen.next()",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: "gen.next()",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          'Fourth <span class="hl-api">gen.next()</span> resumes from <code>yield 3</code>. No more <code>yield</code> statements remain, so the generator <strong>completes</strong>. The result is <span class="hl-micro">{ value: undefined, done: true }</span>.',
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 7, 8, 9, 10],
        consoleOutput: [
          "{ value: 1, done: false }",
          "{ value: 2, done: false }",
          "{ value: 3, done: false }",
          "{ value: undefined, done: true }",
        ],
        generatorState: {
          status: "completed",
          yieldValue: "undefined",
          done: true,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: "gen.next()",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: "gen.next()",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
          {
            id: 4,
            caller: "gen.next()",
            response: "{ value: undefined, done: true }",
            direction: "return",
          },
        ],
      },
      {
        descriptionHtml:
          '<strong>Done.</strong> Each <span class="hl-api">.next()</span> resumed the generator until the next <span class="hl-task">yield</span>. After the last yield, <code>done: true</code> signals the generator is exhausted. Calling <code>.next()</code> again always returns <span class="hl-micro">{ value: undefined, done: true }</span>.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        consoleOutput: [
          "{ value: 1, done: false }",
          "{ value: 2, done: false }",
          "{ value: 3, done: false }",
          "{ value: undefined, done: true }",
        ],
        generatorState: {
          status: "completed",
          yieldValue: "undefined",
          done: true,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: "gen.next()",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: "gen.next()",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
          {
            id: 4,
            caller: "gen.next()",
            response: "{ value: undefined, done: true }",
            direction: "return",
          },
        ],
      },
    ],
  },

  /* ─── Example 2: Two-way Data Flow ─── */
  {
    id: "two-way-data",
    title: "Two-way Data Flow",
    kind: "data-flow",
    description:
      "Values flow OUT via yield and IN via .next(arg). The argument to .next() becomes the result of the yield expression.",
    codeLines: [
      { num: 1, text: "function* conversation() {" },
      { num: 2, text: '  const name = yield "What is your name?";' },
      { num: 3, text: "  const age = yield `Hello, ${name}!`;" },
      { num: 4, text: "  return `${name} is ${age}`;" },
      { num: 5, text: "}" },
      { num: 6, text: "" },
      { num: 7, text: "const gen = conversation();" },
      { num: 8, text: "console.log(gen.next());" },
      { num: 9, text: 'console.log(gen.next("Alice"));' },
      { num: 10, text: "console.log(gen.next(25));" },
    ],
    steps: [
      {
        descriptionHtml:
          'The <code>conversation</code> generator function is declared. It uses <code>yield</code> both to send values <strong>out</strong> and receive values <strong>in</strong>.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        generatorState: null,
        callFlow: [],
      },
      {
        descriptionHtml:
          '<code>conversation()</code> creates a <span class="hl-task">generator object</span>. The function body has not started yet. The generator is in <strong>suspended</strong> state, waiting for the first <span class="hl-api">.next()</span>.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: [],
        generatorState: { status: "created", done: false },
        callFlow: [],
      },
      {
        descriptionHtml:
          'First <span class="hl-api">gen.next()</span> starts the body. Execution runs until <code>yield "What is your name?"</code>. The string flows <strong>out</strong> as the value. Any argument to the first <code>.next()</code> is ignored because there is no <code>yield</code> waiting to receive it.',
        activeLine: 2,
        doneLines: [1, 5, 7],
        consoleOutput: ['{ value: "What is your name?", done: false }'],
        generatorState: {
          status: "suspended",
          yieldValue: '"What is your name?"',
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: '{ value: "What is your name?", done: false }',
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          '<span class="hl-api">gen.next("Alice")</span> resumes. The argument <code>"Alice"</code> flows <strong>into</strong> the generator and becomes the result of the paused <code>yield</code> expression. So <code>name</code> is set to <code>"Alice"</code>. Execution continues to the next <code>yield</code>, sending <code>"Hello, Alice!"</code> <strong>out</strong>.',
        activeLine: 3,
        doneLines: [1, 2, 5, 7, 8],
        consoleOutput: [
          '{ value: "What is your name?", done: false }',
          '{ value: "Hello, Alice!", done: false }',
        ],
        generatorState: {
          status: "suspended",
          nextArg: '"Alice"',
          yieldValue: '"Hello, Alice!"',
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: '{ value: "What is your name?", done: false }',
            direction: "yield",
          },
          {
            id: 2,
            caller: 'gen.next("Alice")',
            response: '{ value: "Hello, Alice!", done: false }',
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          '<span class="hl-api">gen.next(25)</span> resumes. <code>25</code> flows <strong>in</strong> and is assigned to <code>age</code>. The <code>return</code> statement completes the generator with <span class="hl-micro">{ value: "Alice is 25", done: true }</span>. The <code>done: true</code> flag signals the generator is finished.',
        activeLine: 4,
        doneLines: [1, 2, 3, 5, 7, 8, 9],
        consoleOutput: [
          '{ value: "What is your name?", done: false }',
          '{ value: "Hello, Alice!", done: false }',
          '{ value: "Alice is 25", done: true }',
        ],
        generatorState: {
          status: "completed",
          nextArg: "25",
          yieldValue: '"Alice is 25"',
          done: true,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: '{ value: "What is your name?", done: false }',
            direction: "yield",
          },
          {
            id: 2,
            caller: 'gen.next("Alice")',
            response: '{ value: "Hello, Alice!", done: false }',
            direction: "yield",
          },
          {
            id: 3,
            caller: "gen.next(25)",
            response: '{ value: "Alice is 25", done: true }',
            direction: "return",
          },
        ],
      },
      {
        descriptionHtml:
          '<strong>Done.</strong> Generators enable <strong>two-way communication</strong>: <span class="hl-task">yield</span> sends values out, while arguments to <span class="hl-api">.next(arg)</span> send values in. The first <code>.next()</code> starts the generator; subsequent calls resume it with a value. <code>return</code> completes the generator with <code>done: true</code>.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        consoleOutput: [
          '{ value: "What is your name?", done: false }',
          '{ value: "Hello, Alice!", done: false }',
          '{ value: "Alice is 25", done: true }',
        ],
        generatorState: {
          status: "completed",
          yieldValue: '"Alice is 25"',
          done: true,
        },
        callFlow: [
          {
            id: 1,
            caller: "gen.next()",
            response: '{ value: "What is your name?", done: false }',
            direction: "yield",
          },
          {
            id: 2,
            caller: 'gen.next("Alice")',
            response: '{ value: "Hello, Alice!", done: false }',
            direction: "yield",
          },
          {
            id: 3,
            caller: "gen.next(25)",
            response: '{ value: "Alice is 25", done: true }',
            direction: "return",
          },
        ],
      },
    ],
  },

  /* ─── Example 3: Iterator Protocol ─── */
  {
    id: "iterator-protocol",
    title: "Iterator Protocol",
    kind: "iterator",
    description:
      "Generators automatically implement the iterator protocol, making them consumable by for...of loops.",
    codeLines: [
      { num: 1, text: "function* range(start, end) {" },
      { num: 2, text: "  for (let i = start; i <= end; i++) {" },
      { num: 3, text: "    yield i;" },
      { num: 4, text: "  }" },
      { num: 5, text: "}" },
      { num: 6, text: "" },
      { num: 7, text: "for (const num of range(1, 3)) {" },
      { num: 8, text: "  console.log(num);" },
      { num: 9, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          'The <code>range</code> generator function is declared. Generators automatically implement the <span class="hl-loop">iterator protocol</span> (both <code>Symbol.iterator</code> and <code>.next()</code>), making them usable with <code>for...of</code>.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        generatorState: null,
        callFlow: [],
      },
      {
        descriptionHtml:
          'The <span class="hl-loop">for...of</span> loop calls <code>range(1, 3)</code>, creating a generator object. Behind the scenes, the loop calls <code>[Symbol.iterator]()</code> on the generator and begins calling <span class="hl-api">.next()</span> on each iteration.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: [],
        generatorState: { status: "created", done: false },
        callFlow: [],
      },
      {
        descriptionHtml:
          'First iteration: the loop calls <span class="hl-api">.next()</span> internally. The generator enters the <code>for</code> loop with <code>i = 1</code> and hits <code>yield 1</code>. The value <code>1</code> is assigned to <code>num</code>.',
        activeLine: 3,
        doneLines: [1, 5, 7],
        consoleOutput: [],
        generatorState: {
          status: "suspended",
          yieldValue: "1",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(num)</code> outputs <code>1</code>. The <span class="hl-loop">for...of</span> loop body executes with the yielded value.',
        activeLine: 8,
        doneLines: [1, 2, 3, 5, 7],
        consoleOutput: ["1"],
        generatorState: {
          status: "suspended",
          yieldValue: "1",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          'Second iteration: <span class="hl-api">.next()</span> resumes the generator. The internal <code>for</code> loop increments <code>i</code> to <code>2</code> and hits <code>yield 2</code>.',
        activeLine: 3,
        doneLines: [1, 2, 5, 7, 8],
        consoleOutput: ["1"],
        generatorState: {
          status: "suspended",
          yieldValue: "2",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: ".next()  [for...of]",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          "<code>console.log(num)</code> outputs <code>2</code>.",
        activeLine: 8,
        doneLines: [1, 2, 3, 5, 7],
        consoleOutput: ["1", "2"],
        generatorState: {
          status: "suspended",
          yieldValue: "2",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: ".next()  [for...of]",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          'Third iteration: the generator resumes, <code>i</code> increments to <code>3</code>, and <code>yield 3</code> pauses execution.',
        activeLine: 3,
        doneLines: [1, 2, 5, 7, 8],
        consoleOutput: ["1", "2"],
        generatorState: {
          status: "suspended",
          yieldValue: "3",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: ".next()  [for...of]",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: ".next()  [for...of]",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          "<code>console.log(num)</code> outputs <code>3</code>.",
        activeLine: 8,
        doneLines: [1, 2, 3, 5, 7],
        consoleOutput: ["1", "2", "3"],
        generatorState: {
          status: "suspended",
          yieldValue: "3",
          done: false,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: ".next()  [for...of]",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: ".next()  [for...of]",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
        ],
      },
      {
        descriptionHtml:
          'The loop calls <span class="hl-api">.next()</span> again. The generator resumes, <code>i</code> becomes <code>4</code>, the condition <code>4 &lt;= 3</code> is false, so the function exits. The result is <span class="hl-micro">{ value: undefined, done: true }</span>. The <span class="hl-loop">for...of</span> loop sees <code>done: true</code> and <strong>stops iterating</strong>.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 8],
        consoleOutput: ["1", "2", "3"],
        generatorState: {
          status: "completed",
          yieldValue: "undefined",
          done: true,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: ".next()  [for...of]",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: ".next()  [for...of]",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
          {
            id: 4,
            caller: ".next()  [for...of]",
            response: "{ value: undefined, done: true }",
            direction: "return",
          },
        ],
      },
      {
        descriptionHtml:
          '<strong>Done.</strong> Output: 1, 2, 3. The <span class="hl-loop">for...of</span> loop automatically calls <span class="hl-api">.next()</span> and extracts the <code>value</code> on each iteration. When <code>done: true</code> is returned, the loop exits. This is the <strong>iterator protocol</strong> in action \u2014 generators implement it for free.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        consoleOutput: ["1", "2", "3"],
        generatorState: {
          status: "completed",
          yieldValue: "undefined",
          done: true,
        },
        callFlow: [
          {
            id: 1,
            caller: ".next()  [for...of]",
            response: "{ value: 1, done: false }",
            direction: "yield",
          },
          {
            id: 2,
            caller: ".next()  [for...of]",
            response: "{ value: 2, done: false }",
            direction: "yield",
          },
          {
            id: 3,
            caller: ".next()  [for...of]",
            response: "{ value: 3, done: false }",
            direction: "yield",
          },
          {
            id: 4,
            caller: ".next()  [for...of]",
            response: "{ value: undefined, done: true }",
            direction: "return",
          },
        ],
      },
    ],
  },
];
