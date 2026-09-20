# SEO Documentation

This document describes the SEO work currently implemented in VisualizeJS.

## Canonical Domain

- Production site URL: `https://visualizejs.com`
- Source of truth: `SITE_URL` in `src/lib/constants.ts`
- Current default:
  - `process.env.NEXT_PUBLIC_SITE_URL || "https://visualizejs.com"`

## Implemented SEO Features

### 1) Page Metadata (Next.js Metadata API)

- Root metadata is configured in `src/app/layout.tsx`:
  - `metadataBase`
  - default/title template
  - description
  - root keywords
  - canonical for `/`
  - robots directives
  - Open Graph + Twitter cards (including `images`)
- Topic metadata is generated in `src/lib/metadata.ts` via `createTopicMetadata(topic)`:
  - title
  - description
  - category
  - merged keywords
  - canonical URL
  - robots directives
  - Open Graph + Twitter cards (including `images`)
- Social preview images are generated per route by `opengraph-image.tsx` files, all drawing through `src/lib/socialImage.tsx`:
  - `src/app/opengraph-image.tsx` (home)
  - `src/app/[category]/opengraph-image.tsx` (category colour, topic count)
  - `src/app/[category]/[topic]/opengraph-image.tsx` (topic title, difficulty, description)
  - Twitter cards reuse the Open Graph image; there is no separate twitter-image route
- Category pages define targeted metadata:
  - `src/app/[category]/page.tsx` (one generated page per category)

### 2) Keyword Strategy

- Centralized keyword composition in `src/lib/metadata.ts`:
  - `CATEGORY_KEYWORDS` (from the category registry)
  - `TOPIC_KEYWORDS` (curated, 4 to 8 per topic, typed by `TopicId`)
  - dedupe helper
- `getTopicKeywords(topic)` merges the topic title, the curated list, and the category list. Search engines ignore the meta keywords tag, so the list is kept short; its real use is the `keywords` field of the TechArticle structured data.
- Includes intent-style query coverage, for example:
  - `var vs let vs const`
  - `execution context javascript`
  - `this binding rules`
  - `microtask queue vs macrotask queue`

### 3) Structured Data (JSON-LD)

- Global schemas in `src/app/layout.tsx`:
  - `WebSite`
  - `Organization` (with LinkedIn profile in `sameAs`)
- Topic page schemas in `src/components/layout/VisualizationPageShell.tsx`:
  - `TechArticle`
  - `BreadcrumbList`
- Category listing schema in `src/components/layout/CategoryTopicsPage.tsx`:
  - `CollectionPage` with `ItemList` of topic URLs

### 4) Crawl and Index Controls

- Robots file route: `src/app/robots.ts`
  - Generates `/robots.txt`
  - allows crawling
  - declares sitemap URL
- Sitemap route: `src/app/sitemap.ts`
  - Generates `/sitemap.xml`
  - includes static routes (`/`, `/javascript`, `/react`) and all topic routes
  - Theory content shares its topic's URL, so it needs no separate sitemap entry

## Files Involved

- `src/lib/constants.ts`
- `src/lib/metadata.ts`
- `src/app/layout.tsx`
- `src/app/opengraph-image.tsx`
- `src/app/[category]/opengraph-image.tsx`
- `src/app/[category]/[topic]/opengraph-image.tsx`
- `src/lib/socialImage.tsx`
- `src/components/layout/VisualizationPageShell.tsx`
- `src/components/layout/CategoryTopicsPage.tsx`
- `src/app/[category]/page.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`

## Vercel Environment Variables

Recommended for production:

- `NEXT_PUBLIC_SITE_URL=https://visualizejs.com`
  - Recommended even though there is a default, to avoid accidental wrong canonicals between environments.
- `NEXT_PUBLIC_CREATOR_LINKEDIN_URL`
  - Optional. Set if you want to override the built-in fallback.
- `NEXT_PUBLIC_CREATOR_AVATAR_SRC`
  - Optional. Set if avatar asset path/domain changes.
- `NEXT_PUBLIC_CREATOR_AVATAR_FALLBACK`
  - Optional.

Notes:

- `NEXT_PUBLIC_*` variables are exposed to the browser, so do not place secrets there.
- Configure Production, Preview, and Development values separately in Vercel as needed.

## Post-Deploy SEO Checklist

1. Confirm `https://visualizejs.com/robots.txt` loads and references sitemap.
2. Confirm `https://visualizejs.com/sitemap.xml` includes all topic URLs.
3. Inspect rendered `<head>` on a topic page for canonical, OG, Twitter, and keywords.
4. Verify `og:image` and `twitter:image` are absolute and return `200`:
   - `https://visualizejs.com/opengraph-image`
   - `https://visualizejs.com/backend/opengraph-image`
   - `https://visualizejs.com/javascript/closures/opengraph-image`
5. Validate JSON-LD in Google Rich Results Test or Schema Markup Validator.
6. Add and verify domain in Google Search Console, then submit sitemap.
7. Wait for crawl/indexing and monitor query impressions.
