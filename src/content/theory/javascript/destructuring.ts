import type { TopicTheoryContent } from "@/content/theory/types";

export const destructuringTheory: TopicTheoryContent = {
  summary:
    "Destructuring assignment unpacks values from arrays by position and properties from objects by name into distinct variables, reducing boilerplate and improving readability.",
  whatItIs: [
    "Array destructuring assigns elements to variables based on their index position. You can skip elements with empty commas and provide default values for missing indices.",
    "Object destructuring extracts properties by matching property names. Variables can be renamed with the colon syntax and given defaults when a property is undefined.",
    "Destructuring works in function parameters, letting you extract needed values directly from arguments without intermediate variables. This is especially common for configuration objects and React props.",
  ],
  howItWorks: [
    "Step 1: the engine evaluates the right-hand side expression to get the source value (array or object).",
    "Step 2: for arrays, elements are matched by index position; for objects, properties are matched by name.",
    "Step 3: if a destructured variable has a default value and the matched value is undefined, the default is used instead.",
    "Step 4: nested patterns reach into inner structures, and rest elements collect whatever remains.",
  ],
  commonMistakes: [
    {
      title: "Confusing object rename syntax with defaults",
      explanation:
        "In { name: alias }, the colon renames the variable. Developers sometimes confuse this with { name = default }, which sets a default value.",
      fix: "Remember: colon renames (prop: newName), equals defaults (prop = fallback). You can combine them: { prop: newName = fallback }.",
    },
    {
      title: "Destructuring null or undefined",
      explanation:
        "Attempting to destructure null or undefined throws a TypeError because the engine cannot read properties from non-object values.",
      fix: "Guard with a fallback: const { x } = obj ?? {} or provide a default parameter in functions.",
    },
    {
      title: "Forgetting parentheses for assignment without declaration",
      explanation:
        "Writing { a, b } = obj without let/const is parsed as a block statement, causing a syntax error.",
      fix: "Wrap in parentheses: ({ a, b } = obj). The parens force expression parsing.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is the difference between array and object destructuring?",
      answer:
        "Array destructuring matches by position (index), while object destructuring matches by property name. Arrays use square brackets, objects use curly braces.",
      codeExample: {
        language: "javascript",
        code: `const [a, b] = [1, 2];        // by position
const { x, y } = { x: 1, y: 2 }; // by name`,
      },
    },
    {
      question: "How do default values work in destructuring?",
      answer:
        "Defaults activate only when the destructured value is undefined. A null value does not trigger the default.",
      codeExample: {
        language: "javascript",
        code: `const { a = 10 } = { a: undefined }; // a = 10
const { b = 10 } = { b: null };      // b = null`,
      },
    },
    {
      question: "Can you swap two variables using destructuring?",
      answer:
        "Yes. Array destructuring allows swapping without a temporary variable: [a, b] = [b, a].",
      codeExample: {
        language: "javascript",
        code: `let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1`,
      },
    },
    {
      question: "How do you destructure nested objects?",
      answer:
        "Use nested curly braces matching the object shape. The intermediate property name acts as a path, not a variable.",
      codeExample: {
        language: "javascript",
        code: `const user = { address: { city: "NYC" } };
const { address: { city } } = user;
console.log(city); // "NYC"
// 'address' is NOT a variable here`,
      },
    },
  ],
  relatedTopicIds: ["spread-rest", "scope-chain", "closures", "reference-value"],
};
