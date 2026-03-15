import type { VirtualDomExample } from "./types";

export const EXAMPLES: VirtualDomExample[] = [
  /* ── Simple Element ── */
  {
    id: "simple-element",
    title: "Simple Element",
    description:
      "A basic JSX element compiled to createElement calls, producing a virtual DOM tree that maps to real DOM nodes.",
    kind: "element",
    codeLines: [
      { num: 1, text: "function Greeting() {" },
      { num: 2, text: "  return (" },
      { num: 3, text: "    <div>" },
      { num: 4, text: "      <h1>Hello</h1>" },
      { num: 5, text: "      <p>World</p>" },
      { num: 6, text: "    </div>" },
      { num: 7, text: "  );" },
      { num: 8, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "JSX looks like HTML, but it is not. The browser cannot run JSX directly. A build tool like Babel transforms it before the code reaches the browser.",
        activeLine: 2,
        doneLines: [1],
        vdomTree: null,
        createElementCalls: [],
        domOutput: [],
      },
      {
        descriptionHtml:
          'Babel converts the inner elements first. <code>&lt;h1&gt;Hello&lt;/h1&gt;</code> becomes <code>createElement("h1", null, "Hello")</code>.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        vdomTree: null,
        createElementCalls: [
          {
            id: "ce-h1",
            code: 'createElement("h1", null, "Hello")',
            highlight: true,
          },
        ],
        domOutput: [],
      },
      {
        descriptionHtml:
          'Next, <code>&lt;p&gt;World&lt;/p&gt;</code> becomes <code>createElement("p", null, "World")</code>. Each JSX tag maps to exactly one createElement call.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        vdomTree: null,
        createElementCalls: [
          {
            id: "ce-h1",
            code: 'createElement("h1", null, "Hello")',
            highlight: false,
          },
          {
            id: "ce-p",
            code: 'createElement("p", null, "World")',
            highlight: true,
          },
        ],
        domOutput: [],
      },
      {
        descriptionHtml:
          'The outer <code>&lt;div&gt;</code> wraps both children. <code>createElement("div", null, h1Element, pElement)</code> receives the two child elements as arguments.',
        activeLine: 3,
        doneLines: [1, 2],
        vdomTree: null,
        createElementCalls: [
          {
            id: "ce-h1",
            code: 'createElement("h1", null, "Hello")',
            highlight: false,
          },
          {
            id: "ce-p",
            code: 'createElement("p", null, "World")',
            highlight: false,
          },
          {
            id: "ce-div",
            code: 'createElement("div", null, h1Element, pElement)',
            highlight: true,
          },
        ],
        domOutput: [],
      },
      {
        descriptionHtml:
          'Each <code>createElement</code> call returns a <span class="hl-api">plain JavaScript object</span> describing the element. Together these objects form the virtual DOM tree.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        vdomTree: {
          id: "div",
          label: "<div>",
          highlight: "active",
          children: [
            {
              id: "h1",
              label: "<h1>",
              children: [{ id: "h1-text", label: '"Hello"' }],
            },
            {
              id: "p",
              label: "<p>",
              children: [{ id: "p-text", label: '"World"' }],
            },
          ],
        },
        activeNodeId: "div",
        createElementCalls: [
          {
            id: "ce-h1",
            code: 'createElement("h1", null, "Hello")',
            highlight: false,
          },
          {
            id: "ce-p",
            code: 'createElement("p", null, "World")',
            highlight: false,
          },
          {
            id: "ce-div",
            code: 'createElement("div", null, h1Element, pElement)',
            highlight: false,
          },
        ],
        domOutput: [],
      },
      {
        descriptionHtml:
          "React reads the virtual DOM tree and creates <strong>real DOM nodes</strong> to match. This is the initial mount. The browser can now paint the result on screen.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        vdomTree: {
          id: "div",
          label: "<div>",
          highlight: "unchanged",
          children: [
            {
              id: "h1",
              label: "<h1>",
              highlight: "unchanged",
              children: [{ id: "h1-text", label: '"Hello"' }],
            },
            {
              id: "p",
              label: "<p>",
              highlight: "unchanged",
              children: [{ id: "p-text", label: '"World"' }],
            },
          ],
        },
        createElementCalls: [
          {
            id: "ce-h1",
            code: 'createElement("h1", null, "Hello")',
            highlight: false,
          },
          {
            id: "ce-p",
            code: 'createElement("p", null, "World")',
            highlight: false,
          },
          {
            id: "ce-div",
            code: 'createElement("div", null, h1Element, pElement)',
            highlight: false,
          },
        ],
        domOutput: [
          "<div>",
          "  <h1>Hello</h1>",
          "  <p>World</p>",
          "</div>",
        ],
      },
    ],
  },

  /* ── Nested Components ── */
  {
    id: "nested-components",
    title: "Nested Components",
    description:
      "Components are functions that return elements. React calls each component to resolve the full element tree before creating DOM nodes.",
    kind: "component",
    codeLines: [
      { num: 1, text: "function Header() {" },
      { num: 2, text: '  return <h1>My App</h1>;' },
      { num: 3, text: "}" },
      { num: 4, text: "" },
      { num: 5, text: "function Content() {" },
      { num: 6, text: "  return <p>Welcome to the app</p>;" },
      { num: 7, text: "}" },
      { num: 8, text: "" },
      { num: 9, text: "function App() {" },
      { num: 10, text: "  return (" },
      { num: 11, text: "    <main>" },
      { num: 12, text: "      <Header />" },
      { num: 13, text: "      <Content />" },
      { num: 14, text: "    </main>" },
      { num: 15, text: "  );" },
      { num: 16, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "React starts by calling <code>App()</code>. The JSX inside App references two child components: <code>&lt;Header /&gt;</code> and <code>&lt;Content /&gt;</code>.",
        activeLine: 10,
        doneLines: [9],
        vdomTree: null,
        createElementCalls: [
          {
            id: "ce-app",
            code: "createElement(App, null)",
            highlight: true,
          },
        ],
        domOutput: [],
      },
      {
        descriptionHtml:
          'Babel compiles <code>&lt;Header /&gt;</code> to <code>createElement(Header, null)</code>. Notice the first argument is the <span class="hl-api">function itself</span>, not a string. This tells React it is a component, not a DOM element.',
        activeLine: 12,
        doneLines: [9, 10, 11],
        vdomTree: {
          id: "main",
          label: "<main>",
          children: [
            { id: "header", label: "<Header>", highlight: "active" },
            { id: "content", label: "<Content>" },
          ],
        },
        activeNodeId: "header",
        createElementCalls: [
          {
            id: "ce-app",
            code: "createElement(App, null)",
            highlight: false,
          },
          {
            id: "ce-header",
            code: "createElement(Header, null)",
            highlight: true,
          },
        ],
        domOutput: [],
      },
      {
        descriptionHtml:
          'React sees that <code>Header</code> is a function, so it <span class="hl-task">calls Header()</span> to get its return value. <code>Header()</code> returns <code>&lt;h1&gt;My App&lt;/h1&gt;</code>.',
        activeLine: 2,
        doneLines: [1],
        vdomTree: {
          id: "main",
          label: "<main>",
          children: [
            {
              id: "header",
              label: "<Header>",
              highlight: "active",
              children: [
                {
                  id: "h1",
                  label: "<h1>",
                  highlight: "added",
                  children: [{ id: "h1-text", label: '"My App"' }],
                },
              ],
            },
            { id: "content", label: "<Content>" },
          ],
        },
        activeNodeId: "header",
        createElementCalls: [
          {
            id: "ce-app",
            code: "createElement(App, null)",
            highlight: false,
          },
          {
            id: "ce-header",
            code: "createElement(Header, null)",
            highlight: false,
          },
          {
            id: "ce-h1",
            code: 'createElement("h1", null, "My App")',
            highlight: true,
          },
        ],
        domOutput: [],
      },
      {
        descriptionHtml:
          'React now resolves <code>&lt;Content /&gt;</code> the same way. It <span class="hl-task">calls Content()</span>, which returns <code>&lt;p&gt;Welcome to the app&lt;/p&gt;</code>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 5],
        vdomTree: {
          id: "main",
          label: "<main>",
          children: [
            {
              id: "header",
              label: "<Header>",
              highlight: "unchanged",
              children: [
                {
                  id: "h1",
                  label: "<h1>",
                  children: [{ id: "h1-text", label: '"My App"' }],
                },
              ],
            },
            {
              id: "content",
              label: "<Content>",
              highlight: "active",
              children: [
                {
                  id: "p",
                  label: "<p>",
                  highlight: "added",
                  children: [{ id: "p-text", label: '"Welcome to the app"' }],
                },
              ],
            },
          ],
        },
        activeNodeId: "content",
        createElementCalls: [
          {
            id: "ce-app",
            code: "createElement(App, null)",
            highlight: false,
          },
          {
            id: "ce-header",
            code: "createElement(Header, null)",
            highlight: false,
          },
          {
            id: "ce-h1",
            code: 'createElement("h1", null, "My App")',
            highlight: false,
          },
          {
            id: "ce-content",
            code: "createElement(Content, null)",
            highlight: false,
          },
          {
            id: "ce-p",
            code: 'createElement("p", null, "Welcome to the app")',
            highlight: true,
          },
        ],
        domOutput: [],
      },
      {
        descriptionHtml:
          "All components are resolved. The virtual DOM tree now contains only <strong>host elements</strong> (div, h1, p) that map directly to real DOM nodes.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        vdomTree: {
          id: "main",
          label: "<main>",
          highlight: "unchanged",
          children: [
            {
              id: "header",
              label: "<Header>",
              highlight: "unchanged",
              children: [
                {
                  id: "h1",
                  label: "<h1>",
                  highlight: "unchanged",
                  children: [{ id: "h1-text", label: '"My App"' }],
                },
              ],
            },
            {
              id: "content",
              label: "<Content>",
              highlight: "unchanged",
              children: [
                {
                  id: "p",
                  label: "<p>",
                  highlight: "unchanged",
                  children: [{ id: "p-text", label: '"Welcome to the app"' }],
                },
              ],
            },
          ],
        },
        createElementCalls: [
          {
            id: "ce-app",
            code: "createElement(App, null)",
            highlight: false,
          },
          {
            id: "ce-header",
            code: "createElement(Header, null)",
            highlight: false,
          },
          {
            id: "ce-h1",
            code: 'createElement("h1", null, "My App")',
            highlight: false,
          },
          {
            id: "ce-content",
            code: "createElement(Content, null)",
            highlight: false,
          },
          {
            id: "ce-p",
            code: 'createElement("p", null, "Welcome to the app")',
            highlight: false,
          },
        ],
        domOutput: [],
      },
      {
        descriptionHtml:
          "React creates real DOM nodes from the resolved tree. Components like <code>&lt;Header&gt;</code> do not appear in the DOM. Only the host elements they returned are rendered.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        vdomTree: {
          id: "main",
          label: "<main>",
          highlight: "unchanged",
          children: [
            {
              id: "header",
              label: "<Header>",
              highlight: "unchanged",
              children: [
                {
                  id: "h1",
                  label: "<h1>",
                  highlight: "unchanged",
                  children: [{ id: "h1-text", label: '"My App"' }],
                },
              ],
            },
            {
              id: "content",
              label: "<Content>",
              highlight: "unchanged",
              children: [
                {
                  id: "p",
                  label: "<p>",
                  highlight: "unchanged",
                  children: [{ id: "p-text", label: '"Welcome to the app"' }],
                },
              ],
            },
          ],
        },
        createElementCalls: [
          {
            id: "ce-app",
            code: "createElement(App, null)",
            highlight: false,
          },
          {
            id: "ce-header",
            code: "createElement(Header, null)",
            highlight: false,
          },
          {
            id: "ce-h1",
            code: 'createElement("h1", null, "My App")',
            highlight: false,
          },
          {
            id: "ce-content",
            code: "createElement(Content, null)",
            highlight: false,
          },
          {
            id: "ce-p",
            code: 'createElement("p", null, "Welcome to the app")',
            highlight: false,
          },
        ],
        domOutput: [
          "<main>",
          "  <h1>My App</h1>",
          "  <p>Welcome to the app</p>",
          "</main>",
        ],
      },
    ],
  },

  /* ── Dynamic Props ── */
  {
    id: "dynamic-props",
    title: "Dynamic Props",
    description:
      "Props and expressions in JSX become properties on the virtual DOM object. When state changes, React builds a new tree and diffs it against the previous one.",
    kind: "dynamic",
    codeLines: [
      { num: 1, text: "function Counter() {" },
      { num: 2, text: "  const [count, setCount] = useState(0);" },
      { num: 3, text: "  return (" },
      { num: 4, text: '    <button className="btn"' },
      { num: 5, text: "      onClick={() => setCount(count + 1)}" },
      { num: 6, text: "    >" },
      { num: 7, text: "      Clicks: {count}" },
      { num: 8, text: "    </button>" },
      { num: 9, text: "  );" },
      { num: 10, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "The component renders with <code>count = 0</code>. JSX expressions like <code>{count}</code> are evaluated at render time and become part of the createElement arguments.",
        activeLine: 3,
        doneLines: [1, 2],
        vdomTree: null,
        createElementCalls: [],
        domOutput: [],
      },
      {
        descriptionHtml:
          'Babel compiles the JSX. Props like <code>className</code> and <code>onClick</code> become fields in a <span class="hl-api">props object</span> passed as the second argument to createElement.',
        activeLine: 4,
        doneLines: [1, 2, 3],
        vdomTree: null,
        createElementCalls: [
          {
            id: "ce-btn-1",
            code: 'createElement("button", { className: "btn", onClick: fn }, "Clicks: 0")',
            highlight: true,
          },
        ],
        domOutput: [],
      },
      {
        descriptionHtml:
          "The createElement call returns a virtual DOM object. The <code>props</code> object holds className, onClick, and the children text. This is a plain JavaScript object, not a DOM node.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        vdomTree: {
          id: "button",
          label: "<button>",
          highlight: "active",
          props: [
            { key: "className", value: '"btn"' },
            { key: "onClick", value: "fn" },
          ],
          children: [{ id: "btn-text", label: '"Clicks: 0"' }],
        },
        activeNodeId: "button",
        createElementCalls: [
          {
            id: "ce-btn-1",
            code: 'createElement("button", { className: "btn", onClick: fn }, "Clicks: 0")',
            highlight: false,
          },
        ],
        domOutput: [],
      },
      {
        descriptionHtml:
          "React reads the virtual DOM object and creates a real <code>&lt;button&gt;</code> DOM node with the className attribute and click handler attached.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        vdomTree: {
          id: "button",
          label: "<button>",
          highlight: "unchanged",
          props: [
            { key: "className", value: '"btn"' },
            { key: "onClick", value: "fn" },
          ],
          children: [{ id: "btn-text", label: '"Clicks: 0"' }],
        },
        createElementCalls: [
          {
            id: "ce-btn-1",
            code: 'createElement("button", { className: "btn", onClick: fn }, "Clicks: 0")',
            highlight: false,
          },
        ],
        domOutput: ['<button class="btn">', "  Clicks: 0", "</button>"],
      },
      {
        descriptionHtml:
          'User clicks the button. <code>setCount(1)</code> triggers a re-render. React calls <code>Counter()</code> again with <code>count = 1</code> and gets a <span class="hl-api">new virtual DOM object</span>.',
        activeLine: 5,
        doneLines: [1, 2, 3, 4],
        vdomTree: {
          id: "button",
          label: "<button>",
          highlight: "active",
          props: [
            { key: "className", value: '"btn"' },
            { key: "onClick", value: "fn" },
          ],
          children: [
            { id: "btn-text", label: '"Clicks: 1"', highlight: "updated" },
          ],
        },
        activeNodeId: "button",
        createElementCalls: [
          {
            id: "ce-btn-1",
            code: 'createElement("button", { className: "btn", onClick: fn }, "Clicks: 0")',
            highlight: false,
          },
          {
            id: "ce-btn-2",
            code: 'createElement("button", { className: "btn", onClick: fn }, "Clicks: 1")',
            highlight: true,
          },
        ],
        domOutput: ['<button class="btn">', "  Clicks: 0", "</button>"],
      },
      {
        descriptionHtml:
          'React <span class="hl-task">diffs</span> the old and new virtual DOM objects. The button type and className are unchanged. Only the text child changed from <code>"Clicks: 0"</code> to <code>"Clicks: 1"</code>. React updates just that text node in the real DOM.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        vdomTree: {
          id: "button",
          label: "<button>",
          highlight: "unchanged",
          props: [
            { key: "className", value: '"btn"' },
            { key: "onClick", value: "fn" },
          ],
          children: [
            { id: "btn-text", label: '"Clicks: 1"', highlight: "updated" },
          ],
        },
        createElementCalls: [
          {
            id: "ce-btn-1",
            code: 'createElement("button", { className: "btn", onClick: fn }, "Clicks: 0")',
            highlight: false,
          },
          {
            id: "ce-btn-2",
            code: 'createElement("button", { className: "btn", onClick: fn }, "Clicks: 1")',
            highlight: false,
          },
        ],
        domOutput: ['<button class="btn">', "  Clicks: 1", "</button>"],
      },
    ],
  },
];
