import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PillToggleGroup from "../PillToggleGroup";

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Bravo" },
];

describe("PillToggleGroup", () => {
  it("adds an unselected value", async () => {
    const handleChange = vi.fn();
    render(<PillToggleGroup label="Tags" options={OPTIONS} selected={["a"]} onChange={handleChange} />);
    expect(screen.getByRole("group", { name: "Tags" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Bravo" }));
    expect(handleChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("removes a selected value", async () => {
    const handleChange = vi.fn();
    render(<PillToggleGroup label="Tags" options={OPTIONS} selected={["a", "b"]} onChange={handleChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Alpha" }));
    expect(handleChange).toHaveBeenCalledWith(["b"]);
  });
});
