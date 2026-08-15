## What changed

<!-- Describe the change and why it is needed. Link the issue if there is one. -->

## Type

- [ ] Bug fix
- [ ] Content correction
- [ ] New topic
- [ ] Improvement to an existing visualization
- [ ] Docs or tooling

## Verification

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm run check:registries` passes

## For a new topic

Confirm each registry was updated, or delete this section.

- [ ] `src/lib/topics.ts`
- [ ] Route at `src/app/<category>/<topic-id>/page.tsx`
- [ ] Visualization at `src/components/visualizations/<topic-id>/`
- [ ] Theory content at `src/content/theory/<category>/<topic-id>.ts`
- [ ] `THEORY_CONTENT_BY_TOPIC_ID` in `src/content/theory/index.ts`
- [ ] `TOPIC_KEYWORDS` and `TOPIC_THEORY_DESCRIPTIONS` in `src/lib/metadata.ts`
- [ ] `SELECTOR_TOOLBAR_TOPIC_IDS` if the topic uses `ExampleSelector`
- [ ] Added to the `relatedTopicIds` of 2 or more existing theory files

## Screenshots

<!-- Visualization changes are much easier to review with a screenshot or recording. -->
