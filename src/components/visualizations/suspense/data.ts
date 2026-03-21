import type { SuspenseExample } from "./types";

export const EXAMPLES: SuspenseExample[] = [
  /* ── Single Boundary ── */
  {
    id: "single-boundary",
    title: "Single Boundary",
    description:
      "One Suspense boundary wraps an async component. Watch fallback swap in while data loads.",
    kind: "single",
    codeLines: [
      { num: 1, text: "function App() {" },
      { num: 2, text: "  return (" },
      { num: 3, text: "    <div>" },
      { num: 4, text: '      <Suspense fallback={<Loading />}>' },
      { num: 5, text: "        <UserProfile />" },
      { num: 6, text: "      </Suspense>" },
      { num: 7, text: "    </div>" },
      { num: 8, text: "  );" },
      { num: 9, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "React renders <code>&lt;App&gt;</code>, walks the JSX tree, and reaches the <code>&lt;Suspense&gt;</code> boundary.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "suspense", label: "<Suspense>", highlight: "active", children: [
                { id: "user-profile", label: "<UserProfile>" },
              ]},
            ]},
          ],
        },
        activeNodeId: "suspense",
        boundaries: [
          {
            id: "b1",
            label: "<Suspense>",
            status: "idle",
            fallbackLabel: "<Loading />",
          },
        ],
      },
      {
        descriptionHtml:
          'React tries rendering <code>&lt;UserProfile&gt;</code>. The component <span class="hl-loop">throws a Promise</span> because data is not ready yet.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "suspense", label: "<Suspense>", children: [
                { id: "user-profile", label: "<UserProfile>", highlight: "removed" },
              ]},
            ]},
          ],
        },
        activeNodeId: "user-profile",
        boundaries: [
          {
            id: "b1",
            label: "<Suspense>",
            status: "suspended",
            fallbackLabel: "<Loading />",
            promiseLabel: "fetchUser()",
          },
        ],
      },
      {
        descriptionHtml:
          'React catches the thrown Promise at the nearest <code>&lt;Suspense&gt;</code> boundary. It <span class="hl-api">switches to the fallback</span>.',
        activeLine: 4,
        doneLines: [1, 2, 3, 5],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "suspense", label: "<Suspense>", highlight: "active", children: [
                { id: "loading", label: "<Loading>", highlight: "added" },
              ]},
            ]},
          ],
        },
        activeNodeId: "suspense",
        boundaries: [
          {
            id: "b1",
            label: "<Suspense>",
            status: "fallback-visible",
            fallbackLabel: "<Loading />",
            promiseLabel: "fetchUser()",
          },
        ],
      },
      {
        descriptionHtml:
          'Fallback <code>&lt;Loading /&gt;</code> is committed to the DOM. React attaches a <code>.then()</code> handler to the thrown Promise.',
        activeLine: 4,
        doneLines: [1, 2, 3, 5],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "suspense", label: "<Suspense>", children: [
                { id: "loading", label: "<Loading>", highlight: "unchanged" },
              ]},
            ]},
          ],
        },
        boundaries: [
          {
            id: "b1",
            label: "<Suspense>",
            status: "fallback-visible",
            fallbackLabel: "<Loading />",
            promiseLabel: "fetchUser() [pending]",
          },
        ],
      },
      {
        descriptionHtml:
          'Promise resolves with user data. React <span class="hl-task">re-renders</span> <code>&lt;UserProfile&gt;</code>, which now returns JSX successfully.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "suspense", label: "<Suspense>", highlight: "active", children: [
                { id: "user-profile", label: "<UserProfile>", highlight: "added" },
              ]},
            ]},
          ],
        },
        activeNodeId: "user-profile",
        boundaries: [
          {
            id: "b1",
            label: "<Suspense>",
            status: "resolved",
            fallbackLabel: "<Loading />",
            promiseLabel: "fetchUser() [fulfilled]",
          },
        ],
      },
      {
        descriptionHtml:
          "Complete. Suspense boundary resolved, fallback removed, and <code>&lt;UserProfile&gt;</code> is now visible in the DOM.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        componentTree: {
          id: "app",
          label: "<App>",
          highlight: "unchanged",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "suspense", label: "<Suspense>", highlight: "unchanged", children: [
                { id: "user-profile", label: "<UserProfile>", highlight: "unchanged" },
              ]},
            ]},
          ],
        },
        boundaries: [
          {
            id: "b1",
            label: "<Suspense>",
            status: "resolved",
            fallbackLabel: "<Loading />",
          },
        ],
      },
    ],
  },

  /* ── Nested Boundaries ── */
  {
    id: "nested-boundaries",
    title: "Nested Boundaries",
    description:
      "Two boundaries at different depths resolve independently.",
    kind: "nested",
    codeLines: [
      { num: 1, text: "function App() {" },
      { num: 2, text: "  return (" },
      { num: 3, text: '    <Suspense fallback={<PageSkeleton />}>' },
      { num: 4, text: "      <Header />" },
      { num: 5, text: '      <Suspense fallback={<CommentsSkeleton />}>' },
      { num: 6, text: "        <Comments />" },
      { num: 7, text: "      </Suspense>" },
      { num: 8, text: "    </Suspense>" },
      { num: 9, text: "  );" },
      { num: 10, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "React encounters the outer <code>&lt;Suspense&gt;</code> boundary and begins rendering its children.",
        activeLine: 3,
        doneLines: [1, 2],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            { id: "outer-suspense", label: "<Suspense>", highlight: "active", children: [
              { id: "header", label: "<Header>" },
              { id: "inner-suspense", label: "<Suspense>", children: [
                { id: "comments", label: "<Comments>" },
              ]},
            ]},
          ],
        },
        activeNodeId: "outer-suspense",
        boundaries: [
          { id: "outer", label: "Outer <Suspense>", status: "idle", fallbackLabel: "<PageSkeleton />" },
          { id: "inner", label: "Inner <Suspense>", status: "idle", fallbackLabel: "<CommentsSkeleton />" },
        ],
      },
      {
        descriptionHtml:
          '<code>&lt;Header&gt;</code> throws a Promise (fetching user data). The <span class="hl-loop">outer boundary catches it</span> since it is the nearest ancestor.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            { id: "outer-suspense", label: "<Suspense>", children: [
              { id: "page-skeleton", label: "<PageSkeleton>", highlight: "added" },
            ]},
          ],
        },
        activeNodeId: "outer-suspense",
        boundaries: [
          { id: "outer", label: "Outer <Suspense>", status: "fallback-visible", fallbackLabel: "<PageSkeleton />", promiseLabel: "fetchUser()" },
          { id: "inner", label: "Inner <Suspense>", status: "idle", fallbackLabel: "<CommentsSkeleton />" },
        ],
      },
      {
        descriptionHtml:
          'Outer boundary shows <code>&lt;PageSkeleton&gt;</code>. The entire subtree (including inner boundary) is <span class="hl-task">hidden behind the outer fallback</span>.',
        activeLine: 3,
        doneLines: [1, 2],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            { id: "outer-suspense", label: "<Suspense>", children: [
              { id: "page-skeleton", label: "<PageSkeleton>", highlight: "unchanged" },
            ]},
          ],
        },
        boundaries: [
          { id: "outer", label: "Outer <Suspense>", status: "fallback-visible", fallbackLabel: "<PageSkeleton />", promiseLabel: "fetchUser() [pending]" },
          { id: "inner", label: "Inner <Suspense>", status: "idle", fallbackLabel: "<CommentsSkeleton />" },
        ],
      },
      {
        descriptionHtml:
          'Header\'s promise resolves. React re-renders the outer boundary\'s children. <code>&lt;Header&gt;</code> renders successfully. Now React reaches the <span class="hl-api">inner boundary</span>.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            { id: "outer-suspense", label: "<Suspense>", highlight: "active", children: [
              { id: "header", label: "<Header>", highlight: "added" },
              { id: "inner-suspense", label: "<Suspense>", highlight: "active", children: [
                { id: "comments", label: "<Comments>" },
              ]},
            ]},
          ],
        },
        activeNodeId: "inner-suspense",
        boundaries: [
          { id: "outer", label: "Outer <Suspense>", status: "resolved", fallbackLabel: "<PageSkeleton />" },
          { id: "inner", label: "Inner <Suspense>", status: "idle", fallbackLabel: "<CommentsSkeleton />" },
        ],
      },
      {
        descriptionHtml:
          '<code>&lt;Comments&gt;</code> throws a Promise. The <span class="hl-loop">inner boundary catches it</span> and shows <code>&lt;CommentsSkeleton&gt;</code>. Header stays visible.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            { id: "outer-suspense", label: "<Suspense>", children: [
              { id: "header", label: "<Header>", highlight: "unchanged" },
              { id: "inner-suspense", label: "<Suspense>", children: [
                { id: "comments-skeleton", label: "<CommentsSkeleton>", highlight: "added" },
              ]},
            ]},
          ],
        },
        activeNodeId: "inner-suspense",
        boundaries: [
          { id: "outer", label: "Outer <Suspense>", status: "resolved", fallbackLabel: "<PageSkeleton />" },
          { id: "inner", label: "Inner <Suspense>", status: "fallback-visible", fallbackLabel: "<CommentsSkeleton />", promiseLabel: "fetchComments()" },
        ],
      },
      {
        descriptionHtml:
          "Comments data loads. Inner boundary resolves independently. Both boundaries are now resolved and all content is visible.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        componentTree: {
          id: "app",
          label: "<App>",
          highlight: "unchanged",
          children: [
            { id: "outer-suspense", label: "<Suspense>", highlight: "unchanged", children: [
              { id: "header", label: "<Header>", highlight: "unchanged" },
              { id: "inner-suspense", label: "<Suspense>", highlight: "unchanged", children: [
                { id: "comments", label: "<Comments>", highlight: "added" },
              ]},
            ]},
          ],
        },
        boundaries: [
          { id: "outer", label: "Outer <Suspense>", status: "resolved", fallbackLabel: "<PageSkeleton />" },
          { id: "inner", label: "Inner <Suspense>", status: "resolved", fallbackLabel: "<CommentsSkeleton />" },
        ],
      },
    ],
  },

  /* ── Waterfall vs Parallel ── */
  {
    id: "waterfall-vs-parallel",
    title: "Waterfall vs Parallel",
    description:
      "Two sibling async components inside one boundary. React waits for both before revealing.",
    kind: "parallel",
    codeLines: [
      { num: 1, text: "function Dashboard() {" },
      { num: 2, text: "  return (" },
      { num: 3, text: '    <Suspense fallback={<DashSkeleton />}>' },
      { num: 4, text: "      <UserStats />   {/* fetches user data */}" },
      { num: 5, text: "      <RecentOrders /> {/* fetches order data */}" },
      { num: 6, text: "    </Suspense>" },
      { num: 7, text: "  );" },
      { num: 8, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "React renders <code>&lt;Dashboard&gt;</code> and enters the <code>&lt;Suspense&gt;</code> boundary. It begins rendering children.",
        activeLine: 3,
        doneLines: [1, 2],
        componentTree: {
          id: "dashboard",
          label: "<Dashboard>",
          children: [
            { id: "suspense", label: "<Suspense>", highlight: "active", children: [
              { id: "user-stats", label: "<UserStats>" },
              { id: "recent-orders", label: "<RecentOrders>" },
            ]},
          ],
        },
        activeNodeId: "suspense",
        boundaries: [
          { id: "b1", label: "<Suspense>", status: "idle", fallbackLabel: "<DashSkeleton />" },
        ],
      },
      {
        descriptionHtml:
          '<code>&lt;UserStats&gt;</code> <span class="hl-loop">throws a Promise</span>. React records it but continues trying to render siblings to discover all pending data.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        componentTree: {
          id: "dashboard",
          label: "<Dashboard>",
          children: [
            { id: "suspense", label: "<Suspense>", children: [
              { id: "user-stats", label: "<UserStats>", highlight: "removed" },
              { id: "recent-orders", label: "<RecentOrders>" },
            ]},
          ],
        },
        activeNodeId: "user-stats",
        boundaries: [
          { id: "b1", label: "<Suspense>", status: "suspended", fallbackLabel: "<DashSkeleton />", promiseLabel: "fetchUser() [pending]" },
        ],
      },
      {
        descriptionHtml:
          '<code>&lt;RecentOrders&gt;</code> also <span class="hl-loop">throws a Promise</span>. Both fetches are now in flight in parallel. The boundary shows the fallback.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        componentTree: {
          id: "dashboard",
          label: "<Dashboard>",
          children: [
            { id: "suspense", label: "<Suspense>", children: [
              { id: "dash-skeleton", label: "<DashSkeleton>", highlight: "added" },
            ]},
          ],
        },
        activeNodeId: "suspense",
        boundaries: [
          { id: "b1", label: "<Suspense>", status: "fallback-visible", fallbackLabel: "<DashSkeleton />", promiseLabel: "fetchUser() + fetchOrders() [pending]" },
        ],
      },
      {
        descriptionHtml:
          '<code>fetchUser()</code> resolves first. But the boundary still has one pending Promise, so it <span class="hl-task">keeps showing the fallback</span>.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        componentTree: {
          id: "dashboard",
          label: "<Dashboard>",
          children: [
            { id: "suspense", label: "<Suspense>", children: [
              { id: "dash-skeleton", label: "<DashSkeleton>", highlight: "unchanged" },
            ]},
          ],
        },
        boundaries: [
          { id: "b1", label: "<Suspense>", status: "fallback-visible", fallbackLabel: "<DashSkeleton />", promiseLabel: "fetchOrders() [still pending]" },
        ],
      },
      {
        descriptionHtml:
          '<code>fetchOrders()</code> resolves. All Promises are fulfilled. React <span class="hl-api">reveals both components together</span> in a single commit.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        componentTree: {
          id: "dashboard",
          label: "<Dashboard>",
          children: [
            { id: "suspense", label: "<Suspense>", highlight: "active", children: [
              { id: "user-stats", label: "<UserStats>", highlight: "added" },
              { id: "recent-orders", label: "<RecentOrders>", highlight: "added" },
            ]},
          ],
        },
        activeNodeId: "suspense",
        boundaries: [
          { id: "b1", label: "<Suspense>", status: "resolved", fallbackLabel: "<DashSkeleton />" },
        ],
      },
      {
        descriptionHtml:
          "Complete. Both siblings render at the same time, avoiding a staggered \"popcorn\" effect. This is a key benefit of Suspense over independent loading states.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        componentTree: {
          id: "dashboard",
          label: "<Dashboard>",
          highlight: "unchanged",
          children: [
            { id: "suspense", label: "<Suspense>", highlight: "unchanged", children: [
              { id: "user-stats", label: "<UserStats>", highlight: "unchanged" },
              { id: "recent-orders", label: "<RecentOrders>", highlight: "unchanged" },
            ]},
          ],
        },
        boundaries: [
          { id: "b1", label: "<Suspense>", status: "resolved", fallbackLabel: "<DashSkeleton />" },
        ],
      },
    ],
  },
];
