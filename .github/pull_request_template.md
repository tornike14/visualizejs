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
- [ ] `npm run verify` passes (lint, typecheck, format, build)

## For a new topic

Confirm each registry was updated, or delete this section.

- [ ] `src/lib/topics.ts` (set `toolbar: "simple"` if the topic has no example picker)
- [ ] Visualization at `src/components/visualizations/<topic-id>/`
- [ ] `VISUALIZATIONS` in `src/components/visualizations/registry.tsx`
- [ ] Theory content at `src/content/theory/<category>/<topic-id>.ts`
- [ ] `THEORY_CONTENT_BY_TOPIC_ID` in `src/content/theory/index.ts`
- [ ] `TOPIC_KEYWORDS` and `TOPIC_THEORY_DESCRIPTIONS` in `src/lib/metadata.ts`
- [ ] Added to the `relatedTopicIds` of 2 or more existing theory files

The registries are typed by `TopicId`, so a missing entry fails `npm run typecheck`.

## Screenshots

<!-- Visualization changes are much easier to review with a screenshot or recording. -->
