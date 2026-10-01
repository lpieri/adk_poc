import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TabBar from "../TabBar";

describe("TabBar", () => {
  it("highlights the active tab and switches tabs", async () => {
    const handleChange = vi.fn();
    render(<TabBar active="horses" onChange={handleChange} />);
    expect(screen.getByRole("navigation", { name: "Navigation principale" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Chevaux" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Ale" })).not.toHaveAttribute("aria-current");
    expect(screen.getByTestId("tab-pill").style.transform).toBe("translateX(100%)");
    await userEvent.click(screen.getByRole("button", { name: "Lieux" }));
    expect(handleChange).toHaveBeenCalledWith("places");
  });
});
