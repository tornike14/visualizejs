# Component Reference

Design system, reusable visualization components, shared hooks, and animation system. For topic wiring workflow, see [topic-authoring.md](topic-authoring.md). For React-specific components, see [react-topic-authoring.md](react-topic-authoring.md).

---

## Table of Contents

1. [Design System Reference](#design-system-reference)
2. [Reusable Components](#reusable-components)
3. [Playback Engine - useStepPlayback](#playback-engine--usestepplayback)
4. [Change Flash - useChangeFlash](#change-flash--usechangeflash)
5. [Syntax Highlighting - Tokenizer](#syntax-highlighting--tokenizer)
6. [Animation System](#animation-system)
7. [Shared CSS Classes](#shared-css-classes)

---

## Design System Reference

### Color Palette (CSS Variables)

| Variable | Value | Usage |
|---|---|---|
| `--app-bg` | `#090f1f` | Page background |
| `--app-surface` | `#0f1a30` | Card backgrounds |
| `--app-surface-strong` | `#0d1528` | Sidebar, stronger surfaces |
| `--app-border` | `rgba(71, 85, 105, 0.65)` | Borders |
| `--app-text-primary` | `#e2e8f0` | Primary text |
| `--app-text-secondary` | `#94a3b8` | Secondary/muted text |
| `--app-accent` | `#f472b6` | Pink accent |

### Surface Classes

| Class | Use |
|---|---|
| `.app-surface` | Main cards - gradient bg, border, shadow, blur |
| `.app-surface-subtle` | Lighter containers - controls row and explanation pill |
| `.app-surface-flat` | Minimal surface - inline code backgrounds |

### Difficulty Badge Colors

Defined in `src/lib/constants.ts`:

```typescript
export const DIFFICULTY_COLORS = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};
```

---

## Reusable Components

### NeonPanel

Themed container with a glowing dot header.

```typescript
import { NeonPanel } from "@/components/visualization-ui/NeonPanel";

<NeonPanel title="Call Stack" tone="amber" bodyClassName="min-h-[10rem]">
  {/* panel content */}
</NeonPanel>
```

**Tones:** `"amber"` | `"cyan"` | `"green"` | `"violet"` | `"pink"` | `"slate"`

Each tone sets the header background tint and the dot glow color.

### CodeBlock / CodeLine

Multi-line and single-line syntax-highlighted code display.

```typescript
import { CodeBlock, type CodeBlockLine } from "@/components/visualization-ui/CodeBlock";

<CodeBlock
  lines={myLines.map((line): CodeBlockLine => ({
    key: line.num,
    lineNumber: line.num,
    text: line.text,
    className: cn(
      isActive && "is-active",
      isDone && !isActive && "is-done",
    ),
    leftSlot: someIcon, // optional icon before the code
  }))}
/>
```

**Important:** Always use `isDone && !isActive` - never apply both `is-active` and `is-done` to the same line. The `is-done` class sets `opacity: 0.4` which would visually override the active highlight. When the event loop or callbacks re-execute a line that was previously done, it must appear active (highlighted), not faded.

`CodeLine` can be used individually for finer control:

```typescript
import { CodeLine } from "@/components/visualization-ui/CodeLine";

<CodeLine
  lineNumber={1}
  text="const x = 42;"
  className="is-active"
  leftSlot={<ArrowUp className="h-3.5 w-3.5 text-emerald-300" />}
/>
```

### ConsoleOutput

Shared console panel. Renders inside a slate NeonPanel. Auto-detects error lines (ReferenceError, TypeError, SyntaxError) and colors them red.

```typescript
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";

<ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
```

### TransportControls

Playback buttons: Reset, Step Back, Play/Pause, Step Forward, Speed dropdown. Step position is rendered inside this component (left of Reset) when `stepIndex` and `totalSteps` are provided.

```typescript
import { TransportControls } from "@/components/visualization-ui/TransportControls";

<TransportControls
  isPlaying={isPlaying}
  canStep={canStep}
  canStepBack={canStepBack}
  stepIndex={currentStepIndex}
  totalSteps={STEPS.length}
  speedLevel={speedLevel}
  speedLabel={speedLabel}
  onTogglePlay={togglePlay}
  onStep={handleStep}
  onStepBack={handleStepBack}
  onReset={handleReset}
  onSpeedLevelChange={setSpeedLevel}
/>
```

`stepIndex` and `totalSteps` are UI-only props for the inline step pill. The remaining control props come directly from `useStepPlayback`.

### ExampleSelector

Shared dropdown for switching between sub-examples within a visualization. If your topic has multiple examples (like Hoisting, Promises, PrototypalInheritance, ScopeChain, or ThisKeyword), use this component instead of building a custom dropdown.

```typescript
import { ExampleSelector, type ExampleOption } from "@/components/visualization-ui/ExampleSelector";

// Your examples must extend ExampleOption (id, title, description)
interface MyExample extends ExampleOption {
  kind: "basic" | "advanced";
  codeLines: SourceLine[];
  steps: MyStep[];
}

const EXAMPLES: MyExample[] = [
  { id: "basic", title: "Basic", kind: "basic", description: "...", codeLines: [...], steps: [...] },
  { id: "advanced", title: "Advanced", kind: "advanced", description: "...", codeLines: [...], steps: [...] },
];

// In your component:
const [activeExampleId, setActiveExampleId] = useState(EXAMPLES[0].id);

<ExampleSelector
  examples={EXAMPLES}
  activeId={activeExampleId}
  onSelect={handleExampleChange}
  renderBadge={(ex) => (
    <Badge variant="outline" className={cn("text-[10px]", badgeClass(ex.kind))}>
      {ex.kind}
    </Badge>
  )}
/>
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `examples` | `T[]` | Array of example objects (must extend `ExampleOption`) |
| `activeId` | `string` | Currently selected example ID |
| `onSelect` | `(id: string) => void` | Called when the user picks a different example |
| `renderBadge` | `(example: T) => ReactNode` | Optional render prop for a badge next to each title in the dropdown |

**Integration with playback:** When switching examples, reset playback using `useStepPlayback`'s `resetKey` option:

```typescript
const example = EXAMPLES.find((e) => e.id === activeExampleId) ?? EXAMPLES[0];

const { currentStepIndex, ... } = useStepPlayback({
  totalSteps: example.steps.length,
  initialStep: -1,
  resetKey: activeExampleId, // resets playback when the example changes
});
```

The selector renders in the toolbar area (inside `<ToolbarPortal>`), typically left-aligned with badges while transport controls stay on the right. It uses the shared `useClickOutside` hook internally for outside-click and Escape key dismissal.

### Tooltip

Custom hover tooltip with 400ms delay. Used internally by TransportControls, available for any button/icon.

```typescript
import { Tooltip } from "@/components/visualization-ui/Tooltip";

<Tooltip label="Reset">
  <button>...</button>
</Tooltip>
```

Supports `side="top"` (default) or `side="bottom"`.
Tooltips auto-disable on touch / coarse-pointer devices.

### TopicLink

Cross-topic navigation link. Use at the end of a visualization to guide users to related topics.

```typescript
import { TopicLink } from "@/components/visualization-ui/TopicLink";

<TopicLink
  href="/javascript/heap-stack"
  label="See how Heap & Stack memory works"
/>
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `href` | `string` | Route to the related topic |
| `label` | `string` | Descriptive link text |
| `className` | `string?` | Optional extra classes |

Renders as a pink pill with an arrow icon. Show it conditionally on the last step of a relevant example:

```tsx
{currentStepIndex === example.steps.length - 1 && (
  <div className="flex justify-center pt-1">
    <TopicLink href="/javascript/closures" label="Learn how Closures work" />
  </div>
)}
```

---

## Playback Engine - useStepPlayback

**File:** `src/hooks/useStepPlayback.ts`

Central playback engine used by all visualizations. Manages step index, auto-play timer, speed levels.

```typescript
import { useStepPlayback } from "@/hooks/useStepPlayback";

const {
  currentStepIndex,  // -1 (not started) or 0..N
  isPlaying,         // auto-advance active
  speedLevel,        // 1-6
  speedLabel,        // "0.25x" .. "2x"
  canStep,           // can advance forward
  canStepBack,       // can go backward
  togglePlay,        // play/pause
  step,              // advance one step
  stepBack,          // go back one step
  reset,             // return to initial state
  setSpeedLevel,     // change speed
  jumpTo,            // jump to specific step index
} = useStepPlayback({
  totalSteps: STEPS.length,
  initialStep: -1,       // -1 = "not started", 0 = "first step visible"
  resetKey: someValue,   // optional: reset when this changes
});
```

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `totalSteps` | `number` | required | Total number of steps |
| `initialStep` | `number` | `-1` | Starting index. Use `-1` for "press play to start", `0` for "first step shown immediately" |
| `resetKey` | `string \| number` | `undefined` | When this changes, playback resets. Use for switching between sub-examples (like Hoisting's example selector) |

Default speed level is `4` (`1x`).

**Speed levels:**

| Level | Label | Delay |
|---|---|---|
| 1 | 0.25x | 5000ms |
| 2 | 0.5x | 2500ms |
| 3 | 0.75x | 1800ms |
| 4 | 1x | 1200ms |
| 5 | 1.5x | 700ms |
| 6 | 2x | 400ms |

---

## Change Flash - useChangeFlash

**File:** `src/hooks/useChangeFlash.ts`

Some step transitions only change the description text (or only one panel's data), leaving the rest of the visualization identical. Without visual feedback, users may think the step didn't advance. The change flash system solves this by briefly highlighting whichever sections actually changed.

### How it works

`useChangeFlash` compares serialized "channels" of data between step transitions. Each channel maps to a named data slice (description, code, heap, etc.). When a channel's value changes, its flash flag becomes `true` for 850ms, then resets. Components conditionally apply CSS flash classes based on these flags.

```typescript
import { useChangeFlash } from "@/hooks/useChangeFlash";

const flashes = useChangeFlash(
  {
    description: currentStep?.descriptionHtml,
    roots: currentStep?.roots,
    heap: currentStep?.heapObjects,
    console: currentStep?.consoleOutput,
  },
  currentStepIndex,
);
// flashes.description === true for 850ms when descriptionHtml changes
// flashes.heap === true for 850ms when heapObjects changes
// etc.
```

**Parameters:**

| Param | Type | Description |
|---|---|---|
| `channels` | `Record<K, unknown>` | Named data slices from the current step. Values are compared via `JSON.stringify` |
| `stepIndex` | `number` | Current step index from `useStepPlayback`. Used as the effect trigger |

**Returns:** `Record<K, boolean>` - same keys as `channels`, each `true` if that channel changed on the most recent step transition.

**Behavior:**

- The first real step (-1 to 0) does **not** flash - everything is new, there's no meaningful "previous state"
- Reset (step goes back to -1) clears all flash state
- A single timer clears all active flashes after 850ms
- Rapid stepping cancels the previous timer and restarts

### CSS Classes

Two animation classes are available in `globals.css`:

| Class | Effect | Apply to |
|---|---|---|
| `.viz-change-flash` | Outer pink glow pulse (`box-shadow`) | NeonPanels - via `className` prop |
| `.viz-change-flash-pill` | Inset pink glow pulse (`box-shadow`) | Explanation pill wrapper - via `cn()` |

Both animations run for 850ms with peak at 40%. They honor `prefers-reduced-motion`.

### Applying to NeonPanels

Pass the flash class via the `className` prop. Do **not** use a flash-based `key` prop - that remounts the panel and replays child entrance animations (`viz-slide-in`).

```tsx
<NeonPanel
  title="Heap"
  tone="violet"
  className={flashes.heap ? "viz-change-flash" : undefined}
>
  <GCHeapPanel objects={...} />
</NeonPanel>
```

### Applying to the explanation pill

Use `cn()` to conditionally add the pill flash class:

```tsx
<div
  className={cn(
    "app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5",
    flashes.description && "viz-change-flash-pill",
  )}
>
```

### Applying to ConsoleOutput

`ConsoleOutput` passes its `className` prop to the panel body, not the outer NeonPanel. Wrap it in a div for the outer glow:

```tsx
<div className={flashes.console ? "viz-change-flash rounded-3xl" : undefined}>
  <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
</div>
```

### Child entrance animations

When a NeonPanel's data changes between steps, its children (heap objects, root cards, etc.) should replay their `viz-slide-in` entrance animation - but **only when a specific item's data actually changed**. Use a data fingerprint in the key instead of the step index:

```tsx
/** Stable fingerprint - changes only when the item's data changes. */
function itemFingerprint(item: Item): string {
  return `${item.label}|${item.tone}|${item.status}|${item.props.map((p) => `${p.key}:${p.value}`).join(",")}`;
}

function HeapItems({ items }: { items: Item[] }) {
  return items.map((item) => (
    <div key={`${item.id}-${itemFingerprint(item)}`} className="viz-slide-in ...">
      {item.label}
    </div>
  ));
}
```

**Why fingerprints instead of `stepKey`?** Using `stepKey={currentStepIndex}` in child keys causes **every** child to remount on **every** step - replaying entrance animations even when that item's data hasn't changed. With a data fingerprint, the key only changes when the item's actual data changes, so:

- Items with unchanged data keep their DOM nodes (no animation replay)
- Items whose data changed get a new key -> remount -> `viz-slide-in` replays
- New items appearing get a fresh key -> animate in
- Removed items unmount cleanly

The fingerprint should include all properties that visually affect the item (label, tone, status, props, etc.).

### Choosing channels

Each channel key should map to the data that drives a specific panel. Common channels:

| Channel | Data | Panel |
|---|---|---|
| `description` | `descriptionHtml` | Explanation pill |
| `stack` | `stackFrames` / `stack` | Call Stack NeonPanel |
| `heap` | `heapObjects` / `heapAllocations` | Heap NeonPanel |
| `console` | `consoleOutput` | Console Output |

Add topic-specific channels as needed (e.g., `roots`, `scope`, `taskQueue`).

**Note:** The Source Code panel does **not** need a flash channel. The active line highlight (yellow border) and done-line fading already provide a strong visual signal when the code pointer moves. Adding a flash glow would be redundant.

---

## Syntax Highlighting - Tokenizer

**File:** `src/lib/visualization/syntax.ts`

Lightweight regex tokenizer for educational JavaScript snippets. Not a general parser - designed for small (5-15 line) hardcoded examples.

### Token Types

| Type | CSS Class | Color | Examples |
|---|---|---|---|
| `keyword` | `.tok-kw` | `#c084fc` (purple) | `let`, `const`, `function`, `return`, `if`, `async`, `await` |
| `builtin` | `.tok-builtin` | `#e5c07b` (warm yellow) | `console`, `Promise`, `Array`, `Math`, `JSON`, `Error` |
| `function` | `.tok-fn` | `#60a5fa` (blue) | `log`, `setTimeout`, `resolve`, `then`, `push`, `map` |
| `string` | `.tok-str` | `#34d399` (green) | `'hello'`, `"world"`, `` `template` `` |
| `number` | `.tok-num` | `#fbbf24` (amber) | `42`, `3.14` |
| `comment` | `.tok-comment` | `#64748b` (slate) | `// comment` |
| `punctuation` | `.tok-punct` | `#94a3b8` (light slate) | `{`, `}`, `(`, `)`, `;` |
| `plain` | (none) | inherits | identifiers, whitespace |

### Distinction: builtins vs functions

Global objects/constructors (`console`, `Promise`, `Array`) render as **builtin** (warm yellow). Methods (`log`, `resolve`, `then`, `push`) render as **function** (blue). This gives visual differentiation in chains like `console.log()` or `Promise.resolve().then()`.

### Usage

Tokenization is handled automatically by `CodeLine` and `CodeBlock`. You only provide plain text - the components call `tokenize()` internally. You do not need to import the tokenizer directly unless building a custom renderer.

---

## Animation System

All animations are CSS-only (no Framer Motion). Shared keyframes live in `src/app/globals.css`.

### Shared Animation Classes

| Class | Effect | Use Case |
|---|---|---|
| `.viz-slide-in` | Slide in from left with spring | Queue items entering |
| `.viz-float-up` | Float up with fade-in | Hoisted declarations moving to top |
| `.viz-pulse-dot` | Pulse opacity (0.55 to 1) | Playing indicator dot |
| `.viz-change-flash` | Outer pink glow pulse (850ms) | NeonPanels whose data changed between steps |
| `.viz-change-flash-pill` | Inset pink glow pulse (850ms) | Explanation pill when description changed |

### Using `.viz-slide-in`

Apply to items that appear in queues/lists:

```tsx
<div className="viz-slide-in rounded-lg border px-3 py-2">
  {item}
</div>
```

### Using `.viz-float-up`

Apply to elements that represent hoisting (moving declarations upward):

```tsx
<CodeLineComponent
  className="viz-float-up is-floating"
  leftSlot={<ArrowUp className="viz-float-up h-3.5 w-3.5 text-emerald-300" />}
/>
```

### Using `.viz-pulse-dot`

Shows a pulsing green dot when playback is active:

```tsx
{isPlaying ? <span className="viz-pulse-dot" /> : null}
```

### Topic-Specific Animations

If your topic needs animations not covered by the shared set, add them in an inline `<style>` tag inside your component (inside the `<section>`, not in the toolbar portal). Example from EventLoop (orbit ring):

```tsx
<style>{`
  .my-custom-anim {
    animation: my-keyframe 1s linear infinite;
  }
  @keyframes my-keyframe {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`}</style>
```

Keep topic-specific CSS minimal. If an animation pattern is reused across 2+ topics, move it to `globals.css`.

---

## Shared CSS Classes

### Code Line States

Applied via `className` on `CodeBlock` / `CodeLine` items:

| Class | Effect | When to Use |
|---|---|---|
| `.is-active` | Yellow left border + amber background | Current execution line |
| `.is-done` | 40% opacity | Lines already executed (never combine with `is-active`) |
| `.is-highlighted` | Soft amber background + faint left border | Lines being referenced but not executing |
| `.is-floating` | Green background + green left border | Lines being hoisted upward |
| `.is-tdz` | Red background + red left border | Lines in Temporal Dead Zone |

These classes are defined in `globals.css` under `@layer components` and apply to `.code-line` elements.

**Critical rule:** When mapping lines, always guard `is-done` with `!isActive`:

```typescript
className: cn(
  isActive && "is-active",
  isDone && !isActive && "is-done",
)
```

### Code Line Structure

```css
.code-line       /* flex row container */
.code-line-num   /* gutter: line number */
.code-line-icon  /* fixed-width slot for icons */
.code-line-content  /* the code text (white-space: pre) */
```
