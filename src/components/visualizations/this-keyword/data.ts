import type { ThisExample } from "./types";

export const EXAMPLES: ThisExample[] = [
  // ---- Example 1: Implicit vs Default Binding ----
  {
    id: "implicit-default",
    title: "Implicit vs Default",
    kind: "implicit",
    description:
      "Method calls bind this to the calling object. Standalone calls leave this as undefined in strict mode.",
    codeLines: [
      { num: 1, text: "const user = {" },
      { num: 2, text: '  name: "Alice",' },
      { num: 3, text: "  greet() {" },
      { num: 4, text: "    console.log(this.name);" },
      { num: 5, text: "  }" },
      { num: 6, text: "};" },
      { num: 7, text: "" },
      { num: 8, text: "user.greet();" },
      { num: 9, text: "const greetFn = user.greet;" },
      { num: 10, text: "greetFn();" },
    ],
    steps: [
      {
        descriptionHtml:
          'Create the <code>user</code> object with a <code>name</code> property and a <code>greet</code> method. No function calls yet, so <code>this</code> has no binding.',
        activeLine: 1,
        doneLines: [],
        objects: [
          {
            label: "user",
            properties: [
              { name: "name", value: '"Alice"' },
              { name: "greet", value: "f()" },
            ],
            highlight: "active",
          },
        ],
        thisBinding: null,
        consoleOutput: [],
      },
      {
        descriptionHtml:
          '<code>user.greet()</code> is called. The key is the <strong>dot</strong> before <code>greet</code> - the object to the left of the dot determines <code>this</code>.',
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6],
        objects: [
          {
            label: "user",
            properties: [
              { name: "name", value: '"Alice"' },
              { name: "greet", value: "f()" },
            ],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "implicit",
          ruleLabel: "Implicit Binding",
          value: "user",
          callExpression: "user.greet()",
        },
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'Inside <code>greet()</code>, <code>this</code> is <code>user</code> because of implicit binding. <code>this.name</code> resolves to <code>"Alice"</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3, 5, 6, 8],
        objects: [
          {
            label: "user",
            properties: [
              { name: "name", value: '"Alice"' },
              { name: "greet", value: "f()" },
            ],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "implicit",
          ruleLabel: "Implicit Binding",
          value: "user",
          callExpression: "user.greet()",
        },
        consoleOutput: ['"Alice"'],
      },
      {
        descriptionHtml:
          'Now <code>user.greet</code> is extracted into a standalone variable <code>greetFn</code>. The function reference is copied, but the object binding is <strong>not</strong> carried along.',
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 8],
        objects: [
          {
            label: "user",
            properties: [
              { name: "name", value: '"Alice"' },
              { name: "greet", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        thisBinding: null,
        consoleOutput: ['"Alice"'],
      },
      {
        descriptionHtml:
          '<code>greetFn()</code> is called - no dot, no object in front. This is a <strong>plain function call</strong>.',
        activeLine: 10,
        doneLines: [1, 2, 3, 4, 5, 6, 8, 9],
        objects: [
          {
            label: "user",
            properties: [
              { name: "name", value: '"Alice"' },
              { name: "greet", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        thisBinding: {
          rule: "lost",
          ruleLabel: "Lost Binding",
          value: "undefined",
          callExpression: "greetFn()",
        },
        consoleOutput: ['"Alice"'],
      },
      {
        descriptionHtml:
          'Inside <code>greet()</code> again, but now <code>this</code> is <code>undefined</code> (strict mode). The binding was <strong>lost</strong> when the method was extracted. <code>this.name</code> is <code>undefined</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3, 5, 6, 8, 9, 10],
        objects: [
          {
            label: "user",
            properties: [
              { name: "name", value: '"Alice"' },
              { name: "greet", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        thisBinding: {
          rule: "lost",
          ruleLabel: "Lost Binding",
          value: "undefined",
          callExpression: "greetFn()",
        },
        consoleOutput: ['"Alice"', "undefined"],
      },
      {
        descriptionHtml:
          '<strong>Key takeaway:</strong> The value of <code>this</code> depends on <strong>how</strong> the function is called, not where it is defined. <code>obj.method()</code> binds <code>this</code> to <code>obj</code>. A plain <code>func()</code> call loses the binding.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 8, 9, 10],
        objects: [
          {
            label: "user",
            properties: [
              { name: "name", value: '"Alice"' },
              { name: "greet", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        thisBinding: null,
        consoleOutput: ['"Alice"', "undefined"],
      },
    ],
  },

  // ---- Example 2: Explicit Binding ----
  {
    id: "explicit",
    title: "Explicit Binding",
    kind: "explicit",
    description:
      "call(), apply(), and bind() let you manually set the value of this.",
    codeLines: [
      { num: 1, text: "function greet(greeting) {" },
      { num: 2, text: '  console.log(greeting + ", " + this.name);' },
      { num: 3, text: "}" },
      { num: 4, text: "" },
      { num: 5, text: 'const alice = { name: "Alice" };' },
      { num: 6, text: 'const bob = { name: "Bob" };' },
      { num: 7, text: "" },
      { num: 8, text: 'greet.call(alice, "Hello");' },
      { num: 9, text: 'greet.apply(bob, ["Hi"]);' },
      { num: 10, text: 'const boundGreet = greet.bind(alice, "Hey");' },
      { num: 11, text: "boundGreet();" },
    ],
    steps: [
      {
        descriptionHtml:
          'Declare a standalone <code>greet</code> function that references <code>this.name</code>. On its own, <code>this</code> would be <code>undefined</code> - we will control it explicitly.',
        activeLine: 1,
        doneLines: [],
        objects: [],
        thisBinding: null,
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'Create two objects: <code>alice</code> and <code>bob</code>. Neither has a <code>greet</code> method - we will borrow the standalone function.',
        activeLine: 5,
        doneLines: [1, 2, 3],
        objects: [
          {
            label: "alice",
            properties: [{ name: "name", value: '"Alice"' }],
            highlight: "active",
          },
          {
            label: "bob",
            properties: [{ name: "name", value: '"Bob"' }],
            highlight: "active",
          },
        ],
        thisBinding: null,
        consoleOutput: [],
      },
      {
        descriptionHtml:
          '<code>greet.call(alice, "Hello")</code> - <code>call</code> invokes the function immediately with <code>this</code> set to <code>alice</code>. Arguments are passed individually after the context.',
        activeLine: 8,
        doneLines: [1, 2, 3, 5, 6],
        objects: [
          {
            label: "alice",
            properties: [{ name: "name", value: '"Alice"' }],
            highlight: "target",
          },
          {
            label: "bob",
            properties: [{ name: "name", value: '"Bob"' }],
            highlight: "none",
          },
        ],
        thisBinding: {
          rule: "explicit-call",
          ruleLabel: "Explicit: call()",
          value: "alice",
          callExpression: 'greet.call(alice, "Hello")',
        },
        consoleOutput: ['"Hello, Alice"'],
      },
      {
        descriptionHtml:
          '<code>greet.apply(bob, ["Hi"])</code> - <code>apply</code> works like <code>call</code> but takes arguments as an <strong>array</strong>. <code>this</code> is now <code>bob</code>.',
        activeLine: 9,
        doneLines: [1, 2, 3, 5, 6, 8],
        objects: [
          {
            label: "alice",
            properties: [{ name: "name", value: '"Alice"' }],
            highlight: "none",
          },
          {
            label: "bob",
            properties: [{ name: "name", value: '"Bob"' }],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "explicit-apply",
          ruleLabel: "Explicit: apply()",
          value: "bob",
          callExpression: 'greet.apply(bob, ["Hi"])',
        },
        consoleOutput: ['"Hello, Alice"', '"Hi, Bob"'],
      },
      {
        descriptionHtml:
          '<code>greet.bind(alice, "Hey")</code> does <strong>not</strong> call the function. Instead, it returns a <strong>new function</strong> with <code>this</code> permanently bound to <code>alice</code>.',
        activeLine: 10,
        doneLines: [1, 2, 3, 5, 6, 8, 9],
        objects: [
          {
            label: "alice",
            properties: [{ name: "name", value: '"Alice"' }],
            highlight: "target",
          },
          {
            label: "bob",
            properties: [{ name: "name", value: '"Bob"' }],
            highlight: "none",
          },
        ],
        thisBinding: {
          rule: "explicit-bind",
          ruleLabel: "Explicit: bind()",
          value: "alice",
          callExpression: 'greet.bind(alice, "Hey")',
        },
        consoleOutput: ['"Hello, Alice"', '"Hi, Bob"'],
      },
      {
        descriptionHtml:
          '<code>boundGreet()</code> - even though this is a <strong>plain call</strong> (no dot, no explicit context), <code>this</code> is still <code>alice</code> because <code>bind</code> locks it permanently.',
        activeLine: 11,
        doneLines: [1, 2, 3, 5, 6, 8, 9, 10],
        objects: [
          {
            label: "alice",
            properties: [{ name: "name", value: '"Alice"' }],
            highlight: "target",
          },
          {
            label: "bob",
            properties: [{ name: "name", value: '"Bob"' }],
            highlight: "none",
          },
        ],
        thisBinding: {
          rule: "explicit-bind",
          ruleLabel: "Explicit: bind()",
          value: "alice",
          callExpression: "boundGreet()",
        },
        consoleOutput: ['"Hello, Alice"', '"Hi, Bob"', '"Hey, Alice"'],
      },
      {
        descriptionHtml:
          '<strong>Key takeaway:</strong> <code>call</code> and <code>apply</code> invoke immediately with a chosen <code>this</code>. <code>bind</code> returns a new function with <code>this</code> permanently locked - even future plain calls cannot override it.',
        activeLine: null,
        doneLines: [1, 2, 3, 5, 6, 8, 9, 10, 11],
        objects: [
          {
            label: "alice",
            properties: [{ name: "name", value: '"Alice"' }],
            highlight: "none",
          },
          {
            label: "bob",
            properties: [{ name: "name", value: '"Bob"' }],
            highlight: "none",
          },
        ],
        thisBinding: null,
        consoleOutput: ['"Hello, Alice"', '"Hi, Bob"', '"Hey, Alice"'],
      },
    ],
  },

  // ---- Example 3: new Binding ----
  {
    id: "new-binding",
    title: "new Binding",
    kind: "new",
    description:
      "The new operator creates a fresh object and binds this to it inside the constructor.",
    codeLines: [
      { num: 1, text: "function User(name) {" },
      { num: 2, text: "  console.log(this);" },
      { num: 3, text: "  this.name = name;" },
      { num: 4, text: "  this.greet = function() {" },
      { num: 5, text: '    console.log("Hi, " + this.name);' },
      { num: 6, text: "  };" },
      { num: 7, text: "}" },
      { num: 8, text: "" },
      { num: 9, text: 'const alice = new User("Alice");' },
      { num: 10, text: "alice.greet();" },
      { num: 11, text: "console.log(alice.name);" },
    ],
    steps: [
      {
        descriptionHtml:
          'Declare <code>User</code> as a constructor function. By convention, constructor names start with a capital letter.',
        activeLine: 1,
        doneLines: [],
        objects: [],
        thisBinding: null,
        consoleOutput: [],
      },
      {
        descriptionHtml:
          '<code>new User("Alice")</code> is called. The <code>new</code> operator creates a <strong>fresh empty object</strong> and binds <code>this</code> to it before entering the constructor body.',
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        objects: [
          {
            label: "new User()",
            properties: [],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "new",
          ruleLabel: "new Binding",
          value: "new User()",
          callExpression: 'new User("Alice")',
        },
        consoleOutput: [],
      },
      {
        descriptionHtml:
          '<code>console.log(this)</code> - <code>this</code> is the new empty object. It has no properties yet.',
        activeLine: 2,
        doneLines: [1, 7, 9],
        objects: [
          {
            label: "new User()",
            properties: [],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "new",
          ruleLabel: "new Binding",
          value: "new User()",
          callExpression: 'new User("Alice")',
        },
        consoleOutput: ["User {}"],
      },
      {
        descriptionHtml:
          '<code>this.name = name</code> - the <code>name</code> property is added to the new object via <code>this</code>. The object is being built up step by step.',
        activeLine: 3,
        doneLines: [1, 2, 7, 9],
        objects: [
          {
            label: "new User()",
            properties: [{ name: "name", value: '"Alice"' }],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "new",
          ruleLabel: "new Binding",
          value: "new User()",
          callExpression: 'new User("Alice")',
        },
        consoleOutput: ["User {}"],
      },
      {
        descriptionHtml:
          '<code>this.greet = function()...</code> - a <code>greet</code> method is attached to the new object. The constructor finishes, and <code>new</code> returns this object as <code>alice</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3, 7, 9],
        objects: [
          {
            label: "alice",
            properties: [
              { name: "name", value: '"Alice"' },
              { name: "greet", value: "f()" },
            ],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "new",
          ruleLabel: "new Binding",
          value: "alice",
          callExpression: 'new User("Alice")',
        },
        consoleOutput: ["User {}"],
      },
      {
        descriptionHtml:
          '<code>alice.greet()</code> - now this is a regular method call with <strong>implicit binding</strong>. The dot rule applies: <code>this</code> is <code>alice</code>.',
        activeLine: 10,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 9],
        objects: [
          {
            label: "alice",
            properties: [
              { name: "name", value: '"Alice"' },
              { name: "greet", value: "f()" },
            ],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "implicit",
          ruleLabel: "Implicit Binding",
          value: "alice",
          callExpression: "alice.greet()",
        },
        consoleOutput: ["User {}", '"Hi, Alice"'],
      },
      {
        descriptionHtml:
          '<strong>Key takeaway:</strong> <code>new</code> does three things: (1) creates a fresh empty object, (2) binds <code>this</code> to it inside the constructor, (3) returns the object. After construction, the dot rule (implicit binding) applies as usual.',
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 9, 10],
        objects: [
          {
            label: "alice",
            properties: [
              { name: "name", value: '"Alice"' },
              { name: "greet", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        thisBinding: null,
        consoleOutput: ["User {}", '"Hi, Alice"', '"Alice"'],
      },
    ],
  },

  // ---- Example 4: Arrow Functions ----
  {
    id: "arrow",
    title: "Arrow Functions",
    kind: "arrow",
    description:
      "Arrow functions do not have their own this. They inherit this from the enclosing lexical scope.",
    codeLines: [
      { num: 1, text: "const team = {" },
      { num: 2, text: '  name: "Engineering",' },
      { num: 3, text: '  members: ["Alice", "Bob"],' },
      { num: 4, text: "  show() {" },
      { num: 5, text: "    this.members.forEach((member) => {" },
      { num: 6, text: '      console.log(member + " in " + this.name);' },
      { num: 7, text: "    });" },
      { num: 8, text: "  }" },
      { num: 9, text: "};" },
      { num: 10, text: "" },
      { num: 11, text: "team.show();" },
    ],
    steps: [
      {
        descriptionHtml:
          'Create the <code>team</code> object with a <code>name</code>, a <code>members</code> array, and a <code>show</code> method.',
        activeLine: 1,
        doneLines: [],
        objects: [
          {
            label: "team",
            properties: [
              { name: "name", value: '"Engineering"' },
              { name: "members", value: '["Alice", "Bob"]' },
              { name: "show", value: "f()" },
            ],
            highlight: "active",
          },
        ],
        thisBinding: null,
        consoleOutput: [],
      },
      {
        descriptionHtml:
          '<code>team.show()</code> is called. Implicit binding: the dot rule means <code>this</code> inside <code>show</code> will be <code>team</code>.',
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        objects: [
          {
            label: "team",
            properties: [
              { name: "name", value: '"Engineering"' },
              { name: "members", value: '["Alice", "Bob"]' },
              { name: "show", value: "f()" },
            ],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "implicit",
          ruleLabel: "Implicit Binding",
          value: "team",
          callExpression: "team.show()",
        },
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'Inside <code>show()</code>, <code>this</code> is <code>team</code>. The <code>forEach</code> callback is an <strong>arrow function</strong> - it does not create its own <code>this</code> binding.',
        activeLine: 5,
        doneLines: [1, 2, 3, 8, 9, 11],
        objects: [
          {
            label: "team",
            properties: [
              { name: "name", value: '"Engineering"' },
              { name: "members", value: '["Alice", "Bob"]' },
              { name: "show", value: "f()" },
            ],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "arrow",
          ruleLabel: "Arrow (lexical)",
          value: "team",
          callExpression: "(member) => { ... }",
        },
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'The arrow function <strong>captures</strong> <code>this</code> from its enclosing scope (<code>show</code>). Since <code>show</code> was called as <code>team.show()</code>, the arrow inherits <code>this = team</code>.',
        activeLine: 5,
        doneLines: [1, 2, 3, 8, 9, 11],
        objects: [
          {
            label: "team",
            properties: [
              { name: "name", value: '"Engineering"' },
              { name: "members", value: '["Alice", "Bob"]' },
              { name: "show", value: "f()" },
            ],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "arrow",
          ruleLabel: "Arrow (lexical)",
          value: "team",
          callExpression: "(member) => { ... }",
        },
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'First iteration: <code>member</code> is <code>"Alice"</code>. <code>this.name</code> resolves to <code>"Engineering"</code> because the arrow inherited <code>this = team</code>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 5, 8, 9, 11],
        objects: [
          {
            label: "team",
            properties: [
              { name: "name", value: '"Engineering"' },
              { name: "members", value: '["Alice", "Bob"]' },
              { name: "show", value: "f()" },
            ],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "arrow",
          ruleLabel: "Arrow (lexical)",
          value: "team",
          callExpression: "(member) => { ... }",
        },
        consoleOutput: ['"Alice in Engineering"'],
      },
      {
        descriptionHtml:
          'Second iteration: <code>member</code> is <code>"Bob"</code>. Same <code>this</code> - arrow functions <strong>never</strong> get their own binding, no matter how many times they are called.',
        activeLine: 6,
        doneLines: [1, 2, 3, 5, 8, 9, 11],
        objects: [
          {
            label: "team",
            properties: [
              { name: "name", value: '"Engineering"' },
              { name: "members", value: '["Alice", "Bob"]' },
              { name: "show", value: "f()" },
            ],
            highlight: "target",
          },
        ],
        thisBinding: {
          rule: "arrow",
          ruleLabel: "Arrow (lexical)",
          value: "team",
          callExpression: "(member) => { ... }",
        },
        consoleOutput: ['"Alice in Engineering"', '"Bob in Engineering"'],
      },
      {
        descriptionHtml:
          '<strong>Key takeaway:</strong> Arrow functions inherit <code>this</code> from the enclosing function scope at the time they are defined. If <code>forEach</code> used a regular <code>function</code> instead, <code>this</code> would be <code>undefined</code> - the classic gotcha arrow functions were designed to fix.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11],
        objects: [
          {
            label: "team",
            properties: [
              { name: "name", value: '"Engineering"' },
              { name: "members", value: '["Alice", "Bob"]' },
              { name: "show", value: "f()" },
            ],
            highlight: "none",
          },
        ],
        thisBinding: null,
        consoleOutput: ['"Alice in Engineering"', '"Bob in Engineering"'],
      },
    ],
  },
];
