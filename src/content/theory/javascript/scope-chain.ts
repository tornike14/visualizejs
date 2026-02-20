import type { TopicTheoryContent } from "@/content/theory/types";

export const scopeChainTheory: TopicTheoryContent = {
  summary:
    "The scope chain is the lexical lookup path JavaScript uses to resolve identifiers, starting from the current scope and moving outward until a matching binding is found.",
  whatItIs: [
    "JavaScript uses lexical scoping, meaning variable resolution is based on where code is written, not where a function is called.",
    "Each execution context has access to its own environment plus links to outer environments. These links create the scope chain.",
    "Identifier lookup walks from the innermost environment to outer scopes and stops at the first match. If no binding exists, a ReferenceError is thrown.",
  ],
  howItWorks: [
    "Step 1: code executes in a current lexical environment that contains local bindings.",
    "Step 2: when an identifier is referenced, the engine checks the current environment first.",
    "Step 3: if not found, the engine traverses outward through parent lexical environments.",
    "Step 4: resolution either finds a matching binding or ends at global scope with an unresolved reference error.",
  ],
  commonMistakes: [
    {
      title: "Confusing lexical scope with dynamic scope",
      explanation:
        "JavaScript does not resolve variables from the caller's scope. It resolves from where functions are defined.",
      fix: "Track where a function is declared to understand which outer bindings it can access.",
    },
    {
      title: "Accidental shadowing",
      explanation:
        "A local variable with the same name as an outer variable hides the outer binding and can cause confusing behavior.",
      fix: "Use intentional naming and smaller scopes to avoid accidental shadowing.",
    },
    {
      title: "Expecting block scope from var",
      explanation:
        "var is function-scoped, not block-scoped, so references can escape blocks in ways that differ from let and const.",
      fix: "Prefer let and const for predictable block-level scope behavior.",
    },
  ],
  interviewQuestions: [
    {
      question: "Does JavaScript search global scope first?",
      answer:
        "No. Lookup starts from the innermost current scope and proceeds outward toward global scope.",
      codeExample: {
        language: "javascript",
        code: `const level = "global";

function outer() {
  const level = "outer";
  function inner() {
    console.log(level); // "outer"
  }
  inner();
}`,
      },
    },
    {
      question: "Can scope chain change based on how a function is called?",
      answer:
        "No. Scope chain is lexical and fixed by declaration context, not invocation pattern.",
    },
    {
      question: "How does scope chain relate to closures?",
      answer:
        "Closures preserve access to outer lexical environments, effectively extending scope-chain access beyond the outer function's execution.",
    },
    {
      question: "Are imports part of scope resolution?",
      answer:
        "Yes. Module imports create bindings in module scope that participate in identifier resolution like other lexical bindings.",
    },
  ],
  relatedTopicIds: ["closures", "hoisting", "this-keyword", "reference-value"],
};
