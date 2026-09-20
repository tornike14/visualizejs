import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SourceCodePanel } from "@/components/visualization-ui/SourceCodePanel";
import { VISUALIZATION_PANEL_TITLES } from "@/lib/visualization/uiCopy";

const LINES = [
  { num: 1, text: "function outer() {" },
  { num: 2, text: "  let count = 0;" },
  { num: 3, text: "  return count;" },
  { num: 4, text: "}" },
];

const lineElements = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(".code-line"));

describe("SourceCodePanel", () => {
  it("uses the shared panel title by default and allows an override", () => {
    const { rerender } = render(<SourceCodePanel lines={LINES} />);
    expect(
      screen.getByText(VISUALIZATION_PANEL_TITLES.sourceCode),
    ).toBeInTheDocument();
    rerender(<SourceCodePanel lines={LINES} title="Template" />);
    expect(screen.getByText("Template")).toBeInTheDocument();
  });

  it("renders every line with its number and highlighted tokens", () => {
    const { container } = render(<SourceCodePanel lines={LINES} />);
    const lines = lineElements(container);
    expect(lines).toHaveLength(4);
    expect(lines[0].querySelector(".code-line-num")?.textContent).toBe("1");
    expect(lines[0].querySelector(".tok-kw")?.textContent).toBe("function");
    expect(lines[1].textContent).toContain("let count = 0;");
  });

  it("marks the active and done lines", () => {
    const { container } = render(
      <SourceCodePanel lines={LINES} activeLine={3} doneLines={[1, 2]} />,
    );
    const lines = lineElements(container);
    expect(lines[0]).toHaveClass("is-done");
    expect(lines[1]).toHaveClass("is-done");
    expect(lines[2]).toHaveClass("is-active");
    expect(lines[2]).not.toHaveClass("is-done");
    expect(lines[3]).not.toHaveClass("is-done");
    expect(lines[3]).not.toHaveClass("is-active");
  });

  it("never fades the active line even when it is also listed as done", () => {
    const { container } = render(
      <SourceCodePanel lines={LINES} activeLine={2} doneLines={[1, 2, 3]} />,
    );
    const lines = lineElements(container);
    expect(lines[1]).toHaveClass("is-active");
    expect(lines[1]).not.toHaveClass("is-done");
    expect(lines[2]).toHaveClass("is-done");
  });

  it("highlights extra lines only when they are neither active nor done", () => {
    const { container } = render(
      <SourceCodePanel
        lines={LINES}
        activeLine={1}
        doneLines={[2]}
        highlightLines={[1, 2, 3]}
      />,
    );
    const lines = lineElements(container);
    expect(lines[0]).not.toHaveClass("is-highlighted");
    expect(lines[1]).not.toHaveClass("is-highlighted");
    expect(lines[2]).toHaveClass("is-highlighted");
  });

  it("renders no markers before playback starts", () => {
    const { container } = render(<SourceCodePanel lines={LINES} />);
    for (const line of lineElements(container)) {
      expect(line.className.trim()).toBe("code-line");
    }
  });
});
