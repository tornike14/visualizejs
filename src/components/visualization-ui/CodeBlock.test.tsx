import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CodeBlock } from "@/components/visualization-ui/CodeBlock";
import { CodeLine } from "@/components/visualization-ui/CodeLine";

describe("CodeLine", () => {
  it("wraps each token in a span with its syntax class", () => {
    const { container } = render(
      <CodeLine lineNumber={1} text="const x = 'a'; // note" />,
    );
    const content = container.querySelector(".code-line-content")!;
    expect(content.querySelector(".tok-kw")?.textContent).toBe("const");
    expect(content.querySelector(".tok-str")?.textContent).toBe("'a'");
    expect(content.querySelector(".tok-comment")?.textContent).toBe("// note");
    expect(content.textContent).toBe("const x = 'a'; // note");
  });

  it("keeps plain tokens unclassed", () => {
    const { container } = render(<CodeLine text="value" />);
    const span = container.querySelector(".code-line-content span")!;
    expect(span.className).toBe("");
  });

  it("renders a space for a blank line so the row keeps its height", () => {
    const { container } = render(<CodeLine text="   " />);
    expect(container.querySelector(".code-line-content")?.textContent).toBe(
      "\u00a0",
    );
  });

  it("omits the line number and icon when they are not given", () => {
    const { container } = render(<CodeLine text="x" />);
    expect(container.querySelector(".code-line-num")).toBeNull();
    expect(container.querySelector(".code-line-icon")).toBeNull();
  });

  it("renders a left slot and merges class names", () => {
    const { container } = render(
      <CodeLine text="x" className="is-active" leftSlot={<b>!</b>} />,
    );
    expect(container.querySelector(".code-line")).toHaveClass("is-active");
    expect(container.querySelector(".code-line-icon")?.textContent).toBe("!");
  });
});

describe("CodeBlock", () => {
  it("renders one line per entry in order", () => {
    const { container } = render(
      <CodeBlock
        lines={[
          { key: "a", lineNumber: 1, text: "first();" },
          { key: "b", lineNumber: 2, text: "second();", className: "is-done" },
        ]}
      />,
    );
    const lines = container.querySelectorAll(".code-line");
    expect(lines).toHaveLength(2);
    expect(lines[0].textContent).toContain("first();");
    expect(lines[1]).toHaveClass("is-done");
  });
});
