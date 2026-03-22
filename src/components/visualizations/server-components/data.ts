import type { RSCExample } from "./types";

export const EXAMPLES: RSCExample[] = [
  /* ── Server vs Client (basic) ── */
  {
    id: "basic-split",
    title: "Server vs Client",
    description:
      "Server Component parent with a Client Component child. See what renders where.",
    kind: "basic",
    codeLines: [
      { num: 1, text: "// page.tsx (Server Component)" },
      { num: 2, text: "import { Counter } from './Counter';" },
      { num: 3, text: "" },
      { num: 4, text: "export default async function Page() {" },
      { num: 5, text: "  const data = await fetchData();" },
      { num: 6, text: "  return (" },
      { num: 7, text: "    <main>" },
      { num: 8, text: "      <h1>{data.title}</h1>" },
      { num: 9, text: "      <Counter initialCount={0} />" },
      { num: 10, text: "    </main>" },
      { num: 11, text: "  );" },
      { num: 12, text: "}" },
      { num: 13, text: "" },
      { num: 14, text: "// Counter.tsx" },
      { num: 15, text: "'use client';" },
      { num: 16, text: "export function Counter({ initialCount }) {" },
      { num: 17, text: "  const [count, setCount] = useState(initialCount);" },
      { num: 18, text: "  return <button onClick={() => setCount(c => c+1)}>{count}</button>;" },
      { num: 19, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "React starts the <span class=\"hl-api\">server render pass</span>. <code>Page</code> is a Server Component (no <code>'use client'</code> directive).",
        activeLine: 4,
        doneLines: [1, 2],
        componentTree: {
          id: "page",
          label: "<Page>",
          props: [{ key: "env", value: "server" }],
          highlight: "active",
          children: [],
        },
        activeNodeId: "page",
        renderPhase: "server-render",
        payload: [],
      },
      {
        descriptionHtml:
          "Server executes <code>await fetchData()</code>. Async works directly in Server Components because they run on the server, not in the browser.",
        activeLine: 5,
        doneLines: [1, 2, 4],
        componentTree: {
          id: "page",
          label: "<Page>",
          props: [{ key: "env", value: "server" }],
          children: [
            { id: "main", label: "<main>", children: [
              { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"My App"' }] },
            ]},
          ],
        },
        activeNodeId: "page",
        renderPhase: "server-render",
        payload: [],
      },
      {
        descriptionHtml:
          "Server renders <code>&lt;main&gt;</code> and <code>&lt;h1&gt;</code>. These produce <span class=\"hl-task\">HTML directly</span> with no client-side JavaScript needed.",
        activeLine: 8,
        doneLines: [1, 2, 4, 5, 6, 7],
        componentTree: {
          id: "page",
          label: "<Page>",
          props: [{ key: "env", value: "server" }],
          children: [
            { id: "main", label: "<main>", children: [
              { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"My App"' }] },
              { id: "counter", label: "<Counter>", props: [{ key: "env", value: "client" }] },
            ]},
          ],
        },
        renderPhase: "server-render",
        payload: [
          { id: "p1", type: "html-chunk", label: "<main>", detail: "static HTML for server-rendered elements", status: "streaming" },
          { id: "p2", type: "html-chunk", label: "<h1>", detail: '"My App" rendered to HTML string', status: "streaming" },
        ],
      },
      {
        descriptionHtml:
          'React encounters <code>&lt;Counter&gt;</code> with <code>\'use client\'</code>. It <span class="hl-loop">stops rendering</span> and records a client reference.',
        activeLine: 9,
        doneLines: [1, 2, 4, 5, 6, 7, 8],
        componentTree: {
          id: "page",
          label: "<Page>",
          props: [{ key: "env", value: "server" }],
          children: [
            { id: "main", label: "<main>", children: [
              { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"My App"' }] },
              { id: "counter", label: "<Counter>", highlight: "active", props: [{ key: "env", value: "client" }] },
            ]},
          ],
        },
        activeNodeId: "counter",
        renderPhase: "serialization",
        payload: [
          { id: "p1", type: "html-chunk", label: "<main>", detail: "static HTML for server-rendered elements", status: "sent" },
          { id: "p2", type: "html-chunk", label: "<h1>", detail: '"My App" rendered to HTML string', status: "sent" },
          { id: "p3", type: "client-reference", label: "<Counter>", detail: "module: ./Counter.tsx, export: Counter", status: "streaming" },
        ],
      },
      {
        descriptionHtml:
          'Serializes props crossing the boundary: <code>initialCount={0}</code>. React validates that the value is <span class="hl-task">serializable</span> (no functions, classes, or Symbols).',
        activeLine: 9,
        doneLines: [1, 2, 4, 5, 6, 7, 8],
        componentTree: {
          id: "page",
          label: "<Page>",
          props: [{ key: "env", value: "server" }],
          children: [
            { id: "main", label: "<main>", children: [
              { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"My App"' }] },
              { id: "counter", label: "<Counter>", props: [{ key: "env", value: "client" }, { key: "initialCount", value: "0" }] },
            ]},
          ],
        },
        renderPhase: "serialization",
        payload: [
          { id: "p1", type: "html-chunk", label: "<main>", detail: "static HTML for server-rendered elements", status: "sent" },
          { id: "p2", type: "html-chunk", label: "<h1>", detail: '"My App" rendered to HTML string', status: "sent" },
          { id: "p3", type: "client-reference", label: "<Counter>", detail: "module: ./Counter.tsx, export: Counter", status: "sent" },
          { id: "p4", type: "serialized-props", label: "Counter props", detail: '{ initialCount: 0 }', status: "streaming" },
        ],
      },
      {
        descriptionHtml:
          'RSC payload streams to the browser. Client loads the Counter module and <span class="hl-api">hydrates</span> it with the serialized props.',
        activeLine: 17,
        doneLines: [1, 2, 4, 5, 6, 7, 8, 9, 14, 15, 16],
        componentTree: {
          id: "page",
          label: "<Page>",
          props: [{ key: "env", value: "server" }],
          children: [
            { id: "main", label: "<main>", children: [
              { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"My App"' }] },
              { id: "counter", label: "<Counter>", highlight: "active", props: [{ key: "env", value: "client" }] },
            ]},
          ],
        },
        activeNodeId: "counter",
        renderPhase: "client-hydration",
        payload: [
          { id: "p1", type: "html-chunk", label: "<main>", detail: "static HTML for server-rendered elements", status: "sent" },
          { id: "p2", type: "html-chunk", label: "<h1>", detail: '"My App" rendered to HTML string', status: "sent" },
          { id: "p3", type: "client-reference", label: "<Counter>", detail: "module: ./Counter.tsx, export: Counter", status: "sent" },
          { id: "p4", type: "serialized-props", label: "Counter props", detail: '{ initialCount: 0 }', status: "sent" },
        ],
      },
      {
        descriptionHtml:
          "Complete. Server-rendered HTML is interactive. <code>Counter</code> is mounted with <code>useState</code> on the client. <code>Page</code> and <code>&lt;h1&gt;</code> ship zero JavaScript.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        componentTree: {
          id: "page",
          label: "<Page>",
          props: [{ key: "env", value: "server" }],
          highlight: "unchanged",
          children: [
            { id: "main", label: "<main>", children: [
              { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"My App"' }] },
              { id: "counter", label: "<Counter>", highlight: "unchanged", props: [{ key: "env", value: "client" }] },
            ]},
          ],
        },
        renderPhase: "complete",
        payload: [
          { id: "p1", type: "html-chunk", label: "<main>", detail: "static HTML for server-rendered elements", status: "sent" },
          { id: "p2", type: "html-chunk", label: "<h1>", detail: '"My App" rendered to HTML string', status: "sent" },
          { id: "p3", type: "client-reference", label: "<Counter>", detail: "module: ./Counter.tsx, export: Counter", status: "sent" },
          { id: "p4", type: "serialized-props", label: "Counter props", detail: '{ initialCount: 0 }', status: "sent" },
        ],
      },
    ],
  },

  /* ── RSC Payload (serialization focus) ── */
  {
    id: "serialization",
    title: "RSC Payload",
    description:
      "Focus on serialization: HTML for server parts, references for client parts, serialized props at boundary.",
    kind: "payload",
    codeLines: [
      { num: 1, text: "// Layout.tsx (Server Component)" },
      { num: 2, text: "export default async function Layout() {" },
      { num: 3, text: "  const user = await getUser();" },
      { num: 4, text: "  return (" },
      { num: 5, text: "    <div className=\"layout\">" },
      { num: 6, text: "      <h1>Welcome, {user.name}</h1>" },
      { num: 7, text: "      <SearchBar placeholder={`Search ${user.name}'s items`} />" },
      { num: 8, text: "      <p>{user.bio}</p>" },
      { num: 9, text: "    </div>" },
      { num: 10, text: "  );" },
      { num: 11, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Server begins rendering <code>Layout</code>. It fetches user data and starts producing output.",
        activeLine: 3,
        doneLines: [1, 2],
        componentTree: {
          id: "layout",
          label: "<Layout>",
          props: [{ key: "env", value: "server" }],
          highlight: "active",
          children: [],
        },
        activeNodeId: "layout",
        renderPhase: "server-render",
        payload: [],
      },
      {
        descriptionHtml:
          '<code>&lt;div&gt;</code> and <code>&lt;h1&gt;</code> are plain elements. Server renders them to an <span class="hl-task">HTML chunk</span> in the payload.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        componentTree: {
          id: "layout",
          label: "<Layout>",
          props: [{ key: "env", value: "server" }],
          children: [
            { id: "div", label: "<div>", children: [
              { id: "h1", label: "<h1>", highlight: "active", children: [{ id: "h1-text", label: '"Welcome, Alice"' }] },
            ]},
          ],
        },
        activeNodeId: "h1",
        renderPhase: "server-render",
        payload: [
          { id: "p1", type: "html-chunk", label: '<div class="layout">', detail: "opening tag with className attribute", status: "streaming" },
          { id: "p2", type: "html-chunk", label: "<h1>Welcome, Alice</h1>", detail: "fully rendered with interpolated data", status: "streaming" },
        ],
      },
      {
        descriptionHtml:
          'React reaches <code>&lt;SearchBar&gt;</code> (a client component). It emits a <span class="hl-api">client reference</span> and serializes the <code>placeholder</code> prop.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        componentTree: {
          id: "layout",
          label: "<Layout>",
          props: [{ key: "env", value: "server" }],
          children: [
            { id: "div", label: "<div>", children: [
              { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"Welcome, Alice"' }] },
              { id: "search", label: "<SearchBar>", highlight: "active", props: [{ key: "env", value: "client" }] },
            ]},
          ],
        },
        activeNodeId: "search",
        renderPhase: "serialization",
        payload: [
          { id: "p1", type: "html-chunk", label: '<div class="layout">', detail: "opening tag with className attribute", status: "sent" },
          { id: "p2", type: "html-chunk", label: "<h1>Welcome, Alice</h1>", detail: "fully rendered with interpolated data", status: "sent" },
          { id: "p3", type: "client-reference", label: "<SearchBar>", detail: "module: ./SearchBar.tsx", status: "streaming" },
          { id: "p4", type: "serialized-props", label: "SearchBar props", detail: '{ placeholder: "Search Alice\'s items" }', status: "streaming" },
        ],
      },
      {
        descriptionHtml:
          "Server continues past the client boundary. <code>&lt;p&gt;</code> with <code>user.bio</code> is another server-rendered HTML chunk.",
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        componentTree: {
          id: "layout",
          label: "<Layout>",
          props: [{ key: "env", value: "server" }],
          children: [
            { id: "div", label: "<div>", children: [
              { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"Welcome, Alice"' }] },
              { id: "search", label: "<SearchBar>", props: [{ key: "env", value: "client" }] },
              { id: "p-bio", label: "<p>", highlight: "active", children: [{ id: "bio-text", label: '"Frontend engineer..."' }] },
            ]},
          ],
        },
        activeNodeId: "p-bio",
        renderPhase: "serialization",
        payload: [
          { id: "p1", type: "html-chunk", label: '<div class="layout">', detail: "opening tag with className attribute", status: "sent" },
          { id: "p2", type: "html-chunk", label: "<h1>Welcome, Alice</h1>", detail: "fully rendered with interpolated data", status: "sent" },
          { id: "p3", type: "client-reference", label: "<SearchBar>", detail: "module: ./SearchBar.tsx", status: "sent" },
          { id: "p4", type: "serialized-props", label: "SearchBar props", detail: '{ placeholder: "Search Alice\'s items" }', status: "sent" },
          { id: "p5", type: "html-chunk", label: "<p>Frontend engineer...</p>", detail: "server-rendered text content", status: "streaming" },
        ],
      },
      {
        descriptionHtml:
          "Payload streams to the client. Server-rendered HTML is displayed immediately. The browser loads <code>SearchBar</code> and hydrates it.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        componentTree: {
          id: "layout",
          label: "<Layout>",
          props: [{ key: "env", value: "server" }],
          highlight: "unchanged",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"Welcome, Alice"' }] },
              { id: "search", label: "<SearchBar>", highlight: "unchanged", props: [{ key: "env", value: "client" }] },
              { id: "p-bio", label: "<p>", highlight: "unchanged", children: [{ id: "bio-text", label: '"Frontend engineer..."' }] },
            ]},
          ],
        },
        renderPhase: "complete",
        payload: [
          { id: "p1", type: "html-chunk", label: '<div class="layout">', detail: "opening tag with className attribute", status: "sent" },
          { id: "p2", type: "html-chunk", label: "<h1>Welcome, Alice</h1>", detail: "fully rendered with interpolated data", status: "sent" },
          { id: "p3", type: "client-reference", label: "<SearchBar>", detail: "module: ./SearchBar.tsx", status: "sent" },
          { id: "p4", type: "serialized-props", label: "SearchBar props", detail: '{ placeholder: "Search Alice\'s items" }', status: "sent" },
          { id: "p5", type: "html-chunk", label: "<p>Frontend engineer...</p>", detail: "server-rendered text content", status: "sent" },
        ],
      },
    ],
  },

  /* ── Composition Pattern ── */
  {
    id: "composition",
    title: "Composition Pattern",
    description:
      "Server Component passes Client Components as children through slots.",
    kind: "composition",
    codeLines: [
      { num: 1, text: "// ServerLayout.tsx (Server Component)" },
      { num: 2, text: "export default async function ServerLayout() {" },
      { num: 3, text: "  const data = await fetchSidebar();" },
      { num: 4, text: "  return (" },
      { num: 5, text: "    <ClientShell>" },
      { num: 6, text: "      <Sidebar items={data.items} />" },
      { num: 7, text: "    </ClientShell>" },
      { num: 8, text: "  );" },
      { num: 9, text: "}" },
      { num: 10, text: "" },
      { num: 11, text: "// ClientShell.tsx" },
      { num: 12, text: "'use client';" },
      { num: 13, text: "export function ClientShell({ children }) {" },
      { num: 14, text: "  const [open, setOpen] = useState(true);" },
      { num: 15, text: "  return <div className={open ? 'expanded' : 'collapsed'}>{children}</div>;" },
      { num: 16, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Server renders <code>ServerLayout</code>. It fetches sidebar data and prepares to render children.",
        activeLine: 3,
        doneLines: [1, 2],
        componentTree: {
          id: "server-layout",
          label: "<ServerLayout>",
          props: [{ key: "env", value: "server" }],
          highlight: "active",
          children: [],
        },
        activeNodeId: "server-layout",
        renderPhase: "server-render",
        payload: [],
      },
      {
        descriptionHtml:
          "Server sees <code>&lt;ClientShell&gt;</code> is a client component. But its <code>children</code> prop contains <code>&lt;Sidebar&gt;</code>, which is a <span class=\"hl-task\">Server Component</span>.",
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        componentTree: {
          id: "server-layout",
          label: "<ServerLayout>",
          props: [{ key: "env", value: "server" }],
          children: [
            { id: "client-shell", label: "<ClientShell>", highlight: "active", props: [{ key: "env", value: "client" }], children: [
              { id: "sidebar", label: "<Sidebar>", props: [{ key: "env", value: "server" }] },
            ]},
          ],
        },
        activeNodeId: "client-shell",
        renderPhase: "server-render",
        payload: [
          { id: "p1", type: "client-reference", label: "<ClientShell>", detail: "module: ./ClientShell.tsx", status: "streaming" },
        ],
      },
      {
        descriptionHtml:
          'Server renders <code>&lt;Sidebar&gt;</code> to HTML <span class="hl-api">before serializing</span>. The rendered HTML becomes the <code>children</code> prop passed to ClientShell.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        componentTree: {
          id: "server-layout",
          label: "<ServerLayout>",
          props: [{ key: "env", value: "server" }],
          children: [
            { id: "client-shell", label: "<ClientShell>", props: [{ key: "env", value: "client" }], children: [
              { id: "sidebar", label: "<Sidebar>", highlight: "active", props: [{ key: "env", value: "server" }] },
            ]},
          ],
        },
        activeNodeId: "sidebar",
        renderPhase: "serialization",
        payload: [
          { id: "p1", type: "client-reference", label: "<ClientShell>", detail: "module: ./ClientShell.tsx", status: "sent" },
          { id: "p2", type: "html-chunk", label: "<Sidebar>", detail: "server-rendered to HTML with fetched items", status: "streaming" },
        ],
      },
      {
        descriptionHtml:
          "The key insight: <code>ClientShell</code> receives pre-rendered HTML as <code>children</code>. It can wrap, position, or conditionally show them without needing to re-render them.",
        activeLine: 15,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14],
        componentTree: {
          id: "server-layout",
          label: "<ServerLayout>",
          props: [{ key: "env", value: "server" }],
          children: [
            { id: "client-shell", label: "<ClientShell>", highlight: "active", props: [{ key: "env", value: "client" }], children: [
              { id: "sidebar", label: "<Sidebar>", highlight: "unchanged", props: [{ key: "env", value: "server" }] },
            ]},
          ],
        },
        activeNodeId: "client-shell",
        renderPhase: "client-hydration",
        payload: [
          { id: "p1", type: "client-reference", label: "<ClientShell>", detail: "module: ./ClientShell.tsx", status: "sent" },
          { id: "p2", type: "html-chunk", label: "<Sidebar>", detail: "server-rendered to HTML with fetched items", status: "sent" },
          { id: "p3", type: "serialized-props", label: "ClientShell props", detail: "{ children: <server-rendered Sidebar HTML> }", status: "sent" },
        ],
      },
      {
        descriptionHtml:
          "Complete. <code>ClientShell</code> manages toggle state on the client. <code>Sidebar</code> was rendered on the server with zero client JavaScript. This is the composition pattern.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        componentTree: {
          id: "server-layout",
          label: "<ServerLayout>",
          props: [{ key: "env", value: "server" }],
          highlight: "unchanged",
          children: [
            { id: "client-shell", label: "<ClientShell>", highlight: "unchanged", props: [{ key: "env", value: "client" }], children: [
              { id: "sidebar", label: "<Sidebar>", highlight: "unchanged", props: [{ key: "env", value: "server" }] },
            ]},
          ],
        },
        renderPhase: "complete",
        payload: [
          { id: "p1", type: "client-reference", label: "<ClientShell>", detail: "module: ./ClientShell.tsx", status: "sent" },
          { id: "p2", type: "html-chunk", label: "<Sidebar>", detail: "server-rendered to HTML with fetched items", status: "sent" },
          { id: "p3", type: "serialized-props", label: "ClientShell props", detail: "{ children: <server-rendered Sidebar HTML> }", status: "sent" },
        ],
      },
    ],
  },
];
