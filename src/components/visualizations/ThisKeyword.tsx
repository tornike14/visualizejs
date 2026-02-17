"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import {
  CodeBlock,
  type CodeBlockLine,
} from "@/components/visualization-ui/CodeBlock";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { ExampleSelector } from "@/components/visualization-ui/ExampleSelector";
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { cn } from "@/lib/utils";
import {
  VISUALIZATION_PANEL_TITLES,
  VISUALIZATION_EMPTY_STATES,
} from "@/lib/visualization/uiCopy";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BindingKind = "implicit" | "explicit" | "new" | "arrow";

type BindingRule =
  | "default"
  | "implicit"
  | "explicit-call"
  | "explicit-apply"
  | "explicit-bind"
  | "new"
  | "arrow"
  | "lost";

interface SourceLine {
  num: number;
  text: string;
}

interface MemoryObject {
  label: string;
  properties: { name: string; value: string }[];
  highlight?: "active" | "target" | "none";
}

interface ThisBinding {
  rule: BindingRule;
  ruleLabel: string;
  value: string;
  callExpression: string;
}

interface ThisStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  objects: MemoryObject[];
  thisBinding: ThisBinding | null;
  consoleOutput: string[];
}

interface ThisExample {
  id: string;
  title: string;
  kind: BindingKind;
  description: string;
  codeLines: SourceLine[];
  steps: ThisStep[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function kindBadgeClass(kind: BindingKind): string {
  switch (kind) {
    case "implicit":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "explicit":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/25";
    case "new":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    case "arrow":
      return "bg-violet-500/15 text-violet-400 border-violet-500/25";
  }
}

function kindLabel(kind: BindingKind): string {
  switch (kind) {
    case "implicit":
      return "implicit";
    case "explicit":
      return "call/apply/bind";
    case "new":
      return "new";
    case "arrow":
      return "arrow fn";
  }
}

function ruleColorClass(rule: BindingRule): string {
  switch (rule) {
    case "default":
    case "lost":
      return "bg-red-500/20 text-red-300 border-red-500/25";
    case "implicit":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/25";
    case "explicit-call":
    case "explicit-apply":
    case "explicit-bind":
      return "bg-cyan-500/20 text-cyan-300 border-cyan-500/25";
    case "new":
      return "bg-amber-500/20 text-amber-300 border-amber-500/25";
    case "arrow":
      return "bg-violet-500/20 text-violet-300 border-violet-500/25";
  }
}

// ---------------------------------------------------------------------------
// Example Data
// ---------------------------------------------------------------------------

const EXAMPLES: ThisExample[] = [
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
          '<code>user.greet()</code> is called. The key is the <strong>dot</strong> before <code>greet</code> — the object to the left of the dot determines <code>this</code>.',
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
          '<code>greetFn()</code> is called — no dot, no object in front. This is a <strong>plain function call</strong>.',
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
          'Declare a standalone <code>greet</code> function that references <code>this.name</code>. On its own, <code>this</code> would be <code>undefined</code> — we will control it explicitly.',
        activeLine: 1,
        doneLines: [],
        objects: [],
        thisBinding: null,
        consoleOutput: [],
      },
      {
        descriptionHtml:
          'Create two objects: <code>alice</code> and <code>bob</code>. Neither has a <code>greet</code> method — we will borrow the standalone function.',
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
          '<code>greet.call(alice, "Hello")</code> — <code>call</code> invokes the function immediately with <code>this</code> set to <code>alice</code>. Arguments are passed individually after the context.',
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
          '<code>greet.apply(bob, ["Hi"])</code> — <code>apply</code> works like <code>call</code> but takes arguments as an <strong>array</strong>. <code>this</code> is now <code>bob</code>.',
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
          '<code>boundGreet()</code> — even though this is a <strong>plain call</strong> (no dot, no explicit context), <code>this</code> is still <code>alice</code> because <code>bind</code> locks it permanently.',
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
          '<strong>Key takeaway:</strong> <code>call</code> and <code>apply</code> invoke immediately with a chosen <code>this</code>. <code>bind</code> returns a new function with <code>this</code> permanently locked — even future plain calls cannot override it.',
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
          '<code>console.log(this)</code> — <code>this</code> is the new empty object. It has no properties yet.',
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
          '<code>this.name = name</code> — the <code>name</code> property is added to the new object via <code>this</code>. The object is being built up step by step.',
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
          '<code>this.greet = function()...</code> — a <code>greet</code> method is attached to the new object. The constructor finishes, and <code>new</code> returns this object as <code>alice</code>.',
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
          '<code>alice.greet()</code> — now this is a regular method call with <strong>implicit binding</strong>. The dot rule applies: <code>this</code> is <code>alice</code>.',
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
          'Inside <code>show()</code>, <code>this</code> is <code>team</code>. The <code>forEach</code> callback is an <strong>arrow function</strong> — it does not create its own <code>this</code> binding.',
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
          'Second iteration: <code>member</code> is <code>"Bob"</code>. Same <code>this</code> — arrow functions <strong>never</strong> get their own binding, no matter how many times they are called.',
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
          '<strong>Key takeaway:</strong> Arrow functions inherit <code>this</code> from the enclosing function scope at the time they are defined. If <code>forEach</code> used a regular <code>function</code> instead, <code>this</code> would be <code>undefined</code> — the classic gotcha arrow functions were designed to fix.',
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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ThisBindingCard({ binding }: { binding: ThisBinding | null }) {
  if (!binding) {
    return (
      <p className="py-6 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60 uppercase">
        no binding yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Active Rule */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
          Active Rule
        </span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
            ruleColorClass(binding.rule)
          )}
        >
          {binding.ruleLabel}
        </span>
      </div>

      {/* Call expression */}
      <div className="rounded-lg border border-slate-500/30 bg-slate-800/30 px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
          Invocation
        </span>
        <p className="mt-0.5 font-mono text-sm text-slate-100">
          {binding.callExpression}
        </p>
      </div>

      {/* this => value */}
      <div className="flex items-center gap-3">
        <span className="rounded-lg border border-pink-300/35 bg-pink-400/10 px-3 py-1.5 font-mono text-sm font-semibold text-pink-200">
          this
        </span>
        <svg
          viewBox="0 0 24 8"
          className="h-2 w-6 flex-shrink-0 text-pink-400/70"
          aria-hidden="true"
        >
          <path
            d="M0 4H20M20 4L16 1M20 4L16 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span
          className={cn(
            "rounded-lg border px-3 py-1.5 font-mono text-sm font-semibold",
            binding.value === "undefined"
              ? "border-red-300/35 bg-red-400/10 text-red-200"
              : "border-emerald-300/35 bg-emerald-400/10 text-emerald-200"
          )}
        >
          {binding.value}
        </span>
      </div>
    </div>
  );
}

function MemoryObjects({ objects }: { objects: MemoryObject[] }) {
  if (objects.length === 0) {
    return (
      <p className="py-6 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60 uppercase">
        no objects yet
      </p>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {objects.map((obj, index) => (
        <div
          key={`${obj.label}-${index}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2.5 transition-all duration-300",
            obj.highlight === "target"
              ? "border-emerald-300/40 bg-emerald-400/8 shadow-[0_0_18px_rgba(52,211,153,0.1)]"
              : obj.highlight === "active"
                ? "border-amber-300/40 bg-amber-400/8 shadow-[0_0_18px_rgba(251,191,36,0.1)]"
                : "border-slate-500/30 bg-slate-800/30"
          )}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <span
              className={cn(
                "font-mono text-xs font-semibold",
                obj.highlight === "target"
                  ? "text-emerald-300"
                  : obj.highlight === "active"
                    ? "text-amber-300"
                    : "text-slate-400"
              )}
            >
              {obj.label}
            </span>
            {obj.highlight === "target" && (
              <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] text-emerald-300">
                this
              </span>
            )}
          </div>
          {obj.properties.length > 0 ? (
            <div className="space-y-0.5">
              {obj.properties.map((prop) => (
                <div
                  key={prop.name}
                  className="flex items-center justify-between rounded px-2 py-0.5 font-mono text-xs"
                >
                  <span className="text-slate-400">{prop.name}</span>
                  <span className="text-slate-300">{prop.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-2 font-mono text-[11px] text-slate-500">
              (empty object)
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ThisKeyword() {
  const [activeExampleId, setActiveExampleId] = useState(EXAMPLES[0].id);

  const example =
    EXAMPLES.find((e) => e.id === activeExampleId) ?? EXAMPLES[0];

  const {
    currentStepIndex,
    isPlaying,
    speedLevel,
    speedLabel,
    canStep,
    canStepBack,
    togglePlay,
    step: handleStep,
    stepBack: handleStepBack,
    reset: handleReset,
    setSpeedLevel,
  } = useStepPlayback({
    totalSteps: example.steps.length,
    initialStep: -1,
    resetKey: activeExampleId,
  });

  const currentStep =
    currentStepIndex >= 0 ? example.steps[currentStepIndex] : null;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      thisBinding: currentStep?.thisBinding,
      objects: currentStep?.objects,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  const handleExampleChange = (id: string) => {
    setActiveExampleId(id);
  };

  return (
    <>
      {/* Toolbar: portaled above the surface card */}
      <ToolbarPortal>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <ExampleSelector
                examples={EXAMPLES}
                activeId={activeExampleId}
                onSelect={handleExampleChange}
                renderBadge={(ex) => (
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", kindBadgeClass(ex.kind))}
                  >
                    {kindLabel(ex.kind)}
                  </Badge>
                )}
              />
              <Badge
                variant="outline"
                className={cn("text-[10px]", kindBadgeClass(example.kind))}
              >
                {kindLabel(example.kind)}
              </Badge>
            </div>

            <TransportControls
              isPlaying={isPlaying}
              canStep={canStep}
              canStepBack={canStepBack}
              stepIndex={currentStepIndex}
              totalSteps={example.steps.length}
              speedLevel={speedLevel}
              speedLabel={speedLabel}
              onTogglePlay={togglePlay}
              onStep={handleStep}
              onStepBack={handleStepBack}
              onReset={handleReset}
              onSpeedLevelChange={setSpeedLevel}
            />
          </div>

          <div
            className={cn(
              "app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5",
              flashes.description && "viz-change-flash-pill",
            )}
          >
            {currentStep ? (
              <p
                className="viz-step-desc text-center text-sm text-slate-300"
                dangerouslySetInnerHTML={{
                  __html: currentStep.descriptionHtml,
                }}
              />
            ) : (
              <p className="text-center text-sm text-slate-500">
                {VISUALIZATION_EMPTY_STATES.stepDescription}
              </p>
            )}
          </div>
        </div>
      </ToolbarPortal>

      {/* Main visualization */}
      <section className="relative flex flex-col gap-4 px-1 py-2 text-slate-100 sm:px-2 sm:py-3 lg:px-3 lg:py-4">
        <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]">
          <NeonPanel
            title={VISUALIZATION_PANEL_TITLES.sourceCode}
            tone="amber"
            bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
          >
            <CodeBlock
              lines={example.codeLines.map((line): CodeBlockLine => {
                const isActive = currentStep?.activeLine === line.num;
                const isDone =
                  currentStep?.doneLines.includes(line.num) ?? false;
                return {
                  key: line.num,
                  lineNumber: line.num,
                  text: line.text,
                  className: cn(
                    isActive && "is-active",
                    isDone && !isActive && "is-done"
                  ),
                };
              })}
            />
          </NeonPanel>

          <div className="space-y-4">
            <NeonPanel
              title="this Binding"
              tone="pink"
              bodyClassName="min-h-[10rem]"
              className={flashes.thisBinding ? "viz-change-flash" : undefined}
            >
              <ThisBindingCard
                binding={currentStep?.thisBinding ?? null}
              />
            </NeonPanel>

            <NeonPanel
              title="Objects in Memory"
              tone="cyan"
              bodyClassName="min-h-[8rem]"
              className={flashes.objects ? "viz-change-flash" : undefined}
            >
              <MemoryObjects objects={currentStep?.objects ?? []} />
            </NeonPanel>

            <div className={flashes.console ? "viz-change-flash rounded-3xl" : undefined}>
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
