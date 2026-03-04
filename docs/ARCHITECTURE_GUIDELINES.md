# Frontend Architecture Guidelines

This document defines how we structure UI code so features stay maintainable as the project grows.

## 1) Component Size Limits

- Target: keep component files at **<= 200 lines**.
- Hard limit: when a file approaches **300 lines**, split it immediately.
- If a feature needs many sections, move sections into feature-local subcomponents.

## 2) Feature Folder Structure

For non-trivial UI features, use a dedicated folder instead of a single large file.

```txt
src/components/<feature>/
  <FeatureMain>.tsx
  types.ts
  <feature>-data.ts
  <feature>-helpers.ts
  components/
    ...
  previews/ (or sections/, panels/, etc.)
    ...
```

Rules:
- Keep rendering logic in `.tsx` components.
- Keep pure helpers in `.ts` files.
- Keep static/config data in dedicated `*-data.ts` files.
- Keep reusable types in `types.ts`.
- Keep shared utility helpers (for example `noop`) in `src/lib/utils.ts`.

## 3) Reusable UI Primitives

If behavior can be reused across features, move it to `src/components/ui`.

Examples:
- carousel primitives
- dropdown primitives
- repeated navigation controls

Feature components should compose these primitives instead of re-implementing them.

## 4) Static Data Placement

For **non-visualization** features (onboarding, config, copy), move large static
data blobs into separate data modules under `src/content/static/<feature>/`.

Visualization step data (`EXAMPLES`, `STEPS`, `CODE_LINES`) is co-located
inside each visualization component file. This is intentional — step data is
tightly coupled to the component's local types and render logic, and
co-location makes authoring and iterating faster. Extract only when a single
file exceeds ~2,000 lines or when the same data is shared across components.

Example (non-visualization data):

```txt
src/content/static/onboarding/
  tourCopy.ts
```

## 5) Component Declaration Style

Use modern const-based component declarations:

```tsx
export const MyComponent = () => {
  return <div />;
};
```

Avoid new `function MyComponent()` declarations for React components unless there is a specific technical reason.

## 6) Onboarding Example (Reference)

The onboarding tour follows this structure:

```txt
src/components/onboarding/
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
```

The reusable carousel primitive used by onboarding lives in:

```txt
src/components/ui/StepCarousel.tsx
```

## 7) PR Checklist

Before shipping a UI feature:

1. No new large monolithic files.
2. Static data extracted from main component files.
3. Reusable logic promoted to `src/components/ui` when applicable.
4. React components use const-based declarations.
5. `npm run lint` and `npm run build` both pass.
