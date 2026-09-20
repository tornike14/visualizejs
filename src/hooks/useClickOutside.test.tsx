import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useClickOutside } from "@/hooks/useClickOutside";

const Popover = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const ref = useClickOutside<HTMLDivElement>(open, onClose);
  return (
    <div>
      <div ref={ref} data-testid="inside">
        <button type="button">inner</button>
      </div>
      <button type="button">outside</button>
    </div>
  );
};

describe("useClickOutside", () => {
  it("closes on a mousedown outside the element", () => {
    const onClose = vi.fn();
    render(<Popover open onClose={onClose} />);
    fireEvent.mouseDown(screen.getByText("outside"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ignores mousedown inside the element", () => {
    const onClose = vi.fn();
    render(<Popover open onClose={onClose} />);
    fireEvent.mouseDown(screen.getByText("inner"));
    fireEvent.mouseDown(screen.getByTestId("inside"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes on Escape and ignores other keys", () => {
    const onClose = vi.fn();
    render(<Popover open onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does nothing while closed", () => {
    const onClose = vi.fn();
    render(<Popover open={false} onClose={onClose} />);
    fireEvent.mouseDown(screen.getByText("outside"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("removes its listeners on unmount", () => {
    const onClose = vi.fn();
    const { unmount } = render(<Popover open onClose={onClose} />);
    unmount();
    fireEvent.mouseDown(document.body);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });
});
