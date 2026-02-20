import type { TopicTheoryContent } from "@/content/theory/types";

export const thisKeywordTheory: TopicTheoryContent = {
  summary:
    "The value of this is determined by call-site rules, not where a function is written, and those rules differ between regular functions, methods, constructors, and arrow functions.",
  whatItIs: [
    "In JavaScript, this provides execution context for a function call. The engine determines it when the function is invoked.",
    "Regular function this depends on the call pattern. Method calls bind this to the receiver object, while plain function calls depend on strict mode and runtime context.",
    "Arrow functions do not create their own this. They lexically capture this from the surrounding scope, which makes them useful for callbacks but unsuitable for dynamic rebinding.",
  ],
  howItWorks: [
    "Step 1: identify how the function is invoked: plain call, method call, constructor call, or explicit binding call/apply/bind.",
    "Step 2: apply precedence rules where explicit binding and new behavior override default binding.",
    "Step 3: for arrow functions, skip dynamic binding and inherit this from the lexical parent scope.",
    "Step 4: execute function body with resolved this value.",
  ],
  commonMistakes: [
    {
      title: "Assuming this is based on where a function is declared",
      explanation:
        "Regular functions use call-site binding, so moving or passing a function changes this unless explicitly controlled.",
      fix: "Debug this by checking invocation pattern, not declaration location.",
    },
    {
      title: "Losing this when passing methods as callbacks",
      explanation:
        "Extracted methods can be called as plain functions, dropping their object receiver and changing this unexpectedly.",
      fix: "Use bind, wrapper callbacks, or class fields with arrow functions when appropriate.",
    },
    {
      title: "Using arrow functions for prototype methods that need dynamic this",
      explanation:
        "Arrow functions capture outer this and ignore call-site binding, which can break method semantics on instances.",
      fix: "Use regular methods when behavior depends on the receiver object.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is this in strict mode for plain function calls?",
      answer:
        "In strict mode, plain function invocation sets this to undefined instead of the global object.",
      codeExample: {
        language: "javascript",
        code: `"use strict";

function showThis() {
  console.log(this);
}

showThis(); // undefined`,
      },
    },
    {
      question: "How do call, apply, and bind differ?",
      answer:
        "call and apply invoke immediately with an explicit this, while bind returns a new function with this pre-bound.",
    },
    {
      question: "Can arrow function this be changed with bind?",
      answer:
        "No. bind does not change lexical this captured by an arrow function.",
    },
    {
      question: "Does new ignore a bound this?",
      answer:
        "When a bound function is called with new, constructor behavior takes priority and this points to the newly created instance.",
    },
  ],
  relatedTopicIds: ["execution-context", "prototypal-inheritance", "scope-chain", "closures", "hoisting"],
};
