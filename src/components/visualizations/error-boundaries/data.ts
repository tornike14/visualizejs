import type { ErrorBoundaryExample } from "./types";

/* ── Example Data ── */

export const EXAMPLES: ErrorBoundaryExample[] = [
  /* ── 1. Basic Error Boundary ── */
  {
    id: "basic",
    title: "Basic Error Boundary",
    description:
      "A class component catches render errors in its subtree and displays fallback UI instead of crashing the app.",
    kind: "basic",
    codeLines: [
      { num: 1, text: "class ErrorBoundary extends React.Component {" },
      { num: 2, text: "  state = { hasError: false };" },
      { num: 3, text: "" },
      { num: 4, text: "  static getDerivedStateFromError(error) {" },
      { num: 5, text: "    return { hasError: true };" },
      { num: 6, text: "  }" },
      { num: 7, text: "" },
      { num: 8, text: "  componentDidCatch(error, info) {" },
      { num: 9, text: "    logToService(error, info);" },
      { num: 10, text: "  }" },
      { num: 11, text: "" },
      { num: 12, text: "  render() {" },
      { num: 13, text: "    if (this.state.hasError) {" },
      { num: 14, text: "      return <h2>Something went wrong.</h2>;" },
      { num: 15, text: "    }" },
      { num: 16, text: "    return this.props.children;" },
      { num: 17, text: "  }" },
      { num: 18, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Initial render: <code>ErrorBoundary</code> initializes with <code>hasError: false</code>. It renders its children normally.",
        activeLine: 2,
        doneLines: [1],
        componentTree: {
          id: "boundary",
          label: "<ErrorBoundary>",
          highlight: "active",
          children: [
            {
              id: "counter",
              label: "<BuggyCounter>",
              children: [
                { id: "btn", label: '<button> "0"' },
              ],
            },
          ],
        },
        activeNodeId: "boundary",
        boundaries: [
          { id: "b1", label: "<ErrorBoundary>", phase: "normal" },
        ],
      },
      {
        descriptionHtml:
          '<code>BuggyCounter</code> renders successfully with count 0. The button displays <code>"0"</code>. Everything works.',
        activeLine: 16,
        doneLines: [1, 2, 12, 13],
        componentTree: {
          id: "boundary",
          label: "<ErrorBoundary>",
          children: [
            {
              id: "counter",
              label: "<BuggyCounter>",
              highlight: "active",
              children: [
                { id: "btn", label: '<button> "0"' },
              ],
            },
          ],
        },
        activeNodeId: "counter",
        boundaries: [
          { id: "b1", label: "<ErrorBoundary>", phase: "normal" },
        ],
      },
      {
        descriptionHtml:
          'User clicks the button twice. Count reaches 2. <code>BuggyCounter</code> throws <code>Error("Crashed!")</code> during render.',
        activeLine: null,
        doneLines: [1, 2, 12, 13, 16],
        componentTree: {
          id: "boundary",
          label: "<ErrorBoundary>",
          children: [
            {
              id: "counter",
              label: "<BuggyCounter>",
              highlight: "removed",
              children: [
                { id: "btn", label: '<button> "2"' },
              ],
            },
          ],
        },
        activeNodeId: "counter",
        boundaries: [
          { id: "b1", label: "<ErrorBoundary>", phase: "error-thrown", errorMessage: "Crashed!" },
        ],
      },
      {
        descriptionHtml:
          'React catches the error during render. <code>getDerivedStateFromError</code> is called with the error object. It returns <code>{ hasError: true }</code> to update the boundary\'s state.',
        activeLine: 4,
        doneLines: [1, 2],
        componentTree: {
          id: "boundary",
          label: "<ErrorBoundary>",
          highlight: "updated",
          children: [
            {
              id: "counter",
              label: "<BuggyCounter>",
              highlight: "removed",
            },
          ],
        },
        activeNodeId: "boundary",
        boundaries: [
          { id: "b1", label: "<ErrorBoundary>", phase: "getDerivedStateFromError", errorMessage: "Crashed!" },
        ],
      },
      {
        descriptionHtml:
          "<code>componentDidCatch</code> fires with the error and a component stack trace. This is the place to log errors to a monitoring service.",
        activeLine: 8,
        doneLines: [1, 2, 4, 5, 6],
        componentTree: {
          id: "boundary",
          label: "<ErrorBoundary>",
          highlight: "updated",
          children: [
            {
              id: "counter",
              label: "<BuggyCounter>",
              highlight: "removed",
            },
          ],
        },
        activeNodeId: "boundary",
        boundaries: [
          { id: "b1", label: "<ErrorBoundary>", phase: "componentDidCatch", errorMessage: "Crashed!" },
        ],
      },
      {
        descriptionHtml:
          'The boundary re-renders with <code>hasError: true</code>. Instead of children, it shows the fallback: <code>"Something went wrong."</code>',
        activeLine: 14,
        doneLines: [1, 2, 4, 5, 6, 8, 9, 12, 13],
        componentTree: {
          id: "boundary",
          label: "<ErrorBoundary>",
          children: [
            {
              id: "fallback",
              label: '<h2> "Something went wrong."',
              highlight: "added",
            },
          ],
        },
        activeNodeId: "boundary",
        boundaries: [
          { id: "b1", label: "<ErrorBoundary>", phase: "fallback-rendered", fallbackLabel: "Something went wrong." },
        ],
      },
      {
        descriptionHtml:
          "Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. They do <strong>not</strong> catch errors in event handlers, async code, or server-side rendering.",
        activeLine: null,
        doneLines: [1, 2, 4, 5, 6, 8, 9, 12, 13, 14],
        componentTree: {
          id: "boundary",
          label: "<ErrorBoundary>",
          children: [
            {
              id: "fallback",
              label: '<h2> "Something went wrong."',
            },
          ],
        },
        activeNodeId: undefined,
        boundaries: [
          { id: "b1", label: "<ErrorBoundary>", phase: "fallback-rendered", fallbackLabel: "Something went wrong." },
        ],
      },
    ],
  },

  /* ── 2. Nested Boundaries ── */
  {
    id: "nested",
    title: "Nested Boundaries",
    description:
      "Multiple error boundaries can wrap different parts of the tree. The closest boundary catches the error.",
    kind: "nested",
    codeLines: [
      { num: 1, text: "<OuterBoundary>" },
      { num: 2, text: "  <Header />" },
      { num: 3, text: "  <InnerBoundary>" },
      { num: 4, text: "    <BuggyWidget />" },
      { num: 5, text: "  </InnerBoundary>" },
      { num: 6, text: "  <Footer />" },
      { num: 7, text: "</OuterBoundary>" },
    ],
    steps: [
      {
        descriptionHtml:
          "Initial render: <code>OuterBoundary</code> wraps the entire app. <code>InnerBoundary</code> wraps only the <code>BuggyWidget</code>. Both boundaries are in normal state.",
        activeLine: 1,
        doneLines: [],
        componentTree: {
          id: "outer",
          label: "<OuterBoundary>",
          highlight: "active",
          children: [
            { id: "header", label: "<Header>" },
            {
              id: "inner",
              label: "<InnerBoundary>",
              children: [
                { id: "widget", label: "<BuggyWidget>" },
              ],
            },
            { id: "footer", label: "<Footer>" },
          ],
        },
        activeNodeId: "outer",
        boundaries: [
          { id: "b1", label: "<OuterBoundary>", phase: "normal" },
          { id: "b2", label: "<InnerBoundary>", phase: "normal" },
        ],
      },
      {
        descriptionHtml:
          "All components render successfully. <code>Header</code>, <code>BuggyWidget</code>, and <code>Footer</code> are all visible.",
        activeLine: 4,
        doneLines: [1, 2, 3, 5, 6, 7],
        componentTree: {
          id: "outer",
          label: "<OuterBoundary>",
          children: [
            { id: "header", label: "<Header>" },
            {
              id: "inner",
              label: "<InnerBoundary>",
              children: [
                { id: "widget", label: "<BuggyWidget>", highlight: "active" },
              ],
            },
            { id: "footer", label: "<Footer>" },
          ],
        },
        activeNodeId: "widget",
        boundaries: [
          { id: "b1", label: "<OuterBoundary>", phase: "normal" },
          { id: "b2", label: "<InnerBoundary>", phase: "normal" },
        ],
      },
      {
        descriptionHtml:
          '<code>BuggyWidget</code> throws an error during render. React starts walking <strong>up</strong> the tree looking for the nearest error boundary.',
        activeLine: 4,
        doneLines: [1, 2, 3, 5, 6, 7],
        componentTree: {
          id: "outer",
          label: "<OuterBoundary>",
          children: [
            { id: "header", label: "<Header>" },
            {
              id: "inner",
              label: "<InnerBoundary>",
              children: [
                { id: "widget", label: "<BuggyWidget>", highlight: "removed" },
              ],
            },
            { id: "footer", label: "<Footer>" },
          ],
        },
        activeNodeId: "widget",
        boundaries: [
          { id: "b1", label: "<OuterBoundary>", phase: "normal" },
          { id: "b2", label: "<InnerBoundary>", phase: "error-thrown", errorMessage: "Widget error" },
        ],
      },
      {
        descriptionHtml:
          '<code>InnerBoundary</code> is the <strong>closest</strong> error boundary. It catches the error. <code>getDerivedStateFromError</code> updates its state.',
        activeLine: 3,
        doneLines: [1, 2, 5, 6, 7],
        componentTree: {
          id: "outer",
          label: "<OuterBoundary>",
          children: [
            { id: "header", label: "<Header>" },
            {
              id: "inner",
              label: "<InnerBoundary>",
              highlight: "updated",
              children: [
                { id: "widget", label: "<BuggyWidget>", highlight: "removed" },
              ],
            },
            { id: "footer", label: "<Footer>" },
          ],
        },
        activeNodeId: "inner",
        boundaries: [
          { id: "b1", label: "<OuterBoundary>", phase: "normal" },
          { id: "b2", label: "<InnerBoundary>", phase: "getDerivedStateFromError", errorMessage: "Widget error" },
        ],
      },
      {
        descriptionHtml:
          '<code>InnerBoundary</code> re-renders its fallback: <code>"Widget failed"</code>. <code>Header</code> and <code>Footer</code> are completely <strong>unaffected</strong>.',
        activeLine: 3,
        doneLines: [1, 2, 5, 6, 7],
        componentTree: {
          id: "outer",
          label: "<OuterBoundary>",
          children: [
            { id: "header", label: "<Header>" },
            {
              id: "inner",
              label: "<InnerBoundary>",
              children: [
                { id: "fallback", label: '"Widget failed"', highlight: "added" },
              ],
            },
            { id: "footer", label: "<Footer>" },
          ],
        },
        activeNodeId: "inner",
        boundaries: [
          { id: "b1", label: "<OuterBoundary>", phase: "normal" },
          { id: "b2", label: "<InnerBoundary>", phase: "fallback-rendered", fallbackLabel: "Widget failed" },
        ],
      },
      {
        descriptionHtml:
          "The <code>OuterBoundary</code> never caught the error because <code>InnerBoundary</code> handled it first. If <code>InnerBoundary</code> did not exist, <code>OuterBoundary</code> would have caught it, replacing the <strong>entire</strong> subtree (Header, Widget, and Footer).",
        activeLine: null,
        doneLines: [1, 2, 3, 5, 6, 7],
        componentTree: {
          id: "outer",
          label: "<OuterBoundary>",
          children: [
            { id: "header", label: "<Header>" },
            {
              id: "inner",
              label: "<InnerBoundary>",
              children: [
                { id: "fallback", label: '"Widget failed"' },
              ],
            },
            { id: "footer", label: "<Footer>" },
          ],
        },
        activeNodeId: undefined,
        boundaries: [
          { id: "b1", label: "<OuterBoundary>", phase: "normal" },
          { id: "b2", label: "<InnerBoundary>", phase: "fallback-rendered", fallbackLabel: "Widget failed" },
        ],
      },
      {
        descriptionHtml:
          "Place granular boundaries around risky subtrees. A single root-level boundary replaces everything on error. Multiple boundaries let the rest of the app stay functional when one section fails.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        componentTree: {
          id: "outer",
          label: "<OuterBoundary>",
          children: [
            { id: "header", label: "<Header>" },
            {
              id: "inner",
              label: "<InnerBoundary>",
              children: [
                { id: "fallback", label: '"Widget failed"' },
              ],
            },
            { id: "footer", label: "<Footer>" },
          ],
        },
        activeNodeId: undefined,
        boundaries: [
          { id: "b1", label: "<OuterBoundary>", phase: "normal" },
          { id: "b2", label: "<InnerBoundary>", phase: "fallback-rendered", fallbackLabel: "Widget failed" },
        ],
      },
    ],
  },

  /* ── 3. Recovery Pattern ── */
  {
    id: "recovery",
    title: "Recovery Pattern",
    description:
      "Reset boundary state to re-mount children and retry after an error.",
    kind: "recovery",
    codeLines: [
      { num: 1, text: "class ResettableBoundary extends React.Component {" },
      { num: 2, text: "  state = { hasError: false };" },
      { num: 3, text: "" },
      { num: 4, text: "  static getDerivedStateFromError() {" },
      { num: 5, text: "    return { hasError: true };" },
      { num: 6, text: "  }" },
      { num: 7, text: "" },
      { num: 8, text: "  handleReset = () => {" },
      { num: 9, text: "    this.setState({ hasError: false });" },
      { num: 10, text: "  };" },
      { num: 11, text: "" },
      { num: 12, text: "  render() {" },
      { num: 13, text: "    if (this.state.hasError) {" },
      { num: 14, text: "      return (" },
      { num: 15, text: "        <button onClick={this.handleReset}>" },
      { num: 16, text: "          Try again" },
      { num: 17, text: "        </button>" },
      { num: 18, text: "      );" },
      { num: 19, text: "    }" },
      { num: 20, text: "    return this.props.children;" },
      { num: 21, text: "  }" },
      { num: 22, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Initial render: <code>ResettableBoundary</code> is in normal state, rendering its children.",
        activeLine: 20,
        doneLines: [1, 2, 12, 13],
        componentTree: {
          id: "boundary",
          label: "<ResettableBoundary>",
          highlight: "active",
          children: [
            { id: "child", label: "<DataPanel>" },
          ],
        },
        activeNodeId: "boundary",
        boundaries: [
          { id: "b1", label: "<ResettableBoundary>", phase: "normal" },
        ],
      },
      {
        descriptionHtml:
          "<code>DataPanel</code> throws an error during render (e.g., a network-loaded component with bad data).",
        activeLine: null,
        doneLines: [1, 2, 12, 13, 20],
        componentTree: {
          id: "boundary",
          label: "<ResettableBoundary>",
          children: [
            { id: "child", label: "<DataPanel>", highlight: "removed" },
          ],
        },
        activeNodeId: "child",
        boundaries: [
          { id: "b1", label: "<ResettableBoundary>", phase: "error-thrown", errorMessage: "Bad data" },
        ],
      },
      {
        descriptionHtml:
          '<code>getDerivedStateFromError</code> sets <code>hasError: true</code>. The boundary re-renders and shows the fallback: a <code>"Try again"</code> button.',
        activeLine: 15,
        doneLines: [1, 2, 4, 5, 6, 12, 13, 14],
        componentTree: {
          id: "boundary",
          label: "<ResettableBoundary>",
          children: [
            { id: "fallback", label: '<button> "Try again"', highlight: "added" },
          ],
        },
        activeNodeId: "boundary",
        boundaries: [
          { id: "b1", label: "<ResettableBoundary>", phase: "fallback-rendered", fallbackLabel: "Try again" },
        ],
      },
      {
        descriptionHtml:
          'User clicks <code>"Try again"</code>. <code>handleReset</code> sets <code>hasError</code> back to <code>false</code>.',
        activeLine: 9,
        doneLines: [1, 2, 4, 5, 6, 8, 12, 13, 14, 15],
        componentTree: {
          id: "boundary",
          label: "<ResettableBoundary>",
          highlight: "updated",
          children: [
            { id: "fallback", label: '<button> "Try again"' },
          ],
        },
        activeNodeId: "boundary",
        boundaries: [
          { id: "b1", label: "<ResettableBoundary>", phase: "recovered" },
        ],
      },
      {
        descriptionHtml:
          "The boundary re-renders with <code>hasError: false</code>. It renders <code>this.props.children</code> again, re-mounting <code>DataPanel</code> from scratch.",
        activeLine: 20,
        doneLines: [1, 2, 8, 9, 10, 12, 13],
        componentTree: {
          id: "boundary",
          label: "<ResettableBoundary>",
          children: [
            { id: "child", label: "<DataPanel>", highlight: "added" },
          ],
        },
        activeNodeId: "boundary",
        boundaries: [
          { id: "b1", label: "<ResettableBoundary>", phase: "normal" },
        ],
      },
      {
        descriptionHtml:
          "If the underlying issue is fixed (e.g., fresh data loads), the app recovers. If <code>DataPanel</code> throws again, the boundary catches it again, showing the fallback once more.",
        activeLine: null,
        doneLines: [1, 2, 8, 9, 10, 12, 13, 20],
        componentTree: {
          id: "boundary",
          label: "<ResettableBoundary>",
          children: [
            { id: "child", label: "<DataPanel>" },
          ],
        },
        activeNodeId: undefined,
        boundaries: [
          { id: "b1", label: "<ResettableBoundary>", phase: "normal" },
        ],
      },
      {
        descriptionHtml:
          "This retry pattern is common in production apps. Libraries like react-error-boundary provide a <code>resetKeys</code> prop that auto-resets when specific values change, avoiding the manual button approach.",
        activeLine: null,
        doneLines: [1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 20, 21, 22],
        componentTree: {
          id: "boundary",
          label: "<ResettableBoundary>",
          children: [
            { id: "child", label: "<DataPanel>" },
          ],
        },
        activeNodeId: undefined,
        boundaries: [
          { id: "b1", label: "<ResettableBoundary>", phase: "normal" },
        ],
      },
    ],
  },
];
