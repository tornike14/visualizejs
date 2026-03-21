import type { TopicTheoryContent } from "@/content/theory/types";

export const serverComponentsTheory: TopicTheoryContent = {
  summary:
    "React Server Components split rendering between server and client. Server Components run only on the server, ship zero JavaScript to the browser, and can access backend resources directly. Client Components handle interactivity.",
  whatItIs: [
    "Server Components are React components that execute exclusively on the server. They can use async/await, access databases and file systems directly, and their code never reaches the browser bundle.",
    "Client Components are marked with 'use client' at the top of their file. They run in the browser (and optionally on the server for SSR) and can use hooks like useState, useEffect, and event handlers.",
    "The RSC protocol serializes the server render output into a streaming payload: HTML chunks for server-rendered content, client references for 'use client' components, and serialized props at the boundary between server and client.",
  ],
  howItWorks: [
    "Step 1: React starts a server render pass. It calls Server Component functions on the server, executes async operations, and produces rendered output.",
    "Step 2: when React encounters a 'use client' component, it stops rendering and records a client reference (module path + export name) in the payload.",
    "Step 3: props crossing the server/client boundary are serialized. Only JSON-serializable values (strings, numbers, booleans, arrays, plain objects, Promises) can cross. Functions, classes, and Symbols cannot.",
    "Step 4: the RSC payload streams to the browser. The client runtime loads the referenced client modules and hydrates them with the serialized props.",
    "Step 5: Server Components that were passed as children to Client Components (the composition pattern) are already rendered to HTML on the server. The client component receives them as opaque JSX it can render without re-executing.",
  ],
  commonMistakes: [
    {
      title: "Importing a Server Component into a Client Component",
      explanation:
        "Once you cross the 'use client' boundary, everything imported by that module becomes part of the client bundle. You cannot import a Server Component into a Client Component file.",
      fix: "Use the composition pattern: pass the Server Component as children or a prop from a Server Component parent. The parent renders it on the server and passes the result down.",
    },
    {
      title: "Passing non-serializable props across the boundary",
      explanation:
        "Functions, class instances, Symbols, and other non-serializable values cannot cross the server/client boundary. Attempting to pass them throws a serialization error.",
      fix: "Pass only serializable data (strings, numbers, booleans, arrays, plain objects). If the client needs a callback, define it in the Client Component itself, not on the server.",
    },
    {
      title: "Adding 'use client' too high in the tree",
      explanation:
        "Marking a component as 'use client' turns it and all its imports into client code. This increases the JavaScript bundle and prevents server-only features (async, direct DB access) in the entire subtree.",
      fix: "Push the 'use client' boundary as far down the tree as possible. Only the interactive leaf components need it. Use composition to keep data-fetching in Server Components.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is the difference between Server Components and SSR?",
      answer:
        "SSR renders the full component tree on the server to produce initial HTML, then ships all the JavaScript to the client for hydration. Server Components render specific components on the server permanently - their code never reaches the client bundle. SSR is a rendering strategy; Server Components are a component type.",
    },
    {
      question: "Can a Client Component render a Server Component?",
      answer:
        "Not by importing it directly. But a Server Component can be passed to a Client Component as children or a prop (the composition pattern). The Server Component is rendered on the server first, and the Client Component receives the result as opaque JSX.",
      codeExample: {
        language: "jsx",
        code: `// ServerParent.tsx (Server Component)
export default function ServerParent() {
  return (
    <ClientShell>
      <ServerSidebar /> {/* rendered on server, passed as children */}
    </ClientShell>
  );
}`,
      },
    },
    {
      question: "What can cross the server/client boundary?",
      answer:
        "Only JSON-serializable values: strings, numbers, booleans, null, arrays, plain objects, Dates, and Promises (when used with the use() hook). Functions, class instances, Symbols, and DOM nodes cannot be serialized and will throw an error.",
    },
    {
      question: "Why do Server Components reduce bundle size?",
      answer:
        "Server Component code runs only on the server. Their imports (database drivers, markdown parsers, large data processing libraries) are never sent to the browser. Only the rendered output (HTML) and client references are included in the payload.",
    },
  ],
  relatedTopicIds: [
    "suspense",
    "render-cycle",
    "reconciliation",
    "virtual-dom",
  ],
};
