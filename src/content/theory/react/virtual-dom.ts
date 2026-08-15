import type { TopicTheoryContent } from "@/content/theory/types";

export const virtualDomTheory: TopicTheoryContent = {
  summary:
    "The virtual DOM is a lightweight JavaScript object tree that mirrors the structure of the real DOM. React builds this tree from JSX via createElement, diffs it on re-renders, and applies only the minimal set of changes to the actual browser DOM.",
  whatItIs: [
    "JSX is not HTML. It is syntactic sugar that a build tool like Babel transforms into React.createElement calls before the code reaches the browser. Each JSX tag becomes a function call that returns a plain JavaScript object describing an element's type, props, and children.",
    "These plain objects form a tree called the virtual DOM. It has the same shape as the UI you described in JSX, but it exists entirely in memory as regular JavaScript data, not as browser DOM nodes.",
    "When state changes, React calls your component again to produce a new virtual DOM tree, compares it with the previous one (reconciliation), and updates only the real DOM nodes that actually changed. This avoids expensive full-page re-renders.",
  ],
  howItWorks: [
    "Step 1: Babel compiles JSX tags into React.createElement calls. Inner elements are compiled first, then passed as children to their parent's createElement call.",
    "Step 2: each createElement call returns a plain object with a type field (string for host elements like 'div', function reference for components), a props object, and a children array.",
    "Step 3: for component types, React calls the component function to resolve it into host elements. This process repeats recursively until the entire tree consists of host element objects.",
    "Step 4: on the initial mount, React walks the resolved tree and creates matching real DOM nodes. On re-renders, React builds a new tree, diffs it against the previous tree, and applies only the changes (attribute updates, text node swaps, insertions, removals).",
  ],
  commonMistakes: [
    {
      title: "Thinking virtual DOM is a browser feature",
      explanation:
        "The virtual DOM is not a web standard or a browser API. It is a pattern React uses internally. The browser only sees real DOM nodes after React has processed the virtual tree.",
      fix: "Think of the virtual DOM as a blueprint (plain JS objects) that React translates into real DOM operations. The browser never interacts with it directly.",
    },
    {
      title: "Assuming virtual DOM always makes apps faster",
      explanation:
        "The virtual DOM adds overhead: React must build the object tree, diff it, and then update the DOM. For simple UIs with few updates, directly manipulating the DOM can be faster.",
      fix: "The virtual DOM wins when updates are frequent and scattered across a large tree. It batches and minimizes DOM writes, which is where the real performance gain comes from.",
    },
    {
      title: "Confusing JSX with HTML",
      explanation:
        "JSX uses camelCase attributes (className, onClick) and requires a single root expression. Writing HTML attributes like 'class' or 'onclick' will not work or will cause warnings.",
      fix: "Remember that JSX compiles to JavaScript function calls. Use className instead of class, htmlFor instead of for, and camelCase event handlers.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is the virtual DOM and why does React use it?",
      answer:
        "The virtual DOM is an in-memory tree of plain JavaScript objects that describes the UI. React uses it to avoid direct DOM manipulation on every state change. Instead, React builds a new virtual tree, diffs it against the previous one, and applies only the necessary changes to the real DOM.",
    },
    {
      question: "What does JSX compile to?",
      answer:
        "JSX compiles to React.createElement calls (or the jsx runtime in React 17+). Each JSX tag becomes a function call that returns a plain object with type, props, and children fields.",
      codeExample: {
        language: "jsx",
        code: `// JSX
<button className="btn">Click</button>

// Compiles to
React.createElement("button", { className: "btn" }, "Click")

// Returns
{ type: "button", props: { className: "btn", children: "Click" } }`,
      },
    },
    {
      question:
        "What is the difference between a host element and a component element in the virtual DOM?",
      answer:
        "A host element has a string type (like 'div' or 'span') and maps directly to a real DOM node. A component element has a function (or class) as its type. React must call that function to resolve it into host elements before it can create DOM nodes.",
    },
    {
      question: "How does React update the DOM when state changes?",
      answer:
        "React calls the component function again to produce a new virtual DOM tree. It then diffs (reconciles) this new tree against the previous one, identifies the minimum set of changes, and applies those changes to the real DOM in a single batch.",
    },
  ],
  relatedTopicIds: [
    "reconciliation",
    "fiber-tree",
    "render-cycle",
    "hooks",
    "context-propagation",
  ],
};
