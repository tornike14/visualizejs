import type { ScopeExample } from "./types";

export const EXAMPLES: ScopeExample[] = [
  // ---- Example 1: Identifier Lookup ----
  {
    id: "identifier-lookup",
    title: "Identifier Lookup",
    kind: "lookup",
    description:
      "Step-by-step variable resolution: the engine walks from inner scope outward until the name is found or ReferenceError is thrown.",
    codeLines: [
      { num: 1, text: 'const x = "global";' },
      { num: 2, text: "" },
      { num: 3, text: "function outer() {" },
      { num: 4, text: '  const y = "outer";' },
      { num: 5, text: "" },
      { num: 6, text: "  function inner() {" },
      { num: 7, text: '    const z = "inner";' },
      { num: 8, text: "    console.log(z);" },
      { num: 9, text: "    console.log(y);" },
      { num: 10, text: "    console.log(x);" },
      { num: 11, text: "    console.log(w);" },
      { num: 12, text: "  }" },
      { num: 13, text: "  inner();" },
      { num: 14, text: "}" },
      { num: 15, text: "outer();" },
    ],
    steps: [
      // Step 0: Global scope created
      {
        descriptionHtml:
          'The global scope is created. <code>x</code> is initialized to <code>"global"</code> and <code>outer</code> is registered as a function.',
        activeLine: 1,
        doneLines: [],
        scopes: [
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "x", value: '"global"' },
              { name: "outer", value: "f()" },
            ],
            highlight: "active",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: [],
      },
      // Step 1: outer() called
      {
        descriptionHtml:
          '<code>outer()</code> is called. A new <strong>function scope</strong> is created with <code>y</code> and <code>inner</code> as local bindings.',
        activeLine: 15,
        doneLines: [1],
        scopes: [
          {
            label: "inner()",
            type: "function",
            bindings: [],
            highlight: "none",
          },
          {
            label: "outer()",
            type: "function",
            bindings: [
              { name: "y", value: '"outer"' },
              { name: "inner", value: "f()" },
            ],
            highlight: "active",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "x", value: '"global"' },
              { name: "outer", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: [],
      },
      // Step 2: inner() called - 3 scopes now visible
      {
        descriptionHtml:
          '<code>inner()</code> is called. Its scope has one local binding: <code>z</code>. The scope chain is now three levels deep: <strong>inner -> outer -> Global</strong>.',
        activeLine: 13,
        doneLines: [1, 3, 4, 15],
        scopes: [
          {
            label: "inner()",
            type: "function",
            bindings: [{ name: "z", value: '"inner"' }],
            highlight: "active",
          },
          {
            label: "outer()",
            type: "function",
            bindings: [
              { name: "y", value: '"outer"' },
              { name: "inner", value: "f()" },
            ],
            highlight: "none",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "x", value: '"global"' },
              { name: "outer", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: [],
      },
      // Step 3: console.log(z) - lookup z, check inner
      {
        descriptionHtml:
          '<code>console.log(z)</code> - the engine looks up <code>z</code>. It starts in the <strong>innermost</strong> scope: <code>inner()</code>.',
        activeLine: 8,
        doneLines: [1, 3, 4, 6, 7, 13, 15],
        scopes: [
          {
            label: "inner()",
            type: "function",
            bindings: [{ name: "z", value: '"inner"' }],
            highlight: "searching",
            activeBinding: "z",
          },
          {
            label: "outer()",
            type: "function",
            bindings: [
              { name: "y", value: '"outer"' },
              { name: "inner", value: "f()" },
            ],
            highlight: "none",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "x", value: '"global"' },
              { name: "outer", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: {
          identifier: "z",
          path: ["inner()"],
          result: "searching",
        },
        consoleOutput: [],
      },
      // Step 4: z found in inner
      {
        descriptionHtml:
          '<code>z</code> is found in <code>inner()</code> with value <code>"inner"</code>. Lookup complete - no need to check outer scopes.',
        activeLine: 8,
        doneLines: [1, 3, 4, 6, 7, 13, 15],
        scopes: [
          {
            label: "inner()",
            type: "function",
            bindings: [{ name: "z", value: '"inner"' }],
            highlight: "found",
            activeBinding: "z",
          },
          {
            label: "outer()",
            type: "function",
            bindings: [
              { name: "y", value: '"outer"' },
              { name: "inner", value: "f()" },
            ],
            highlight: "none",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "x", value: '"global"' },
              { name: "outer", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: {
          identifier: "z",
          path: ["inner()"],
          result: "found",
          foundIn: "inner()",
        },
        consoleOutput: ['"inner"'],
      },
      // Step 5: console.log(y) - lookup y, check inner (not found)
      {
        descriptionHtml:
          '<code>console.log(y)</code> - looking up <code>y</code>. Check <code>inner()</code> first - <code>y</code> is not here.',
        activeLine: 9,
        doneLines: [1, 3, 4, 6, 7, 8, 13, 15],
        scopes: [
          {
            label: "inner()",
            type: "function",
            bindings: [{ name: "z", value: '"inner"' }],
            highlight: "searching",
          },
          {
            label: "outer()",
            type: "function",
            bindings: [
              { name: "y", value: '"outer"' },
              { name: "inner", value: "f()" },
            ],
            highlight: "none",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "x", value: '"global"' },
              { name: "outer", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: {
          identifier: "y",
          path: ["inner()"],
          result: "searching",
        },
        consoleOutput: ['"inner"'],
      },
      // Step 6: y found in outer
      {
        descriptionHtml:
          'Not in <code>inner()</code>, so the engine walks up the <code>[[Scope]]</code> link to <code>outer()</code>. <code>y</code> is found here with value <code>"outer"</code>.',
        activeLine: 9,
        doneLines: [1, 3, 4, 6, 7, 8, 13, 15],
        scopes: [
          {
            label: "inner()",
            type: "function",
            bindings: [{ name: "z", value: '"inner"' }],
            highlight: "none",
          },
          {
            label: "outer()",
            type: "function",
            bindings: [
              { name: "y", value: '"outer"' },
              { name: "inner", value: "f()" },
            ],
            highlight: "found",
            activeBinding: "y",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "x", value: '"global"' },
              { name: "outer", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: 0,
        lookup: {
          identifier: "y",
          path: ["inner()", "outer()"],
          result: "found",
          foundIn: "outer()",
        },
        consoleOutput: ['"inner"', '"outer"'],
      },
      // Step 7: console.log(x) - lookup x, check inner (not found)
      {
        descriptionHtml:
          '<code>console.log(x)</code> - looking up <code>x</code>. Not in <code>inner()</code>...',
        activeLine: 10,
        doneLines: [1, 3, 4, 6, 7, 8, 9, 13, 15],
        scopes: [
          {
            label: "inner()",
            type: "function",
            bindings: [{ name: "z", value: '"inner"' }],
            highlight: "searching",
          },
          {
            label: "outer()",
            type: "function",
            bindings: [
              { name: "y", value: '"outer"' },
              { name: "inner", value: "f()" },
            ],
            highlight: "none",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "x", value: '"global"' },
              { name: "outer", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: {
          identifier: "x",
          path: ["inner()"],
          result: "searching",
        },
        consoleOutput: ['"inner"', '"outer"'],
      },
      // Step 8: x - not in outer either
      {
        descriptionHtml:
          'Not in <code>outer()</code> either. Continue walking up the chain...',
        activeLine: 10,
        doneLines: [1, 3, 4, 6, 7, 8, 9, 13, 15],
        scopes: [
          {
            label: "inner()",
            type: "function",
            bindings: [{ name: "z", value: '"inner"' }],
            highlight: "none",
          },
          {
            label: "outer()",
            type: "function",
            bindings: [
              { name: "y", value: '"outer"' },
              { name: "inner", value: "f()" },
            ],
            highlight: "searching",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "x", value: '"global"' },
              { name: "outer", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: 0,
        lookup: {
          identifier: "x",
          path: ["inner()", "outer()"],
          result: "searching",
        },
        consoleOutput: ['"inner"', '"outer"'],
      },
      // Step 9: x found in Global
      {
        descriptionHtml:
          '<code>x</code> is found in the <strong>Global</strong> scope with value <code>"global"</code>. The engine walked all three scopes to resolve this name.',
        activeLine: 10,
        doneLines: [1, 3, 4, 6, 7, 8, 9, 13, 15],
        scopes: [
          {
            label: "inner()",
            type: "function",
            bindings: [{ name: "z", value: '"inner"' }],
            highlight: "none",
          },
          {
            label: "outer()",
            type: "function",
            bindings: [
              { name: "y", value: '"outer"' },
              { name: "inner", value: "f()" },
            ],
            highlight: "none",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "x", value: '"global"' },
              { name: "outer", value: "f()" },
            ],
            highlight: "found",
            activeBinding: "x",
          },
        ],
        activeLink: 1,
        lookup: {
          identifier: "x",
          path: ["inner()", "outer()", "Global Scope"],
          result: "found",
          foundIn: "Global Scope",
        },
        consoleOutput: ['"inner"', '"outer"', '"global"'],
      },
      // Step 10: console.log(w) - lookup w, searching all scopes
      {
        descriptionHtml:
          '<code>console.log(w)</code> - looking up <code>w</code>. The engine checks <code>inner()</code>, <code>outer()</code>, and <code>Global</code>...',
        activeLine: 11,
        doneLines: [1, 3, 4, 6, 7, 8, 9, 10, 13, 15],
        scopes: [
          {
            label: "inner()",
            type: "function",
            bindings: [{ name: "z", value: '"inner"' }],
            highlight: "searching",
          },
          {
            label: "outer()",
            type: "function",
            bindings: [
              { name: "y", value: '"outer"' },
              { name: "inner", value: "f()" },
            ],
            highlight: "searching",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "x", value: '"global"' },
              { name: "outer", value: "f()" },
            ],
            highlight: "searching",
          },
        ],
        activeLink: undefined,
        lookup: {
          identifier: "w",
          path: ["inner()", "outer()", "Global Scope"],
          result: "searching",
        },
        consoleOutput: ['"inner"', '"outer"', '"global"'],
      },
      // Step 11: w - ReferenceError
      {
        descriptionHtml:
          '<code>w</code> was not found in <strong>any</strong> scope. The engine has exhausted the entire scope chain, so it throws a <code>ReferenceError: w is not defined</code>.',
        activeLine: 11,
        doneLines: [1, 3, 4, 6, 7, 8, 9, 10, 13, 15],
        scopes: [
          {
            label: "inner()",
            type: "function",
            bindings: [{ name: "z", value: '"inner"' }],
            highlight: "none",
          },
          {
            label: "outer()",
            type: "function",
            bindings: [
              { name: "y", value: '"outer"' },
              { name: "inner", value: "f()" },
            ],
            highlight: "none",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "x", value: '"global"' },
              { name: "outer", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: {
          identifier: "w",
          path: ["inner()", "outer()", "Global Scope"],
          result: "error",
        },
        consoleOutput: [
          '"inner"',
          '"outer"',
          '"global"',
          "ReferenceError: w is not defined",
        ],
      },
    ],
  },

  // ---- Example 2: Block vs Function Scope ----
  {
    id: "block-scope",
    title: "Block vs Function Scope",
    kind: "block",
    description:
      "var is function-scoped and leaks out of blocks. let and const are block-scoped and stay confined.",
    codeLines: [
      { num: 1, text: "function demo() {" },
      { num: 2, text: "  var a = 1;" },
      { num: 3, text: "  let b = 2;" },
      { num: 4, text: "" },
      { num: 5, text: "  if (true) {" },
      { num: 6, text: "    var a = 10;" },
      { num: 7, text: "    let b = 20;" },
      { num: 8, text: "    console.log(a, b);" },
      { num: 9, text: "  }" },
      { num: 10, text: "" },
      { num: 11, text: "  console.log(a, b);" },
      { num: 12, text: "}" },
      { num: 13, text: "demo();" },
    ],
    steps: [
      // Step 0: demo() called, function scope created
      {
        descriptionHtml:
          '<code>demo()</code> is called. The function scope is created with <code>var a = 1</code> and <code>let b = 2</code>.',
        activeLine: 13,
        doneLines: [],
        scopes: [
          {
            label: "demo()",
            type: "function",
            bindings: [
              { name: "a", value: "1" },
              { name: "b", value: "2" },
            ],
            highlight: "active",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [{ name: "demo", value: "f()" }],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: [],
      },
      // Step 1: var a and let b initialized
      {
        descriptionHtml:
          '<code>var a = 1</code> and <code>let b = 2</code> are initialized in the <strong>function scope</strong>. Both <code>a</code> and <code>b</code> live in <code>demo()</code>.',
        activeLine: 2,
        doneLines: [1, 13],
        scopes: [
          {
            label: "demo()",
            type: "function",
            bindings: [
              { name: "a", value: "1" },
              { name: "b", value: "2" },
            ],
            highlight: "active",
            activeBinding: "a",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [{ name: "demo", value: "f()" }],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: [],
      },
      // Step 2: Enter if block - block scope created
      {
        descriptionHtml:
          'Entering the <code>if</code> block. A new <strong>block scope</strong> is created. <code>let b = 20</code> creates a <strong>new</strong> <code>b</code> in this block scope, shadowing the outer <code>b</code>.',
        activeLine: 5,
        doneLines: [1, 2, 3, 13],
        scopes: [
          {
            label: "if { } Block",
            type: "block",
            bindings: [{ name: "b", value: "20" }],
            highlight: "active",
          },
          {
            label: "demo()",
            type: "function",
            bindings: [
              { name: "a", value: "1" },
              { name: "b", value: "2" },
            ],
            highlight: "none",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [{ name: "demo", value: "f()" }],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: [],
      },
      // Step 3: var a = 10 - overwrites function-scoped a
      {
        descriptionHtml:
          '<code>var a = 10</code> - <code>var</code> is <strong>function-scoped</strong>, so this is the <strong>same</strong> <code>a</code> in <code>demo()</code>. It overwrites <code>1</code> with <code>10</code>. Notice: <code>a</code> is in the function scope, not the block scope.',
        activeLine: 6,
        doneLines: [1, 2, 3, 5, 13],
        scopes: [
          {
            label: "if { } Block",
            type: "block",
            bindings: [{ name: "b", value: "20" }],
            highlight: "none",
          },
          {
            label: "demo()",
            type: "function",
            bindings: [
              { name: "a", value: "10" },
              { name: "b", value: "2" },
            ],
            highlight: "active",
            activeBinding: "a",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [{ name: "demo", value: "f()" }],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: [],
      },
      // Step 4: let b = 20 - new b in block scope
      {
        descriptionHtml:
          '<code>let b = 20</code> - <code>let</code> is <strong>block-scoped</strong>, so this creates a <strong>new</strong> <code>b</code> in the <code>if</code> block. The outer <code>b = 2</code> in <code>demo()</code> is untouched.',
        activeLine: 7,
        doneLines: [1, 2, 3, 5, 6, 13],
        scopes: [
          {
            label: "if { } Block",
            type: "block",
            bindings: [{ name: "b", value: "20" }],
            highlight: "active",
            activeBinding: "b",
          },
          {
            label: "demo()",
            type: "function",
            bindings: [
              { name: "a", value: "10" },
              { name: "b", value: "2" },
            ],
            highlight: "none",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [{ name: "demo", value: "f()" }],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: [],
      },
      // Step 5: console.log(a, b) inside block
      {
        descriptionHtml:
          '<code>console.log(a, b)</code> inside the block. <code>a</code> is found in the function scope (<code>10</code>). <code>b</code> is found in the block scope (<code>20</code>) - it <strong>shadows</strong> the outer <code>b</code>.',
        activeLine: 8,
        doneLines: [1, 2, 3, 5, 6, 7, 13],
        scopes: [
          {
            label: "if { } Block",
            type: "block",
            bindings: [{ name: "b", value: "20" }],
            highlight: "found",
            activeBinding: "b",
          },
          {
            label: "demo()",
            type: "function",
            bindings: [
              { name: "a", value: "10" },
              { name: "b", value: "2" },
            ],
            highlight: "found",
            activeBinding: "a",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [{ name: "demo", value: "f()" }],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: ["10, 20"],
      },
      // Step 6: Exit block - block scope destroyed
      {
        descriptionHtml:
          'The <code>if</code> block ends. The block scope is <strong>destroyed</strong> - <code>let b = 20</code> is gone. But <code>var a = 10</code> persists because <code>var</code> lives in the function scope.',
        activeLine: 9,
        doneLines: [1, 2, 3, 5, 6, 7, 8, 13],
        scopes: [
          {
            label: "demo()",
            type: "function",
            bindings: [
              { name: "a", value: "10" },
              { name: "b", value: "2" },
            ],
            highlight: "active",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [{ name: "demo", value: "f()" }],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: ["10, 20"],
      },
      // Step 7: console.log(a, b) after block
      {
        descriptionHtml:
          '<code>console.log(a, b)</code> after the block. <code>a</code> is <code>10</code> - <code>var</code> leaked the change out of the block. <code>b</code> is <code>2</code> - the block-scoped <code>b = 20</code> is gone.',
        activeLine: 11,
        doneLines: [1, 2, 3, 5, 6, 7, 8, 9, 13],
        scopes: [
          {
            label: "demo()",
            type: "function",
            bindings: [
              { name: "a", value: "10" },
              { name: "b", value: "2" },
            ],
            highlight: "found",
            activeBinding: "a",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [{ name: "demo", value: "f()" }],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: ["10, 20", "10, 2"],
      },
      // Step 8: Summary
      {
        descriptionHtml:
          '<strong>Key takeaway:</strong> <code>var</code> is function-scoped - it ignores block boundaries and can leak values. <code>let</code> and <code>const</code> are block-scoped - they are confined to the nearest <code>{ }</code> block and destroyed when it exits.',
        activeLine: null,
        doneLines: [1, 2, 3, 5, 6, 7, 8, 9, 11, 13],
        scopes: [
          {
            label: "demo()",
            type: "function",
            bindings: [
              { name: "a", value: "10" },
              { name: "b", value: "2" },
            ],
            highlight: "none",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [{ name: "demo", value: "f()" }],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: ["10, 20", "10, 2"],
      },
    ],
  },

  // ---- Example 3: Lexical Scope ----
  {
    id: "lexical-scope",
    title: "Lexical Scope",
    kind: "lexical",
    description:
      "Scope is determined by where a function is defined, not where it is called.",
    codeLines: [
      { num: 1, text: 'const name = "global";' },
      { num: 2, text: "" },
      { num: 3, text: "function greet() {" },
      { num: 4, text: "  console.log(name);" },
      { num: 5, text: "}" },
      { num: 6, text: "" },
      { num: 7, text: "function wrapper() {" },
      { num: 8, text: '  const name = "wrapper";' },
      { num: 9, text: "  greet();" },
      { num: 10, text: "}" },
      { num: 11, text: "wrapper();" },
    ],
    steps: [
      // Step 0: Global scope
      {
        descriptionHtml:
          'Global scope is created. <code>name</code>, <code>greet</code>, and <code>wrapper</code> are all registered here. <code>greet</code> is <strong>defined</strong> at the global level.',
        activeLine: 1,
        doneLines: [],
        scopes: [
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "name", value: '"global"' },
              { name: "greet", value: "f()" },
              { name: "wrapper", value: "f()" },
            ],
            highlight: "active",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: [],
      },
      // Step 1: wrapper() called
      {
        descriptionHtml:
          '<code>wrapper()</code> is called. Its scope has a local <code>name = "wrapper"</code>. This is a <strong>different</strong> <code>name</code> from the global one.',
        activeLine: 11,
        doneLines: [1, 3, 4, 5, 7, 8, 9, 10],
        scopes: [
          {
            label: "wrapper()",
            type: "function",
            bindings: [{ name: "name", value: '"wrapper"' }],
            highlight: "active",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "name", value: '"global"' },
              { name: "greet", value: "f()" },
              { name: "wrapper", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: [],
      },
      // Step 2: greet() called from inside wrapper
      {
        descriptionHtml:
          '<code>greet()</code> is called from inside <code>wrapper()</code>. But where does <code>greet</code> look for variables? Its scope chain was set when it was <strong>defined</strong> - at the global level.',
        activeLine: 9,
        doneLines: [1, 3, 4, 5, 7, 8, 10, 11],
        scopes: [
          {
            label: "greet()",
            type: "function",
            bindings: [],
            highlight: "active",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "name", value: '"global"' },
              { name: "greet", value: "f()" },
              { name: "wrapper", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: [],
      },
      // Step 3: Lookup name - searching greet()
      {
        descriptionHtml:
          '<code>console.log(name)</code> - the engine looks up <code>name</code>. It starts in <code>greet()</code>\'s own scope - no <code>name</code> here.',
        activeLine: 4,
        doneLines: [1, 3, 5, 7, 8, 9, 10, 11],
        scopes: [
          {
            label: "greet()",
            type: "function",
            bindings: [],
            highlight: "searching",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "name", value: '"global"' },
              { name: "greet", value: "f()" },
              { name: "wrapper", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: {
          identifier: "name",
          path: ["greet()"],
          result: "searching",
        },
        consoleOutput: [],
      },
      // Step 4: name found in Global (NOT wrapper)
      {
        descriptionHtml:
          'The engine walks up to <code>greet</code>\'s <strong>lexical</strong> parent - the <strong>Global</strong> scope (where <code>greet</code> was defined). It finds <code>name = "global"</code>. It does <strong>not</strong> look in <code>wrapper()</code> even though <code>wrapper</code> called <code>greet</code>.',
        activeLine: 4,
        doneLines: [1, 3, 5, 7, 8, 9, 10, 11],
        scopes: [
          {
            label: "greet()",
            type: "function",
            bindings: [],
            highlight: "none",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "name", value: '"global"' },
              { name: "greet", value: "f()" },
              { name: "wrapper", value: "f()" },
            ],
            highlight: "found",
            activeBinding: "name",
          },
        ],
        activeLink: 0,
        lookup: {
          identifier: "name",
          path: ["greet()", "Global Scope"],
          result: "found",
          foundIn: "Global Scope",
        },
        consoleOutput: ['"global"'],
      },
      // Step 5: Contrast with wrapper's name
      {
        descriptionHtml:
          '<code>wrapper()</code> has its own <code>name = "wrapper"</code>, but <code>greet()</code> never sees it. In JavaScript, the scope chain follows the <strong>definition site</strong> (lexical scope), not the <strong>call site</strong> (dynamic scope).',
        activeLine: null,
        doneLines: [1, 3, 4, 5, 7, 8, 9, 10, 11],
        scopes: [
          {
            label: "greet()",
            type: "function",
            bindings: [],
            highlight: "none",
          },
          {
            label: "wrapper()",
            type: "function",
            bindings: [{ name: "name", value: '"wrapper"' }],
            highlight: "none",
          },
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "name", value: '"global"' },
              { name: "greet", value: "f()" },
              { name: "wrapper", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: ['"global"'],
      },
      // Step 6: Key takeaway
      {
        descriptionHtml:
          '<strong>Key takeaway:</strong> JavaScript uses <strong>lexical scoping</strong>. A function\'s scope chain is determined at <strong>definition time</strong>, not call time. This is the foundation of closures - and the opposite of how <code>this</code> works (which is determined by the call site).',
        activeLine: null,
        doneLines: [1, 3, 4, 5, 7, 8, 9, 10, 11],
        scopes: [
          {
            label: "Global Scope",
            type: "global",
            bindings: [
              { name: "name", value: '"global"' },
              { name: "greet", value: "f()" },
              { name: "wrapper", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        activeLink: undefined,
        lookup: null,
        consoleOutput: ['"global"'],
      },
    ],
  },
];
