import type { TopicTheoryContent } from "@/content/theory/types";

export const typeCoercionTheory: TopicTheoryContent = {
  summary:
    "Type coercion is JavaScript's implicit or explicit conversion process between primitives, which affects equality, arithmetic, boolean checks, and many edge-case behaviors.",
  whatItIs: [
    "JavaScript operations often require operands of certain types. When values differ from expected types, JavaScript converts them according to specification rules.",
    "Coercion can be explicit, such as Number(value), String(value), or Boolean(value), or implicit, such as string concatenation and loose equality.",
    "Understanding coercion prevents bugs around null, undefined, empty strings, NaN, and comparison operators.",
  ],
  howItWorks: [
    "Step 1: an operator or language construct evaluates operand types.",
    "Step 2: if required, JavaScript applies conversion algorithms to one or both operands.",
    "Step 3: operation proceeds using converted values and returns a result.",
    "Step 4: further expressions may trigger additional coercions, especially in chained comparisons or mixed-type arithmetic.",
  ],
  commonMistakes: [
    {
      title: "Using loose equality without understanding rules",
      explanation:
        "== applies multi-step coercion that can produce surprising results across strings, numbers, booleans, null, and undefined.",
      fix: "Default to === and use == only in deliberate, well-understood cases.",
    },
    {
      title: "Treating all non-number strings as NaN conversions",
      explanation:
        "Some strings convert unexpectedly, such as Number('') and Number(' ') returning 0.",
      fix: "Validate and normalize input before numeric conversion.",
    },
    {
      title: "Relying on truthy and falsy checks for business rules",
      explanation:
        "Values like 0, '', and NaN are falsy but may represent valid user input.",
      fix: "Use explicit checks for nullish values or domain-specific conditions.",
    },
  ],
  interviewQuestions: [
    {
      question: "Is NaN equal to itself?",
      answer:
        "No. NaN is the only JavaScript value that is not equal to itself. Use Number.isNaN to test it reliably.",
      codeExample: {
        language: "javascript",
        code: `console.log(NaN === NaN); // false
console.log(Number.isNaN(NaN)); // true
console.log([] == false); // true (coercion)`,
      },
    },
    {
      question: "Why is [] == false true in JavaScript?",
      answer:
        "Loose equality triggers coercion steps that convert values before comparison, leading to unintuitive but spec-defined results.",
    },
    {
      question: "Should I ever use == ?",
      answer:
        "It can be acceptable for specific patterns like value == null to match null or undefined, but use it intentionally and sparingly.",
    },
    {
      question: "Does Boolean('false') return false?",
      answer:
        "No. Non-empty strings are truthy, so Boolean('false') returns true.",
    },
  ],
  relatedTopicIds: ["reference-value", "this-keyword", "promises", "hoisting"],
};
