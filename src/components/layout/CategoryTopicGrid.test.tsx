import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { CategoryTopicGrid } from "./CategoryTopicGrid";
import type { Topic } from "@/types";

const topic = (
  id: string,
  difficulty: Topic["difficulty"],
  group?: string,
): Topic => ({
  id,
  title: `Title ${id}`,
  description: `About ${id}`,
  category: "frameworks",
  difficulty,
  docsUrl: "https://example.com",
  route: `/frameworks/${id}`,
  ...(group ? { group } : {}),
});

const TOPICS = [
  topic("one", "beginner", "Vue"),
  topic("two", "intermediate", "Vue"),
  topic("three", "intermediate", "Svelte"),
];

const cardTitles = () =>
  screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);

const chip = (name: RegExp) => screen.getByRole("radio", { name });

describe("CategoryTopicGrid", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("shows every topic with counts per level and disables empty levels", () => {
    render(<CategoryTopicGrid heading="Topics" topics={TOPICS} />);
    expect(cardTitles()).toEqual([
      "Vue",
      "Title one",
      "Title two",
      "Svelte",
      "Title three",
    ]);
    expect(chip(/^All/)).toBeChecked();
    expect(chip(/^All/)).toHaveTextContent("3");
    expect(chip(/^Beginner/)).toHaveTextContent("1");
    expect(chip(/^Intermediate/)).toHaveTextContent("2");
    expect(chip(/^Advanced/)).toBeDisabled();
    expect(screen.getByText(/3 topics, ordered/)).toBeInTheDocument();
  });

  it("filters to one level, hides empty groups, and writes the URL", async () => {
    const user = userEvent.setup();
    render(<CategoryTopicGrid heading="Topics" topics={TOPICS} />);
    await user.click(chip(/^Beginner/));
    expect(chip(/^Beginner/)).toBeChecked();
    expect(cardTitles()).toEqual(["Vue", "Title one"]);
    expect(screen.getByText("1 of 3 topics")).toBeInTheDocument();
    expect(window.location.search).toBe("?level=beginner");
  });

  it("keeps the registry index on filtered cards", async () => {
    const user = userEvent.setup();
    render(<CategoryTopicGrid heading="Topics" topics={TOPICS} />);
    await user.click(chip(/^Intermediate/));
    const cards = screen.getAllByRole("article");
    expect(within(cards[0]).getByText("02")).toBeInTheDocument();
    expect(within(cards[1]).getByText("03")).toBeInTheDocument();
  });

  it("clears the filter when the active chip is clicked again", async () => {
    const user = userEvent.setup();
    render(<CategoryTopicGrid heading="Topics" topics={TOPICS} />);
    await user.click(chip(/^Intermediate/));
    await user.click(chip(/^Intermediate/));
    expect(chip(/^All/)).toBeChecked();
    expect(cardTitles()).toHaveLength(5);
    expect(window.location.search).toBe("");
  });

  it("applies a level given in the URL on load", () => {
    window.history.replaceState(null, "", "/frameworks?level=intermediate");
    render(<CategoryTopicGrid heading="Topics" topics={TOPICS} />);
    expect(chip(/^Intermediate/)).toBeChecked();
    expect(cardTitles()).toEqual(["Vue", "Title two", "Svelte", "Title three"]);
  });

  it("ignores an unknown level in the URL", () => {
    window.history.replaceState(null, "", "/frameworks?level=expert");
    render(<CategoryTopicGrid heading="Topics" topics={TOPICS} />);
    expect(chip(/^All/)).toBeChecked();
    expect(cardTitles()).toHaveLength(5);
  });
});
