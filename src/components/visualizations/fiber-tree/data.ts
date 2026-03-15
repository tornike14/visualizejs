import type { FiberTreeExample } from "./types";

export const EXAMPLES: FiberTreeExample[] = [
  /* ── Work Loop Traversal ── */
  {
    id: "work-loop",
    title: "Work Loop Traversal",
    description:
      "React traverses the fiber tree depth-first using beginWork (down) and completeWork (up).",
    kind: "work-loop",
    codeLines: [
      { num: 1, text: "function App() {" },
      { num: 2, text: "  return (" },
      { num: 3, text: "    <div>" },
      { num: 4, text: "      <Header />" },
      { num: 5, text: "      <Content>" },
      { num: 6, text: "        <p>Hello</p>" },
      { num: 7, text: "      </Content>" },
      { num: 8, text: "    </div>" },
      { num: 9, text: "  );" },
      { num: 10, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "The work loop starts at the <code>HostRoot</code> fiber. React sets it as the first unit of work.",
        activeLine: null,
        doneLines: [],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "active",
          children: [
            {
              id: "app",
              label: "<App>",
              children: [
                {
                  id: "div",
                  label: "<div>",
                  children: [
                    { id: "header", label: "<Header>" },
                    {
                      id: "content",
                      label: "<Content>",
                      children: [{ id: "p", label: "<p>" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "root",
        phase: "beginWork",
        currentFiber: "HostRoot",
        pendingWork: ["App", "div", "Header", "Content", "p"],
        fiberDetail: {
          tag: "HostRoot",
          stateNode: "FiberRootNode",
          child: "App",
          sibling: null,
          return: null,
        },
      },
      {
        descriptionHtml:
          "<code>beginWork</code> on <code>HostRoot</code> returns its child <code>App</code>. The loop moves down.",
        activeLine: 1,
        doneLines: [],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "unchanged",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "active",
              children: [
                {
                  id: "div",
                  label: "<div>",
                  children: [
                    { id: "header", label: "<Header>" },
                    {
                      id: "content",
                      label: "<Content>",
                      children: [{ id: "p", label: "<p>" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "app",
        phase: "beginWork",
        currentFiber: "App",
        pendingWork: ["div", "Header", "Content", "p"],
        fiberDetail: {
          tag: "FunctionComponent",
          stateNode: null,
          child: "div",
          sibling: null,
          return: "HostRoot",
        },
      },
      {
        descriptionHtml:
          "<code>beginWork</code> on <code>App</code> calls the component function. It returns JSX with a <code>&lt;div&gt;</code> child.",
        activeLine: 3,
        doneLines: [1, 2],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "unchanged",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "unchanged",
              children: [
                {
                  id: "div",
                  label: "<div>",
                  highlight: "active",
                  children: [
                    { id: "header", label: "<Header>" },
                    {
                      id: "content",
                      label: "<Content>",
                      children: [{ id: "p", label: "<p>" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "div",
        phase: "beginWork",
        currentFiber: "div",
        pendingWork: ["Header", "Content", "p"],
        fiberDetail: {
          tag: "HostComponent",
          stateNode: "HTMLDivElement",
          child: "Header",
          sibling: null,
          return: "App",
        },
      },
      {
        descriptionHtml:
          "<code>beginWork</code> on <code>&lt;div&gt;</code> reconciles its children. Moves to first child <code>&lt;Header&gt;</code>.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "unchanged",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "unchanged",
              children: [
                {
                  id: "div",
                  label: "<div>",
                  highlight: "unchanged",
                  children: [
                    { id: "header", label: "<Header>", highlight: "active" },
                    {
                      id: "content",
                      label: "<Content>",
                      children: [{ id: "p", label: "<p>" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "header",
        phase: "beginWork",
        currentFiber: "Header",
        pendingWork: ["Content", "p"],
        fiberDetail: {
          tag: "FunctionComponent",
          stateNode: null,
          child: null,
          sibling: "Content",
          return: "div",
        },
      },
      {
        descriptionHtml:
          "<code>&lt;Header&gt;</code> has no children. <code>completeWork</code> runs, creating its DOM node. Then the loop checks for a sibling.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "unchanged",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "unchanged",
              children: [
                {
                  id: "div",
                  label: "<div>",
                  highlight: "unchanged",
                  children: [
                    { id: "header", label: "<Header>", highlight: "updated" },
                    {
                      id: "content",
                      label: "<Content>",
                      children: [{ id: "p", label: "<p>" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "header",
        phase: "completeWork",
        currentFiber: "Header",
        pendingWork: ["Content", "p"],
        fiberDetail: {
          tag: "FunctionComponent",
          stateNode: null,
          child: null,
          sibling: "Content",
          return: "div",
        },
      },
      {
        descriptionHtml:
          "<code>Header</code> has a sibling: <code>&lt;Content&gt;</code>. The loop runs <code>beginWork</code> on it instead of going back up.",
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "unchanged",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "unchanged",
              children: [
                {
                  id: "div",
                  label: "<div>",
                  highlight: "unchanged",
                  children: [
                    { id: "header", label: "<Header>", highlight: "updated" },
                    {
                      id: "content",
                      label: "<Content>",
                      highlight: "active",
                      children: [{ id: "p", label: "<p>" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "content",
        phase: "beginWork",
        currentFiber: "Content",
        pendingWork: ["p"],
        fiberDetail: {
          tag: "FunctionComponent",
          stateNode: null,
          child: "p",
          sibling: null,
          return: "div",
        },
      },
      {
        descriptionHtml:
          "<code>beginWork</code> on <code>&lt;Content&gt;</code> reconciles children. Moves to <code>&lt;p&gt;</code>.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "unchanged",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "unchanged",
              children: [
                {
                  id: "div",
                  label: "<div>",
                  highlight: "unchanged",
                  children: [
                    { id: "header", label: "<Header>", highlight: "updated" },
                    {
                      id: "content",
                      label: "<Content>",
                      highlight: "unchanged",
                      children: [
                        { id: "p", label: "<p>", highlight: "active" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "p",
        phase: "beginWork",
        currentFiber: "p",
        pendingWork: [],
        fiberDetail: {
          tag: "HostComponent",
          stateNode: "HTMLParagraphElement",
          child: null,
          sibling: null,
          return: "Content",
        },
      },
      {
        descriptionHtml:
          "<code>&lt;p&gt;</code> is a leaf. <code>completeWork</code> creates its DOM node. No sibling, so the loop returns to <code>Content</code>.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "unchanged",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "unchanged",
              children: [
                {
                  id: "div",
                  label: "<div>",
                  highlight: "unchanged",
                  children: [
                    { id: "header", label: "<Header>", highlight: "updated" },
                    {
                      id: "content",
                      label: "<Content>",
                      highlight: "unchanged",
                      children: [
                        { id: "p", label: "<p>", highlight: "updated" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "p",
        phase: "completeWork",
        currentFiber: "p",
        pendingWork: [],
        fiberDetail: {
          tag: "HostComponent",
          stateNode: "HTMLParagraphElement",
          child: null,
          sibling: null,
          return: "Content",
        },
      },
      {
        descriptionHtml:
          "<code>completeWork</code> on <code>&lt;Content&gt;</code>. No sibling, returns up to <code>&lt;div&gt;</code>.",
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "unchanged",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "unchanged",
              children: [
                {
                  id: "div",
                  label: "<div>",
                  highlight: "unchanged",
                  children: [
                    { id: "header", label: "<Header>", highlight: "updated" },
                    {
                      id: "content",
                      label: "<Content>",
                      highlight: "updated",
                      children: [
                        { id: "p", label: "<p>", highlight: "updated" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "content",
        phase: "completeWork",
        currentFiber: "Content",
        pendingWork: [],
        fiberDetail: {
          tag: "FunctionComponent",
          stateNode: null,
          child: "p",
          sibling: null,
          return: "div",
        },
      },
      {
        descriptionHtml:
          "<code>completeWork</code> on <code>&lt;div&gt;</code>. Appends child DOM nodes. Returns up to <code>App</code>.",
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "unchanged",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "unchanged",
              children: [
                {
                  id: "div",
                  label: "<div>",
                  highlight: "updated",
                  children: [
                    { id: "header", label: "<Header>", highlight: "updated" },
                    {
                      id: "content",
                      label: "<Content>",
                      highlight: "updated",
                      children: [
                        { id: "p", label: "<p>", highlight: "updated" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "div",
        phase: "completeWork",
        currentFiber: "div",
        pendingWork: [],
        fiberDetail: {
          tag: "HostComponent",
          stateNode: "HTMLDivElement",
          child: "Header",
          sibling: null,
          return: "App",
        },
      },
      {
        descriptionHtml:
          "<code>completeWork</code> on <code>App</code>, then <code>HostRoot</code>. The entire tree has been processed.",
        activeLine: 10,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "updated",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "updated",
              children: [
                {
                  id: "div",
                  label: "<div>",
                  highlight: "updated",
                  children: [
                    { id: "header", label: "<Header>", highlight: "updated" },
                    {
                      id: "content",
                      label: "<Content>",
                      highlight: "updated",
                      children: [
                        { id: "p", label: "<p>", highlight: "updated" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "root",
        phase: "completeWork",
        currentFiber: "HostRoot",
        pendingWork: [],
        fiberDetail: {
          tag: "HostRoot",
          stateNode: "FiberRootNode",
          child: "App",
          sibling: null,
          return: null,
        },
      },
      {
        descriptionHtml:
          "Work loop complete. The <span class=\"hl-api\">work-in-progress tree</span> is ready. React can now commit changes to the DOM.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "updated",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "updated",
              children: [
                {
                  id: "div",
                  label: "<div>",
                  highlight: "updated",
                  children: [
                    { id: "header", label: "<Header>", highlight: "updated" },
                    {
                      id: "content",
                      label: "<Content>",
                      highlight: "updated",
                      children: [
                        { id: "p", label: "<p>", highlight: "updated" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: undefined,
        phase: "idle",
        currentFiber: null,
        pendingWork: [],
        fiberDetail: null,
      },
    ],
  },

  /* ── Unit of Work ── */
  {
    id: "unit-of-work",
    title: "Unit of Work",
    description:
      "How React processes a single fiber: check for updates, call the component, reconcile children.",
    kind: "unit-of-work",
    codeLines: [
      { num: 1, text: "// Inside performUnitOfWork(fiber)" },
      { num: 2, text: "1. Check if fiber has pending updates" },
      { num: 3, text: "2. Call component function / render" },
      { num: 4, text: "3. Reconcile returned children" },
      { num: 5, text: "4. Return next fiber to process:" },
      { num: 6, text: "   - child (if it exists)" },
      { num: 7, text: "   - sibling (if no child)" },
      { num: 8, text: "   - parent's sibling (walk up)" },
    ],
    steps: [
      {
        descriptionHtml:
          "A fiber is selected as the current <span class=\"hl-api\">unit of work</span>. React checks whether it has pending state or prop changes.",
        activeLine: 2,
        doneLines: [1],
        tree: {
          id: "root",
          label: "HostRoot",
          children: [
            {
              id: "app",
              label: "<App>",
              children: [
                {
                  id: "counter",
                  label: "<Counter>",
                  highlight: "active",
                  children: [
                    { id: "span", label: "<span>" },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "counter",
        phase: "beginWork",
        currentFiber: "Counter",
        pendingWork: ["Counter"],
        fiberDetail: {
          tag: "FunctionComponent",
          stateNode: null,
          child: "span",
          sibling: null,
          return: "App",
        },
      },
      {
        descriptionHtml:
          "The fiber has a pending state update. React calls <code>Counter()</code> to get the new returned elements.",
        activeLine: 3,
        doneLines: [1, 2],
        tree: {
          id: "root",
          label: "HostRoot",
          children: [
            {
              id: "app",
              label: "<App>",
              children: [
                {
                  id: "counter",
                  label: "<Counter>",
                  highlight: "active",
                  children: [
                    { id: "span", label: "<span>" },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "counter",
        phase: "beginWork",
        currentFiber: "Counter",
        pendingWork: ["Counter"],
        fiberDetail: {
          tag: "FunctionComponent",
          stateNode: null,
          child: "span",
          sibling: null,
          return: "App",
        },
      },
      {
        descriptionHtml:
          "The component returns new JSX. React <span class=\"hl-task\">reconciles</span> the returned children against the existing fiber children.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        tree: {
          id: "root",
          label: "HostRoot",
          children: [
            {
              id: "app",
              label: "<App>",
              children: [
                {
                  id: "counter",
                  label: "<Counter>",
                  highlight: "active",
                  children: [
                    { id: "span", label: "<span>", highlight: "unchanged" },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "counter",
        phase: "beginWork",
        currentFiber: "Counter",
        pendingWork: [],
        fiberDetail: {
          tag: "FunctionComponent",
          stateNode: null,
          child: "span",
          sibling: null,
          return: "App",
        },
      },
      {
        descriptionHtml:
          "Reconciliation complete. Now React determines the <span class=\"hl-stack\">next unit of work</span>. Rule 1: if a child exists, process it next.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        tree: {
          id: "root",
          label: "HostRoot",
          children: [
            {
              id: "app",
              label: "<App>",
              children: [
                {
                  id: "counter",
                  label: "<Counter>",
                  highlight: "updated",
                  children: [
                    { id: "span", label: "<span>", highlight: "active" },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "span",
        phase: "beginWork",
        currentFiber: "span",
        pendingWork: [],
        fiberDetail: {
          tag: "HostComponent",
          stateNode: "HTMLSpanElement",
          child: null,
          sibling: null,
          return: "Counter",
        },
      },
      {
        descriptionHtml:
          "<code>&lt;span&gt;</code> has no children. <code>completeWork</code> runs. Rule 2: check for a sibling.",
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        tree: {
          id: "root",
          label: "HostRoot",
          children: [
            {
              id: "app",
              label: "<App>",
              children: [
                {
                  id: "counter",
                  label: "<Counter>",
                  highlight: "updated",
                  children: [
                    { id: "span", label: "<span>", highlight: "updated" },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "span",
        phase: "completeWork",
        currentFiber: "span",
        pendingWork: [],
        fiberDetail: {
          tag: "HostComponent",
          stateNode: "HTMLSpanElement",
          child: null,
          sibling: null,
          return: "Counter",
        },
      },
      {
        descriptionHtml:
          "No sibling found. Rule 3: walk up to <code>Counter</code> (the return pointer) and run <code>completeWork</code> on it.",
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        tree: {
          id: "root",
          label: "HostRoot",
          children: [
            {
              id: "app",
              label: "<App>",
              children: [
                {
                  id: "counter",
                  label: "<Counter>",
                  highlight: "updated",
                  children: [
                    { id: "span", label: "<span>", highlight: "updated" },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "counter",
        phase: "completeWork",
        currentFiber: "Counter",
        pendingWork: [],
        fiberDetail: {
          tag: "FunctionComponent",
          stateNode: null,
          child: "span",
          sibling: null,
          return: "App",
        },
      },
      {
        descriptionHtml:
          "<code>Counter</code> complete. The loop continues walking up until it finds a sibling or reaches the root.",
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        tree: {
          id: "root",
          label: "HostRoot",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "updated",
              children: [
                {
                  id: "counter",
                  label: "<Counter>",
                  highlight: "updated",
                  children: [
                    { id: "span", label: "<span>", highlight: "updated" },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "app",
        phase: "completeWork",
        currentFiber: "App",
        pendingWork: [],
        fiberDetail: {
          tag: "FunctionComponent",
          stateNode: null,
          child: "Counter",
          sibling: null,
          return: "HostRoot",
        },
      },
      {
        descriptionHtml:
          "All fibers processed. The work-in-progress tree is complete and ready for the commit phase.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        tree: {
          id: "root",
          label: "HostRoot",
          highlight: "updated",
          children: [
            {
              id: "app",
              label: "<App>",
              highlight: "updated",
              children: [
                {
                  id: "counter",
                  label: "<Counter>",
                  highlight: "updated",
                  children: [
                    { id: "span", label: "<span>", highlight: "updated" },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: undefined,
        phase: "idle",
        currentFiber: null,
        pendingWork: [],
        fiberDetail: null,
      },
    ],
  },
];
