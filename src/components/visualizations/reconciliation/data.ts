import type { ReconciliationExample } from "./types";

export const EXAMPLES: ReconciliationExample[] = [
  /* ── Same Element Type ── */
  {
    id: "same-type",
    title: "Same Element Type",
    description:
      "When an element keeps the same type, React updates only the changed attributes and children.",
    kind: "same-type",
    codeLines: [
      { num: 1, text: "function Counter() {" },
      { num: 2, text: "  const [count, setCount] = useState(0);" },
      { num: 3, text: "  return (" },
      { num: 4, text: "    <div className=\"counter\">" },
      { num: 5, text: "      <h1>Count</h1>" },
      { num: 6, text: "      <p>{count}</p>" },
      { num: 7, text: "      <button onClick={() => setCount(count + 1)}>" },
      { num: 8, text: "        Increment" },
      { num: 9, text: "      </button>" },
      { num: 10, text: "    </div>" },
      { num: 11, text: "  );" },
      { num: 12, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Initial render: React creates the virtual DOM tree from JSX. Each element becomes a node in the tree.",
        activeLine: 3,
        doneLines: [1, 2],
        previousTree: {
          id: "div",
          label: "<div>",
          props: [{ key: "className", value: '"counter"' }],
          children: [
            { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"Count"' }] },
            { id: "p", label: "<p>", children: [{ id: "p-text", label: '"0"' }] },
            { id: "button", label: "<button>", children: [{ id: "btn-text", label: '"Increment"' }] },
          ],
        },
        newTree: {
          id: "div",
          label: "<div>",
          props: [{ key: "className", value: '"counter"' }],
          children: [
            { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"Count"' }] },
            { id: "p", label: "<p>", children: [{ id: "p-text", label: '"0"' }] },
            { id: "button", label: "<button>", children: [{ id: "btn-text", label: '"Increment"' }] },
          ],
        },
        operations: [],
      },
      {
        descriptionHtml:
          'User clicks <code>Increment</code>. <code>setCount(1)</code> triggers a re-render. React calls <code>Counter()</code> again to get a <span class="hl-api">new virtual DOM tree</span>.',
        activeLine: 7,
        doneLines: [1, 2, 3],
        previousTree: {
          id: "div",
          label: "<div>",
          props: [{ key: "className", value: '"counter"' }],
          children: [
            { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"Count"' }] },
            { id: "p", label: "<p>", children: [{ id: "p-text", label: '"0"' }] },
            { id: "button", label: "<button>", children: [{ id: "btn-text", label: '"Increment"' }] },
          ],
        },
        newTree: {
          id: "div",
          label: "<div>",
          props: [{ key: "className", value: '"counter"' }],
          children: [
            { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"Count"' }] },
            { id: "p", label: "<p>", children: [{ id: "p-text", label: '"1"' }] },
            { id: "button", label: "<button>", children: [{ id: "btn-text", label: '"Increment"' }] },
          ],
        },
        operations: [],
      },
      {
        descriptionHtml:
          'React starts diffing from the root. <code>&lt;div&gt;</code> has the <span class="hl-api">same type</span> in both trees, so React keeps the DOM node and checks its attributes.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        previousTree: {
          id: "div",
          label: "<div>",
          highlight: "active",
          props: [{ key: "className", value: '"counter"' }],
          children: [
            { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"Count"' }] },
            { id: "p", label: "<p>", children: [{ id: "p-text", label: '"0"' }] },
            { id: "button", label: "<button>", children: [{ id: "btn-text", label: '"Increment"' }] },
          ],
        },
        newTree: {
          id: "div",
          label: "<div>",
          highlight: "active",
          props: [{ key: "className", value: '"counter"' }],
          children: [
            { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"Count"' }] },
            { id: "p", label: "<p>", children: [{ id: "p-text", label: '"1"' }] },
            { id: "button", label: "<button>", children: [{ id: "btn-text", label: '"Increment"' }] },
          ],
        },
        activeNodeId: "div",
        operations: [
          { type: "noop", target: "<div>", detail: "same type, same props. keep node" },
        ],
      },
      {
        descriptionHtml:
          'React recurses into children. <code>&lt;h1&gt;</code> is the same type with the same text child <code>"Count"</code>, so <span class="hl-task">no update needed</span>.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        previousTree: {
          id: "div",
          label: "<div>",
          props: [{ key: "className", value: '"counter"' }],
          children: [
            { id: "h1", label: "<h1>", highlight: "active", children: [{ id: "h1-text", label: '"Count"' }] },
            { id: "p", label: "<p>", children: [{ id: "p-text", label: '"0"' }] },
            { id: "button", label: "<button>", children: [{ id: "btn-text", label: '"Increment"' }] },
          ],
        },
        newTree: {
          id: "div",
          label: "<div>",
          props: [{ key: "className", value: '"counter"' }],
          children: [
            { id: "h1", label: "<h1>", highlight: "active", children: [{ id: "h1-text", label: '"Count"' }] },
            { id: "p", label: "<p>", children: [{ id: "p-text", label: '"1"' }] },
            { id: "button", label: "<button>", children: [{ id: "btn-text", label: '"Increment"' }] },
          ],
        },
        activeNodeId: "h1",
        operations: [
          { type: "noop", target: "<div>", detail: "same type, same props. keep node" },
          { type: "noop", target: "<h1>", detail: 'same text child "Count". skip' },
        ],
      },
      {
        descriptionHtml:
          '<code>&lt;p&gt;</code> is the same type, but the text child changed from <code>"0"</code> to <code>"1"</code>. React <span class="hl-stack">updates only the text node</span> in the real DOM.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        previousTree: {
          id: "div",
          label: "<div>",
          props: [{ key: "className", value: '"counter"' }],
          children: [
            { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"Count"' }] },
            { id: "p", label: "<p>", highlight: "active", children: [{ id: "p-text", label: '"0"', highlight: "updated" }] },
            { id: "button", label: "<button>", children: [{ id: "btn-text", label: '"Increment"' }] },
          ],
        },
        newTree: {
          id: "div",
          label: "<div>",
          props: [{ key: "className", value: '"counter"' }],
          children: [
            { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"Count"' }] },
            { id: "p", label: "<p>", highlight: "active", children: [{ id: "p-text", label: '"1"', highlight: "updated" }] },
            { id: "button", label: "<button>", children: [{ id: "btn-text", label: '"Increment"' }] },
          ],
        },
        activeNodeId: "p",
        operations: [
          { type: "noop", target: "<div>", detail: "same type, same props. keep node" },
          { type: "noop", target: "<h1>", detail: 'same text child "Count". skip' },
          { type: "update", target: "<p>", detail: 'text: "0" → "1"' },
        ],
      },
      {
        descriptionHtml:
          '<code>&lt;button&gt;</code> is unchanged, same type and same text. React <span class="hl-task">skips it</span>. Diffing is complete: only <strong>one DOM text node</strong> was updated.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        previousTree: {
          id: "div",
          label: "<div>",
          highlight: "unchanged",
          props: [{ key: "className", value: '"counter"' }],
          children: [
            { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"Count"' }] },
            { id: "p", label: "<p>", highlight: "updated", children: [{ id: "p-text", label: '"1"', highlight: "updated" }] },
            { id: "button", label: "<button>", highlight: "unchanged", children: [{ id: "btn-text", label: '"Increment"' }] },
          ],
        },
        newTree: {
          id: "div",
          label: "<div>",
          highlight: "unchanged",
          props: [{ key: "className", value: '"counter"' }],
          children: [
            { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"Count"' }] },
            { id: "p", label: "<p>", highlight: "updated", children: [{ id: "p-text", label: '"1"', highlight: "updated" }] },
            { id: "button", label: "<button>", highlight: "unchanged", children: [{ id: "btn-text", label: '"Increment"' }] },
          ],
        },
        operations: [
          { type: "noop", target: "<div>", detail: "same type, same props. keep node" },
          { type: "noop", target: "<h1>", detail: 'same text child "Count". skip' },
          { type: "update", target: "<p>", detail: 'text: "0" → "1"' },
          { type: "noop", target: "<button>", detail: "same text. skip" },
        ],
      },
    ],
  },

  /* ── Different Element Type ── */
  {
    id: "different-type",
    title: "Different Element Type",
    description:
      "When the element type changes, React tears down the old subtree and builds a new one from scratch.",
    kind: "different-type",
    codeLines: [
      { num: 1, text: "function App({ isLoggedIn }) {" },
      { num: 2, text: "  return (" },
      { num: 3, text: "    <main>" },
      { num: 4, text: "      <h1>My App</h1>" },
      { num: 5, text: "      {isLoggedIn" },
      { num: 6, text: "        ? <Dashboard user=\"Alice\" />" },
      { num: 7, text: "        : <LoginForm />}" },
      { num: 8, text: "    </main>" },
      { num: 9, text: "  );" },
      { num: 10, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Initial render with <code>isLoggedIn = false</code>. The tree contains <code>&lt;LoginForm&gt;</code> as a child of <code>&lt;main&gt;</code>.",
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5],
        previousTree: {
          id: "main",
          label: "<main>",
          children: [
            { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"My App"' }] },
            { id: "login", label: "<LoginForm>" },
          ],
        },
        newTree: {
          id: "main",
          label: "<main>",
          children: [
            { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"My App"' }] },
            { id: "login", label: "<LoginForm>" },
          ],
        },
        operations: [],
      },
      {
        descriptionHtml:
          "User logs in. <code>isLoggedIn</code> becomes <code>true</code>. React re-renders <code>App</code> and gets a <span class=\"hl-api\">new tree</span> with <code>&lt;Dashboard&gt;</code> instead of <code>&lt;LoginForm&gt;</code>.",
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        previousTree: {
          id: "main",
          label: "<main>",
          children: [
            { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"My App"' }] },
            { id: "login", label: "<LoginForm>" },
          ],
        },
        newTree: {
          id: "main",
          label: "<main>",
          children: [
            { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"My App"' }] },
            { id: "dashboard", label: "<Dashboard>", props: [{ key: "user", value: '"Alice"' }] },
          ],
        },
        operations: [],
      },
      {
        descriptionHtml:
          'React compares <code>&lt;main&gt;</code>: same type, so it <span class="hl-task">keeps the node</span>. Then it compares children one by one.',
        activeLine: 3,
        doneLines: [1, 2],
        previousTree: {
          id: "main",
          label: "<main>",
          highlight: "active",
          children: [
            { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"My App"' }] },
            { id: "login", label: "<LoginForm>" },
          ],
        },
        newTree: {
          id: "main",
          label: "<main>",
          highlight: "active",
          children: [
            { id: "h1", label: "<h1>", children: [{ id: "h1-text", label: '"My App"' }] },
            { id: "dashboard", label: "<Dashboard>", props: [{ key: "user", value: '"Alice"' }] },
          ],
        },
        activeNodeId: "main",
        operations: [
          { type: "noop", target: "<main>", detail: "same type. keep node" },
        ],
      },
      {
        descriptionHtml:
          '<code>&lt;h1&gt;</code> is unchanged, <span class="hl-task">skip</span>. Now React compares the second child: <code>&lt;LoginForm&gt;</code> vs <code>&lt;Dashboard&gt;</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        previousTree: {
          id: "main",
          label: "<main>",
          children: [
            { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"My App"' }] },
            { id: "login", label: "<LoginForm>", highlight: "active" },
          ],
        },
        newTree: {
          id: "main",
          label: "<main>",
          children: [
            { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"My App"' }] },
            { id: "dashboard", label: "<Dashboard>", highlight: "active", props: [{ key: "user", value: '"Alice"' }] },
          ],
        },
        activeNodeId: "login",
        operations: [
          { type: "noop", target: "<main>", detail: "same type. keep node" },
          { type: "noop", target: "<h1>", detail: "same text. skip" },
        ],
      },
      {
        descriptionHtml:
          '<span class="hl-loop">Different types!</span> <code>&lt;LoginForm&gt;</code> ≠ <code>&lt;Dashboard&gt;</code>. React <strong>unmounts</strong> LoginForm entirely (runs cleanup effects, destroys DOM) and <strong>mounts</strong> Dashboard from scratch.',
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        previousTree: {
          id: "main",
          label: "<main>",
          children: [
            { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"My App"' }] },
            { id: "login", label: "<LoginForm>", highlight: "removed" },
          ],
        },
        newTree: {
          id: "main",
          label: "<main>",
          children: [
            { id: "h1", label: "<h1>", highlight: "unchanged", children: [{ id: "h1-text", label: '"My App"' }] },
            { id: "dashboard", label: "<Dashboard>", highlight: "added", props: [{ key: "user", value: '"Alice"' }] },
          ],
        },
        operations: [
          { type: "noop", target: "<main>", detail: "same type. keep node" },
          { type: "noop", target: "<h1>", detail: "same text. skip" },
          { type: "remove", target: "<LoginForm>", detail: "unmount. destroy subtree & run cleanup" },
          { type: "insert", target: "<Dashboard>", detail: "mount. create new subtree from scratch" },
        ],
      },
    ],
  },

  /* ── Key-Based List Reconciliation ── */
  {
    id: "key-list",
    title: "Key-Based List",
    description:
      "Keys help React identify which items changed, moved, or were added/removed in a list.",
    kind: "key-list",
    codeLines: [
      { num: 1, text: "function TodoList({ items }) {" },
      { num: 2, text: "  return (" },
      { num: 3, text: "    <ul>" },
      { num: 4, text: "      {items.map(item => (" },
      { num: 5, text: "        <li key={item.id}>" },
      { num: 6, text: "          {item.text}" },
      { num: 7, text: "        </li>" },
      { num: 8, text: "      ))}" },
      { num: 9, text: "    </ul>" },
      { num: 10, text: "  );" },
      { num: 11, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          'Initial render with three items: <code>"Buy milk"</code>, <code>"Walk dog"</code>, <code>"Read book"</code>. Each <code>&lt;li&gt;</code> has a unique <code>key</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        previousTree: {
          id: "ul",
          label: "<ul>",
          children: [
            { id: "li-1", label: "<li>", props: [{ key: "key", value: '"a"' }], children: [{ id: "text-1", label: '"Buy milk"' }] },
            { id: "li-2", label: "<li>", props: [{ key: "key", value: '"b"' }], children: [{ id: "text-2", label: '"Walk dog"' }] },
            { id: "li-3", label: "<li>", props: [{ key: "key", value: '"c"' }], children: [{ id: "text-3", label: '"Read book"' }] },
          ],
        },
        newTree: {
          id: "ul",
          label: "<ul>",
          children: [
            { id: "li-1", label: "<li>", props: [{ key: "key", value: '"a"' }], children: [{ id: "text-1", label: '"Buy milk"' }] },
            { id: "li-2", label: "<li>", props: [{ key: "key", value: '"b"' }], children: [{ id: "text-2", label: '"Walk dog"' }] },
            { id: "li-3", label: "<li>", props: [{ key: "key", value: '"c"' }], children: [{ id: "text-3", label: '"Read book"' }] },
          ],
        },
        operations: [],
      },
      {
        descriptionHtml:
          'A new item <code>"Feed cat"</code> is inserted at the <strong>top</strong> and <code>"Walk dog"</code> is removed. React re-renders with the new <code>items</code> array.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        previousTree: {
          id: "ul",
          label: "<ul>",
          children: [
            { id: "li-1", label: "<li>", props: [{ key: "key", value: '"a"' }], children: [{ id: "text-1", label: '"Buy milk"' }] },
            { id: "li-2", label: "<li>", props: [{ key: "key", value: '"b"' }], children: [{ id: "text-2", label: '"Walk dog"' }] },
            { id: "li-3", label: "<li>", props: [{ key: "key", value: '"c"' }], children: [{ id: "text-3", label: '"Read book"' }] },
          ],
        },
        newTree: {
          id: "ul",
          label: "<ul>",
          children: [
            { id: "li-4", label: "<li>", props: [{ key: "key", value: '"d"' }], children: [{ id: "text-4", label: '"Feed cat"' }] },
            { id: "li-1", label: "<li>", props: [{ key: "key", value: '"a"' }], children: [{ id: "text-1", label: '"Buy milk"' }] },
            { id: "li-3", label: "<li>", props: [{ key: "key", value: '"c"' }], children: [{ id: "text-3", label: '"Read book"' }] },
          ],
        },
        operations: [],
      },
      {
        descriptionHtml:
          'React uses <code>key</code> props to match children. Key <code>"a"</code> and <code>"c"</code> exist in both lists, so React <span class="hl-task">knows these are the same elements</span>, just in different positions.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        previousTree: {
          id: "ul",
          label: "<ul>",
          highlight: "active",
          children: [
            { id: "li-1", label: "<li>", highlight: "active", props: [{ key: "key", value: '"a"' }], children: [{ id: "text-1", label: '"Buy milk"' }] },
            { id: "li-2", label: "<li>", props: [{ key: "key", value: '"b"' }], children: [{ id: "text-2", label: '"Walk dog"' }] },
            { id: "li-3", label: "<li>", highlight: "active", props: [{ key: "key", value: '"c"' }], children: [{ id: "text-3", label: '"Read book"' }] },
          ],
        },
        newTree: {
          id: "ul",
          label: "<ul>",
          highlight: "active",
          children: [
            { id: "li-4", label: "<li>", props: [{ key: "key", value: '"d"' }], children: [{ id: "text-4", label: '"Feed cat"' }] },
            { id: "li-1", label: "<li>", highlight: "active", props: [{ key: "key", value: '"a"' }], children: [{ id: "text-1", label: '"Buy milk"' }] },
            { id: "li-3", label: "<li>", highlight: "active", props: [{ key: "key", value: '"c"' }], children: [{ id: "text-3", label: '"Read book"' }] },
          ],
        },
        operations: [
          { type: "noop", target: 'key="a"', detail: "matched. reuse existing DOM node" },
          { type: "noop", target: 'key="c"', detail: "matched. reuse existing DOM node" },
        ],
      },
      {
        descriptionHtml:
          'Key <code>"b"</code> (Walk dog) is missing from the new list. React <span class="hl-loop">unmounts</span> that element and destroys its DOM node.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        previousTree: {
          id: "ul",
          label: "<ul>",
          children: [
            { id: "li-1", label: "<li>", highlight: "unchanged", props: [{ key: "key", value: '"a"' }], children: [{ id: "text-1", label: '"Buy milk"' }] },
            { id: "li-2", label: "<li>", highlight: "removed", props: [{ key: "key", value: '"b"' }], children: [{ id: "text-2", label: '"Walk dog"' }] },
            { id: "li-3", label: "<li>", highlight: "unchanged", props: [{ key: "key", value: '"c"' }], children: [{ id: "text-3", label: '"Read book"' }] },
          ],
        },
        newTree: {
          id: "ul",
          label: "<ul>",
          children: [
            { id: "li-4", label: "<li>", props: [{ key: "key", value: '"d"' }], children: [{ id: "text-4", label: '"Feed cat"' }] },
            { id: "li-1", label: "<li>", highlight: "unchanged", props: [{ key: "key", value: '"a"' }], children: [{ id: "text-1", label: '"Buy milk"' }] },
            { id: "li-3", label: "<li>", highlight: "unchanged", props: [{ key: "key", value: '"c"' }], children: [{ id: "text-3", label: '"Read book"' }] },
          ],
        },
        operations: [
          { type: "noop", target: 'key="a"', detail: "matched. reuse existing DOM node" },
          { type: "noop", target: 'key="c"', detail: "matched. reuse existing DOM node" },
          { type: "remove", target: 'key="b"', detail: "not in new list. unmount & destroy" },
        ],
      },
      {
        descriptionHtml:
          'Key <code>"d"</code> (Feed cat) is <span class="hl-task">new</span>. React creates a fresh DOM node and <span class="hl-api">inserts it</span> at position 0. Matched nodes are moved as needed.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        previousTree: {
          id: "ul",
          label: "<ul>",
          children: [
            { id: "li-1", label: "<li>", highlight: "unchanged", props: [{ key: "key", value: '"a"' }], children: [{ id: "text-1", label: '"Buy milk"' }] },
            { id: "li-2", label: "<li>", highlight: "removed", props: [{ key: "key", value: '"b"' }], children: [{ id: "text-2", label: '"Walk dog"' }] },
            { id: "li-3", label: "<li>", highlight: "unchanged", props: [{ key: "key", value: '"c"' }], children: [{ id: "text-3", label: '"Read book"' }] },
          ],
        },
        newTree: {
          id: "ul",
          label: "<ul>",
          children: [
            { id: "li-4", label: "<li>", highlight: "added", props: [{ key: "key", value: '"d"' }], children: [{ id: "text-4", label: '"Feed cat"' }] },
            { id: "li-1", label: "<li>", highlight: "unchanged", props: [{ key: "key", value: '"a"' }], children: [{ id: "text-1", label: '"Buy milk"' }] },
            { id: "li-3", label: "<li>", highlight: "unchanged", props: [{ key: "key", value: '"c"' }], children: [{ id: "text-3", label: '"Read book"' }] },
          ],
        },
        operations: [
          { type: "noop", target: 'key="a"', detail: "matched. reuse existing DOM node" },
          { type: "noop", target: 'key="c"', detail: "matched. reuse existing DOM node" },
          { type: "remove", target: 'key="b"', detail: "not in new list. unmount & destroy" },
          { type: "insert", target: 'key="d"', detail: "new key. create & insert at position 0" },
        ],
      },
      {
        descriptionHtml:
          "Reconciliation complete. React made <strong>minimal DOM changes</strong>: removed one node, inserted one node, and reused two existing nodes instead of rebuilding the entire list.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        previousTree: {
          id: "ul",
          label: "<ul>",
          highlight: "unchanged",
          children: [
            { id: "li-1", label: "<li>", highlight: "unchanged", props: [{ key: "key", value: '"a"' }], children: [{ id: "text-1", label: '"Buy milk"' }] },
            { id: "li-2", label: "<li>", highlight: "removed", props: [{ key: "key", value: '"b"' }], children: [{ id: "text-2", label: '"Walk dog"' }] },
            { id: "li-3", label: "<li>", highlight: "unchanged", props: [{ key: "key", value: '"c"' }], children: [{ id: "text-3", label: '"Read book"' }] },
          ],
        },
        newTree: {
          id: "ul",
          label: "<ul>",
          highlight: "unchanged",
          children: [
            { id: "li-4", label: "<li>", highlight: "added", props: [{ key: "key", value: '"d"' }], children: [{ id: "text-4", label: '"Feed cat"' }] },
            { id: "li-1", label: "<li>", highlight: "unchanged", props: [{ key: "key", value: '"a"' }], children: [{ id: "text-1", label: '"Buy milk"' }] },
            { id: "li-3", label: "<li>", highlight: "unchanged", props: [{ key: "key", value: '"c"' }], children: [{ id: "text-3", label: '"Read book"' }] },
          ],
        },
        operations: [
          { type: "noop", target: 'key="a"', detail: "matched. reuse existing DOM node" },
          { type: "noop", target: 'key="c"', detail: "matched. reuse existing DOM node" },
          { type: "remove", target: 'key="b"', detail: "not in new list. unmount & destroy" },
          { type: "insert", target: 'key="d"', detail: "new key. create & insert at position 0" },
        ],
      },
    ],
  },
];
