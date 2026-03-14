# VisualizeJS Project Status

## 1) Project Snapshot

VisualizeJS is a Next.js App Router project focused on interactive JavaScript concept visualizations.

Current product scope:
- JavaScript track is active with interactive concept pages.
- React track is live with interactive visualizations (first topic: Reconciliation).
- UI theme has been unified across shell, sidebar, pages, and visualizations using shared design tokens and reusable visualization primitives.

Status:
- `npm run lint` - passes (0 errors)
- `npm run build` - passes

---

## 2) Tech Stack

- Next.js `16.1.6` (App Router, webpack mode)
- React `19.2.3`
- TypeScript (strict mode)
- Tailwind CSS v4 + shadcn/ui primitives
- ESLint (Next core-web-vitals + TypeScript config)

Scripts:
- `npm run dev` -> `next dev --webpack`
- `npm run build` -> `next build --webpack`
- `npm run start` -> `next start`
- `npm run lint` -> `eslint`

---

## 3) Current Route Map

- `/` -> redirects to `/javascript`
- `/javascript` -> JavaScript landing page
- `/javascript/event-loop` -> Event Loop visualization
- `/javascript/hoisting` -> Hoisting visualization
- `/javascript/closures` -> Closures visualization
- `/javascript/promises` -> Promises visualization
- `/javascript/prototypal-inheritance` -> Prototypal Inheritance visualization
- `/javascript/this-keyword` -> this Keyword visualization
- `/javascript/scope-chain` -> Scope Chain visualization
- `/javascript/execution-context` -> Execution Context visualization
- `/javascript/reference-value` -> Reference vs Value visualization
- `/javascript/heap-stack` -> Heap & Stack visualization
- `/javascript/garbage-collection` -> Garbage Collection visualization
- `/javascript/generators` -> Generators & Iterators visualization
- `/javascript/type-coercion` -> Type Coercion visualization
- `/react` -> React category landing page
- `/react/reconciliation` -> Reconciliation & Virtual DOM Diffing visualization
- `/javascript/[topic]/theory` -> Theory pages for JS topics
- `/react/[topic]/theory` -> Theory pages for React topics

Removed routes:
- `/react/virtual-dom`
- `/react/jwt`
- `/javascript/execution-context-scope-chain`

Note: Each topic with theory content also has a `/theory` sub-route (e.g., `/javascript/closures/theory`).

---

## 4) Current Key File Structure

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    loading.tsx
    sitemap.ts
    robots.ts
    javascript/
      page.tsx
      layout.tsx
      [topic]/theory/page.tsx
      event-loop/page.tsx
      hoisting/page.tsx
      closures/page.tsx
      promises/page.tsx
      prototypal-inheritance/page.tsx
      this-keyword/page.tsx
      scope-chain/page.tsx
      execution-context/page.tsx
      reference-value/page.tsx
      heap-stack/page.tsx
      garbage-collection/page.tsx
      generators/page.tsx
      type-coercion/page.tsx
    react/
      page.tsx
      layout.tsx
      [topic]/theory/page.tsx
      reconciliation/page.tsx
  components/
    ErrorBoundary.tsx
    onboarding/
      OnboardingTourModal.tsx
      onboardingTourSteps.ts
      onboardingTourStorage.ts
      types.ts
      components/
        PreviewShell.tsx
      previews/
        ControlsPreview.tsx
        SandboxPreview.tsx
        TheoryPreview.tsx
        LinkedInPreview.tsx
    layout/
      AppTheme.tsx
      Sidebar.tsx
      TopicToggle.tsx
      CategoryTopicsPage.tsx
      VisualizationPageShell.tsx
      ToolbarPortal.tsx
    visualization-ui/
      NeonPanel.tsx
      TransportControls.tsx
      ExampleSelector.tsx
      ComponentTreeDiagram.tsx
      Tooltip.tsx
      CodeBlock.tsx
      CodeLine.tsx
      ConsoleOutput.tsx
      TopicLink.tsx
    ui/
      StepCarousel.tsx
    visualizations/
      EventLoop.tsx
      Hoisting.tsx
      Closures.tsx
      Promises.tsx
      TypeCoercion.tsx
      VisualizationLoading.tsx
      execution-context/        # Folder-based JS topic
      garbage-collection/
      generators/
      heap-stack/
      prototypal-inheritance/
      reference-value/
      scope-chain/
      this-keyword/
      reconciliation/           # Folder-based React topic (reference implementation)
        index.tsx
        types.ts
        helpers.ts
        data.ts
        components/
          DiffPanel.tsx
  hooks/
    useStepPlayback.ts
    useChangeFlash.ts
    useClickOutside.ts
  content/
    static/
      onboarding/
        tourCopy.ts
      storageKeys.ts
    theory/
      types.ts
      index.ts
      javascript/               # JS theory content files
      react/                    # React theory content files
        reconciliation.ts
  lib/
    topics.ts
    metadata.ts
    constants.ts
    utils.ts
    visualization-helpers.ts
    visualization/
      syntax.ts
      uiCopy.ts
  types/
    index.ts
    visualization.ts            # SourceLine, TreeNodeData, TreeNodeHighlight, ChainHighlight
public/
  icons/
    javascript.svg
    react.svg
  personal-image.png
docs/
  ultimate.md                   (this file, current status)
  ARCHITECTURE_GUIDELINES.md    (frontend architecture standards)
  TOPIC_AUTHORING.md            (guide for wiring new topics, JS and React)
  THEORY_AUTHORING.md           (guide for adding theory pages)
  SANDBOX_AUTHORING.md          (guide for adding sandbox mode)
  seo.md                        (SEO implementation docs)
```

---

## 5) Architecture Patterns

- **ToolbarPortal + skeleton slot**: Transport controls and step explanations render outside the surface card via React context + `createPortal`. `ToolbarSlot` shows a pre-hydration skeleton (simple or selector variant) to prevent layout jump on hard refresh, then swaps to real portaled content.
- **TransportControls owns step pill**: Step position is rendered inline in `TransportControls` (left of Reset) via `stepIndex`/`totalSteps`; visualizations no longer render a separate step pill.
- **useStepPlayback**: Shared hook for step-driven playback (play, pause, step, reset, speed). Speed options are `0.25x` to `2x`; default is `1x`.
- **useClickOutside**: Shared hook that handles outside-click dismissal and Escape key for dropdowns. Used by `ExampleSelector` and `TransportControls`.
- **ExampleSelector**: Shared dropdown for switching sub-examples, with optional `renderBadge`. Used by Hoisting, Promises, Prototypal Inheritance, Scope Chain, this Keyword, and Reconciliation.
- **Tooltip behavior by device**: Tooltips render only on hover-capable devices (`(hover: hover) and (pointer: fine)`), so mobile/touch UIs stay clean.
- **Sidebar footer and profile CTA**: Sidebar includes a compact LinkedIn follow pill with profile image and copyright.
- **Mobile nav pattern**: On mobile, brand logo remains visible at top-left, burger is fixed top-right, and full sidebar content (including footer extras) opens in the sheet.
- **Syntax tokenizer**: Lightweight regex tokenizer in `syntax.ts`. `CodeBlock` / `CodeLine` auto-tokenize plain text into colored spans.
- **NeonPanel**: Themed container with tone-colored headers (amber, cyan, green, violet, pink, slate).
- **Step data model**: Each visualization uses hardcoded full-state snapshots (`STEPS` arrays), no deltas.
- **External docs link**: Each topic has `docsUrl`; shell renders an external docs icon beside the title.
- **Responsive source code column**: Layout uses `xl:grid-cols-[auto_minmax(0,1fr)]` so code can size to content while right column fills remaining space.
- **ComponentTreeDiagram**: Reusable recursive tree visualization for React topics. Auto-scales to fit container width via `ResizeObserver` + CSS `transform: scale()`. Uses split-half connector technique for clean tree lines.
- **Folder-based visualizations**: Complex topics (most JS topics added after the initial batch, all React topics) use a folder structure: `index.tsx`, `types.ts`, `helpers.ts`, `data.ts`, `components/`.
- **No emojis**: UI text uses semantic emphasis (`<strong>`) and avoids emojis.
- **No em dashes**: Content avoids long dashes and AI-sounding language. Use periods, commas, or restructure sentences instead.

---

## 6) Conventions

1. Keep one H1 at page shell level.
2. Use `NeonPanel` + `TransportControls` for interactive visualizations.
3. Use step data models (not hardcoded DOM-driven behavior).
4. Code line fading guard: `isDone && !isActive` (never fade active lines).
5. `description` field on topics is used for SEO metadata and category landing cards only, not shown on the visualization page.
6. Use modular feature folders for complex UI: split components, helpers, types, and static data into separate files.
7. Extract reusable controls/patterns (for example, carousels) into `src/components/ui`.
8. Keep new React components in const form (`const Component = () =>`), not function declarations.
9. See `docs/TOPIC_AUTHORING.md` for topic wiring (JS and React), `docs/THEORY_AUTHORING.md` for theory pages, `docs/SANDBOX_AUTHORING.md` for sandbox mode, and `docs/ARCHITECTURE_GUIDELINES.md` for architecture rules.

---

## 7) Verification Snapshot

Latest generated routes:
- `/`
- `/_not-found`
- `/javascript`
- `/javascript/closures`
- `/javascript/event-loop`
- `/javascript/execution-context`
- `/javascript/garbage-collection`
- `/javascript/generators`
- `/javascript/heap-stack`
- `/javascript/hoisting`
- `/javascript/promises`
- `/javascript/prototypal-inheritance`
- `/javascript/reference-value`
- `/javascript/scope-chain`
- `/javascript/this-keyword`
- `/javascript/type-coercion`
- `/javascript/[topic]/theory` (for topics with theory content)
- `/react`
- `/react/reconciliation`
- `/react/[topic]/theory`
