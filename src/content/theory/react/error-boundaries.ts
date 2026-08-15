import type { TopicTheoryContent } from "@/content/theory/types";

export const errorBoundariesTheory: TopicTheoryContent = {
  summary:
    "Error boundaries are React class components that catch JavaScript errors in their child component tree during rendering, lifecycle methods, and constructors. They display a fallback UI instead of crashing the entire application.",

  whatItIs: [
    "An error boundary is a class component that implements getDerivedStateFromError, componentDidCatch, or both. When a child component throws during render, React catches the error and delegates it to the nearest boundary up the tree. The boundary then renders fallback UI instead of the broken subtree.",
    "getDerivedStateFromError is a static method called during the render phase. It receives the error and returns an object to update state. componentDidCatch is called during the commit phase and receives both the error and an info object containing the component stack trace. Use it for side effects like logging.",
    "Error boundaries only catch errors in the React render path: component render methods, lifecycle methods, and constructors. They do not catch errors in event handlers, asynchronous code (setTimeout, promises), server-side rendering, or errors thrown in the boundary itself.",
  ],

  howItWorks: [
    "Step 1: a child component throws an error during rendering. React halts the render of that subtree.",
    "Step 2: React walks up the component tree looking for the nearest error boundary. If no boundary is found, the entire tree unmounts.",
    "Step 3: the boundary's getDerivedStateFromError method runs. It returns a state update (e.g., { hasError: true }) so the boundary knows to render fallback UI on the next render.",
    "Step 4: React re-renders the boundary with the updated state. The boundary's render method checks the error flag and returns fallback UI instead of this.props.children. componentDidCatch then fires for logging or analytics.",
  ],

  commonMistakes: [
    {
      title: "Expecting boundaries to catch event handler errors",
      explanation:
        "Error boundaries only catch errors during the render and commit phases. Errors in onClick, onChange, or other event handlers are not caught by boundaries.",
      fix: "Use standard try/catch inside event handlers. For async errors, handle rejections with .catch() or try/catch in async functions.",
    },
    {
      title: "Placing a single boundary at the root",
      explanation:
        "One root-level boundary replaces the entire UI on any error. Users lose all context and functionality when a small part of the app fails.",
      fix: "Place granular boundaries around independent sections: sidebar, main content, individual widgets. This way, a failure in one section leaves the rest functional.",
    },
    {
      title: "Forgetting that boundaries must be class components",
      explanation:
        "There is no hook equivalent for getDerivedStateFromError or componentDidCatch. Function components cannot be error boundaries (as of React 19).",
      fix: "Write a reusable ErrorBoundary class component or use the react-error-boundary library, which wraps the class API with a convenient component and hook interface.",
    },
  ],

  interviewQuestions: [
    {
      question: "What errors can error boundaries NOT catch?",
      answer:
        "Error boundaries do not catch errors in event handlers, asynchronous code (setTimeout, requestAnimationFrame, promises), server-side rendering, or errors thrown in the error boundary itself. For these cases, use try/catch or promise .catch() handlers.",
    },
    {
      question: "How do you recover from an error boundary's fallback state?",
      answer:
        "Reset the boundary's hasError state. This can be done with a retry button that calls setState, or by passing a key prop that changes when the error condition might be resolved. Libraries like react-error-boundary provide resetKeys for automatic recovery when specific values change.",
    },
    {
      question: "Why are there no hook-based error boundaries?",
      answer:
        "getDerivedStateFromError and componentDidCatch are lifecycle methods that need to intercept the React render cycle at specific points. React has not yet provided hook equivalents for these interception points. The react-error-boundary library provides a useErrorBoundary hook, but it still uses a class component internally.",
    },
  ],

  relatedTopicIds: ["reconciliation", "render-cycle", "suspense", "hooks", "fiber-tree"],
};
