import type { UseEffectExample } from "./types";

/* ── Example Data ── */

export const EXAMPLES: UseEffectExample[] = [
  /* ── 1. Mount & Unmount ── */
  {
    id: "mount-unmount",
    title: "Mount & Unmount",
    description:
      "useEffect with an empty dependency array runs once after mount. The cleanup function runs on unmount.",
    kind: "mount-unmount",
    codeLines: [
      { num: 1, text: "function Timer() {" },
      { num: 2, text: "  const [count, setCount] = useState(0);" },
      { num: 3, text: "" },
      { num: 4, text: "  useEffect(() => {" },
      { num: 5, text: '    console.log("effect: mounted");' },
      { num: 6, text: "    const id = setInterval(() => {" },
      { num: 7, text: "      setCount(c => c + 1);" },
      { num: 8, text: "    }, 1000);" },
      { num: 9, text: "" },
      { num: 10, text: "    return () => {" },
      { num: 11, text: '      console.log("cleanup: unmounting");' },
      { num: 12, text: "      clearInterval(id);" },
      { num: 13, text: "    };" },
      { num: 14, text: "  }, []);" },
      { num: 15, text: "" },
      { num: 16, text: "  return <div>Count: {count}</div>;" },
      { num: 17, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "React calls the <code>Timer</code> function for the first time. <code>useState</code> initializes <code>count</code> to 0.",
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        componentTree: {
          id: "timer",
          label: "<Timer>",
          highlight: "active",
          children: [{ id: "div", label: '<div> "Count: 0"' }],
        },
        activeNodeId: "timer",
        effects: [{ id: "e1", label: "useEffect([], ...)", phase: "idle", deps: "[]" }],
        currentPhase: "render",
      },
      {
        descriptionHtml:
          '<code>useEffect</code> is registered with an <strong>empty dependency array</strong> <code>[]</code>. React stores the effect but does not run it yet.',
        activeLine: 4,
        doneLines: [1, 2],
        consoleOutput: [],
        componentTree: {
          id: "timer",
          label: "<Timer>",
          children: [{ id: "div", label: '<div> "Count: 0"' }],
        },
        activeNodeId: "timer",
        effects: [{ id: "e1", label: "useEffect([], ...)", phase: "idle", deps: "[]" }],
        currentPhase: "render",
      },
      {
        descriptionHtml:
          'React commits the DOM update. The browser paints <code>"Count: 0"</code> to the screen. Effects run <strong>after</strong> paint, not during render.',
        activeLine: 16,
        doneLines: [1, 2, 4, 14],
        consoleOutput: [],
        componentTree: {
          id: "timer",
          label: "<Timer>",
          children: [{ id: "div", label: '<div> "Count: 0"' }],
        },
        activeNodeId: undefined,
        effects: [{ id: "e1", label: "useEffect([], ...)", phase: "idle", deps: "[]" }],
        currentPhase: "paint",
      },
      {
        descriptionHtml:
          'After paint, React runs the effect callback. It logs <code>"effect: mounted"</code> and starts a 1-second interval that increments count.',
        activeLine: 5,
        doneLines: [1, 2, 4, 14, 16],
        consoleOutput: ["effect: mounted"],
        componentTree: {
          id: "timer",
          label: "<Timer>",
          children: [{ id: "div", label: '<div> "Count: 0"' }],
        },
        activeNodeId: undefined,
        effects: [{ id: "e1", label: "useEffect([], ...)", phase: "effect-run", deps: "[]" }],
        currentPhase: "effect-run",
      },
      {
        descriptionHtml:
          'The interval fires. <code>setCount</code> triggers a re-render. React calls Timer again, count is now 1. The deps array is <code>[]</code>, so the effect is <strong>skipped</strong> (no cleanup, no re-run).',
        activeLine: 7,
        doneLines: [1, 2, 4, 5, 6, 8, 14, 16],
        consoleOutput: ["effect: mounted"],
        componentTree: {
          id: "timer",
          label: "<Timer>",
          highlight: "updated",
          children: [{ id: "div", label: '<div> "Count: 1"', highlight: "updated" }],
        },
        activeNodeId: "timer",
        effects: [{ id: "e1", label: "useEffect([], ...)", phase: "idle", deps: "[] (unchanged)" }],
        currentPhase: "render",
      },
      {
        descriptionHtml:
          'The component unmounts. React runs the cleanup function: logs <code>"cleanup: unmounting"</code> and clears the interval. No memory leak.',
        activeLine: 11,
        doneLines: [1, 2, 4, 5, 6, 7, 8, 10, 14, 16],
        consoleOutput: ["effect: mounted", "cleanup: unmounting"],
        componentTree: {
          id: "timer",
          label: "<Timer>",
          highlight: "removed",
          children: [{ id: "div", label: '<div> "Count: 1"', highlight: "removed" }],
        },
        activeNodeId: "timer",
        effects: [{ id: "e1", label: "useEffect([], ...)", phase: "cleanup-run", deps: "[]" }],
        currentPhase: "cleanup-run",
      },
      {
        descriptionHtml:
          'Empty deps <code>[]</code> means: run the effect once after mount, run cleanup once on unmount. This is the React equivalent of "component did mount" and "component will unmount".',
        activeLine: null,
        doneLines: [1, 2, 4, 5, 6, 7, 8, 10, 11, 12, 14, 16],
        consoleOutput: ["effect: mounted", "cleanup: unmounting"],
        componentTree: {
          id: "timer",
          label: "<Timer>",
          highlight: "removed",
          children: [],
        },
        activeNodeId: undefined,
        effects: [],
        currentPhase: "idle",
      },
    ],
  },

  /* ── 2. Dependency Array ── */
  {
    id: "deps",
    title: "Dependency Array",
    description:
      "The dependency array controls when the effect re-runs. React compares each value with Object.is.",
    kind: "deps",
    codeLines: [
      { num: 1, text: "function UserProfile({ userId }) {" },
      { num: 2, text: "  const [user, setUser] = useState(null);" },
      { num: 3, text: "" },
      { num: 4, text: "  useEffect(() => {" },
      { num: 5, text: '    console.log("fetching user", userId);' },
      { num: 6, text: "    fetchUser(userId).then(setUser);" },
      { num: 7, text: "  }, [userId]);" },
      { num: 8, text: "" },
      { num: 9, text: '  return <div>{user?.name ?? "Loading..."}</div>;' },
      { num: 10, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>UserProfile</code> renders with <code>userId="1"</code>. <code>useState</code> initializes <code>user</code> to <code>null</code>.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        componentTree: {
          id: "profile",
          label: "<UserProfile>",
          highlight: "active",
          props: [{ key: "userId", value: '"1"' }],
          children: [{ id: "div", label: '<div> "Loading..."' }],
        },
        activeNodeId: "profile",
        effects: [{ id: "e1", label: "useEffect([userId], ...)", phase: "idle", deps: '["1"]' }],
        currentPhase: "render",
      },
      {
        descriptionHtml:
          '<code>useEffect</code> is registered with <code>[userId]</code>. This is the first render, so the effect will run after paint.',
        activeLine: 4,
        doneLines: [1, 2],
        consoleOutput: [],
        componentTree: {
          id: "profile",
          label: "<UserProfile>",
          props: [{ key: "userId", value: '"1"' }],
          children: [{ id: "div", label: '<div> "Loading..."' }],
        },
        activeNodeId: "profile",
        effects: [{ id: "e1", label: "useEffect([userId], ...)", phase: "idle", deps: '["1"]' }],
        currentPhase: "render",
      },
      {
        descriptionHtml:
          'DOM committed. Browser paints <code>"Loading..."</code>. React then runs the effect.',
        activeLine: 9,
        doneLines: [1, 2, 4, 7],
        consoleOutput: [],
        componentTree: {
          id: "profile",
          label: "<UserProfile>",
          props: [{ key: "userId", value: '"1"' }],
          children: [{ id: "div", label: '<div> "Loading..."' }],
        },
        activeNodeId: undefined,
        effects: [{ id: "e1", label: "useEffect([userId], ...)", phase: "idle", deps: '["1"]' }],
        currentPhase: "paint",
      },
      {
        descriptionHtml:
          'Effect runs: logs <code>"fetching user 1"</code> and starts an async fetch for userId "1".',
        activeLine: 5,
        doneLines: [1, 2, 4, 7, 9],
        consoleOutput: ["fetching user 1"],
        componentTree: {
          id: "profile",
          label: "<UserProfile>",
          props: [{ key: "userId", value: '"1"' }],
          children: [{ id: "div", label: '<div> "Loading..."' }],
        },
        activeNodeId: undefined,
        effects: [{ id: "e1", label: "useEffect([userId], ...)", phase: "effect-run", deps: '["1"]' }],
        currentPhase: "effect-run",
      },
      {
        descriptionHtml:
          'Fetch resolves. <code>setUser</code> triggers a re-render. The component now shows the user name. React checks deps: <code>"1" === "1"</code> (same). Effect is <strong>skipped</strong>.',
        activeLine: 6,
        doneLines: [1, 2, 4, 5, 7, 9],
        consoleOutput: ["fetching user 1"],
        componentTree: {
          id: "profile",
          label: "<UserProfile>",
          highlight: "updated",
          props: [{ key: "userId", value: '"1"' }],
          children: [{ id: "div", label: '<div> "Alice"', highlight: "updated" }],
        },
        activeNodeId: "profile",
        effects: [{ id: "e1", label: "useEffect([userId], ...)", phase: "idle", deps: '["1"] (unchanged)' }],
        currentPhase: "render",
      },
      {
        descriptionHtml:
          'Props change: <code>userId</code> becomes <code>"2"</code>. React re-renders the component.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: ["fetching user 1"],
        componentTree: {
          id: "profile",
          label: "<UserProfile>",
          highlight: "active",
          props: [{ key: "userId", value: '"2"' }],
          children: [{ id: "div", label: '<div> "Loading..."' }],
        },
        activeNodeId: "profile",
        effects: [{ id: "e1", label: "useEffect([userId], ...)", phase: "idle", deps: '["2"]' }],
        currentPhase: "render",
      },
      {
        descriptionHtml:
          'Deps check: <code>"2" !== "1"</code>. The dependency changed, so React will run the effect again after paint.',
        activeLine: 5,
        doneLines: [1, 2, 4, 7, 9],
        consoleOutput: ["fetching user 1", "fetching user 2"],
        componentTree: {
          id: "profile",
          label: "<UserProfile>",
          props: [{ key: "userId", value: '"2"' }],
          children: [{ id: "div", label: '<div> "Loading..."' }],
        },
        activeNodeId: undefined,
        effects: [{ id: "e1", label: "useEffect([userId], ...)", phase: "effect-run", deps: '["2"] (changed)' }],
        currentPhase: "effect-run",
      },
      {
        descriptionHtml:
          'React compares each dependency value with <code>Object.is</code>. When any value changes, the previous cleanup runs (if any), then the new effect runs. Primitives compare by value; objects compare by reference.',
        activeLine: null,
        doneLines: [1, 2, 4, 5, 6, 7, 9],
        consoleOutput: ["fetching user 1", "fetching user 2"],
        componentTree: {
          id: "profile",
          label: "<UserProfile>",
          props: [{ key: "userId", value: '"2"' }],
          children: [{ id: "div", label: '<div> "Bob"' }],
        },
        activeNodeId: undefined,
        effects: [{ id: "e1", label: "useEffect([userId], ...)", phase: "idle", deps: '["2"]' }],
        currentPhase: "idle",
      },
    ],
  },

  /* ── 3. Cleanup Timing ── */
  {
    id: "cleanup",
    title: "Cleanup Timing",
    description:
      "Cleanup runs before the next effect invocation and on unmount. It closes over the previous render's values.",
    kind: "cleanup",
    codeLines: [
      { num: 1, text: "function ChatRoom({ roomId }) {" },
      { num: 2, text: "  useEffect(() => {" },
      { num: 3, text: '    console.log("connect to", roomId);' },
      { num: 4, text: "    const conn = createConnection(roomId);" },
      { num: 5, text: "" },
      { num: 6, text: "    return () => {" },
      { num: 7, text: '      console.log("disconnect from", roomId);' },
      { num: 8, text: "      conn.close();" },
      { num: 9, text: "    };" },
      { num: 10, text: "  }, [roomId]);" },
      { num: 11, text: "" },
      { num: 12, text: "  return <div>Room: {roomId}</div>;" },
      { num: 13, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          '<code>ChatRoom</code> renders with <code>roomId="general"</code>. The effect is registered with <code>[roomId]</code>.',
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        componentTree: {
          id: "chat",
          label: "<ChatRoom>",
          highlight: "active",
          props: [{ key: "roomId", value: '"general"' }],
          children: [{ id: "div", label: '<div> "Room: general"' }],
        },
        activeNodeId: "chat",
        effects: [{ id: "e1", label: "useEffect([roomId])", phase: "idle", deps: '["general"]' }],
        currentPhase: "render",
      },
      {
        descriptionHtml:
          'DOM committed, browser paints. Effect runs: logs <code>"connect to general"</code> and opens a connection.',
        activeLine: 3,
        doneLines: [1, 2, 10, 12],
        consoleOutput: ["connect to general"],
        componentTree: {
          id: "chat",
          label: "<ChatRoom>",
          props: [{ key: "roomId", value: '"general"' }],
          children: [{ id: "div", label: '<div> "Room: general"' }],
        },
        activeNodeId: undefined,
        effects: [{ id: "e1", label: "useEffect([roomId])", phase: "effect-run", deps: '["general"]' }],
        currentPhase: "effect-run",
      },
      {
        descriptionHtml:
          'Props change: <code>roomId</code> becomes <code>"random"</code>. React re-renders the component.',
        activeLine: 1,
        doneLines: [],
        consoleOutput: ["connect to general"],
        componentTree: {
          id: "chat",
          label: "<ChatRoom>",
          highlight: "active",
          props: [{ key: "roomId", value: '"random"' }],
          children: [{ id: "div", label: '<div> "Room: random"' }],
        },
        activeNodeId: "chat",
        effects: [{ id: "e1", label: "useEffect([roomId])", phase: "idle", deps: '["random"]' }],
        currentPhase: "render",
      },
      {
        descriptionHtml:
          'DOM committed with new text. Browser paints <code>"Room: random"</code>.',
        activeLine: 12,
        doneLines: [1, 2, 10],
        consoleOutput: ["connect to general"],
        componentTree: {
          id: "chat",
          label: "<ChatRoom>",
          props: [{ key: "roomId", value: '"random"' }],
          children: [{ id: "div", label: '<div> "Room: random"', highlight: "updated" }],
        },
        activeNodeId: undefined,
        effects: [{ id: "e1", label: "useEffect([roomId])", phase: "idle", deps: '["random"]', cleanupPending: true }],
        currentPhase: "paint",
      },
      {
        descriptionHtml:
          'Cleanup from the <strong>previous</strong> effect runs first: logs <code>"disconnect from general"</code> and closes the old connection. The cleanup function captured <code>roomId = "general"</code> from the previous render.',
        activeLine: 7,
        doneLines: [1, 2, 6, 10, 12],
        consoleOutput: ["connect to general", "disconnect from general"],
        componentTree: {
          id: "chat",
          label: "<ChatRoom>",
          props: [{ key: "roomId", value: '"random"' }],
          children: [{ id: "div", label: '<div> "Room: random"' }],
        },
        activeNodeId: undefined,
        effects: [{ id: "e1", label: "useEffect([roomId])", phase: "cleanup-run", deps: '["general"] (prev)' }],
        currentPhase: "cleanup-run",
      },
      {
        descriptionHtml:
          'Then the new effect runs: logs <code>"connect to random"</code> and opens a fresh connection to the new room.',
        activeLine: 3,
        doneLines: [1, 2, 6, 7, 8, 10, 12],
        consoleOutput: ["connect to general", "disconnect from general", "connect to random"],
        componentTree: {
          id: "chat",
          label: "<ChatRoom>",
          props: [{ key: "roomId", value: '"random"' }],
          children: [{ id: "div", label: '<div> "Room: random"' }],
        },
        activeNodeId: undefined,
        effects: [{ id: "e1", label: "useEffect([roomId])", phase: "effect-run", deps: '["random"]' }],
        currentPhase: "effect-run",
      },
      {
        descriptionHtml:
          'On unmount, cleanup runs one last time: <code>"disconnect from random"</code>. Cleanup always runs before the next effect and on unmount. Each cleanup closes over the values from the render it was created in.',
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 6, 8, 10, 12],
        consoleOutput: ["connect to general", "disconnect from general", "connect to random", "disconnect from random"],
        componentTree: {
          id: "chat",
          label: "<ChatRoom>",
          highlight: "removed",
          props: [{ key: "roomId", value: '"random"' }],
          children: [],
        },
        activeNodeId: "chat",
        effects: [{ id: "e1", label: "useEffect([roomId])", phase: "cleanup-run", deps: '["random"]' }],
        currentPhase: "cleanup-run",
      },
    ],
  },

  /* ── 4. Common Patterns ── */
  {
    id: "patterns",
    title: "Common Patterns",
    description:
      "Event listeners, subscriptions, and resize handlers follow the same subscribe-in-effect, unsubscribe-in-cleanup pattern.",
    kind: "patterns",
    codeLines: [
      { num: 1, text: "function WindowSize() {" },
      { num: 2, text: "  const [width, setWidth] = useState(" },
      { num: 3, text: "    window.innerWidth" },
      { num: 4, text: "  );" },
      { num: 5, text: "" },
      { num: 6, text: "  useEffect(() => {" },
      { num: 7, text: "    const handleResize = () =>" },
      { num: 8, text: "      setWidth(window.innerWidth);" },
      { num: 9, text: '    window.addEventListener("resize", handleResize);' },
      { num: 10, text: "" },
      { num: 11, text: "    return () => {" },
      { num: 12, text: '      window.removeEventListener("resize", handleResize);' },
      { num: 13, text: "    };" },
      { num: 14, text: "  }, []);" },
      { num: 15, text: "" },
      { num: 16, text: "  return <div>Width: {width}px</div>;" },
      { num: 17, text: "}" },
    ],
    steps: [
      {
        descriptionHtml:
          "<code>WindowSize</code> renders. <code>useState</code> initializes width to the current <code>window.innerWidth</code>.",
        activeLine: 2,
        doneLines: [1],
        consoleOutput: [],
        componentTree: {
          id: "ws",
          label: "<WindowSize>",
          highlight: "active",
          children: [{ id: "div", label: '<div> "Width: 1280px"' }],
        },
        activeNodeId: "ws",
        effects: [{ id: "e1", label: "useEffect([], ...)", phase: "idle", deps: "[]" }],
        currentPhase: "render",
      },
      {
        descriptionHtml:
          "DOM committed, browser paints. React runs the effect: creates a resize handler and attaches it to the window.",
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 6, 14, 16],
        consoleOutput: [],
        componentTree: {
          id: "ws",
          label: "<WindowSize>",
          children: [{ id: "div", label: '<div> "Width: 1280px"' }],
        },
        activeNodeId: undefined,
        effects: [{ id: "e1", label: "useEffect([], ...)", phase: "effect-run", deps: "[]" }],
        currentPhase: "effect-run",
      },
      {
        descriptionHtml:
          "The user resizes the window. The event fires, <code>setWidth</code> updates state, and React re-renders. The effect is <strong>not</strong> re-run because deps are <code>[]</code>.",
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 6, 7, 9, 14, 16],
        consoleOutput: [],
        componentTree: {
          id: "ws",
          label: "<WindowSize>",
          highlight: "updated",
          children: [{ id: "div", label: '<div> "Width: 960px"', highlight: "updated" }],
        },
        activeNodeId: "ws",
        effects: [{ id: "e1", label: "useEffect([], ...)", phase: "idle", deps: "[] (unchanged)" }],
        currentPhase: "render",
      },
      {
        descriptionHtml:
          'The component unmounts. Cleanup runs: <code>removeEventListener</code> detaches the handler. No dangling listeners remain.',
        activeLine: 12,
        doneLines: [1, 2, 3, 4, 6, 7, 8, 9, 11, 14, 16],
        consoleOutput: [],
        componentTree: {
          id: "ws",
          label: "<WindowSize>",
          highlight: "removed",
          children: [],
        },
        activeNodeId: "ws",
        effects: [{ id: "e1", label: "useEffect([], ...)", phase: "cleanup-run", deps: "[]" }],
        currentPhase: "cleanup-run",
      },
      {
        descriptionHtml:
          "This is the classic subscribe/unsubscribe pattern. Subscribe in the effect, unsubscribe in cleanup. Works the same for WebSocket connections, IntersectionObserver, MutationObserver, and any external subscription.",
        activeLine: null,
        doneLines: [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 14, 16],
        consoleOutput: [],
        componentTree: {
          id: "ws",
          label: "<WindowSize>",
          highlight: "removed",
          children: [],
        },
        activeNodeId: undefined,
        effects: [],
        currentPhase: "idle",
      },
    ],
  },
];
