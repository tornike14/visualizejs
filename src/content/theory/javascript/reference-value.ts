import type { TopicTheoryContent } from "@/content/theory/types";

export const referenceValueTheory: TopicTheoryContent = {
  summary:
    "JavaScript primitives are copied by value while objects are handled through references to heap allocations, which explains shared mutation and copy behavior.",
  whatItIs: [
    "Primitive assignments and argument passing copy the actual primitive value, so later changes to one variable do not affect the other.",
    "Objects and arrays are stored in memory locations, and variables hold references to those locations. Copying such variables copies the reference, not the object contents.",
    "Understanding this distinction is essential for predictable state updates, immutability patterns, and avoiding accidental side effects.",
  ],
  howItWorks: [
    "Step 1: primitive assignment creates an independent value copy.",
    "Step 2: object assignment copies a reference to the same underlying object.",
    "Step 3: mutating a shared object through one reference is visible from all references.",
    "Step 4: shallow-copy operations clone only top-level properties, keeping nested references shared unless deep cloning is used.",
  ],
  commonMistakes: [
    {
      title: "Assuming object assignment makes a deep copy",
      explanation:
        "const b = a for objects means both variables point to the same object, so mutation through one affects the other.",
      fix: "Use copy utilities and immutable update patterns when independent objects are needed.",
    },
    {
      title: "Relying on shallow spread for nested isolation",
      explanation:
        "Object and array spread copy only one level, leaving nested objects shared by reference.",
      fix: "Deep clone nested structures intentionally with structuredClone or custom copy logic.",
    },
    {
      title: "Mutating function arguments unexpectedly",
      explanation:
        "Passing an object into a function passes its reference, so in-function mutation can leak outside.",
      fix: "Clone inputs or keep functions pure when mutation side effects are undesired.",
    },
  ],
  interviewQuestions: [
    {
      question: "Are arrays passed by reference in JavaScript?",
      answer:
        "JavaScript passes values. For arrays and objects, that value is a reference to the underlying object.",
      codeExample: {
        language: "javascript",
        code: `const a = { count: 1 };
const b = a;
b.count = 2;

console.log(a.count); // 2 (shared object identity)`,
      },
    },
    {
      question: "What is the fastest safe deep-copy option?",
      answer:
        "structuredClone is a solid built-in for many cases, but compatibility and data-shape constraints should be considered.",
    },
    {
      question: "How can I check if two variables reference the same object?",
      answer:
        "Strict equality compares object identity, so a === b is true when both references point to the same object.",
    },
    {
      question: "Does Object.freeze make nested objects immutable too?",
      answer:
        "No. freeze is shallow and does not recursively freeze nested objects unless you do so manually.",
    },
  ],
  relatedTopicIds: ["heap-stack", "garbage-collection", "type-coercion", "closures"],
};
