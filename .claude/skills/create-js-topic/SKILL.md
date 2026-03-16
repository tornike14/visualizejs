---
description: Create a new JavaScript visualization topic, scaffold all required files, register in topic and theory registries, and verify the build passes.
---

# Create JS Topic

Scaffold a new JavaScript visualization topic end-to-end. This skill handles the full multi-file workflow from topic registration to build verification.

## When to Use

When the user asks to create, add, or build a new JavaScript topic or visualization.

## Workflow

1. **Gather inputs** from the user:
   - Topic ID (kebab-case, e.g., `async-await`)
   - Title (display name, e.g., "Async/Await")
   - Difficulty (`beginner`, `intermediate`, or `advanced`)
   - `docsUrl` (MDN or authoritative reference URL)
   - Description (1-2 sentences for SEO and landing page cards)
   - Whether it uses ExampleSelector (multiple sub-examples)
   - Whether it should be folder-based (recommended for complex topics)

2. **Register the topic** in `src/lib/topics.ts`. Add to the `topics` array following the existing order convention.

3. **Add SEO keywords** in `src/lib/metadata.ts` under `TOPIC_KEYWORDS`. Add 4-7 relevant search terms.

4. **Create the route page** at `src/app/javascript/<id>/page.tsx`. Follow the exact pattern from existing pages (see `src/app/javascript/generators/page.tsx` for reference).

5. **Scaffold the visualization component:**
   - **Single-file:** `src/components/visualizations/<TopicName>.tsx`
   - **Folder-based:** `src/components/visualizations/<topic-id>/` with `index.tsx`, `types.ts`, `helpers.ts`, `data.ts`, `components/`
   - Read `docs/topic-authoring.md` for the full skeleton template.
   - Read `docs/component-reference.md` for component APIs and hooks.

6. **If using ExampleSelector:** Add topic ID to `SELECTOR_TOOLBAR_TOPIC_IDS` in `src/components/layout/VisualizationPageShell.tsx`.

7. **Create theory content** at `src/content/theory/javascript/<id>.ts`. Read `docs/theory-authoring.md` for field-by-field guidance and tone requirements.

8. **Register theory** in `src/content/theory/index.ts`. Import and add to `THEORY_CONTENT_BY_TOPIC_ID`.

9. **Add theory description** in `src/lib/metadata.ts` under `TOPIC_THEORY_DESCRIPTIONS`.

10. **Verify:** Run `npm run build`. Fix any errors.

## Key Files

- `src/lib/topics.ts` -- topic registry
- `src/lib/metadata.ts` -- keywords and theory descriptions
- `src/app/javascript/<id>/page.tsx` -- route page (new)
- `src/components/visualizations/` -- visualization component (new)
- `src/content/theory/javascript/<id>.ts` -- theory content (new)
- `src/content/theory/index.ts` -- theory registry
- `src/components/layout/VisualizationPageShell.tsx` -- SELECTOR_TOOLBAR_TOPIC_IDS

## Documentation

- `docs/topic-authoring.md` -- full JS topic workflow and checklist
- `docs/component-reference.md` -- component APIs, hooks, animations
- `docs/theory-authoring.md` -- theory content requirements

## Non-Negotiable Rules

- No em dashes or AI-sounding language in content
- No emojis in step descriptions or UI text
- Use `VISUALIZATION_PANEL_TITLES` and `VISUALIZATION_EMPTY_STATES` from `uiCopy.ts`
- Wrap `setActiveExampleId` in `handleExampleChange` callback
- Theory `relatedTopicIds` must have 3-5 valid IDs (never empty)
- Code line fading guard: `isDone && !isActive`
- Components use `"use client"` directive and named exports
