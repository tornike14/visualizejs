# Topic Authoring Guide

How to wire a new JavaScript visualization topic into VisualizeJS. For React-specific extensions, see [react-topic-authoring.md](react-topic-authoring.md). For reusable components, hooks, and animations, see [component-reference.md](component-reference.md).

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Step 1 - Register the Topic](#step-1--register-the-topic)
4. [Step 2 - Create the Route Page](#step-2--create-the-route-page)
5. [Step 3 - Build the Visualization Component](#step-3--build-the-visualization-component)
6. [Toolbar Portal Pattern](#toolbar-portal-pattern)
7. [Step Data Modeling](#step-data-modeling)
8. [UI Copy Constants](#ui-copy-constants)
9. [Checklist](#checklist)

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
      [topic]/theory/page.tsx      # JS theory route
    react/
      your-topic/page.tsx          # React topic route
      [topic]/theory/page.tsx      # React theory route
      layout.tsx                   # React category layout
  components/
    visualizations/
      YourTopic.tsx                 # Single-file visualization (JS topics)
      your-topic/                   # Folder-based visualization (React/complex topics)
        index.tsx                   #   Main component
        types.ts                    #   Step, Example, Kind types
        helpers.ts                  #   Badge classes, labels, operation styles
        data.ts                     #   EXAMPLES array with step data
        components/                 #   Sub-components (DiffPanel, etc.)
    visualization-ui/
      CodeBlock.tsx                 # Multi-line syntax-highlighted code
      CodeLine.tsx                  # Single line with gutter + tokens
      ComponentTreeDiagram/         # Recursive tree visualization (React topics)
        index.tsx                   #   Main component with auto-scaling
        TreeNode.tsx                #   Recursive tree node renderer
        styles.ts                   #   Highlight, label, and connector style maps
      ConsoleOutput.tsx             # Shared console panel
      ExampleSelector.tsx           # Dropdown for switching sub-examples
      NeonPanel.tsx                 # Themed container with tones
      TopicLink.tsx                 # Cross-topic navigation link
      TransportControls/            # Playback buttons + speed dropdown
        index.tsx                   #   Main component
        types.ts                    #   PlaybackSpeedLevel, props interfaces
        constants.ts                #   Speed options, button style classes
        icons.tsx                   #   Play, Pause, Step, Reset, Chevron icons
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
    visualization-helpers.ts        # createKindBadgeClass, createKindLabel
  types/
    index.ts                        # Topic, Category, Difficulty types
    visualization.ts                # SourceLine, TreeNodeData, TreeNodeHighlight, ChainHighlight
```

---

## Step 1 - Register the Topic

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

## Step 2 - Create the Route Page

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
    import("@/components/visualizations/closures").then(
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
- No changes needed here for the toolbar - the shell already includes `ToolbarProvider` + `ToolbarSlot`.

---

## Step 3 - Build the Visualization Component

**File:** `src/components/visualizations/closures/index.tsx`

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

1. **`ToolbarProvider`** - wraps the shell and stores the mount node + toolbar readiness state in context.
2. **`ToolbarSlot`** - placed between header and card in the shell. Renders a skeleton (`simple` or `selector`) until portaled content mounts.
3. **`ToolbarPortal`** - uses `createPortal` to render children into the `ToolbarSlot` from anywhere in the tree and toggles slot readiness.

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

### All Topics

- [ ] Topic registered in `src/lib/topics.ts` (including `docsUrl`)
- [ ] Keywords added in `src/lib/metadata.ts` (`TOPIC_KEYWORDS`)
- [ ] Route page created at `src/app/<category>/<id>/page.tsx`
- [ ] Visualization component created (single file or folder-based)
- [ ] Component uses `"use client"` directive
- [ ] Component is exported as a named export (not default)
- [ ] Component uses `useStepPlayback` hook for playback
- [ ] Toolbar (controls + explanation) wrapped in `<ToolbarPortal>` (renders outside surface card)
- [ ] Main visualization in a `<section>` (renders inside surface card)
- [ ] Component renders `TransportControls` with all required props (`stepIndex` + `totalSteps` for inline step pill)
- [ ] If topic has multiple examples, uses shared `ExampleSelector` (not a custom dropdown)
- [ ] If using `ExampleSelector`, passes `resetKey: activeExampleId` to `useStepPlayback`
- [ ] If using `ExampleSelector`, wraps `setActiveExampleId` in a `handleExampleChange` callback
- [ ] If using `ExampleSelector`, topic added to `SELECTOR_TOOLBAR_TOPIC_IDS` in `VisualizationPageShell.tsx`
- [ ] Source code displayed via `CodeBlock` or `CodeLine` (not raw HTML)
- [ ] Panel titles use `VISUALIZATION_PANEL_TITLES` constants (not hardcoded strings)
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
- [ ] No em dashes or AI-sounding language in user-facing content
- [ ] `npm run build` passes
- [ ] Visual check on desktop and mobile
- [ ] All transport controls work: play, pause, step forward, step back, reset, speed change

### JS Topics (additional)

- [ ] Console output rendered via `ConsoleOutput`

### React Topics (additional)

See [react-topic-authoring.md](react-topic-authoring.md) for the full React checklist.
