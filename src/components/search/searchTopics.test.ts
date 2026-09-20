import { describe, expect, it } from "vitest";
import {
  filterTopics,
  type SearchEntry,
} from "@/components/search/searchTopics";

const entry = (
  overrides: Partial<SearchEntry> & Pick<SearchEntry, "id" | "title">,
): SearchEntry => ({
  kind: "topic",
  subtitle: "",
  route: `/javascript/${overrides.id}`,
  category: "javascript",
  ...overrides,
});

const ENTRIES: SearchEntry[] = [
  entry({
    id: "event-loop",
    title: "Event Loop",
    subtitle: "Call stack and queues",
  }),
  entry({
    id: "closures",
    title: "Closures",
    subtitle: "Functions remember scope",
  }),
  entry({
    id: "hooks",
    title: "Hooks",
    category: "react",
    route: "/react/hooks",
    subtitle: "useState and useEffect in order",
  }),
  entry({
    id: "react",
    kind: "category",
    title: "React",
    category: "react",
    route: "/react",
    subtitle: "Rendering and reconciliation",
  }),
  entry({
    id: "event-delegation",
    title: "Event Delegation",
    subtitle: "One listener for many elements",
  }),
];

const ids = (results: SearchEntry[]) => results.map((result) => result.id);

describe("filterTopics", () => {
  it("returns every entry untouched for an empty or blank query", () => {
    expect(filterTopics(ENTRIES, "")).toBe(ENTRIES);
    expect(filterTopics(ENTRIES, "   ")).toBe(ENTRIES);
  });

  it("is case insensitive and ignores surrounding whitespace", () => {
    expect(ids(filterTopics(ENTRIES, "  CLOSURES "))).toEqual(["closures"]);
  });

  it("ranks title prefixes above title substrings", () => {
    const list = [
      entry({ id: "custom-events", title: "Custom Events" }),
      entry({ id: "event-loop", title: "Event Loop" }),
    ];
    expect(ids(filterTopics(list, "event"))).toEqual([
      "event-loop",
      "custom-events",
    ]);
  });

  it("ranks a title substring above an id or category match", () => {
    const list = [
      entry({ id: "abc", title: "Something reactive" }),
      entry({ id: "react-basics", title: "Basics" }),
    ];
    expect(ids(filterTopics(list, "react"))).toEqual(["abc", "react-basics"]);
  });

  it("matches on category and ranks it below title matches", () => {
    const results = ids(filterTopics(ENTRIES, "react"));
    expect(results[0]).toBe("react");
    expect(results).toContain("hooks");
  });

  it("falls back to subtitle words with the lowest score", () => {
    const results = ids(filterTopics(ENTRIES, "listener"));
    expect(results).toEqual(["event-delegation"]);
  });

  it("requires every term to match", () => {
    expect(ids(filterTopics(ENTRIES, "event loop"))).toEqual(["event-loop"]);
    expect(ids(filterTopics(ENTRIES, "event nothing"))).toEqual([]);
  });

  it("matches hyphenated ids when the query uses spaces", () => {
    const list = [entry({ id: "use-effect-lifecycle", title: "Effects" })];
    expect(ids(filterTopics(list, "effect lifecycle"))).toEqual([
      "use-effect-lifecycle",
    ]);
  });

  it("drops entries that match nothing", () => {
    expect(filterTopics(ENTRIES, "zzz")).toEqual([]);
  });

  it("breaks ties in favour of categories", () => {
    const list = [
      entry({ id: "react-topic", title: "React Topic" }),
      entry({
        id: "react",
        kind: "category",
        title: "React",
        category: "react",
        route: "/react",
      }),
    ];
    expect(ids(filterTopics(list, "react"))).toEqual(["react", "react-topic"]);
  });

  it("does not mutate the input", () => {
    const copy = [...ENTRIES];
    filterTopics(ENTRIES, "event");
    expect(ENTRIES).toEqual(copy);
  });
});
