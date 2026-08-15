import type { TopicTheoryContent } from "@/content/theory/types";

export const suspenseTheory: TopicTheoryContent = {
  summary:
    "React Suspense lets you declaratively handle async boundaries in your component tree. Components that are not ready yet show a fallback, and React reveals the real content once all pending data within a boundary has loaded.",
  whatItIs: [
    "Suspense is a React component that wraps part of your tree and displays a fallback UI while any child underneath is waiting for asynchronous data. It replaces imperative loading-state management with a declarative boundary.",
    "When a child component is not ready (its data-fetching library throws a Promise), React catches that Promise at the nearest Suspense boundary, hides the pending subtree, and renders the fallback instead.",
    "Once all Promises within a boundary resolve, React commits the real content in a single paint, preventing staggered loading states that cause layout shifts.",
  ],
  howItWorks: [
    "Step 1: React renders your component tree and encounters a <Suspense> boundary. It records this as a potential fallback point.",
    "Step 2: a child component throws a Promise (via a Suspense-compatible data source). React catches it at the nearest boundary.",
    "Step 3: React switches the boundary to its fallback. The pending subtree is hidden but not unmounted, so local state is preserved.",
    "Step 4: React attaches a .then() listener to the thrown Promise. When it resolves, React retries rendering the suspended component.",
    "Step 5: if the component renders successfully, React replaces the fallback with the real content in a single commit.",
  ],
  commonMistakes: [
    {
      title: "Using Suspense with useEffect-based fetching",
      explanation:
        "Suspense works with data sources that throw Promises during render (like React Server Components, use(), or libraries such as Relay and SWR with Suspense mode). Plain useEffect fetch calls never throw during render, so Suspense cannot catch them.",
      fix: "Use a Suspense-compatible data fetching approach: the use() hook with a Promise, a framework integration (Next.js Server Components), or a library that supports Suspense (Relay, SWR with suspense: true).",
    },
    {
      title: "Wrapping every component in its own Suspense boundary",
      explanation:
        "Too many boundaries cause a staggered \"popcorn\" loading effect where content pops in one piece at a time, creating a poor user experience.",
      fix: "Group related content within a single boundary. Use nested boundaries only when parts of the page should reveal independently (e.g., main content vs comments).",
    },
    {
      title: "Forgetting that Suspense hides the entire subtree",
      explanation:
        "When one child in a boundary suspends, the entire boundary switches to fallback, hiding all siblings too, even those that are already loaded.",
      fix: "If siblings should remain visible while one loads, wrap only the suspending component in its own boundary.",
    },
  ],
  interviewQuestions: [
    {
      question: "How does Suspense know a component is loading?",
      answer:
        "Suspense relies on the thrown-Promise protocol: a component (or its data source) throws a Promise during render. React catches it at the nearest Suspense boundary. This is different from returning a loading state; the component literally cannot finish rendering yet.",
    },
    {
      question: "What happens when multiple children in one Suspense boundary are loading?",
      answer:
        "The boundary waits for all pending Promises to resolve before revealing any content. This prevents partial UI from appearing and ensures siblings render together in a single commit, avoiding layout shifts.",
    },
    {
      question: "Can you nest Suspense boundaries?",
      answer:
        "Yes. Each boundary is independent. When a component suspends, React walks up the tree and catches the Promise at the nearest ancestor boundary. Inner boundaries can resolve before or after outer ones.",
      codeExample: {
        language: "jsx",
        code: `<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<CommentsSkeleton />}>
    <Comments />
  </Suspense>
</Suspense>`,
      },
    },
    {
      question: "Does Suspense unmount the pending component?",
      answer:
        "No. The suspended component is hidden (not committed to the DOM) but stays mounted in React's internal tree. Local state, refs, and effect cleanup are preserved. When the data arrives, React resumes where it left off.",
    },
  ],
  relatedTopicIds: [
    "render-cycle",
    "fiber-tree",
    "reconciliation",
    "server-components",
    "error-boundaries",
  ],
};
