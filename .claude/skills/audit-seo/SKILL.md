---
description: Audit SEO implementation across all topics, checking keywords, theory descriptions, sitemap coverage, metadata completeness, and related topic links.
---

# SEO Audit

Read-only audit of SEO implementation across all topics. Verifies metadata completeness, keyword coverage, and theory page linkage.

## When to Use

When the user asks to audit, check, or verify SEO compliance, metadata, or topic coverage.

## Checks

Run each check and report findings:

### 1. TOPIC_KEYWORDS Coverage

Read `src/lib/topics.ts` to get all topic IDs. Read `src/lib/metadata.ts` and verify every topic ID has an entry in `TOPIC_KEYWORDS`. Flag missing topics.

### 2. docsUrl Validation

Verify every topic in `src/lib/topics.ts` has a non-empty `docsUrl` field. Flag any empty or missing values.

### 3. Theory Registration

Read `src/content/theory/index.ts`. For each theory file imported, verify:

- The corresponding `.ts` file exists at the expected path
- The topic ID exists in `src/lib/topics.ts`
  Flag orphaned theory files or unregistered topics.

### 4. TOPIC_THEORY_DESCRIPTIONS Coverage

For every topic registered in `src/content/theory/index.ts`, verify it has a corresponding entry in `TOPIC_THEORY_DESCRIPTIONS` in `src/lib/metadata.ts`. Flag missing descriptions.

### 5. relatedTopicIds Validation

For each theory content file, check that:

- `relatedTopicIds` is not an empty array
- Each ID in `relatedTopicIds` exists in `src/lib/topics.ts`
  Flag empty arrays and invalid IDs.

### 6. Sitemap and Robots

Verify `src/app/sitemap.ts` and `src/app/robots.ts` exist, and that every category in `src/lib/categories.ts` has a route page at `src/app/<id>/page.tsx`.

### 7. Route Page Coverage

Routes are generated from `src/lib/topics.ts` by `src/app/[category]/[topic]/page.tsx`, so every registered topic has a page. Verify `generateStaticParams` still maps over `topics` and that `sitemap.ts` lists every topic route.

## Output Format

Report as a pass/fail table:

```
| Check                          | Status | Details |
|-------------------------------|--------|---------|
| TOPIC_KEYWORDS coverage       | PASS   | 16/16 topics covered |
| docsUrl validation            | PASS   | All topics have docsUrl |
| Theory registration           | FAIL   | generators missing theory |
...
```

## Documentation

- `docs/seo.md` -- SEO implementation details and post-deploy checklist
