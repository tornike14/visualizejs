import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ExplanationToggle } from "@/components/visualization-ui/ExplanationToggle";
import { STORAGE_KEYS } from "@/content/static/storageKeys";
import { writeExplanationMode } from "@/lib/explanationMode";

describe("ExplanationToggle", () => {
  beforeEach(() => {
    writeExplanationMode("detailed");
  });

  it("renders a radio group with detailed selected by default", () => {
    render(<ExplanationToggle />);
    expect(
      screen.getByRole("radiogroup", { name: "Explanation style" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Detailed" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Simple" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("switches the mode and persists it", async () => {
    const user = userEvent.setup();
    render(<ExplanationToggle />);
    await user.click(screen.getByRole("radio", { name: "Simple" }));
    expect(screen.getByRole("radio", { name: "Simple" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Detailed" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(window.localStorage.getItem(STORAGE_KEYS.explanationMode)).toBe(
      "simple",
    );
  });

  it("reflects a preference set elsewhere", () => {
    writeExplanationMode("simple");
    render(<ExplanationToggle />);
    expect(screen.getByRole("radio", { name: "Simple" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });
});
