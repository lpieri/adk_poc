import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import WakeupToggle from "../WakeupToggle";

describe("WakeupToggle", () => {
  it("turns the wakeup on", async () => {
    const handleToggle = vi.fn();
    render(<WakeupToggle enabled={false} onToggle={handleToggle} />);
    const toggle = screen.getByRole("switch", { name: "Réveil par localisation" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);
    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it("turns the wakeup off", async () => {
    const handleToggle = vi.fn();
    render(<WakeupToggle enabled onToggle={handleToggle} />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
    await userEvent.click(toggle);
    expect(handleToggle).toHaveBeenCalledWith(false);
  });
});
