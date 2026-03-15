import type { ContextPropagationExample } from "./types";

export const EXAMPLES: ContextPropagationExample[] = [
  /* ── Basic Provider ── */
  {
    id: "basic-provider",
    title: "Basic Provider",
    description:
      "A single Provider stores a value. A consumer reads it with useContext by walking up the tree to the nearest Provider.",
    kind: "basic",
    codeLines: [
      { num: 1, text: 'const ThemeCtx = createContext("light");' },
      { num: 2, text: "" },
      { num: 3, text: "function ThemedButton() {" },
      { num: 4, text: "  const theme = useContext(ThemeCtx);" },
      { num: 5, text: "  return <button>{theme}</button>;" },
      { num: 6, text: "}" },
      { num: 7, text: "" },
      { num: 8, text: "function App() {" },
      { num: 9, text: "  return (" },
      { num: 10, text: '    <ThemeCtx.Provider value="dark">' },
      { num: 11, text: "      <ThemedButton />" },
      { num: 12, text: "    </ThemeCtx.Provider>" },
      { num: 13, text: "  );" },
      { num: 14, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>createContext("light")</code> creates a context object with a <span class="hl-api">default value</span> of <code>"light"</code>. This default is used only when no Provider exists above a consumer.',
        activeLine: 1,
        doneLines: [],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [],
        },
        contextRegistry: [
          { name: "ThemeCtx", value: '"light" (default)', providerId: "none" },
        ],
        consumers: [],
      },
      {
        descriptionHtml:
          '<code>App</code> renders. The <code>&lt;ThemeCtx.Provider&gt;</code> mounts and stores <code>"dark"</code> as the <span class="hl-api">current value</span> for ThemeCtx.',
        activeLine: 10,
        doneLines: [1, 8, 9],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "provider",
              label: "<ThemeCtx.Provider>",
              highlight: "active",
              props: [{ key: "value", value: '"dark"' }],
              children: [
                { id: "button-comp", label: "<ThemedButton>" },
              ],
            },
          ],
        },
        activeNodeId: "provider",
        contextRegistry: [
          { name: "ThemeCtx", value: '"dark"', providerId: "Provider" },
        ],
        consumers: [],
      },
      {
        descriptionHtml:
          "<code>ThemedButton</code> mounts. React sees the <code>useContext(ThemeCtx)</code> call and <span class=\"hl-task\">subscribes</span> this component to ThemeCtx.",
        activeLine: 4,
        doneLines: [1, 3, 8, 9, 10],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "provider",
              label: "<ThemeCtx.Provider>",
              props: [{ key: "value", value: '"dark"' }],
              children: [
                {
                  id: "button-comp",
                  label: "<ThemedButton>",
                  highlight: "active",
                },
              ],
            },
          ],
        },
        activeNodeId: "button-comp",
        contextRegistry: [
          { name: "ThemeCtx", value: '"dark"', providerId: "Provider" },
        ],
        consumers: [
          {
            consumerId: "ThemedButton",
            contextName: "ThemeCtx",
            currentValue: "reading...",
          },
        ],
      },
      {
        descriptionHtml:
          'To resolve the value, React walks <span class="hl-api">up the component tree</span> from ThemedButton to the nearest ThemeCtx.Provider. It finds the Provider and reads <code>"dark"</code>.',
        activeLine: 4,
        doneLines: [1, 3, 8, 9, 10],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "provider",
              label: "<ThemeCtx.Provider>",
              highlight: "active",
              props: [{ key: "value", value: '"dark"' }],
              children: [
                {
                  id: "button-comp",
                  label: "<ThemedButton>",
                  highlight: "active",
                },
              ],
            },
          ],
        },
        activeNodeId: "provider",
        contextRegistry: [
          { name: "ThemeCtx", value: '"dark"', providerId: "Provider" },
        ],
        consumers: [
          {
            consumerId: "ThemedButton",
            contextName: "ThemeCtx",
            currentValue: '"dark"',
          },
        ],
      },
      {
        descriptionHtml:
          '<code>useContext</code> returns <code>"dark"</code>. ThemedButton renders a <code>&lt;button&gt;</code> displaying the theme value. The context value flows from Provider to consumer through the tree.',
        activeLine: 5,
        doneLines: [1, 3, 4, 8, 9, 10],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "provider",
              label: "<ThemeCtx.Provider>",
              highlight: "unchanged",
              props: [{ key: "value", value: '"dark"' }],
              children: [
                {
                  id: "button-comp",
                  label: "<ThemedButton>",
                  highlight: "unchanged",
                  children: [
                    { id: "button", label: "<button>", highlight: "added" },
                  ],
                },
              ],
            },
          ],
        },
        contextRegistry: [
          { name: "ThemeCtx", value: '"dark"', providerId: "Provider" },
        ],
        consumers: [
          {
            consumerId: "ThemedButton",
            contextName: "ThemeCtx",
            currentValue: '"dark"',
          },
        ],
      },
      {
        descriptionHtml:
          "Summary: <code>createContext</code> defines the context. <code>Provider</code> stores the value. <code>useContext</code> subscribes and reads the nearest Provider's value by walking up the tree.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        componentTree: {
          id: "app",
          label: "<App>",
          highlight: "unchanged",
          children: [
            {
              id: "provider",
              label: "<ThemeCtx.Provider>",
              highlight: "unchanged",
              props: [{ key: "value", value: '"dark"' }],
              children: [
                {
                  id: "button-comp",
                  label: "<ThemedButton>",
                  highlight: "unchanged",
                  children: [
                    { id: "button", label: "<button>", highlight: "unchanged" },
                  ],
                },
              ],
            },
          ],
        },
        contextRegistry: [
          { name: "ThemeCtx", value: '"dark"', providerId: "Provider" },
        ],
        consumers: [
          {
            consumerId: "ThemedButton",
            contextName: "ThemeCtx",
            currentValue: '"dark"',
          },
        ],
      },
    ],
  },

  /* ── Nested Providers ── */
  {
    id: "nested-providers",
    title: "Nested Providers",
    description:
      "An inner Provider shadows the outer one for its subtree. Each consumer reads from the nearest Provider above it.",
    kind: "nested",
    codeLines: [
      { num: 1, text: 'const ThemeCtx = createContext("light");' },
      { num: 2, text: "" },
      { num: 3, text: "function Label() {" },
      { num: 4, text: "  const theme = useContext(ThemeCtx);" },
      { num: 5, text: "  return <span>{theme}</span>;" },
      { num: 6, text: "}" },
      { num: 7, text: "" },
      { num: 8, text: "function App() {" },
      { num: 9, text: "  return (" },
      { num: 10, text: '    <ThemeCtx.Provider value="dark">' },
      { num: 11, text: "      <Label />           {/* outer */}" },
      { num: 12, text: '      <ThemeCtx.Provider value="blue">' },
      { num: 13, text: "        <Label />         {/* inner */}" },
      { num: 14, text: "      </ThemeCtx.Provider>" },
      { num: 15, text: "    </ThemeCtx.Provider>" },
      { num: 16, text: "  );" },
      { num: 17, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          'The outer Provider mounts with <code>value="dark"</code>. It covers the entire subtree.',
        activeLine: 10,
        doneLines: [1, 8, 9],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "outer-provider",
              label: "<ThemeCtx.Provider>",
              highlight: "active",
              props: [{ key: "value", value: '"dark"' }],
              children: [
                { id: "label-outer", label: "<Label> (outer)" },
                {
                  id: "inner-provider",
                  label: "<ThemeCtx.Provider>",
                  props: [{ key: "value", value: '"blue"' }],
                  children: [
                    { id: "label-inner", label: "<Label> (inner)" },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "outer-provider",
        contextRegistry: [
          { name: "ThemeCtx", value: '"dark"', providerId: "Outer Provider" },
        ],
        consumers: [],
      },
      {
        descriptionHtml:
          'The inner Provider mounts with <code>value="blue"</code>. It <span class="hl-api">shadows</span> the outer Provider for everything inside it.',
        activeLine: 12,
        doneLines: [1, 8, 9, 10, 11],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "outer-provider",
              label: "<ThemeCtx.Provider>",
              props: [{ key: "value", value: '"dark"' }],
              children: [
                { id: "label-outer", label: "<Label> (outer)" },
                {
                  id: "inner-provider",
                  label: "<ThemeCtx.Provider>",
                  highlight: "active",
                  props: [{ key: "value", value: '"blue"' }],
                  children: [
                    { id: "label-inner", label: "<Label> (inner)" },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "inner-provider",
        contextRegistry: [
          { name: "ThemeCtx", value: '"dark"', providerId: "Outer Provider" },
          { name: "ThemeCtx", value: '"blue"', providerId: "Inner Provider" },
        ],
        consumers: [],
      },
      {
        descriptionHtml:
          "The outer <code>&lt;Label&gt;</code> calls <code>useContext(ThemeCtx)</code>. React walks up and finds the <strong>outer</strong> Provider first.",
        activeLine: 4,
        doneLines: [1, 3, 8, 9, 10],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "outer-provider",
              label: "<ThemeCtx.Provider>",
              highlight: "active",
              props: [{ key: "value", value: '"dark"' }],
              children: [
                {
                  id: "label-outer",
                  label: "<Label> (outer)",
                  highlight: "active",
                },
                {
                  id: "inner-provider",
                  label: "<ThemeCtx.Provider>",
                  props: [{ key: "value", value: '"blue"' }],
                  children: [
                    { id: "label-inner", label: "<Label> (inner)" },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "label-outer",
        contextRegistry: [
          { name: "ThemeCtx", value: '"dark"', providerId: "Outer Provider" },
          { name: "ThemeCtx", value: '"blue"', providerId: "Inner Provider" },
        ],
        consumers: [
          {
            consumerId: "Label (outer)",
            contextName: "ThemeCtx",
            currentValue: '"dark"',
          },
        ],
      },
      {
        descriptionHtml:
          "The inner <code>&lt;Label&gt;</code> calls <code>useContext(ThemeCtx)</code>. React walks up and hits the <strong>inner</strong> Provider first, so it reads <code>\"blue\"</code>.",
        activeLine: 4,
        doneLines: [1, 3, 8, 9, 10, 12],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "outer-provider",
              label: "<ThemeCtx.Provider>",
              props: [{ key: "value", value: '"dark"' }],
              children: [
                {
                  id: "label-outer",
                  label: "<Label> (outer)",
                  highlight: "unchanged",
                },
                {
                  id: "inner-provider",
                  label: "<ThemeCtx.Provider>",
                  highlight: "active",
                  props: [{ key: "value", value: '"blue"' }],
                  children: [
                    {
                      id: "label-inner",
                      label: "<Label> (inner)",
                      highlight: "active",
                    },
                  ],
                },
              ],
            },
          ],
        },
        activeNodeId: "label-inner",
        contextRegistry: [
          { name: "ThemeCtx", value: '"dark"', providerId: "Outer Provider" },
          { name: "ThemeCtx", value: '"blue"', providerId: "Inner Provider" },
        ],
        consumers: [
          {
            consumerId: "Label (outer)",
            contextName: "ThemeCtx",
            currentValue: '"dark"',
          },
          {
            consumerId: "Label (inner)",
            contextName: "ThemeCtx",
            currentValue: '"blue"',
          },
        ],
      },
      {
        descriptionHtml:
          'Both Labels are rendered. Outer Label shows <code>"dark"</code>, inner Label shows <code>"blue"</code>. The inner Provider overrides the outer for its subtree only.',
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        componentTree: {
          id: "app",
          label: "<App>",
          highlight: "unchanged",
          children: [
            {
              id: "outer-provider",
              label: "<ThemeCtx.Provider>",
              highlight: "unchanged",
              props: [{ key: "value", value: '"dark"' }],
              children: [
                {
                  id: "label-outer",
                  label: "<Label> (outer)",
                  highlight: "unchanged",
                  children: [
                    { id: "span-outer", label: '<span>"dark"</span>', highlight: "unchanged" },
                  ],
                },
                {
                  id: "inner-provider",
                  label: "<ThemeCtx.Provider>",
                  highlight: "unchanged",
                  props: [{ key: "value", value: '"blue"' }],
                  children: [
                    {
                      id: "label-inner",
                      label: "<Label> (inner)",
                      highlight: "unchanged",
                      children: [
                        { id: "span-inner", label: '<span>"blue"</span>', highlight: "unchanged" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        contextRegistry: [
          { name: "ThemeCtx", value: '"dark"', providerId: "Outer Provider" },
          { name: "ThemeCtx", value: '"blue"', providerId: "Inner Provider" },
        ],
        consumers: [
          {
            consumerId: "Label (outer)",
            contextName: "ThemeCtx",
            currentValue: '"dark"',
          },
          {
            consumerId: "Label (inner)",
            contextName: "ThemeCtx",
            currentValue: '"blue"',
          },
        ],
      },
    ],
  },

  /* ── Unnecessary Re-renders ── */
  {
    id: "unnecessary-rerenders",
    title: "Consumer Re-renders",
    description:
      "When a Provider value changes, every consumer of that context re-renders, even if the part of the value they use did not change.",
    kind: "rerender",
    codeLines: [
      { num: 1, text: "const CountCtx = createContext(0);" },
      { num: 2, text: "" },
      { num: 3, text: "function Display() {" },
      { num: 4, text: "  const count = useContext(CountCtx);" },
      { num: 5, text: "  return <p>Count: {count}</p>;" },
      { num: 6, text: "}" },
      { num: 7, text: "" },
      { num: 8, text: "function Badge() {" },
      { num: 9, text: "  const count = useContext(CountCtx);" },
      { num: 10, text: "  return <span>{count > 0 ? \"active\" : \"idle\"}</span>;" },
      { num: 11, text: "}" },
      { num: 12, text: "" },
      { num: 13, text: "function Logo() {" },
      { num: 14, text: "  return <img src=\"logo.png\" />;" },
      { num: 15, text: "}" },
      { num: 16, text: "" },
      { num: 17, text: "function App() {" },
      { num: 18, text: "  const [count, setCount] = useState(0);" },
      { num: 19, text: "  return (" },
      { num: 20, text: "    <CountCtx.Provider value={count}>" },
      { num: 21, text: "      <Display />" },
      { num: 22, text: "      <Badge />" },
      { num: 23, text: "      <Logo />" },
      { num: 24, text: "    </CountCtx.Provider>" },
      { num: 25, text: "  );" },
      { num: 26, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Initial render with <code>count = 0</code>. The Provider stores the value. Display and Badge subscribe via <code>useContext</code>. Logo does not use context.",
        activeLine: 20,
        doneLines: [1, 17, 18, 19],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "provider",
              label: "<CountCtx.Provider>",
              highlight: "active",
              props: [{ key: "value", value: "0" }],
              children: [
                { id: "display", label: "<Display>" },
                { id: "badge", label: "<Badge>" },
                { id: "logo", label: "<Logo>" },
              ],
            },
          ],
        },
        activeNodeId: "provider",
        contextRegistry: [
          { name: "CountCtx", value: "0", providerId: "Provider" },
        ],
        consumers: [],
      },
      {
        descriptionHtml:
          "<code>Display</code> and <code>Badge</code> both call <code>useContext(CountCtx)</code>. React subscribes them to the context. <code>Logo</code> does not use context and is not subscribed.",
        activeLine: 4,
        doneLines: [1, 3, 8, 13, 17, 18, 19, 20],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "provider",
              label: "<CountCtx.Provider>",
              props: [{ key: "value", value: "0" }],
              children: [
                { id: "display", label: "<Display>", highlight: "active" },
                { id: "badge", label: "<Badge>", highlight: "active" },
                { id: "logo", label: "<Logo>", highlight: "unchanged" },
              ],
            },
          ],
        },
        contextRegistry: [
          { name: "CountCtx", value: "0", providerId: "Provider" },
        ],
        consumers: [
          { consumerId: "Display", contextName: "CountCtx", currentValue: "0" },
          { consumerId: "Badge", contextName: "CountCtx", currentValue: "0" },
        ],
      },
      {
        descriptionHtml:
          "All components render. Display shows <code>0</code>, Badge shows <code>\"idle\"</code>, Logo shows the image. Everything is mounted and stable.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        componentTree: {
          id: "app",
          label: "<App>",
          highlight: "unchanged",
          children: [
            {
              id: "provider",
              label: "<CountCtx.Provider>",
              highlight: "unchanged",
              props: [{ key: "value", value: "0" }],
              children: [
                { id: "display", label: "<Display>", highlight: "unchanged" },
                { id: "badge", label: "<Badge>", highlight: "unchanged" },
                { id: "logo", label: "<Logo>", highlight: "unchanged" },
              ],
            },
          ],
        },
        contextRegistry: [
          { name: "CountCtx", value: "0", providerId: "Provider" },
        ],
        consumers: [
          { consumerId: "Display", contextName: "CountCtx", currentValue: "0" },
          { consumerId: "Badge", contextName: "CountCtx", currentValue: "0" },
        ],
      },
      {
        descriptionHtml:
          '<code>setCount(1)</code> is called. The Provider value changes from <code>0</code> to <code>1</code>. React detects the value changed (using <span class="hl-api">Object.is</span> comparison).',
        activeLine: 20,
        doneLines: [1, 17, 18, 19],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "provider",
              label: "<CountCtx.Provider>",
              highlight: "updated",
              props: [{ key: "value", value: "1" }],
              children: [
                { id: "display", label: "<Display>" },
                { id: "badge", label: "<Badge>" },
                { id: "logo", label: "<Logo>" },
              ],
            },
          ],
        },
        activeNodeId: "provider",
        contextRegistry: [
          { name: "CountCtx", value: "1", providerId: "Provider" },
        ],
        consumers: [
          { consumerId: "Display", contextName: "CountCtx", currentValue: "0" },
          { consumerId: "Badge", contextName: "CountCtx", currentValue: "0" },
        ],
      },
      {
        descriptionHtml:
          'React <span class="hl-loop">re-renders every consumer</span> of CountCtx. Both Display and Badge re-render, even though Badge\'s output ("active" vs "idle") might not need the exact number.',
        activeLine: null,
        doneLines: [1, 3, 4, 5, 8, 9, 10, 17, 18, 19, 20],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "provider",
              label: "<CountCtx.Provider>",
              highlight: "updated",
              props: [{ key: "value", value: "1" }],
              children: [
                { id: "display", label: "<Display>", highlight: "updated" },
                { id: "badge", label: "<Badge>", highlight: "updated" },
                { id: "logo", label: "<Logo>", highlight: "unchanged" },
              ],
            },
          ],
        },
        contextRegistry: [
          { name: "CountCtx", value: "1", providerId: "Provider" },
        ],
        consumers: [
          { consumerId: "Display", contextName: "CountCtx", currentValue: "1", isRerendering: true },
          { consumerId: "Badge", contextName: "CountCtx", currentValue: "1", isRerendering: true },
        ],
      },
      {
        descriptionHtml:
          "<code>Logo</code> did <strong>not</strong> re-render because it does not consume CountCtx. Context only triggers re-renders in components that call <code>useContext</code> for that specific context.",
        activeLine: 14,
        doneLines: [1, 3, 4, 5, 8, 9, 10, 13, 17, 18, 19, 20],
        componentTree: {
          id: "app",
          label: "<App>",
          children: [
            {
              id: "provider",
              label: "<CountCtx.Provider>",
              highlight: "unchanged",
              props: [{ key: "value", value: "1" }],
              children: [
                { id: "display", label: "<Display>", highlight: "updated" },
                { id: "badge", label: "<Badge>", highlight: "updated" },
                { id: "logo", label: "<Logo>", highlight: "unchanged" },
              ],
            },
          ],
        },
        contextRegistry: [
          { name: "CountCtx", value: "1", providerId: "Provider" },
        ],
        consumers: [
          { consumerId: "Display", contextName: "CountCtx", currentValue: "1" },
          { consumerId: "Badge", contextName: "CountCtx", currentValue: "1" },
        ],
      },
      {
        descriptionHtml:
          "There is no built-in selector for context. If you need fine-grained subscriptions, split large contexts into smaller ones, or use <code>useMemo</code> inside consumers to skip expensive renders.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        componentTree: {
          id: "app",
          label: "<App>",
          highlight: "unchanged",
          children: [
            {
              id: "provider",
              label: "<CountCtx.Provider>",
              highlight: "unchanged",
              props: [{ key: "value", value: "1" }],
              children: [
                { id: "display", label: "<Display>", highlight: "unchanged" },
                { id: "badge", label: "<Badge>", highlight: "unchanged" },
                { id: "logo", label: "<Logo>", highlight: "unchanged" },
              ],
            },
          ],
        },
        contextRegistry: [
          { name: "CountCtx", value: "1", providerId: "Provider" },
        ],
        consumers: [
          { consumerId: "Display", contextName: "CountCtx", currentValue: "1" },
          { consumerId: "Badge", contextName: "CountCtx", currentValue: "1" },
        ],
      },
    ],
  },
];
