# VisualizeJS Ultimate Project Document

## 1) Project Summary

VisualizeJS is a Next.js App Router project for interactive JavaScript and React concept visualizations.

Current scope implemented:
- Category-based navigation (`JavaScript`, `React`)
- Dedicated topic pages per concept
- Interactive visualization components
- Metadata + route-level loading/error handling
- Category landing pages (`/javascript`, `/react`)
- Root redirect from `/` to `/javascript`

Status: app builds and lints successfully.

---

## 2) Tech Stack (Current)

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
- `/javascript` -> JavaScript topics landing page
- `/javascript/event-loop` -> Event Loop visualization
- `/javascript/hoisting` -> Hoisting visualization
- `/react` -> React topics landing page
- `/react/virtual-dom` -> Virtual DOM visualization
- `/react/jwt` -> JWT visualization

---

## 4) Architecture Overview

### App shell
- `src/app/layout.tsx`
  - Global metadata (site-level title/description/OG/Twitter)
  - Persistent sidebar + main content layout
  - Hydration warning suppression on `<html>` and `<body>` to avoid false mismatches from extension-injected attributes

### Navigation
- `src/components/layout/Sidebar.tsx`
  - URL-driven active category
  - `TopicToggle` switches by route (`/javascript` or `/react`)
  - Mobile sheet + desktop sidebar
  - Topic list filtered by active category

### Topic data model
- `src/lib/topics.ts`
  - Central topic definitions (id/title/category/route/description/difficulty/icon)
  - `getTopicsByCategory`, `getTopicById`, `getTopicOrThrow`

### Visualization page composition
- Each topic page wraps a dynamic visualization import with:
  - `VisualizationPageShell` (header, badges, back navigation)
  - `ErrorBoundary`
  - `VisualizationLoading`
  - route metadata from `createTopicMetadata`

---

## 5) Major Work Completed

### A. Foundation and routing
- Implemented category route groups and pages.
- Added dedicated routes for all 4 visualizations.
- Added category index pages and removed dependency on `/` as a content landing page.
- Added root redirect to `/javascript`.

### B. Sidebar/toggle behavior fixes
- Fixed incorrect category toggle behavior by making category derived from pathname.
- Toggle now consistently navigates between category roots and updates visible topics.

### C. Hydration issues addressed
- Fixed prior server/client mismatch causes related to category state derivation.
- Added hydration suppression on root HTML/body for extension-injected attributes (example: `cz-shortcut-listen`).

### D. Visualization integration
- Added and wired all visualization components:
  - Event Loop
  - Hoisting
  - Virtual DOM
  - JWT

### E. Event Loop redesign (artifact-aligned)
- Rebuilt Event Loop UI and interaction model to closely match Claude artifact style.
- Added reusable design primitives:
  - `src/components/visualization-ui/NeonPanel.tsx`
  - `src/components/visualization-ui/TransportControls.tsx`
- Added reusable playback speed control with levels:
  - `0.5x`, `0.75x`, `1x`, `1.5x`, `2x`
- Implemented artifact-style layout:
  - Source code panel
  - Call Stack / Web APIs / Microtask Queue / Task Queue / Event Loop ring
  - Console output
  - Step description capsule and animated state transitions

---

## 6) Current Key File Structure

```txt
src/
  app/
    layout.tsx
    page.tsx
    loading.tsx
    javascript/
      page.tsx
      layout.tsx
      event-loop/page.tsx
      hoisting/page.tsx
    react/
      page.tsx
      layout.tsx
      virtual-dom/page.tsx
      jwt/page.tsx
  components/
    ErrorBoundary.tsx
    layout/
      Sidebar.tsx
      TopicToggle.tsx
      CategoryTopicsPage.tsx
      VisualizationPageShell.tsx
    visualization-ui/
      NeonPanel.tsx
      TransportControls.tsx
    visualizations/
      EventLoop.tsx
      Hoisting.tsx
      VirtualDOM.tsx
      JWT.tsx
      VisualizationLoading.tsx
  lib/
    topics.ts
    metadata.ts
    constants.ts
    utils.ts
  types/
    index.ts
```

---

## 7) Verification

Latest verification run:
- `npm run lint` -> pass
- `npm run build` -> pass
- Static routes generated for all category and topic pages

---

## 8) Documentation Organization

This `docs/` folder now contains:
- `docs/ultimate.md` (this file)
- `docs/README.md` (copied project readme snapshot)
- `docs/visualizejs-project-brief.md` (copied original project brief)

---

## 9) Recommended Next Steps

1. Apply the new `NeonPanel` + `TransportControls` design system to `Hoisting`, `VirtualDOM`, and `JWT` for full visual consistency.
2. Refresh root `README.md` from template text to project-specific setup, architecture, and contribution docs.
3. Add minimal route-level smoke tests (Play/Step/Reset behavior for visualizations).

