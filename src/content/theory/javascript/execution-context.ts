import type { TopicTheoryContent } from "@/content/theory/types";

export const executionContextTheory: TopicTheoryContent = {
  summary:
    "An execution context is the environment in which JavaScript code is evaluated and executed, containing the variable environment, lexical environment, and this binding.",
  whatItIs: [
    "Every time JavaScript runs code, it does so inside an execution context. There are two main types: the Global Execution Context (created once when the script starts) and Function Execution Contexts (created each time a function is called).",
    "Each execution context goes through two phases. The creation phase scans for declarations, hoists variables (var as undefined, functions as their full definition), binds parameters, and determines the value of this. The execution phase runs code line by line, assigning values and evaluating expressions.",
    "Execution contexts are managed on a call stack (the Execution Context Stack). The global context sits at the bottom. Each function call pushes a new context; when the function returns, its context is popped. Only the topmost context is actively running at any moment.",
  ],
  howItWorks: [
    "Step 1: the engine creates the Global Execution Context, hoists all top-level var declarations and function declarations, and binds this to the global object.",
    "Step 2: the global code begins executing line by line. When a function call is encountered, a new Function Execution Context is created.",
    "Step 3: the new context enters its creation phase - parameters are bound, local var declarations are hoisted, and this is determined by the call-site rules.",
    "Step 4: the function's code executes. If it calls another function, yet another context is pushed onto the stack (nested call).",
    "Step 5: when a function returns, its execution context is popped from the stack and control resumes in the caller's context.",
  ],
  commonMistakes: [
    {
      title: "Assuming var variables have values during creation phase",
      explanation:
        "During the creation phase, var-declared variables are hoisted but initialized to undefined. Accessing them before their assignment line yields undefined, not the intended value.",
      fix: "Understand that hoisting only registers the name. Place var declarations (or prefer let/const) near the top of their scope to avoid confusion.",
    },
    {
      title: "Confusing execution context with scope",
      explanation:
        "Scope determines variable visibility and is set lexically at author time. Execution context is the runtime container that holds the current scope, this binding, and outer environment reference.",
      fix: "Think of scope as the rules for finding variables and execution context as the runtime instance that applies those rules.",
    },
    {
      title: "Forgetting that this is bound per execution context",
      explanation:
        "Each function execution context gets its own this value determined at call time. Arrow functions are the exception - they inherit this from the enclosing context.",
      fix: "Check how a function is called (method, standalone, new, arrow) to predict its this value in that execution context.",
    },
  ],
  interviewQuestions: [
    {
      question: "What happens during the creation phase of an execution context?",
      answer:
        "The engine scans the code for declarations. var variables are hoisted and set to undefined, function declarations are stored in full, parameters are bound to argument values, and the this value is determined. No code is executed yet.",
    },
    {
      question: "How many Global Execution Contexts exist at a time?",
      answer:
        "Exactly one. The Global EC is created when the script starts and remains at the bottom of the call stack until the program ends.",
    },
    {
      question: "What is the difference between Variable Environment and Lexical Environment?",
      answer:
        "The Variable Environment holds var and function declarations. The Lexical Environment additionally tracks let and const bindings. In practice both are part of the same execution context, but the spec separates them to handle block scoping for let/const.",
      codeExample: {
        language: "javascript",
        code: `function demo() {
  var a = 1;    // Variable Environment
  let b = 2;    // Lexical Environment
  {
    let c = 3;  // new Lexical Environment for this block
    console.log(a, b, c); // 1, 2, 3
  }
  // c is not accessible here
}`,
      },
    },
    {
      question: "Why does the following code log undefined?",
      answer:
        "During the creation phase of the function execution context, x is hoisted and set to undefined. The console.log runs before the assignment line, so it sees undefined.",
      codeExample: {
        language: "javascript",
        code: `function test() {
  console.log(x); // undefined
  var x = 10;
}
test();`,
      },
    },
    {
      question: "Do arrow functions create their own execution context?",
      answer:
        "Arrow functions do create an execution context when called, but that context does not get its own this or arguments binding. Instead it inherits this from the enclosing lexical context, which is why arrow functions are often described as not having their own execution context for this purposes.",
      codeExample: {
        language: "javascript",
        code: `const obj = {
  value: 42,
  getValueArrow: () => this.value,   // this = enclosing scope (window)
  getValueRegular() { return this.value; } // this = obj
};

obj.getValueArrow();   // undefined (window.value)
obj.getValueRegular(); // 42`,
      },
    },
  ],
  relatedTopicIds: [
    "scope-chain",
    "hoisting",
    "this-keyword",
    "closures",
    "heap-stack",
  ],
};
