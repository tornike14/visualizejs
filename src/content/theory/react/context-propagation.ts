import type { TopicTheoryContent } from "@/content/theory/types";

export const contextPropagationTheory: TopicTheoryContent = {
  summary:
    "React Context provides a way to pass data through the component tree without prop drilling. A Provider stores a value, and any descendant that calls useContext subscribes to that value and re-renders whenever it changes.",
  whatItIs: [
    "Context solves the problem of passing data through many layers of components that do not use it themselves. Instead of threading props through every intermediate component, you wrap a subtree in a Provider and let any descendant read the value directly with useContext.",
    "Internally, createContext creates a context object that holds a default value. When a Provider mounts, it stores a new value on the context. When useContext is called, React walks up the fiber tree from the consumer to find the nearest Provider for that context and returns its current value.",
    "Context does not have a built-in selector mechanism. When a Provider's value changes (determined by Object.is comparison), React re-renders every component that called useContext for that specific context, regardless of which part of the value each consumer actually uses.",
  ],
  howItWorks: [
    "Step 1: createContext(defaultValue) creates a context object. The default value is used only when a consumer has no Provider ancestor for this context.",
    "Step 2: a Provider component mounts in the tree with a value prop. React stores this value and associates it with the context object. Multiple Providers for the same context can be nested, with inner ones shadowing outer ones.",
    "Step 3: when a component calls useContext(MyContext), React subscribes that component to MyContext. It walks up the fiber tree to find the nearest Provider and returns its current value.",
    "Step 4: when the Provider's value changes (parent re-renders with a new value prop), React uses Object.is to compare old and new values. If they differ, React schedules a re-render for every subscribed consumer of that context.",
  ],
  commonMistakes: [
    {
      title: "Passing a new object literal as Provider value",
      explanation:
        "Writing <Provider value={{ theme, locale }}> creates a new object on every render. Since Object.is compares by reference, every consumer re-renders even if theme and locale have not changed.",
      fix: "Memoize the value object with useMemo: const value = useMemo(() => ({ theme, locale }), [theme, locale]). This keeps the same reference when the dependencies have not changed.",
    },
    {
      title: "Putting too much state in a single context",
      explanation:
        "A context with many fields causes all consumers to re-render when any field changes, even if a given consumer only reads one field. There is no way to subscribe to a subset of the context value.",
      fix: "Split large contexts into smaller, focused ones. For example, separate ThemeContext from UserContext. Each consumer then only re-renders when the specific context it subscribes to changes.",
    },
    {
      title: "Expecting useContext to work like a selector",
      explanation:
        "Unlike Redux useSelector, useContext does not accept a selector function. You cannot pick a single field from the context value and skip re-renders when other fields change.",
      fix: "Use the use(Context) API in React 19+ with memoization patterns, split contexts, or consider an external state library for fine-grained subscriptions.",
    },
  ],
  interviewQuestions: [
    {
      question: "How does React determine the value returned by useContext?",
      answer:
        "React walks up the fiber tree from the component that called useContext to find the nearest Provider for that context. It returns the Provider's current value prop. If no Provider exists, it returns the default value passed to createContext.",
    },
    {
      question: "What happens when a Provider's value changes?",
      answer:
        "React compares the old and new values using Object.is. If they differ, every component that called useContext for that context is scheduled for a re-render, regardless of whether the component uses the changed part of the value.",
      codeExample: {
        language: "jsx",
        code: `// All consumers re-render when count changes
<CountCtx.Provider value={count}>
  <Display />   {/* re-renders */}
  <Badge />     {/* re-renders */}
  <Logo />      {/* does NOT re-render (no useContext) */}
</CountCtx.Provider>`,
      },
    },
    {
      question: "How do nested Providers for the same context work?",
      answer:
        "An inner Provider shadows the outer one for its entire subtree. Consumers inside the inner Provider read the inner value. Consumers outside the inner Provider (but inside the outer) read the outer value. Each consumer always reads from its nearest ancestor Provider.",
      codeExample: {
        language: "jsx",
        code: `<ThemeCtx.Provider value="dark">
  <Label />  {/* reads "dark" */}
  <ThemeCtx.Provider value="blue">
    <Label />  {/* reads "blue" */}
  </ThemeCtx.Provider>
</ThemeCtx.Provider>`,
      },
    },
    {
      question:
        "Why does passing an object literal as a Provider value cause unnecessary re-renders?",
      answer:
        "Object literals create a new reference on every render. Since React uses Object.is (reference equality) to detect value changes, a new reference always counts as a change, triggering all consumers to re-render. Wrapping the value in useMemo prevents this by preserving the reference when dependencies have not changed.",
    },
  ],
  relatedTopicIds: [
    "reconciliation",
    "hooks",
    "render-cycle",
    "fiber-tree",
    "closures",
  ],
};
