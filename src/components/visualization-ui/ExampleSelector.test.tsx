import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ExampleSelector } from "@/components/visualization-ui/ExampleSelector";

const EXAMPLES = [
  { id: "one", title: "First example", description: "The first one." },
  { id: "two", title: "Second example", description: "The second one." },
  { id: "three", title: "Third example", description: "The third one." },
];

const renderSelector = (activeId = "one") => {
  const onSelect = vi.fn();
  render(
    <ExampleSelector
      examples={EXAMPLES}
      activeId={activeId}
      onSelect={onSelect}
      renderBadge={(example) => <em>{example.id}</em>}
    />,
  );
  return onSelect;
};

describe("ExampleSelector", () => {
  it("shows the active example on the closed trigger", () => {
    renderSelector("two");
    const trigger = screen.getByRole("button", {
      name: "Select example: Second example",
    });
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("falls back to the first example for an unknown active id", () => {
    renderSelector("missing");
    expect(
      screen.getByRole("button", { name: "Select example: First example" }),
    ).toBeInTheDocument();
  });

  it("opens the list, marks the selected option, and focuses it", async () => {
    const user = userEvent.setup();
    renderSelector("two");
    await user.click(screen.getByRole("button"));
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveFocus();
    expect(options[1].textContent).toContain("The second one.");
    expect(options[1].querySelector("em")?.textContent).toBe("two");
  });

  it("selects an option on click and closes", async () => {
    const user = userEvent.setup();
    const onSelect = renderSelector();
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: /Third example/ }));
    expect(onSelect).toHaveBeenCalledWith("three");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("supports arrow, Home, End, and Enter keyboard navigation", async () => {
    const user = userEvent.setup();
    const onSelect = renderSelector();
    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(options[1]).toHaveFocus();
    await user.keyboard("{End}");
    expect(options[2]).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(options[2]).toHaveFocus();
    await user.keyboard("{Home}");
    expect(options[0]).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(options[0]).toHaveFocus();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith("two");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("closes on Escape, Tab, and outside clicks without selecting", async () => {
    const user = userEvent.setup();
    const onSelect = renderSelector();
    const trigger = screen.getByRole("button");

    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();

    await user.click(trigger);
    await user.keyboard("{Tab}");
    expect(screen.queryByRole("listbox")).toBeNull();

    await user.click(trigger);
    await user.click(document.body);
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("toggles closed when the trigger is clicked again", async () => {
    const user = userEvent.setup();
    renderSelector();
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
