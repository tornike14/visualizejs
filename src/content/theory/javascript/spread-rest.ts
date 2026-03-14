import type { TopicTheoryContent } from "@/content/theory/types";

export const spreadRestTheory: TopicTheoryContent = {
  summary:
    "The spread operator expands iterables into individual elements, while the rest syntax collects multiple elements into a single array or object, using the same three-dot notation in different contexts.",
  whatItIs: [
    "Spread syntax (...) expands an iterable (array, string, object) into individual elements. In arrays it unpacks elements; in objects it copies enumerable own properties into a new object.",
    "Rest syntax (...) collects remaining elements or properties into an array or object. In function parameters it gathers extra arguments; in destructuring it captures leftovers.",
    "Both use the same ... notation but serve opposite purposes: spread expands, rest collects. The context determines which operation occurs.",
  ],
  howItWorks: [
    "Step 1: in array spread, the engine iterates the source and inserts each element at the spread position in the new array.",
    "Step 2: in object spread, enumerable own properties are copied left to right into the new object, with later properties overriding earlier ones.",
    "Step 3: rest parameters in functions collect all remaining arguments after named parameters into a real Array.",
    "Step 4: rest in destructuring gathers unmatched elements (arrays) or properties (objects) into a new container.",
  ],
  commonMistakes: [
    {
      title: "Assuming object spread creates a deep copy",
      explanation:
        "Object spread only copies top-level properties. Nested objects remain shared references, so mutating nested data affects the original.",
      fix: "Use structuredClone for deep copies, or manually spread nested levels when full independence is needed.",
    },
    {
      title: "Placing rest parameter before other parameters",
      explanation:
        "The rest parameter must be the last parameter in a function signature. Placing it elsewhere causes a SyntaxError.",
      fix: "Always declare rest as the final parameter: function fn(a, b, ...rest).",
    },
    {
      title: "Spreading non-iterable values",
      explanation:
        "Spreading a number or boolean in an array context throws a TypeError because they are not iterable.",
      fix: "Only spread iterables (arrays, strings, Sets, Maps) in array contexts. Objects can only be spread in object literals.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is the difference between spread and rest?",
      answer:
        "Spread expands elements in an array/object literal or function call. Rest collects elements in a function parameter or destructuring pattern. Same syntax, opposite direction.",
      codeExample: {
        language: "javascript",
        code: `// Spread: expands
const merged = [...arr1, ...arr2];

// Rest: collects
const [first, ...rest] = [1, 2, 3];`,
      },
    },
    {
      question: "How does property override order work with object spread?",
      answer:
        "Properties are copied left to right. If the same key appears in multiple spread sources, the last one wins.",
      codeExample: {
        language: "javascript",
        code: `const a = { x: 1, y: 2 };
const b = { y: 3, z: 4 };
const c = { ...a, ...b };
console.log(c); // { x: 1, y: 3, z: 4 }`,
      },
    },
    {
      question: "How are rest parameters different from the arguments object?",
      answer:
        "Rest parameters produce a real Array with all array methods. The arguments object is array-like but not a true Array, and does not work in arrow functions.",
    },
    {
      question: "Can you use spread to clone an array?",
      answer:
        "Yes, [...arr] creates a shallow copy. The new array has the same elements but is a separate array object, so pushing to the clone does not affect the original.",
      codeExample: {
        language: "javascript",
        code: `const original = [1, 2, 3];
const clone = [...original];
clone.push(4);
console.log(original); // [1, 2, 3]`,
      },
    },
  ],
  relatedTopicIds: ["destructuring", "reference-value", "closures", "scope-chain", "hoisting"],
};
