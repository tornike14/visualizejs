import type { TopicTheoryContent } from "@/content/theory/types";

export const useEffectLifecycleTheory: TopicTheoryContent = {
  summary:
    "useEffect runs side effects after React commits DOM updates and the browser paints. The dependency array controls when effects re-run, and the cleanup function handles teardown before the next invocation or unmount.",

  whatItIs: [
    "useEffect is a React hook for synchronizing a component with an external system. It accepts a setup function and an optional dependency array. React calls the setup function after the browser has painted the committed DOM changes, not during the render phase.",
    "The dependency array tells React when to re-run the effect. An empty array means run once on mount. Omitting the array means run after every render. Listing specific values means re-run only when those values change, compared with Object.is.",
    "The setup function can return a cleanup function. React calls cleanup before re-running the effect with new values and one final time when the component unmounts. Each cleanup closes over the values from the render that created it, not the current render.",
  ],

  howItWorks: [
    "Step 1: the component renders. React calls the function body, records any useEffect calls, and produces a virtual DOM tree. No effects run yet.",
    "Step 2: React commits DOM mutations from the diff. The browser paints the updated pixels to the screen.",
    "Step 3: React checks the dependency array against the previous render's deps using Object.is. If any value changed (or this is the first render), React marks the effect for execution.",
    "Step 4: React runs pending cleanups from the previous render first, then runs the new effect setup functions. This order ensures the old subscription is torn down before the new one is created.",
  ],

  commonMistakes: [
    {
      title: "Missing dependencies causing stale closures",
      explanation:
        "If a variable used inside the effect is not listed in the dependency array, the effect captures the value from the render when it was created and never sees updates.",
      fix: "Include every reactive value the effect reads in the dependency array. Use the react-hooks/exhaustive-deps ESLint rule to catch missing deps automatically.",
    },
    {
      title: "Objects or arrays in deps causing infinite loops",
      explanation:
        "Creating a new object or array during render produces a new reference every time. Object.is sees it as changed, so the effect re-runs on every render.",
      fix: "Move the object creation outside the component, memoize it with useMemo, or list the individual primitive values the effect actually needs.",
    },
    {
      title: "Confusing useEffect with useLayoutEffect",
      explanation:
        "useEffect runs after paint, which can cause a visible flicker if the effect modifies the DOM. useLayoutEffect runs after commit but before paint, blocking the browser until it finishes.",
      fix: "Default to useEffect. Switch to useLayoutEffect only when you need to read layout (e.g., measuring an element) or make DOM changes that must be visible on the first paint.",
    },
  ],

  interviewQuestions: [
    {
      question: "When does useEffect run relative to rendering?",
      answer:
        "useEffect runs after the browser has painted the committed DOM changes. React first renders (calls the component function), then commits DOM mutations, then the browser paints, and finally React runs pending effects. This is asynchronous relative to the render.",
    },
    {
      question:
        "What happens when you pass no dependency array vs an empty array?",
      answer:
        "No array: the effect runs after every render. Empty array []: the effect runs once after the initial mount and cleanup runs once on unmount. This is because React has no dependencies to compare, so it never finds a reason to re-run.",
    },
    {
      question: "How does cleanup timing work with dependency changes?",
      answer:
        "When deps change, React first runs the cleanup from the previous effect (which closes over the old values), then runs the new effect setup (which closes over the current values). On unmount, React runs the final cleanup. This ensures resources from the old render are always released before new ones are created.",
      codeExample: {
        code: `useEffect(() => {
  console.log("connect to", roomId);
  return () => {
    console.log("disconnect from", roomId);
  };
}, [roomId]);
// roomId "A" -> "B":
// "disconnect from A" (cleanup)
// "connect to B"      (new effect)`,
        language: "javascript",
      },
    },
  ],

  relatedTopicIds: ["hooks", "render-cycle", "closures", "memoization", "suspense"],
};
