import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import type { TransportControlsProps } from "@/components/visualization-ui/TransportControls/types";

const renderControls = (overrides: Partial<TransportControlsProps> = {}) => {
  const props: TransportControlsProps = {
    isPlaying: false,
    canStep: true,
    canStepBack: true,
    stepIndex: 2,
    totalSteps: 10,
    speedLevel: 4,
    speedLabel: "1x",
    onTogglePlay: vi.fn(),
    onStep: vi.fn(),
    onStepBack: vi.fn(),
    onReset: vi.fn(),
    onSpeedLevelChange: vi.fn(),
    onJumpTo: vi.fn(),
    ...overrides,
  };
  render(<TransportControls {...props} />);
  return props;
};

describe("TransportControls", () => {
  it("shows the one-based step position", () => {
    renderControls();
    expect(screen.getByText("Step 3 / 10")).toBeInTheDocument();
  });

  it("shows step 0 before playback starts", () => {
    renderControls({ stepIndex: -1 });
    expect(screen.getByText("Step 0 / 10")).toBeInTheDocument();
  });

  it("hides the step pill and scrubber when no step info is given", () => {
    renderControls({ stepIndex: undefined, totalSteps: undefined });
    expect(screen.queryByText(/Step \d/)).toBeNull();
    expect(screen.queryByRole("slider")).toBeNull();
  });

  it("wires every button to its callback", async () => {
    const user = userEvent.setup();
    const props = renderControls();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await user.click(screen.getByRole("button", { name: "Step back" }));
    await user.click(screen.getByRole("button", { name: "Play" }));
    await user.click(screen.getByRole("button", { name: "Step forward" }));
    expect(props.onReset).toHaveBeenCalledTimes(1);
    expect(props.onStepBack).toHaveBeenCalledTimes(1);
    expect(props.onTogglePlay).toHaveBeenCalledTimes(1);
    expect(props.onStep).toHaveBeenCalledTimes(1);
  });

  it("disables stepping at the ends", () => {
    renderControls({ canStep: false, canStepBack: false });
    expect(screen.getByRole("button", { name: "Step forward" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Step back" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reset" })).toBeEnabled();
  });

  it("labels the play button as pause while playing", () => {
    renderControls({ isPlaying: true });
    const button = screen.getByRole("button", { name: "Pause" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: "Play" })).toBeNull();
  });

  it("lets the reader jump to a step with the scrubber", () => {
    const props = renderControls();
    const slider = screen.getByRole("slider") as HTMLInputElement;
    expect(slider.min).toBe("0");
    expect(slider.max).toBe("9");
    expect(slider.value).toBe("2");
    expect(slider).toHaveAttribute("aria-valuetext", "Step 3 of 10");
    fireEvent.change(slider, { target: { value: "7" } });
    expect(props.onJumpTo).toHaveBeenCalledWith(7);
  });

  it("omits the scrubber without a jump handler", () => {
    renderControls({ onJumpTo: undefined });
    expect(screen.queryByRole("slider")).toBeNull();
  });

  it("omits the scrubber with a single step but keeps the step pill", () => {
    renderControls({ stepIndex: 0, totalSteps: 1 });
    expect(screen.queryByRole("slider")).toBeNull();
    expect(screen.getByText("Step 1 / 1")).toBeInTheDocument();
  });

  it("opens the speed menu and selects a speed", async () => {
    const user = userEvent.setup();
    const props = renderControls();
    const trigger = screen.getByRole("button", { name: "Playback speed: 1x" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).toBeNull();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const options = screen.getAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual([
      "0.25x",
      "0.5x",
      "0.75x",
      "1x",
      "1.5x",
      "2x",
    ]);
    expect(screen.getByRole("option", { name: "1x" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.click(screen.getByRole("option", { name: "2x" }));
    expect(props.onSpeedLevelChange).toHaveBeenCalledWith(6);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("closes the speed menu on Escape and on an outside click", async () => {
    const user = userEvent.setup();
    renderControls();
    const trigger = screen.getByRole("button", { name: "Playback speed: 1x" });
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();

    await user.click(trigger);
    await user.click(document.body);
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
