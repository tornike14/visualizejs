import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const Dialog = ({
  active,
  empty = false,
}: {
  active: boolean;
  empty?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <div ref={ref} data-testid="dialog">
      {!empty && (
        <>
          <button type="button">first</button>
          <a href="#x">middle</a>
          <button type="button">last</button>
        </>
      )}
    </div>
  );
};

describe("useFocusTrap", () => {
  it("focuses the first focusable element when activated", () => {
    render(<Dialog active />);
    expect(screen.getByText("first")).toHaveFocus();
  });

  it("does nothing while inactive", () => {
    const outside = document.createElement("button");
    document.body.append(outside);
    outside.focus();
    render(<Dialog active={false} />);
    expect(outside).toHaveFocus();
    outside.remove();
  });

  it("wraps Tab from the last element to the first", () => {
    render(<Dialog active />);
    const dialog = screen.getByTestId("dialog");
    screen.getByText("last").focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(screen.getByText("first")).toHaveFocus();
  });

  it("wraps Shift+Tab from the first element to the last", () => {
    render(<Dialog active />);
    const dialog = screen.getByTestId("dialog");
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(screen.getByText("last")).toHaveFocus();
  });

  it("lets Tab move normally in the middle of the trap", () => {
    render(<Dialog active />);
    const dialog = screen.getByTestId("dialog");
    screen.getByText("middle").focus();
    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    dialog.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(screen.getByText("middle")).toHaveFocus();
  });

  it("swallows Tab when nothing inside is focusable", () => {
    render(<Dialog active empty />);
    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    screen.getByTestId("dialog").dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("restores focus to the previously focused element on deactivate", () => {
    const opener = document.createElement("button");
    document.body.append(opener);
    opener.focus();
    const { rerender } = render(<Dialog active />);
    expect(screen.getByText("first")).toHaveFocus();
    rerender(<Dialog active={false} />);
    expect(opener).toHaveFocus();
    opener.remove();
  });
});
