import type { SpreadRestExample } from "./types";

/* ── Example Data ── */

export const EXAMPLES: SpreadRestExample[] = [
  /* ── 1. Array Spread ── */
  {
    id: "array-spread",
    title: "Array Spread",
    description:
      "Expand array elements into a new array, combine arrays, or pass elements as function arguments.",
    kind: "array-spread",
    codeLines: [
      { num: 1, text: 'const fruits = ["apple", "banana"];' },
      { num: 2, text: 'const vegs = ["carrot", "pea"];' },
      { num: 3, text: "const all = [...fruits, ...vegs];" },
      { num: 4, text: "const copy = [...fruits];" },
      { num: 5, text: 'copy.push("cherry");' },
      { num: 6, text: "console.log(all);" },
      { num: 7, text: "console.log(fruits);" },
      { num: 8, text: "console.log(copy);" },
    ],
    steps: [
      {
        descriptionHtml:
          'Creates the <code>fruits</code> array with <code>"apple"</code> and <code>"banana"</code>.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        bindings: [
          { name: "fruits", value: '["apple", "banana"]', isNew: true, tone: "amber" },
        ],
      },
      {
        descriptionHtml:
          'Creates the <code>vegs</code> array with <code>"carrot"</code> and <code>"pea"</code>.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        bindings: [
          { name: "fruits", value: '["apple", "banana"]', isNew: false, tone: "amber" },
          { name: "vegs", value: '["carrot", "pea"]', isNew: true, tone: "cyan" },
        ],
      },
      {
        descriptionHtml:
          "<code>[...fruits, ...vegs]</code> <strong>spreads</strong> both arrays into a new one. Each <code>...</code> expands the array elements in place, creating a combined array of four elements.",
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: [],
        bindings: [
          { name: "fruits", value: '["apple", "banana"]', isNew: false, tone: "amber" },
          { name: "vegs", value: '["carrot", "pea"]', isNew: false, tone: "cyan" },
          { name: "all", value: '["apple", "banana", "carrot", "pea"]', isNew: true, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          "<code>[...fruits]</code> creates a <strong>shallow copy</strong> of the array. The new <code>copy</code> array has the same elements but is a separate array object.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: [],
        bindings: [
          { name: "fruits", value: '["apple", "banana"]', isNew: false, tone: "amber" },
          { name: "vegs", value: '["carrot", "pea"]', isNew: false, tone: "cyan" },
          { name: "all", value: '["apple", "banana", "carrot", "pea"]', isNew: false, tone: "emerald" },
          { name: "copy", value: '["apple", "banana"]', isNew: true, tone: "violet" },
        ],
      },
      {
        descriptionHtml:
          '<code>copy.push("cherry")</code> mutates only <code>copy</code>. Since the spread created a new array, <code>fruits</code> is unaffected.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: [],
        bindings: [
          { name: "fruits", value: '["apple", "banana"]', isNew: false, tone: "amber" },
          { name: "vegs", value: '["carrot", "pea"]', isNew: false, tone: "cyan" },
          { name: "all", value: '["apple", "banana", "carrot", "pea"]', isNew: false, tone: "emerald" },
          { name: "copy", value: '["apple", "banana", "cherry"]', isNew: true, tone: "violet" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(all)</code> shows all four elements from the combined spread.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["[apple, banana, carrot, pea]"],
        bindings: [
          { name: "fruits", value: '["apple", "banana"]', isNew: false, tone: "amber" },
          { name: "vegs", value: '["carrot", "pea"]', isNew: false, tone: "cyan" },
          { name: "all", value: '["apple", "banana", "carrot", "pea"]', isNew: false, tone: "emerald" },
          { name: "copy", value: '["apple", "banana", "cherry"]', isNew: false, tone: "violet" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(fruits)</code> still shows <code>["apple", "banana"]</code>. The original array was never modified.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ["[apple, banana, carrot, pea]", "[apple, banana]"],
        bindings: [
          { name: "fruits", value: '["apple", "banana"]', isNew: false, tone: "amber" },
          { name: "vegs", value: '["carrot", "pea"]', isNew: false, tone: "cyan" },
          { name: "all", value: '["apple", "banana", "carrot", "pea"]', isNew: false, tone: "emerald" },
          { name: "copy", value: '["apple", "banana", "cherry"]', isNew: false, tone: "violet" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(copy)</code> shows the three-element copy. <strong>Key takeaway:</strong> array spread expands elements into a new array. It creates a shallow copy, so the original is not mutated.',
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        consoleOutput: ["[apple, banana, carrot, pea]", "[apple, banana]", "[apple, banana, cherry]"],
        bindings: [
          { name: "fruits", value: '["apple", "banana"]', isNew: false, tone: "amber" },
          { name: "vegs", value: '["carrot", "pea"]', isNew: false, tone: "cyan" },
          { name: "all", value: '["apple", "banana", "carrot", "pea"]', isNew: false, tone: "emerald" },
          { name: "copy", value: '["apple", "banana", "cherry"]', isNew: false, tone: "violet" },
        ],
      },
    ],
  },

  /* ── 2. Object Spread ── */
  {
    id: "object-spread",
    title: "Object Spread",
    description:
      "Merge object properties into a new object. Later properties override earlier ones.",
    kind: "object-spread",
    codeLines: [
      { num: 1, text: 'const defaults = { theme: "light", lang: "en" };' },
      { num: 2, text: 'const prefs = { theme: "dark", fontSize: 14 };' },
      { num: 3, text: "const config = { ...defaults, ...prefs };" },
      { num: 4, text: 'const updated = { ...config, lang: "fr" };' },
      { num: 5, text: "console.log(config);" },
      { num: 6, text: "console.log(updated);" },
      { num: 7, text: "console.log(defaults);" },
    ],
    steps: [
      {
        descriptionHtml:
          'Creates <code>defaults</code> with <code>theme: "light"</code> and <code>lang: "en"</code>.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        bindings: [
          { name: "defaults", value: '{ theme: "light", lang: "en" }', isNew: true, tone: "amber" },
        ],
      },
      {
        descriptionHtml:
          'Creates <code>prefs</code> with <code>theme: "dark"</code> and <code>fontSize: 14</code>. Notice both objects have a <code>theme</code> property.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        bindings: [
          { name: "defaults", value: '{ theme: "light", lang: "en" }', isNew: false, tone: "amber" },
          { name: "prefs", value: '{ theme: "dark", fontSize: 14 }', isNew: true, tone: "cyan" },
        ],
      },
      {
        descriptionHtml:
          '<code>{ ...defaults, ...prefs }</code> merges both objects. Properties are copied left to right. <code>prefs.theme</code> (<code>"dark"</code>) <strong>overrides</strong> <code>defaults.theme</code> (<code>"light"</code>) because it comes later.',
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: [],
        bindings: [
          { name: "defaults", value: '{ theme: "light", lang: "en" }', isNew: false, tone: "amber" },
          { name: "prefs", value: '{ theme: "dark", fontSize: 14 }', isNew: false, tone: "cyan" },
          { name: "config", value: '{ theme: "dark", lang: "en", fontSize: 14 }', isNew: true, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>{ ...config, lang: "fr" }</code> spreads <code>config</code> and then overrides <code>lang</code> with <code>"fr"</code>. Inline properties after the spread take precedence.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: [],
        bindings: [
          { name: "defaults", value: '{ theme: "light", lang: "en" }', isNew: false, tone: "amber" },
          { name: "prefs", value: '{ theme: "dark", fontSize: 14 }', isNew: false, tone: "cyan" },
          { name: "config", value: '{ theme: "dark", lang: "en", fontSize: 14 }', isNew: false, tone: "emerald" },
          { name: "updated", value: '{ theme: "dark", lang: "fr", fontSize: 14 }', isNew: true, tone: "violet" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(config)</code> shows the merged result with <code>theme: "dark"</code> from <code>prefs</code> overriding <code>defaults</code>.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ['{ theme: "dark", lang: "en", fontSize: 14 }'],
        bindings: [
          { name: "defaults", value: '{ theme: "light", lang: "en" }', isNew: false, tone: "amber" },
          { name: "prefs", value: '{ theme: "dark", fontSize: 14 }', isNew: false, tone: "cyan" },
          { name: "config", value: '{ theme: "dark", lang: "en", fontSize: 14 }', isNew: false, tone: "emerald" },
          { name: "updated", value: '{ theme: "dark", lang: "fr", fontSize: 14 }', isNew: false, tone: "violet" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(updated)</code> shows <code>lang: "fr"</code> overriding the spread value.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ['{ theme: "dark", lang: "en", fontSize: 14 }', '{ theme: "dark", lang: "fr", fontSize: 14 }'],
        bindings: [
          { name: "defaults", value: '{ theme: "light", lang: "en" }', isNew: false, tone: "amber" },
          { name: "prefs", value: '{ theme: "dark", fontSize: 14 }', isNew: false, tone: "cyan" },
          { name: "config", value: '{ theme: "dark", lang: "en", fontSize: 14 }', isNew: false, tone: "emerald" },
          { name: "updated", value: '{ theme: "dark", lang: "fr", fontSize: 14 }', isNew: false, tone: "violet" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(defaults)</code> is unchanged. Spread always creates a <strong>new</strong> object. <strong>Key takeaway:</strong> object spread copies properties left to right, later values override earlier ones. This is ideal for merging defaults with overrides.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ['{ theme: "dark", lang: "en", fontSize: 14 }', '{ theme: "dark", lang: "fr", fontSize: 14 }', '{ theme: "light", lang: "en" }'],
        bindings: [
          { name: "defaults", value: '{ theme: "light", lang: "en" }', isNew: false, tone: "amber" },
          { name: "prefs", value: '{ theme: "dark", fontSize: 14 }', isNew: false, tone: "cyan" },
          { name: "config", value: '{ theme: "dark", lang: "en", fontSize: 14 }', isNew: false, tone: "emerald" },
          { name: "updated", value: '{ theme: "dark", lang: "fr", fontSize: 14 }', isNew: false, tone: "violet" },
        ],
      },
    ],
  },

  /* ── 3. Rest Parameters ── */
  {
    id: "rest-params",
    title: "Rest Parameters",
    description:
      "Collect an indefinite number of function arguments into an array.",
    kind: "rest-params",
    codeLines: [
      { num: 1, text: "function sum(...nums) {" },
      { num: 2, text: "  return nums.reduce((a, b) => a + b, 0);" },
      { num: 3, text: "}" },
      { num: 4, text: "function head(first, ...rest) {" },
      { num: 5, text: "  return { first, rest };" },
      { num: 6, text: "}" },
      { num: 7, text: "console.log(sum(1, 2, 3));" },
      { num: 8, text: "console.log(sum(10, 20));" },
      { num: 9, text: 'console.log(head("a", "b", "c"));' },
    ],
    steps: [
      {
        descriptionHtml:
          "The <code>sum</code> function is declared with <code>...nums</code> as its parameter. The <code>...</code> before the parameter name means <strong>rest parameter</strong>: it collects all arguments into an array.",
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        bindings: [],
      },
      {
        descriptionHtml:
          "The <code>head</code> function takes a regular parameter <code>first</code> and a rest parameter <code>...rest</code>. The first argument goes to <code>first</code>, and all remaining arguments are collected into <code>rest</code>.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: [],
        bindings: [],
      },
      {
        descriptionHtml:
          "<code>sum(1, 2, 3)</code> is called. The rest parameter <code>nums</code> becomes <code>[1, 2, 3]</code>. <code>reduce</code> adds them: <code>1 + 2 + 3 = 6</code>.",
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: [],
        bindings: [
          { name: "nums", value: "[1, 2, 3]", isNew: true, tone: "cyan" },
          { name: "result", value: "6", isNew: true, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          "<code>console.log</code> outputs <code>6</code>. The rest parameter collected all three arguments into a real array.",
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ["6"],
        bindings: [
          { name: "nums", value: "[1, 2, 3]", isNew: false, tone: "cyan" },
          { name: "result", value: "6", isNew: false, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          "<code>sum(10, 20)</code> is called. Now <code>nums</code> is <code>[10, 20]</code>. Rest parameters adapt to any number of arguments.",
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        consoleOutput: ["6"],
        bindings: [
          { name: "nums", value: "[10, 20]", isNew: true, tone: "cyan" },
          { name: "result", value: "30", isNew: true, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          "Outputs <code>30</code>.",
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        consoleOutput: ["6", "30"],
        bindings: [
          { name: "nums", value: "[10, 20]", isNew: false, tone: "cyan" },
          { name: "result", value: "30", isNew: false, tone: "emerald" },
        ],
      },
      {
        descriptionHtml:
          '<code>head("a", "b", "c")</code> is called. <code>first</code> gets <code>"a"</code>, and <code>...rest</code> collects the remaining into <code>["b", "c"]</code>. Rest must always be the <strong>last</strong> parameter.',
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        consoleOutput: ["6", "30"],
        bindings: [
          { name: "first", value: '"a"', isNew: true, tone: "amber" },
          { name: "rest", value: '["b", "c"]', isNew: true, tone: "violet" },
        ],
      },
      {
        descriptionHtml:
          'Outputs <code>{ first: "a", rest: ["b", "c"] }</code>. <strong>Key takeaway:</strong> rest parameters collect remaining arguments into a real <code>Array</code>. They must be the last parameter in the function signature.',
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        consoleOutput: ["6", "30", '{ first: "a", rest: ["b", "c"] }'],
        bindings: [
          { name: "first", value: '"a"', isNew: false, tone: "amber" },
          { name: "rest", value: '["b", "c"]', isNew: false, tone: "violet" },
        ],
      },
    ],
  },

  /* ── 4. Rest in Destructuring ── */
  {
    id: "rest-destructuring",
    title: "Rest in Destructuring",
    description:
      "Collect remaining elements or properties using ... in destructuring patterns.",
    kind: "rest-destructuring",
    codeLines: [
      { num: 1, text: 'const colors = ["red", "green", "blue", "yellow"];' },
      { num: 2, text: "const [primary, ...others] = colors;" },
      { num: 3, text: 'const user = { name: "Alice", age: 30, role: "dev" };' },
      { num: 4, text: "const { name, ...details } = user;" },
      { num: 5, text: "console.log(primary);" },
      { num: 6, text: "console.log(others);" },
      { num: 7, text: "console.log(name);" },
      { num: 8, text: "console.log(details);" },
    ],
    steps: [
      {
        descriptionHtml:
          "Creates a <code>colors</code> array with four elements.",
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        bindings: [
          { name: "colors", value: '["red", "green", "blue", "yellow"]', isNew: true, tone: "amber" },
        ],
      },
      {
        descriptionHtml:
          '<code>[primary, ...others]</code> destructures the array. <code>primary</code> gets the first element (<code>"red"</code>), and <code>...others</code> collects the <strong>remaining</strong> elements into a new array.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        bindings: [
          { name: "colors", value: '["red", "green", "blue", "yellow"]', isNew: false, tone: "amber" },
          { name: "primary", value: '"red"', isNew: true, tone: "cyan" },
          { name: "others", value: '["green", "blue", "yellow"]', isNew: true, tone: "violet" },
        ],
      },
      {
        descriptionHtml:
          "Creates a <code>user</code> object with three properties.",
        activeLine: 3,
        doneLines: [1, 2],
        consoleOutput: [],
        bindings: [
          { name: "colors", value: '["red", "green", "blue", "yellow"]', isNew: false, tone: "amber" },
          { name: "primary", value: '"red"', isNew: false, tone: "cyan" },
          { name: "others", value: '["green", "blue", "yellow"]', isNew: false, tone: "violet" },
          { name: "user", value: '{ name: "Alice", age: 30, role: "dev" }', isNew: true, tone: "amber" },
        ],
      },
      {
        descriptionHtml:
          '<code>{ name, ...details }</code> extracts <code>name</code> into its own variable and collects <strong>all remaining properties</strong> into a new <code>details</code> object. This is a clean way to separate known properties from the rest.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        consoleOutput: [],
        bindings: [
          { name: "colors", value: '["red", "green", "blue", "yellow"]', isNew: false, tone: "amber" },
          { name: "primary", value: '"red"', isNew: false, tone: "cyan" },
          { name: "others", value: '["green", "blue", "yellow"]', isNew: false, tone: "violet" },
          { name: "user", value: '{ name: "Alice", age: 30, role: "dev" }', isNew: false, tone: "amber" },
          { name: "name", value: '"Alice"', isNew: true, tone: "emerald" },
          { name: "details", value: '{ age: 30, role: "dev" }', isNew: true, tone: "pink" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(primary)</code> outputs <code>"red"</code>, the first element of the array.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        consoleOutput: ["red"],
        bindings: [
          { name: "colors", value: '["red", "green", "blue", "yellow"]', isNew: false, tone: "amber" },
          { name: "primary", value: '"red"', isNew: false, tone: "cyan" },
          { name: "others", value: '["green", "blue", "yellow"]', isNew: false, tone: "violet" },
          { name: "user", value: '{ name: "Alice", age: 30, role: "dev" }', isNew: false, tone: "amber" },
          { name: "name", value: '"Alice"', isNew: false, tone: "emerald" },
          { name: "details", value: '{ age: 30, role: "dev" }', isNew: false, tone: "pink" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(others)</code> outputs the remaining array elements: <code>["green", "blue", "yellow"]</code>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        consoleOutput: ["red", "[green, blue, yellow]"],
        bindings: [
          { name: "colors", value: '["red", "green", "blue", "yellow"]', isNew: false, tone: "amber" },
          { name: "primary", value: '"red"', isNew: false, tone: "cyan" },
          { name: "others", value: '["green", "blue", "yellow"]', isNew: false, tone: "violet" },
          { name: "user", value: '{ name: "Alice", age: 30, role: "dev" }', isNew: false, tone: "amber" },
          { name: "name", value: '"Alice"', isNew: false, tone: "emerald" },
          { name: "details", value: '{ age: 30, role: "dev" }', isNew: false, tone: "pink" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(name)</code> outputs <code>"Alice"</code>, the extracted property.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        consoleOutput: ["red", "[green, blue, yellow]", "Alice"],
        bindings: [
          { name: "colors", value: '["red", "green", "blue", "yellow"]', isNew: false, tone: "amber" },
          { name: "primary", value: '"red"', isNew: false, tone: "cyan" },
          { name: "others", value: '["green", "blue", "yellow"]', isNew: false, tone: "violet" },
          { name: "user", value: '{ name: "Alice", age: 30, role: "dev" }', isNew: false, tone: "amber" },
          { name: "name", value: '"Alice"', isNew: false, tone: "emerald" },
          { name: "details", value: '{ age: 30, role: "dev" }', isNew: false, tone: "pink" },
        ],
      },
      {
        descriptionHtml:
          '<code>console.log(details)</code> outputs the remaining properties: <code>{ age: 30, role: "dev" }</code>. <strong>Key takeaway:</strong> rest in destructuring collects leftover elements (arrays) or properties (objects). It always creates a new array or object, not a reference to the original.',
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        consoleOutput: ["red", "[green, blue, yellow]", "Alice", '{ age: 30, role: "dev" }'],
        bindings: [
          { name: "colors", value: '["red", "green", "blue", "yellow"]', isNew: false, tone: "amber" },
          { name: "primary", value: '"red"', isNew: false, tone: "cyan" },
          { name: "others", value: '["green", "blue", "yellow"]', isNew: false, tone: "violet" },
          { name: "user", value: '{ name: "Alice", age: 30, role: "dev" }', isNew: false, tone: "amber" },
          { name: "name", value: '"Alice"', isNew: false, tone: "emerald" },
          { name: "details", value: '{ age: 30, role: "dev" }', isNew: false, tone: "pink" },
        ],
      },
    ],
  },
];
