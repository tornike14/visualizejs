import type { EventDelegationExample } from "./types";

/* ── Shared DOM tree builder ── */

function makeTree(
  highlights: Record<string, "idle" | "capture-active" | "target-active" | "bubble-active" | "stopped">,
  handlers?: Record<string, "capture" | "bubble">,
) {
  return {
    tag: "div",
    id: "container",
    label: "div#container",
    highlight: highlights["container"] ?? "idle",
    hasHandler: !!handlers?.["container"],
    handlerPhase: handlers?.["container"],
    children: [
      {
        tag: "ul",
        id: "list",
        label: "ul#list",
        highlight: highlights["list"] ?? "idle",
        hasHandler: !!handlers?.["list"],
        handlerPhase: handlers?.["list"],
        children: [
          {
            tag: "li",
            id: "item-1",
            label: "li#item-1",
            highlight: highlights["item-1"] ?? "idle",
            hasHandler: !!handlers?.["item-1"],
            handlerPhase: handlers?.["item-1"],
            children: [],
          },
        ],
      },
    ],
  };
}

function makeDelegationTree(
  highlights: Record<string, "idle" | "capture-active" | "target-active" | "bubble-active" | "stopped">,
  handlers?: Record<string, "capture" | "bubble">,
) {
  return {
    tag: "ul",
    id: "list",
    label: "ul#list",
    highlight: highlights["list"] ?? "idle",
    hasHandler: !!handlers?.["list"],
    handlerPhase: handlers?.["list"],
    children: [
      {
        tag: "li",
        id: "item-1",
        label: 'li#item-1 "Apple"',
        highlight: highlights["item-1"] ?? "idle",
        hasHandler: false,
        children: [],
      },
      {
        tag: "li",
        id: "item-2",
        label: 'li#item-2 "Banana"',
        highlight: highlights["item-2"] ?? "idle",
        hasHandler: false,
        children: [],
      },
      {
        tag: "li",
        id: "item-3",
        label: 'li#item-3 "Cherry"',
        highlight: highlights["item-3"] ?? "idle",
        hasHandler: false,
        children: [],
      },
    ],
  };
}

/* ── Example Data ── */

export const EXAMPLES: EventDelegationExample[] = [
  /* ── 1. Capture & Bubble ── */
  {
    id: "capture-bubble",
    title: "Capture & Bubble",
    description:
      "Events travel down during capture, reach the target, then bubble back up. Handlers default to the bubble phase.",
    kind: "bubbling",
    codeLines: [
      { num: 1, text: 'const div = document.querySelector("#container");' },
      { num: 2, text: 'const ul  = document.querySelector("#list");' },
      { num: 3, text: 'const li  = document.querySelector("#item-1");' },
      { num: 4, text: "" },
      { num: 5, text: "div.addEventListener(\"click\"," },
      { num: 6, text: '  () => console.log("div captured"), true);' },
      { num: 7, text: "" },
      { num: 8, text: "ul.addEventListener(\"click\"," },
      { num: 9, text: '  () => console.log("ul bubbled"));' },
      { num: 10, text: "" },
      { num: 11, text: "li.addEventListener(\"click\"," },
      { num: 12, text: '  () => console.log("li clicked"));' },
    ],
    steps: [
      {
        descriptionHtml:
          'Three nested elements are selected: <code>div#container</code> (outer), <code>ul#list</code> (middle), and <code>li#item-1</code> (inner).',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        domTree: makeTree({}),
        eventPath: [],
        currentPhaseLabel: null,
      },
      {
        descriptionHtml:
          'Three click listeners are registered. The <code>div</code> handler passes <code>true</code> as the third argument, so it listens during the <span class="hl-api">capture</span> phase. The <code>ul</code> and <code>li</code> handlers use the default <span class="hl-task">bubble</span> phase.',
        activeLine: 5,
        doneLines: [1, 2, 3],
        consoleOutput: [],
        domTree: makeTree({}, { container: "capture", list: "bubble", "item-1": "bubble" }),
        eventPath: [],
        currentPhaseLabel: null,
      },
      {
        descriptionHtml:
          'The user clicks <code>li#item-1</code>. The browser builds a propagation path from the root down to the target and back up. The <span class="hl-api">capture phase</span> begins.',
        activeLine: null,
        doneLines: [1, 2, 3, 5, 6, 8, 9, 11, 12],
        consoleOutput: [],
        domTree: makeTree({ "item-1": "target-active" }, { container: "capture", list: "bubble", "item-1": "bubble" }),
        eventPath: [],
        currentPhaseLabel: "Capture Phase",
      },
      {
        descriptionHtml:
          'Capture phase: the event reaches <code>div#container</code>. Its capture listener fires, logging <code>"div captured"</code>.',
        activeLine: 6,
        doneLines: [1, 2, 3, 5, 8, 9, 11, 12],
        consoleOutput: ["div captured"],
        domTree: makeTree({ container: "capture-active" }, { container: "capture", list: "bubble", "item-1": "bubble" }),
        eventPath: [
          { nodeLabel: "div#container", phase: "capture", handlerFired: true, stopped: false },
        ],
        currentPhaseLabel: "Capture Phase",
      },
      {
        descriptionHtml:
          'Capture continues through <code>ul#list</code>. No capture listener here, so the event passes through without firing a handler.',
        activeLine: null,
        doneLines: [1, 2, 3, 5, 6, 8, 9, 11, 12],
        consoleOutput: ["div captured"],
        domTree: makeTree({ list: "capture-active" }, { container: "capture", list: "bubble", "item-1": "bubble" }),
        eventPath: [
          { nodeLabel: "div#container", phase: "capture", handlerFired: true, stopped: false },
          { nodeLabel: "ul#list", phase: "capture", handlerFired: false, stopped: false },
        ],
        currentPhaseLabel: "Capture Phase",
      },
      {
        descriptionHtml:
          '<span class="hl-stack">Target phase</span>: the event reaches <code>li#item-1</code>, the actual click target. Its bubble-phase listener fires here, logging <code>"li clicked"</code>.',
        activeLine: 12,
        doneLines: [1, 2, 3, 5, 6, 8, 9, 11],
        consoleOutput: ["div captured", "li clicked"],
        domTree: makeTree({ "item-1": "target-active" }, { container: "capture", list: "bubble", "item-1": "bubble" }),
        eventPath: [
          { nodeLabel: "div#container", phase: "capture", handlerFired: true, stopped: false },
          { nodeLabel: "ul#list", phase: "capture", handlerFired: false, stopped: false },
          { nodeLabel: "li#item-1", phase: "target", handlerFired: true, stopped: false },
        ],
        currentPhaseLabel: "Target Phase",
      },
      {
        descriptionHtml:
          '<span class="hl-task">Bubble phase</span>: the event travels back up. <code>ul#list</code> has a bubble listener, so it fires, logging <code>"ul bubbled"</code>.',
        activeLine: 9,
        doneLines: [1, 2, 3, 5, 6, 8, 11, 12],
        consoleOutput: ["div captured", "li clicked", "ul bubbled"],
        domTree: makeTree({ list: "bubble-active" }, { container: "capture", list: "bubble", "item-1": "bubble" }),
        eventPath: [
          { nodeLabel: "div#container", phase: "capture", handlerFired: true, stopped: false },
          { nodeLabel: "ul#list", phase: "capture", handlerFired: false, stopped: false },
          { nodeLabel: "li#item-1", phase: "target", handlerFired: true, stopped: false },
          { nodeLabel: "ul#list", phase: "bubble", handlerFired: true, stopped: false },
        ],
        currentPhaseLabel: "Bubble Phase",
      },
      {
        descriptionHtml:
          'Bubble reaches <code>div#container</code>. The div only has a capture listener, so nothing fires during bubble. The event has completed its full journey: capture down, target, then bubble up.',
        activeLine: null,
        doneLines: [1, 2, 3, 5, 6, 8, 9, 11, 12],
        consoleOutput: ["div captured", "li clicked", "ul bubbled"],
        domTree: makeTree({ container: "bubble-active" }, { container: "capture", list: "bubble", "item-1": "bubble" }),
        eventPath: [
          { nodeLabel: "div#container", phase: "capture", handlerFired: true, stopped: false },
          { nodeLabel: "ul#list", phase: "capture", handlerFired: false, stopped: false },
          { nodeLabel: "li#item-1", phase: "target", handlerFired: true, stopped: false },
          { nodeLabel: "ul#list", phase: "bubble", handlerFired: true, stopped: false },
          { nodeLabel: "div#container", phase: "bubble", handlerFired: false, stopped: false },
        ],
        currentPhaseLabel: "Bubble Phase",
      },
    ],
  },

  /* ── 2. stopPropagation ── */
  {
    id: "stop-propagation",
    title: "stopPropagation",
    description:
      "stopPropagation() halts the event at the current node, preventing it from reaching further ancestors.",
    kind: "stop-propagation",
    codeLines: [
      { num: 1, text: 'const div = document.querySelector("#container");' },
      { num: 2, text: 'const ul  = document.querySelector("#list");' },
      { num: 3, text: 'const li  = document.querySelector("#item-1");' },
      { num: 4, text: "" },
      { num: 5, text: "div.addEventListener(\"click\"," },
      { num: 6, text: '  () => console.log("div clicked"));' },
      { num: 7, text: "" },
      { num: 8, text: "ul.addEventListener(\"click\", (e) => {" },
      { num: 9, text: "  e.stopPropagation();" },
      { num: 10, text: '  console.log("ul stopped it");' },
      { num: 11, text: "});" },
      { num: 12, text: "" },
      { num: 13, text: "li.addEventListener(\"click\"," },
      { num: 14, text: '  () => console.log("li clicked"));' },
    ],
    steps: [
      {
        descriptionHtml:
          'Three elements selected. The <code>ul</code> handler will call <code>e.stopPropagation()</code> to block further propagation.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        domTree: makeTree({}),
        eventPath: [],
        currentPhaseLabel: null,
      },
      {
        descriptionHtml:
          'Handlers registered. All use the bubble phase (default). The <code>ul</code> handler calls <code>e.stopPropagation()</code> before logging.',
        activeLine: 8,
        doneLines: [1, 2, 3, 5, 6],
        consoleOutput: [],
        domTree: makeTree({}, { container: "bubble", list: "bubble", "item-1": "bubble" }),
        eventPath: [],
        currentPhaseLabel: null,
      },
      {
        descriptionHtml:
          'The user clicks <code>li#item-1</code>. The capture phase runs first. No capture listeners exist, so no handlers fire during this phase.',
        activeLine: null,
        doneLines: [1, 2, 3, 5, 6, 8, 9, 10, 11, 13, 14],
        consoleOutput: [],
        domTree: makeTree({ "item-1": "target-active" }, { container: "bubble", list: "bubble", "item-1": "bubble" }),
        eventPath: [
          { nodeLabel: "div#container", phase: "capture", handlerFired: false, stopped: false },
          { nodeLabel: "ul#list", phase: "capture", handlerFired: false, stopped: false },
        ],
        currentPhaseLabel: "Capture Phase",
      },
      {
        descriptionHtml:
          '<span class="hl-stack">Target phase</span>: the event reaches <code>li#item-1</code>. Its handler fires, logging <code>"li clicked"</code>.',
        activeLine: 14,
        doneLines: [1, 2, 3, 5, 6, 8, 9, 10, 11, 13],
        consoleOutput: ["li clicked"],
        domTree: makeTree({ "item-1": "target-active" }, { container: "bubble", list: "bubble", "item-1": "bubble" }),
        eventPath: [
          { nodeLabel: "div#container", phase: "capture", handlerFired: false, stopped: false },
          { nodeLabel: "ul#list", phase: "capture", handlerFired: false, stopped: false },
          { nodeLabel: "li#item-1", phase: "target", handlerFired: true, stopped: false },
        ],
        currentPhaseLabel: "Target Phase",
      },
      {
        descriptionHtml:
          '<span class="hl-task">Bubble phase</span>: the event bubbles to <code>ul#list</code>. The handler calls <code>e.stopPropagation()</code> and logs <code>"ul stopped it"</code>. Propagation halts here.',
        activeLine: 9,
        doneLines: [1, 2, 3, 5, 6, 8, 10, 11, 13, 14],
        consoleOutput: ["li clicked", "ul stopped it"],
        domTree: makeTree({ list: "stopped" }, { container: "bubble", list: "bubble", "item-1": "bubble" }),
        eventPath: [
          { nodeLabel: "div#container", phase: "capture", handlerFired: false, stopped: false },
          { nodeLabel: "ul#list", phase: "capture", handlerFired: false, stopped: false },
          { nodeLabel: "li#item-1", phase: "target", handlerFired: true, stopped: false },
          { nodeLabel: "ul#list", phase: "bubble", handlerFired: true, stopped: true },
        ],
        currentPhaseLabel: "Bubble Phase",
      },
      {
        descriptionHtml:
          'The event <strong>never reaches</strong> <code>div#container</code>. Its handler does not fire because <code>stopPropagation()</code> cut the chain at <code>ul</code>.',
        activeLine: null,
        doneLines: [1, 2, 3, 5, 6, 8, 9, 10, 11, 13, 14],
        consoleOutput: ["li clicked", "ul stopped it"],
        domTree: makeTree({ container: "idle", list: "stopped" }, { container: "bubble", list: "bubble", "item-1": "bubble" }),
        eventPath: [
          { nodeLabel: "div#container", phase: "capture", handlerFired: false, stopped: false },
          { nodeLabel: "ul#list", phase: "capture", handlerFired: false, stopped: false },
          { nodeLabel: "li#item-1", phase: "target", handlerFired: true, stopped: false },
          { nodeLabel: "ul#list", phase: "bubble", handlerFired: true, stopped: true },
          { nodeLabel: "div#container", phase: "bubble", handlerFired: false, stopped: true },
        ],
        currentPhaseLabel: "Bubble Phase",
      },
      {
        descriptionHtml:
          'Without <code>stopPropagation()</code>, the div would have logged too. Use <code>stopPropagation</code> when a child must handle an event exclusively and parent handlers should not react.',
        activeLine: null,
        doneLines: [1, 2, 3, 5, 6, 8, 9, 10, 11, 13, 14],
        consoleOutput: ["li clicked", "ul stopped it"],
        domTree: makeTree({}, { container: "bubble", list: "bubble", "item-1": "bubble" }),
        eventPath: [
          { nodeLabel: "div#container", phase: "capture", handlerFired: false, stopped: false },
          { nodeLabel: "ul#list", phase: "capture", handlerFired: false, stopped: false },
          { nodeLabel: "li#item-1", phase: "target", handlerFired: true, stopped: false },
          { nodeLabel: "ul#list", phase: "bubble", handlerFired: true, stopped: true },
          { nodeLabel: "div#container", phase: "bubble", handlerFired: false, stopped: true },
        ],
        currentPhaseLabel: null,
      },
    ],
  },

  /* ── 3. Event Delegation ── */
  {
    id: "delegation",
    title: "Event Delegation",
    description:
      "Attach one handler to a parent instead of many to children. event.target identifies which child was clicked.",
    kind: "delegation",
    codeLines: [
      { num: 1, text: 'const ul = document.querySelector("#list");' },
      { num: 2, text: "" },
      { num: 3, text: 'ul.addEventListener("click", (e) => {' },
      { num: 4, text: '  if (e.target.tagName === "LI") {' },
      { num: 5, text: '    console.log("Clicked: " + e.target.textContent);' },
      { num: 6, text: "  }" },
      { num: 7, text: '  console.log("target: " + e.target.id);' },
      { num: 8, text: '  console.log("currentTarget: " + e.currentTarget.id);' },
      { num: 9, text: "});" },
      { num: 10, text: "" },
      { num: 11, text: "// <ul id=\"list\"> has three <li> children" },
    ],
    steps: [
      {
        descriptionHtml:
          'Select <code>ul#list</code>. Instead of attaching a handler to every <code>li</code>, we attach one handler to the parent. This is the <strong>delegation pattern</strong>.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        domTree: makeDelegationTree({}),
        eventPath: [],
        currentPhaseLabel: null,
      },
      {
        descriptionHtml:
          'The single handler uses <code>e.target</code> to identify which child was clicked, and <code>e.currentTarget</code> to reference the element the handler is attached to (<code>ul</code>).',
        activeLine: 3,
        doneLines: [1],
        consoleOutput: [],
        domTree: makeDelegationTree({}, { list: "bubble" }),
        eventPath: [],
        currentPhaseLabel: null,
      },
      {
        descriptionHtml:
          'Three <code>li</code> elements exist inside <code>ul</code>. The user clicks on <code>li#item-2</code> (text: "Banana"). No handlers are on the <code>li</code> elements themselves.',
        activeLine: 11,
        doneLines: [1, 3],
        consoleOutput: [],
        domTree: makeDelegationTree({ "item-2": "target-active" }, { list: "bubble" }),
        eventPath: [],
        currentPhaseLabel: null,
      },
      {
        descriptionHtml:
          'Capture phase runs (no capture listeners). The event reaches <code>li#item-2</code> (target phase) but there is no handler on it. It then bubbles up to <code>ul#list</code>.',
        activeLine: null,
        doneLines: [1, 3, 11],
        consoleOutput: [],
        domTree: makeDelegationTree({ "item-2": "target-active" }, { list: "bubble" }),
        eventPath: [
          { nodeLabel: "li#item-2", phase: "target", handlerFired: false, stopped: false },
        ],
        currentPhaseLabel: "Target Phase",
      },
      {
        descriptionHtml:
          '<span class="hl-task">Bubble phase</span>: the event bubbles to <code>ul#list</code> where our delegated handler fires. <code>e.target</code> is <code>li#item-2</code> (the clicked child). <code>e.target.tagName</code> is <code>"LI"</code>, so the if-check passes.',
        activeLine: 4,
        doneLines: [1, 3, 11],
        consoleOutput: [],
        domTree: makeDelegationTree({ list: "bubble-active" }, { list: "bubble" }),
        eventPath: [
          { nodeLabel: "li#item-2", phase: "target", handlerFired: false, stopped: false },
          { nodeLabel: "ul#list", phase: "bubble", handlerFired: true, stopped: false },
        ],
        currentPhaseLabel: "Bubble Phase",
      },
      {
        descriptionHtml:
          'The handler logs <code>"Clicked: Banana"</code> using <code>e.target.textContent</code>. It only reacts to <code>LI</code> clicks, ignoring clicks directly on the <code>ul</code> background.',
        activeLine: 5,
        doneLines: [1, 3, 4, 11],
        consoleOutput: ["Clicked: Banana"],
        domTree: makeDelegationTree({ list: "bubble-active" }, { list: "bubble" }),
        eventPath: [
          { nodeLabel: "li#item-2", phase: "target", handlerFired: false, stopped: false },
          { nodeLabel: "ul#list", phase: "bubble", handlerFired: true, stopped: false },
        ],
        currentPhaseLabel: "Bubble Phase",
      },
      {
        descriptionHtml:
          '<code>e.target.id</code> is <code>"item-2"</code> (the clicked element). <code>e.currentTarget.id</code> is <code>"list"</code> (where the handler lives). This distinction is the core of delegation.',
        activeLine: 7,
        doneLines: [1, 3, 4, 5, 6, 11],
        consoleOutput: ["Clicked: Banana", "target: item-2", "currentTarget: list"],
        domTree: makeDelegationTree({ list: "bubble-active" }, { list: "bubble" }),
        eventPath: [
          { nodeLabel: "li#item-2", phase: "target", handlerFired: false, stopped: false },
          { nodeLabel: "ul#list", phase: "bubble", handlerFired: true, stopped: false },
        ],
        currentPhaseLabel: "Bubble Phase",
      },
      {
        descriptionHtml:
          'One handler on <code>ul</code> serves all current and future <code>li</code> children. Adding new list items requires no additional event wiring. This reduces memory usage and simplifies dynamic lists.',
        activeLine: null,
        doneLines: [1, 3, 4, 5, 6, 7, 8, 9, 11],
        consoleOutput: ["Clicked: Banana", "target: item-2", "currentTarget: list"],
        domTree: makeDelegationTree({}, { list: "bubble" }),
        eventPath: [
          { nodeLabel: "li#item-2", phase: "target", handlerFired: false, stopped: false },
          { nodeLabel: "ul#list", phase: "bubble", handlerFired: true, stopped: false },
        ],
        currentPhaseLabel: null,
      },
    ],
  },
];
