import type { TopicTheoryContent } from "@/content/theory/types";

export const hoistingTheory: TopicTheoryContent = {
  summary:
    "Hoisting is the pre-execution setup step where JavaScript registers declarations before running code, which explains function access before definition and the temporal dead zone for block-scoped bindings.",
  whatItIs: [
    "Before JavaScript executes a scope, it creates bindings for declarations found in that scope. This setup phase is commonly described as hoisting.",
    "Function declarations are fully initialized during setup, so they can be called before the line where they appear. Variable bindings differ by declaration type.",
    "var creates a binding initialized to undefined during setup. let and const create bindings too, but they are uninitialized until execution reaches the declaration, which creates the temporal dead zone.",
  ],
  howItWorks: [
    "Step 1: JavaScript parses the scope and records declarations.",
    "Step 2: function declarations are initialized immediately in memory with callable function objects.",
    "Step 3: var bindings are initialized to undefined, while let and const remain uninitialized.",
    "Step 4: execution runs line by line, assigning values and lifting let/const bindings out of the temporal dead zone only when their declarations are evaluated.",
  ],
  commonMistakes: [
    {
      title: "Thinking declarations are physically moved",
      explanation:
        "The source code order does not change. Hoisting is about how bindings are prepared before execution, not textual relocation.",
      fix: "Model hoisting as environment setup, then read runtime behavior from top to bottom.",
    },
    {
      title: "Treating let and const like var",
      explanation:
        "let and const are hoisted as bindings, but they cannot be used before initialization and throw a ReferenceError in the temporal dead zone.",
      fix: "Declare block-scoped variables near first use and avoid early access patterns.",
    },
    {
      title: "Assuming function expressions are callable before assignment",
      explanation:
        "Only function declarations are initialized early. A function expression assigned to const or let is unavailable before that assignment runs.",
      fix: "Call function expressions only after the assignment line has executed.",
    },
  ],
  interviewQuestions: [
    {
      question: "Is hoisting the same as the temporal dead zone?",
      answer:
        "No. Hoisting describes binding creation before execution. The temporal dead zone is the period where a let or const binding exists but is still uninitialized.",
      codeExample: {
        language: "javascript",
        code: `sayHi(); // works
function sayHi() { console.log("hi"); }

console.log(counter); // ReferenceError (TDZ)
let counter = 1;`,
      },
    },
    {
      question: "Why can function declarations be called before they appear?",
      answer:
        "Because function declarations are initialized during the setup phase for their scope, so the binding points to a callable function before execution reaches that line.",
    },
    {
      question: "Are class declarations hoisted?",
      answer:
        "Class bindings are created before execution, but like let and const they are in a temporal dead zone until initialization, so early access throws an error.",
    },
    {
      question: "Should production code rely on hoisting behavior?",
      answer:
        "It is better to write declarations in a clear top-down flow. Understanding hoisting helps debugging, but explicit ordering improves readability.",
    },
  ],
  relatedTopicIds: ["scope-chain", "closures", "this-keyword", "type-coercion"],
};
