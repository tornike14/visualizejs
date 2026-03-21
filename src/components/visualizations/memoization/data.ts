import type { MemoizationExample } from "./types";

export const EXAMPLES: MemoizationExample[] = [
  /* ── React.memo ── */
  {
    id: "react-memo",
    title: "React.memo",
    description:
      "Parent re-renders but memoized child receives same props. React.memo shallow-compares and skips.",
    kind: "memo",
    codeLines: [
      { num: 1, text: "const MemoChild = React.memo(({ name }) => {" },
      { num: 2, text: '  return <p>Hello, {name}</p>;' },
      { num: 3, text: "});" },
      { num: 4, text: "" },
      { num: 5, text: "function Parent() {" },
      { num: 6, text: "  const [count, setCount] = useState(0);" },
      { num: 7, text: '  return (' },
      { num: 8, text: '    <div>' },
      { num: 9, text: '      <p>{count}</p>' },
      { num: 10, text: '      <button onClick={() => setCount(c => c + 1)}>' },
      { num: 11, text: '        +' },
      { num: 12, text: '      </button>' },
      { num: 13, text: '      <MemoChild name="Alice" />' },
      { num: 14, text: '    </div>' },
      { num: 15, text: "  );" },
      { num: 16, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Initial render. <code>React.memo</code> has no previous props yet, so <code>MemoChild</code> renders normally.",
        activeLine: 1,
        doneLines: [],
        componentTree: {
          id: "parent",
          label: "<Parent>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "p", label: "<p>", children: [{ id: "p-text", label: '"0"' }] },
              { id: "button", label: "<button>" },
              { id: "memo-child", label: "<MemoChild>", props: [{ key: "name", value: '"Alice"' }] },
            ]},
          ],
        },
        activeNodeId: "memo-child",
        memoEntries: [
          {
            id: "memo-1",
            hook: "React.memo",
            label: "<MemoChild>",
            deps: ["name"],
            cachedValue: "none (first render)",
            status: "empty",
          },
        ],
        renderDecisions: [
          { componentId: "parent", label: "<Parent>", decision: "render", reason: "initial mount" },
          { componentId: "memo-child", label: "<MemoChild>", decision: "render", reason: "first render, no cached props" },
        ],
      },
      {
        descriptionHtml:
          'Render complete. <code>React.memo</code> stores <code>{ name: "Alice" }</code> as the cached props reference.',
        activeLine: 2,
        doneLines: [1],
        componentTree: {
          id: "parent",
          label: "<Parent>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "p", label: "<p>", children: [{ id: "p-text", label: '"0"' }] },
              { id: "button", label: "<button>" },
              { id: "memo-child", label: "<MemoChild>", highlight: "unchanged", props: [{ key: "name", value: '"Alice"' }] },
            ]},
          ],
        },
        memoEntries: [
          {
            id: "memo-1",
            hook: "React.memo",
            label: "<MemoChild>",
            deps: ["name"],
            cachedValue: '{ name: "Alice" }',
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "parent", label: "<Parent>", decision: "render", reason: "initial mount" },
          { componentId: "memo-child", label: "<MemoChild>", decision: "render", reason: "first render, no cached props" },
        ],
      },
      {
        descriptionHtml:
          'User clicks the <code>+</code> button. <code>setCount</code> triggers a <span class="hl-api">Parent re-render</span>.',
        activeLine: 10,
        doneLines: [1, 2, 3],
        componentTree: {
          id: "parent",
          label: "<Parent>",
          highlight: "active",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "p", label: "<p>", children: [{ id: "p-text", label: '"0"' }] },
              { id: "button", label: "<button>" },
              { id: "memo-child", label: "<MemoChild>", props: [{ key: "name", value: '"Alice"' }] },
            ]},
          ],
        },
        activeNodeId: "parent",
        memoEntries: [
          {
            id: "memo-1",
            hook: "React.memo",
            label: "<MemoChild>",
            deps: ["name"],
            cachedValue: '{ name: "Alice" }',
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "parent", label: "<Parent>", decision: "render", reason: "state changed: count 0 -> 1" },
        ],
      },
      {
        descriptionHtml:
          'Parent re-renders with <code>count = 1</code>. React reaches <code>&lt;MemoChild&gt;</code> and begins <span class="hl-task">shallow prop comparison</span>.',
        activeLine: 13,
        doneLines: [1, 2, 3, 5, 6, 7, 8, 9, 10],
        componentTree: {
          id: "parent",
          label: "<Parent>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "p", label: "<p>", children: [{ id: "p-text", label: '"1"', highlight: "updated" }] },
              { id: "button", label: "<button>" },
              { id: "memo-child", label: "<MemoChild>", highlight: "active", props: [{ key: "name", value: '"Alice"' }] },
            ]},
          ],
        },
        activeNodeId: "memo-child",
        memoEntries: [
          {
            id: "memo-1",
            hook: "React.memo",
            label: "<MemoChild>",
            deps: ["name"],
            prevDeps: ["name"],
            cachedValue: '{ name: "Alice" }',
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "parent", label: "<Parent>", decision: "render", reason: "state changed: count 0 -> 1" },
        ],
      },
      {
        descriptionHtml:
          'Props equal: <code>"Alice" === "Alice"</code>. <code>React.memo</code> <span class="hl-task">skips MemoChild entirely</span>, returning the cached render result.',
        activeLine: 13,
        doneLines: [1, 2, 3, 5, 6, 7, 8, 9, 10],
        componentTree: {
          id: "parent",
          label: "<Parent>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "p", label: "<p>", children: [{ id: "p-text", label: '"1"', highlight: "updated" }] },
              { id: "button", label: "<button>" },
              { id: "memo-child", label: "<MemoChild>", highlight: "unchanged", props: [{ key: "name", value: '"Alice"' }] },
            ]},
          ],
        },
        memoEntries: [
          {
            id: "memo-1",
            hook: "React.memo",
            label: "<MemoChild>",
            deps: ["name"],
            prevDeps: ["name"],
            cachedValue: '{ name: "Alice" }',
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "parent", label: "<Parent>", decision: "render", reason: "state changed: count 0 -> 1" },
          { componentId: "memo-child", label: "<MemoChild>", decision: "skip", reason: "props unchanged (shallow equal)" },
        ],
      },
      {
        descriptionHtml:
          "Complete. Only <code>&lt;p&gt;</code> was updated in the DOM. <code>MemoChild</code> was skipped, saving an unnecessary re-render.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        componentTree: {
          id: "parent",
          label: "<Parent>",
          highlight: "unchanged",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "p", label: "<p>", highlight: "updated", children: [{ id: "p-text", label: '"1"', highlight: "updated" }] },
              { id: "button", label: "<button>", highlight: "unchanged" },
              { id: "memo-child", label: "<MemoChild>", highlight: "unchanged", props: [{ key: "name", value: '"Alice"' }] },
            ]},
          ],
        },
        memoEntries: [
          {
            id: "memo-1",
            hook: "React.memo",
            label: "<MemoChild>",
            deps: ["name"],
            cachedValue: '{ name: "Alice" }',
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "parent", label: "<Parent>", decision: "render", reason: "state changed: count 0 -> 1" },
          { componentId: "memo-child", label: "<MemoChild>", decision: "skip", reason: "props unchanged (shallow equal)" },
        ],
      },
    ],
  },

  /* ── useMemo ── */
  {
    id: "use-memo",
    title: "useMemo",
    description:
      "Expensive calculation cached by dependency array. Shows cache hit when deps unchanged.",
    kind: "use-memo",
    codeLines: [
      { num: 1, text: "function ProductList({ items, taxRate }) {" },
      { num: 2, text: "  const [filter, setFilter] = useState('');" },
      { num: 3, text: "" },
      { num: 4, text: "  const total = useMemo(() => {" },
      { num: 5, text: "    return items.reduce((sum, i) => sum + i.price, 0);" },
      { num: 6, text: "  }, [items]);" },
      { num: 7, text: "" },
      { num: 8, text: "  return (" },
      { num: 9, text: "    <div>" },
      { num: 10, text: "      <input onChange={e => setFilter(e.target.value)} />" },
      { num: 11, text: "      <p>Total: ${total}</p>" },
      { num: 12, text: "    </div>" },
      { num: 13, text: "  );" },
      { num: 14, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Initial render. <code>useMemo</code> runs the factory function because there is no cached value yet.",
        activeLine: 4,
        doneLines: [1, 2],
        componentTree: {
          id: "product-list",
          label: "<ProductList>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "input", label: "<input>" },
              { id: "p-total", label: "<p>", children: [{ id: "total-text", label: '"Total: $150"' }] },
            ]},
          ],
        },
        activeNodeId: "product-list",
        memoEntries: [
          {
            id: "usememo-1",
            hook: "useMemo",
            label: "total = items.reduce(...)",
            deps: ["items"],
            cachedValue: "none (first call)",
            status: "empty",
          },
        ],
        renderDecisions: [
          { componentId: "product-list", label: "<ProductList>", decision: "render", reason: "initial mount" },
        ],
      },
      {
        descriptionHtml:
          "Factory executes: <code>items.reduce</code> computes <code>$150</code>. Result and deps snapshot are cached on the hook.",
        activeLine: 5,
        doneLines: [1, 2, 4],
        componentTree: {
          id: "product-list",
          label: "<ProductList>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "input", label: "<input>" },
              { id: "p-total", label: "<p>", children: [{ id: "total-text", label: '"Total: $150"' }] },
            ]},
          ],
        },
        memoEntries: [
          {
            id: "usememo-1",
            hook: "useMemo",
            label: "total = items.reduce(...)",
            deps: ["items"],
            cachedValue: "$150",
            status: "miss",
          },
        ],
        renderDecisions: [
          { componentId: "product-list", label: "<ProductList>", decision: "render", reason: "initial mount" },
        ],
      },
      {
        descriptionHtml:
          'User types in the filter input. <code>setFilter</code> triggers a <span class="hl-api">re-render</span> of ProductList.',
        activeLine: 10,
        doneLines: [1, 2, 4, 5, 6],
        componentTree: {
          id: "product-list",
          label: "<ProductList>",
          highlight: "active",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "input", label: "<input>" },
              { id: "p-total", label: "<p>", children: [{ id: "total-text", label: '"Total: $150"' }] },
            ]},
          ],
        },
        activeNodeId: "product-list",
        memoEntries: [
          {
            id: "usememo-1",
            hook: "useMemo",
            label: "total = items.reduce(...)",
            deps: ["items"],
            cachedValue: "$150",
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "product-list", label: "<ProductList>", decision: "render", reason: "state changed: filter" },
        ],
      },
      {
        descriptionHtml:
          'React reaches the <code>useMemo</code> hook. It compares deps: <code>items</code> is the <span class="hl-task">same reference</span>. Cache hit - factory is skipped.',
        activeLine: 4,
        doneLines: [1, 2, 10],
        componentTree: {
          id: "product-list",
          label: "<ProductList>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "input", label: "<input>", highlight: "updated" },
              { id: "p-total", label: "<p>", children: [{ id: "total-text", label: '"Total: $150"' }] },
            ]},
          ],
        },
        memoEntries: [
          {
            id: "usememo-1",
            hook: "useMemo",
            label: "total = items.reduce(...)",
            deps: ["items"],
            prevDeps: ["items"],
            cachedValue: "$150",
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "product-list", label: "<ProductList>", decision: "render", reason: "state changed: filter" },
        ],
      },
      {
        descriptionHtml:
          "Complete. The expensive <code>reduce</code> was skipped entirely. <code>useMemo</code> returned the cached <code>$150</code> without recalculating.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        componentTree: {
          id: "product-list",
          label: "<ProductList>",
          highlight: "unchanged",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "input", label: "<input>", highlight: "updated" },
              { id: "p-total", label: "<p>", highlight: "unchanged", children: [{ id: "total-text", label: '"Total: $150"' }] },
            ]},
          ],
        },
        memoEntries: [
          {
            id: "usememo-1",
            hook: "useMemo",
            label: "total = items.reduce(...)",
            deps: ["items"],
            cachedValue: "$150",
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "product-list", label: "<ProductList>", decision: "render", reason: "state changed: filter" },
        ],
      },
    ],
  },

  /* ── useCallback ── */
  {
    id: "use-callback",
    title: "useCallback",
    description:
      "Stable callback reference prevents memoized child from re-rendering.",
    kind: "use-callback",
    codeLines: [
      { num: 1, text: "function Parent() {" },
      { num: 2, text: "  const [count, setCount] = useState(0);" },
      { num: 3, text: "  const [name, setName] = useState('Alice');" },
      { num: 4, text: "" },
      { num: 5, text: "  const handleClick = useCallback(() => {" },
      { num: 6, text: "    console.log(name);" },
      { num: 7, text: "  }, [name]);" },
      { num: 8, text: "" },
      { num: 9, text: "  return (" },
      { num: 10, text: "    <div>" },
      { num: 11, text: "      <p>{count}</p>" },
      { num: 12, text: "      <button onClick={() => setCount(c => c + 1)}>+</button>" },
      { num: 13, text: "      <MemoButton onClick={handleClick} />" },
      { num: 14, text: "    </div>" },
      { num: 15, text: "  );" },
      { num: 16, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Initial render. <code>useCallback</code> stores the callback and captures <code>[name]</code> as deps.",
        activeLine: 5,
        doneLines: [1, 2, 3],
        componentTree: {
          id: "parent",
          label: "<Parent>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "p", label: "<p>", children: [{ id: "p-text", label: '"0"' }] },
              { id: "button", label: "<button>" },
              { id: "memo-button", label: "<MemoButton>", props: [{ key: "onClick", value: "handleClick" }] },
            ]},
          ],
        },
        activeNodeId: "parent",
        memoEntries: [
          {
            id: "cb-1",
            hook: "useCallback",
            label: "handleClick",
            deps: ["name"],
            cachedValue: "() => console.log('Alice')",
            status: "empty",
          },
        ],
        renderDecisions: [
          { componentId: "parent", label: "<Parent>", decision: "render", reason: "initial mount" },
          { componentId: "memo-button", label: "<MemoButton>", decision: "render", reason: "first render" },
        ],
      },
      {
        descriptionHtml:
          'User clicks <code>+</code>. <code>setCount</code> triggers Parent re-render. <code>name</code> has not changed.',
        activeLine: 12,
        doneLines: [1, 2, 3, 5, 6, 7],
        componentTree: {
          id: "parent",
          label: "<Parent>",
          highlight: "active",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "p", label: "<p>", children: [{ id: "p-text", label: '"0"' }] },
              { id: "button", label: "<button>" },
              { id: "memo-button", label: "<MemoButton>", props: [{ key: "onClick", value: "handleClick" }] },
            ]},
          ],
        },
        activeNodeId: "parent",
        memoEntries: [
          {
            id: "cb-1",
            hook: "useCallback",
            label: "handleClick",
            deps: ["name"],
            prevDeps: ["name"],
            cachedValue: "() => console.log('Alice')",
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "parent", label: "<Parent>", decision: "render", reason: "state changed: count 0 -> 1" },
        ],
      },
      {
        descriptionHtml:
          '<code>useCallback</code> compares deps: <code>name</code> is still <code>"Alice"</code>. <span class="hl-task">Same reference returned</span> - no new function created.',
        activeLine: 5,
        doneLines: [1, 2, 3, 12],
        componentTree: {
          id: "parent",
          label: "<Parent>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "p", label: "<p>", children: [{ id: "p-text", label: '"1"', highlight: "updated" }] },
              { id: "button", label: "<button>" },
              { id: "memo-button", label: "<MemoButton>", highlight: "active", props: [{ key: "onClick", value: "handleClick" }] },
            ]},
          ],
        },
        activeNodeId: "memo-button",
        memoEntries: [
          {
            id: "cb-1",
            hook: "useCallback",
            label: "handleClick",
            deps: ["name"],
            prevDeps: ["name"],
            cachedValue: "() => console.log('Alice')",
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "parent", label: "<Parent>", decision: "render", reason: "state changed: count 0 -> 1" },
        ],
      },
      {
        descriptionHtml:
          '<code>React.memo</code> on MemoButton compares <code>onClick</code> prop: same function reference. <span class="hl-task">MemoButton skipped</span>.',
        activeLine: 13,
        doneLines: [1, 2, 3, 5, 6, 7, 12],
        componentTree: {
          id: "parent",
          label: "<Parent>",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "p", label: "<p>", children: [{ id: "p-text", label: '"1"', highlight: "updated" }] },
              { id: "button", label: "<button>" },
              { id: "memo-button", label: "<MemoButton>", highlight: "unchanged", props: [{ key: "onClick", value: "handleClick" }] },
            ]},
          ],
        },
        memoEntries: [
          {
            id: "cb-1",
            hook: "useCallback",
            label: "handleClick",
            deps: ["name"],
            cachedValue: "() => console.log('Alice')",
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "parent", label: "<Parent>", decision: "render", reason: "state changed: count 0 -> 1" },
          { componentId: "memo-button", label: "<MemoButton>", decision: "skip", reason: "onClick is same reference" },
        ],
      },
      {
        descriptionHtml:
          "Complete. Without <code>useCallback</code>, every Parent render would create a new function, and <code>React.memo</code> would see different props every time.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        componentTree: {
          id: "parent",
          label: "<Parent>",
          highlight: "unchanged",
          children: [
            { id: "div", label: "<div>", children: [
              { id: "p", label: "<p>", highlight: "updated", children: [{ id: "p-text", label: '"1"', highlight: "updated" }] },
              { id: "button", label: "<button>", highlight: "unchanged" },
              { id: "memo-button", label: "<MemoButton>", highlight: "unchanged", props: [{ key: "onClick", value: "handleClick" }] },
            ]},
          ],
        },
        memoEntries: [
          {
            id: "cb-1",
            hook: "useCallback",
            label: "handleClick",
            deps: ["name"],
            cachedValue: "() => console.log('Alice')",
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "parent", label: "<Parent>", decision: "render", reason: "state changed: count 0 -> 1" },
          { componentId: "memo-button", label: "<MemoButton>", decision: "skip", reason: "onClick is same reference" },
        ],
      },
    ],
  },

  /* ── Cache Invalidation ── */
  {
    id: "cache-invalidation",
    title: "Cache Invalidation",
    description:
      "Dependencies change, forcing cache miss and recalculation.",
    kind: "invalidation",
    codeLines: [
      { num: 1, text: "function PriceDisplay({ items, taxRate }) {" },
      { num: 2, text: "  const total = useMemo(() => {" },
      { num: 3, text: "    const subtotal = items.reduce((s, i) => s + i.price, 0);" },
      { num: 4, text: "    return subtotal * (1 + taxRate);" },
      { num: 5, text: "  }, [items, taxRate]);" },
      { num: 6, text: "" },
      { num: 7, text: "  return <p>Total: ${total.toFixed(2)}</p>;" },
      { num: 8, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "Initial render with <code>taxRate = 0.08</code>. <code>useMemo</code> runs the factory for the first time.",
        activeLine: 2,
        doneLines: [1],
        componentTree: {
          id: "price",
          label: "<PriceDisplay>",
          props: [{ key: "taxRate", value: "0.08" }],
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"Total: $108.00"' }] },
          ],
        },
        activeNodeId: "price",
        memoEntries: [
          {
            id: "memo-price",
            hook: "useMemo",
            label: "total = subtotal * (1 + taxRate)",
            deps: ["items", "0.08"],
            cachedValue: "none (first call)",
            status: "empty",
          },
        ],
        renderDecisions: [
          { componentId: "price", label: "<PriceDisplay>", decision: "render", reason: "initial mount" },
        ],
      },
      {
        descriptionHtml:
          "Factory computes: <code>$100 * 1.08 = $108.00</code>. Deps <code>[items, 0.08]</code> are stored alongside the cached value.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        componentTree: {
          id: "price",
          label: "<PriceDisplay>",
          props: [{ key: "taxRate", value: "0.08" }],
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"Total: $108.00"' }] },
          ],
        },
        memoEntries: [
          {
            id: "memo-price",
            hook: "useMemo",
            label: "total = subtotal * (1 + taxRate)",
            deps: ["items", "0.08"],
            cachedValue: "$108.00",
            status: "miss",
          },
        ],
        renderDecisions: [
          { componentId: "price", label: "<PriceDisplay>", decision: "render", reason: "initial mount" },
        ],
      },
      {
        descriptionHtml:
          'Parent passes new <code>taxRate = 0.10</code>. PriceDisplay re-renders with <span class="hl-loop">changed props</span>.',
        activeLine: 1,
        doneLines: [],
        componentTree: {
          id: "price",
          label: "<PriceDisplay>",
          highlight: "active",
          props: [{ key: "taxRate", value: "0.10" }],
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"Total: $108.00"' }] },
          ],
        },
        activeNodeId: "price",
        memoEntries: [
          {
            id: "memo-price",
            hook: "useMemo",
            label: "total = subtotal * (1 + taxRate)",
            deps: ["items", "0.10"],
            prevDeps: ["items", "0.08"],
            cachedValue: "$108.00",
            status: "stale",
          },
        ],
        renderDecisions: [
          { componentId: "price", label: "<PriceDisplay>", decision: "render", reason: "props changed: taxRate" },
        ],
      },
      {
        descriptionHtml:
          '<code>useMemo</code> compares deps: <code>items</code> is same, but <code>taxRate</code> changed <code>0.08 !== 0.10</code>. <span class="hl-loop">Cache miss</span> - factory must re-run.',
        activeLine: 2,
        doneLines: [1],
        componentTree: {
          id: "price",
          label: "<PriceDisplay>",
          props: [{ key: "taxRate", value: "0.10" }],
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"Total: $108.00"' }] },
          ],
        },
        memoEntries: [
          {
            id: "memo-price",
            hook: "useMemo",
            label: "total = subtotal * (1 + taxRate)",
            deps: ["items", "0.10"],
            prevDeps: ["items", "0.08"],
            cachedValue: "$108.00 (stale)",
            status: "miss",
          },
        ],
        renderDecisions: [
          { componentId: "price", label: "<PriceDisplay>", decision: "render", reason: "props changed: taxRate" },
        ],
      },
      {
        descriptionHtml:
          "Factory recalculates: <code>$100 * 1.10 = $110.00</code>. New result replaces the stale cache entry.",
        activeLine: 4,
        doneLines: [1, 2, 3],
        componentTree: {
          id: "price",
          label: "<PriceDisplay>",
          props: [{ key: "taxRate", value: "0.10" }],
          children: [
            { id: "p", label: "<p>", children: [{ id: "text", label: '"Total: $110.00"', highlight: "updated" }] },
          ],
        },
        memoEntries: [
          {
            id: "memo-price",
            hook: "useMemo",
            label: "total = subtotal * (1 + taxRate)",
            deps: ["items", "0.10"],
            cachedValue: "$110.00",
            status: "miss",
          },
        ],
        renderDecisions: [
          { componentId: "price", label: "<PriceDisplay>", decision: "render", reason: "props changed: taxRate" },
        ],
      },
      {
        descriptionHtml:
          "Complete. The cache was correctly invalidated when <code>taxRate</code> changed. <code>useMemo</code> only skips recalculation when <strong>all</strong> deps are the same by <code>Object.is</code>.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        componentTree: {
          id: "price",
          label: "<PriceDisplay>",
          highlight: "unchanged",
          props: [{ key: "taxRate", value: "0.10" }],
          children: [
            { id: "p", label: "<p>", highlight: "updated", children: [{ id: "text", label: '"Total: $110.00"', highlight: "updated" }] },
          ],
        },
        memoEntries: [
          {
            id: "memo-price",
            hook: "useMemo",
            label: "total = subtotal * (1 + taxRate)",
            deps: ["items", "0.10"],
            cachedValue: "$110.00",
            status: "hit",
          },
        ],
        renderDecisions: [
          { componentId: "price", label: "<PriceDisplay>", decision: "render", reason: "props changed: taxRate" },
        ],
      },
    ],
  },
];
