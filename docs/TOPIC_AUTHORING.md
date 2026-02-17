# Topic Authoring Guide

How to wire a new visualization topic into VisualizeJS. This document covers the architecture, design system, reusable components, step data modeling, animations, and the full end-to-end wiring process.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Step 1 — Register the Topic](#step-1--register-the-topic)
4. [Step 2 — Create the Route Page](#step-2--create-the-route-page)
5. [Step 3 — Build the Visualization Component](#step-3--build-the-visualization-component)
6. [Toolbar Portal Pattern](#toolbar-portal-pattern)
7. [Design System Reference](#design-system-reference)
8. [Reusable Components](#reusable-components)
9. [Playback Engine — useStepPlayback](#playback-engine--usestepplayback)
10. [Change Flash — useChangeFlash](#change-flash--usechangeflash)
11. [Syntax Highlighting — Tokenizer](#syntax-highlighting--tokenizer)
12. [Animation System](#animation-system)
13. [Step Data Modeling](#step-data-modeling)
14. [Shared CSS Classes](#shared-css-classes)
15. [UI Copy Constants](#ui-copy-constants)
16. [Checklist](#checklist)

---

## Architecture Overview

```
AppTheme  (dark background, gradient overlays, noise texture)
  Sidebar  (collapsible topic navigation)
  main
    VisualizationPageShell  (ToolbarProvider + back link, title + docs link)
      divider
      ToolbarSlot  <-- controls + explanation pill render here via portal
      surface-card
        ErrorBoundary
          <YourVisualization />  (dynamically imported, "use client")
            ToolbarPortal  <-- hoists toolbar content to the slot above
```

Every visualization is a self-contained `"use client"` component that receives no props. It owns its step data, layout, and rendering. The shell provides the page chrome (heading, back link, external docs link, card surface).

The page title is followed by a small external-link icon that opens the topic's authoritative documentation (e.g., MDN). A thin divider line separates the header from the content below.

Transport controls and the step explanation pill are rendered *outside* the surface card via the `ToolbarPortal` pattern. This frees vertical space inside the card for the actual visualization panels.

Data flow: **hardcoded STEPS array** -> **useStepPlayback hook** -> **currentStepIndex** -> **conditional rendering**.

---

## Directory Structure

```
src/
  app/
    javascript/
      your-topic/page.tsx          # Route page (Step 2)
    react/
      your-topic/page.tsx
  components/
    visualizations/
      YourTopic.tsx                 # Visualization component (Step 3)
    visualization-ui/
      CodeBlock.tsx                 # Multi-line syntax-highlighted code
      CodeLine.tsx                  # Single line with gutter + tokens
      ConsoleOutput.tsx             # Shared console panel
      ExampleSelector.tsx           # Dropdown for switching sub-examples
      NeonPanel.tsx                 # Themed container with tones
      TopicLink.tsx                 # Cross-topic navigation link
      TransportControls.tsx         # Playback buttons + speed dropdown
      Tooltip.tsx                   # Lightweight hover tooltip
    layout/
      VisualizationPageShell.tsx    # Page wrapper with ToolbarSlot
      ToolbarPortal.tsx             # Provider, Slot, and Portal components
      Sidebar.tsx                   # Navigation sidebar
      AppTheme.tsx                  # Global theme wrapper
  hooks/
    useStepPlayback.ts              # Shared playback engine
    useChangeFlash.ts               # Detects per-channel data changes between steps
    useClickOutside.ts              # Outside-click + Escape dismiss hook
  lib/
    topics.ts                       # Topic registry
    constants.ts                    # Site-wide constants
    metadata.ts                     # SEO metadata factory
    visualization/
      syntax.ts                     # JS tokenizer + token-to-class map
      uiCopy.ts                     # Shared UI strings
  types/
    index.ts                        # Topic, Category, Difficulty types
```

---

## Step 1 — Register the Topic

**File:** `src/lib/topics.ts`

Add an entry to the `topics` array:

```typescript
{
  id: "closures",
  title: "Closures",
  category: "javascript",
  route: "/javascript/closures",
  description: "See how closures capture variables from their lexical scope.",
  difficulty: "intermediate",
  docsUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
}
```

**Fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | URL slug, used by `getTopicOrThrow()` |
| `title` | `string` | Shown in sidebar + page heading |
| `category` | `"javascript" \| "react"` | Determines sidebar group |
| `route` | `string` | Must match `src/app/<category>/<id>/page.tsx` |
| `description` | `string` | Used for SEO metadata and category landing page cards (not shown on visualization page) |
| `difficulty` | `"beginner" \| "intermediate" \| "advanced"` | Badge color in sidebar |
| `docsUrl` | `string` | External URL to authoritative documentation (MDN, React docs, etc.). Shown as a link icon next to the page title |

**Types** are defined in `src/types/index.ts`:

```typescript
export type Category = "javascript" | "react";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export interface Topic {
  id: string;
  title: string;
  category: Category;
  route: string;
  description: string;
  difficulty: Difficulty;
  docsUrl: string;
}
```

---

## Step 2 — Create the Route Page

**File:** `src/app/javascript/closures/page.tsx`

Every topic page follows the same template:

```typescript
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("closures");

const ClosuresVisualization = dynamic(
  () =>
    import("@/components/visualizations/Closures").then(
      (module) => module.Closures
    ),
  { loading: () => <VisualizationLoading /> }
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function ClosuresPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ErrorBoundary>
        <ClosuresVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
```

Key points:
- `dynamic()` with named export ensures the client component is code-split.
- `VisualizationLoading` shows a spinner during chunk load.
- `createTopicMetadata()` generates Open Graph and Twitter SEO tags automatically.
- `ErrorBoundary` catches rendering errors gracefully.
- No changes needed here for the toolbar — the shell already includes `ToolbarProvider` + `ToolbarSlot`.

---

## Step 3 — Build the Visualization Component

**File:** `src/components/visualizations/Closures.tsx`

### Skeleton

```typescript
"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { CodeBlock, type CodeBlockLine } from "@/components/visualization-ui/CodeBlock";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { ExampleSelector } from "@/components/visualization-ui/ExampleSelector"; // if multi-example
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";
import { cn } from "@/lib/utils";
import {
  VISUALIZATION_PANEL_TITLES,
  VISUALIZATION_EMPTY_STATES,
} from "@/lib/visualization/uiCopy";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { useChangeFlash } from "@/hooks/useChangeFlash";

// 1. Define your source code lines
interface SourceLine {
  num: number;
  text: string;
}

const CODE_LINES: SourceLine[] = [
  { num: 1, text: "function outer() {" },
  { num: 2, text: "  let count = 0;" },
  // ...
];

// 2. Define the step interface
interface ClosureStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  // ... topic-specific fields
}

// 3. Hardcode the STEPS array
const STEPS: ClosureStep[] = [
  {
    descriptionHtml: `Step 1 explanation with <code>inline code</code> and <span class="hl-stack">colored terms</span>.`,
    activeLine: 1,
    doneLines: [],
    consoleOutput: [],
  },
  // ... one object per step
];

// 4. Export the named component
export function Closures() {
  const {
    currentStepIndex,
    isPlaying,
    speedLevel,
    speedLabel,
    canStep,
    canStepBack,
    togglePlay,
    step: handleStep,
    stepBack: handleStepBack,
    reset: handleReset,
    setSpeedLevel,
  } = useStepPlayback({ totalSteps: STEPS.length, initialStep: -1 });

  const currentStep = currentStepIndex >= 0 ? STEPS[currentStepIndex] : null;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      console: currentStep?.consoleOutput,
      // ... add topic-specific channels (heap, roots, scope, etc.)
    },
    currentStepIndex,
  );

  return (
    <>
      {/* Toolbar: portaled above the surface card */}
      <ToolbarPortal>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
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
          </div>

          <div
            className={cn(
              "app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-2.5",
              flashes.description && "viz-change-flash-pill",
            )}
          >
            {currentStep ? (
              <p
                className="viz-step-desc text-center text-sm text-slate-300"
                dangerouslySetInnerHTML={{ __html: currentStep.descriptionHtml }}
              />
            ) : (
              <p className="text-center text-sm text-slate-500">
                {VISUALIZATION_EMPTY_STATES.stepDescription}
              </p>
            )}
          </div>
        </div>
      </ToolbarPortal>

      {/* Main visualization (inside the surface card) */}
      <section className="relative flex flex-col gap-4 px-1 py-2 text-slate-100 sm:px-2 sm:py-3 lg:px-3 lg:py-4">
        <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]">
          <NeonPanel
            title={VISUALIZATION_PANEL_TITLES.sourceCode}
            tone="amber"
            bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
          >
            <CodeBlock
              lines={CODE_LINES.map((line): CodeBlockLine => {
                const isActive = currentStep?.activeLine === line.num;
                const isDone = currentStep?.doneLines.includes(line.num) ?? false;
                return {
                  key: line.num,
                  lineNumber: line.num,
                  text: line.text,
                  className: cn(
                    isActive && "is-active",
                    isDone && !isActive && "is-done",
                  ),
                };
              })}
            />
          </NeonPanel>

          <div className="space-y-4">
            {/* Topic-specific panels go here */}
            <div className={flashes.console ? "viz-change-flash rounded-3xl" : undefined}>
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
```

### Layout Pattern

Each visualization returns a **fragment** with two parts:

```
<>
  <ToolbarPortal>          (portaled above the surface card)
    controls-row           (transport controls, optional selector/badges)
    explanation-pill        (centered, rounded-full, max-w-4xl)
  </ToolbarPortal>

  <section>                (inside the surface card)
    main-grid              (responsive grid with panels)
      source-code-panel
      topic-specific-panels
      console-output
  </section>
</>
```

Row alignment convention:
- Without selector: center the controls row (`justify-center`) so controls stay visually anchored.
- With selector: use a two-side row (`justify-between`) with selector/badges on the left and transport controls on the right.

---

## Toolbar Portal Pattern

**Files:** `src/components/layout/ToolbarPortal.tsx`, `src/components/layout/VisualizationPageShell.tsx`

The toolbar (transport controls + step explanation) is rendered *outside* the surface card to maximize vertical space for visualization panels. This is achieved via a React context + portal pattern:

1. **`ToolbarProvider`** — wraps the shell and stores the mount node + toolbar readiness state in context.
2. **`ToolbarSlot`** — placed between header and card in the shell. Renders a skeleton (`simple` or `selector`) until portaled content mounts.
3. **`ToolbarPortal`** — uses `createPortal` to render children into the `ToolbarSlot` from anywhere in the tree and toggles slot readiness.

The shell sets up the provider and slot automatically. Visualizations just wrap their toolbar JSX in `<ToolbarPortal>`:

```typescript
import { ToolbarPortal } from "@/components/layout/ToolbarPortal";

// Inside your visualization component:
<ToolbarPortal>
  <div className="flex flex-col gap-3">
    {/* controls row + explanation pill */}
  </div>
</ToolbarPortal>
```

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
| `.app-surface` | Main cards — gradient bg, border, shadow, blur |
| `.app-surface-subtle` | Lighter containers — controls row and explanation pill |
| `.app-surface-flat` | Minimal surface — inline code backgrounds |

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

**Important:** Always use `isDone && !isActive` — never apply both `is-active` and `is-done` to the same line. The `is-done` class sets `opacity: 0.4` which would visually override the active highlight. When the event loop or callbacks re-execute a line that was previously done, it must appear active (highlighted), not faded.

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

## Playback Engine — useStepPlayback

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

## Change Flash — useChangeFlash

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

**Returns:** `Record<K, boolean>` — same keys as `channels`, each `true` if that channel changed on the most recent step transition.

**Behavior:**

- The first real step (-1 to 0) does **not** flash — everything is new, there's no meaningful "previous state"
- Reset (step goes back to -1) clears all flash state
- A single timer clears all active flashes after 850ms
- Rapid stepping cancels the previous timer and restarts

### CSS Classes

Two animation classes are available in `globals.css`:

| Class | Effect | Apply to |
|---|---|---|
| `.viz-change-flash` | Outer pink glow pulse (`box-shadow`) | NeonPanels — via `className` prop |
| `.viz-change-flash-pill` | Inset pink glow pulse (`box-shadow`) | Explanation pill wrapper — via `cn()` |

Both animations run for 850ms with peak at 40%. They honor `prefers-reduced-motion`.

### Applying to NeonPanels

Pass the flash class via the `className` prop. Do **not** use a flash-based `key` prop — that remounts the panel and replays child entrance animations (`viz-slide-in`).

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

When a NeonPanel's data changes between steps, its children (heap objects, root cards, etc.) should replay their `viz-slide-in` entrance animation — but **only when a specific item's data actually changed**. Use a data fingerprint in the key instead of the step index:

```tsx
/** Stable fingerprint — changes only when the item's data changes. */
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

**Why fingerprints instead of `stepKey`?** Using `stepKey={currentStepIndex}` in child keys causes **every** child to remount on **every** step — replaying entrance animations even when that item's data hasn't changed. With a data fingerprint, the key only changes when the item's actual data changes, so:

- Items with unchanged data keep their DOM nodes (no animation replay)
- Items whose data changed get a new key → remount → `viz-slide-in` replays
- New items appearing get a fresh key → animate in
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

## Syntax Highlighting — Tokenizer

**File:** `src/lib/visualization/syntax.ts`

Lightweight regex tokenizer for educational JavaScript snippets. Not a general parser — designed for small (5-15 line) hardcoded examples.

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

Tokenization is handled automatically by `CodeLine` and `CodeBlock`. You only provide plain text — the components call `tokenize()` internally. You do not need to import the tokenizer directly unless building a custom renderer.

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

## Step Data Modeling

Every visualization is driven by a hardcoded array of step objects. Each step represents the complete visual state at that point in the explanation.

### Design Principles

1. **Each step is a full snapshot.** The step object contains everything needed to render that moment: active line, done lines, queue contents, console output, description. No deltas.

2. **Description uses HTML strings.** Step descriptions support inline HTML for formatting: `<code>`, `<strong>`, and semantic highlight spans.

3. **Console output is cumulative.** Each step's `consoleOutput` array contains all output up to that point (not just the new line).

4. **Active lines must not be in `doneLines`.** When a line is re-executed (e.g., a callback line picked up by the event loop), remove it from `doneLines` for that step. The rendering uses `isDone && !isActive`, but clean data is still important for clarity and future-proofing.

5. **No emojis in descriptions or UI text.** Use `<strong>` for emphasis instead.

### Description HTML Highlight Classes

Use these inside `descriptionHtml` strings to colorize terms:

| Class | Color | Meaning |
|---|---|---|
| `.hl-stack` | amber | Call stack references |
| `.hl-api` | cyan | Web API references |
| `.hl-task` | green | Task queue references |
| `.hl-micro` | violet | Microtask queue references |
| `.hl-loop` | pink | Event loop references |

Example:

```typescript
descriptionHtml: `<span class="hl-stack">Call Stack</span> receives <code>console.log('Start')</code>.`
```

### Inline code in descriptions

Wrap code references in `<code>` tags. The `.viz-step-desc code` class in `globals.css` styles them with a subtle border and monospace font.

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

---

## UI Copy Constants

**File:** `src/lib/visualization/uiCopy.ts`

Centralized strings for consistent labeling:

```typescript
export const VISUALIZATION_PANEL_TITLES = {
  sourceCode: "Source Code",
  consoleOutput: "Console Output",
} as const;

export const VISUALIZATION_EMPTY_STATES = {
  consoleOutput: "No output yet.",
  stepDescription: "Press Play or Step to begin.",
} as const;
```

Always use these constants instead of hardcoding strings. Add new entries here when introducing shared labels.

---

## Checklist

When adding a new topic, verify every item:

- [ ] Topic registered in `src/lib/topics.ts` (including `docsUrl`)
- [ ] Route page created at `src/app/<category>/<id>/page.tsx`
- [ ] Visualization component created at `src/components/visualizations/<Name>.tsx`
- [ ] Component uses `"use client"` directive
- [ ] Component is exported as a named export (not default)
- [ ] Component uses `useStepPlayback` hook for playback
- [ ] Toolbar (controls + explanation) wrapped in `<ToolbarPortal>` (renders outside surface card)
- [ ] Main visualization in a `<section>` (renders inside surface card)
- [ ] Component renders `TransportControls` with all required props (`stepIndex` + `totalSteps` for inline step pill)
- [ ] If topic has multiple examples, uses shared `ExampleSelector` (not a custom dropdown)
- [ ] If using `ExampleSelector`, passes `resetKey: activeExampleId` to `useStepPlayback`
- [ ] Source code displayed via `CodeBlock` or `CodeLine` (not raw HTML)
- [ ] Console output rendered via `ConsoleOutput`
- [ ] Panels wrapped in `NeonPanel` with appropriate tones
- [ ] Step descriptions use HTML with semantic highlight classes
- [ ] Explanation pill visible at all times (empty state via `VISUALIZATION_EMPTY_STATES.stepDescription`)
- [ ] Code line states use `isDone && !isActive` guard (never fade active lines)
- [ ] Active lines removed from `doneLines` when re-executed by callbacks/event loop
- [ ] `useChangeFlash` hook called with channels for each panel
- [ ] `viz-change-flash-pill` applied to explanation pill wrapper via `cn()`
- [ ] `viz-change-flash` applied to NeonPanels via `className` (no flash-based `key` props)
- [ ] Child items use data fingerprints in keys (not step index) for selective `viz-slide-in` re-triggers
- [ ] If related topics exist, `TopicLink` shown conditionally on last step of relevant example
- [ ] No emojis in step descriptions or UI text
- [ ] `npm run build` passes
- [ ] Visual check on desktop and mobile
- [ ] All transport controls work: play, pause, step forward, step back, reset, speed change
