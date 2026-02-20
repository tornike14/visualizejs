import type { TopicTheoryContent } from "@/content/theory/types";

export const prototypalInheritanceTheory: TopicTheoryContent = {
  summary:
    "Prototypal inheritance lets objects delegate property lookups through prototype links, enabling shared behavior without classical class-based copy inheritance.",
  whatItIs: [
    "Every ordinary JavaScript object can reference another object as its prototype. If a property is missing on the object itself, lookup continues on the prototype chain.",
    "Methods placed on a shared prototype are reused across many instances, which is memory-efficient compared with redefining methods on each object.",
    "class syntax is mostly a layer over this prototype mechanism, so understanding prototype lookup clarifies how methods and inheritance truly work.",
  ],
  howItWorks: [
    "Step 1: property access starts on the receiver object.",
    "Step 2: if the property is not own, JavaScript checks the object's prototype.",
    "Step 3: lookup continues up the chain until a match is found or the chain ends at null.",
    "Step 4: writes create or update own properties unless explicit prototype mutation occurs.",
  ],
  commonMistakes: [
    {
      title: "Mutating __proto__ at runtime",
      explanation:
        "Frequent prototype mutation can hurt performance and make object behavior harder to reason about.",
      fix: "Define prototypes during object creation with class, Object.create, or constructor patterns.",
    },
    {
      title: "Confusing own properties with inherited properties",
      explanation:
        "in and for...in include inherited properties, which can lead to unexpected logic or serialization bugs.",
      fix: "Use Object.hasOwn or hasOwnProperty when own-property checks are required.",
    },
    {
      title: "Overwriting prototype without restoring constructor",
      explanation:
        "Replacing a constructor prototype object can lose the expected constructor reference and metadata.",
      fix: "If replacing prototype, explicitly reset constructor and verify method definitions.",
    },
  ],
  interviewQuestions: [
    {
      question: "Is class inheritance different from prototype inheritance?",
      answer:
        "class uses prototype inheritance under the hood. It offers cleaner syntax, but runtime method lookup still follows prototype chains.",
      codeExample: {
        language: "javascript",
        code: `class User {
  greet() { return "hi"; }
}

const u = new User();
console.log(Object.getPrototypeOf(u) === User.prototype); // true`,
      },
    },
    {
      question: "Where should instance methods live?",
      answer:
        "Methods shared by all instances should be on the prototype to avoid per-instance duplication.",
    },
    {
      question: "Can primitives use prototype methods?",
      answer:
        "Yes. JavaScript temporarily boxes primitives, allowing access to methods on Number.prototype, String.prototype, and others.",
    },
    {
      question: "What ends the prototype chain?",
      answer:
        "The chain ends at null, typically after reaching Object.prototype for ordinary objects.",
    },
  ],
  relatedTopicIds: ["this-keyword", "reference-value", "scope-chain", "heap-stack"],
};
