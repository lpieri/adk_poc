import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SegmentedControl from "../SegmentedControl";

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Bravo" },
];

const MANY_OPTIONS = ["a", "b", "c", "d", "e"].map((value) => ({ value, label: value.toUpperCase() }));

describe("SegmentedControl", () => {
  it("slides a black pill under the selected option and reports changes", async () => {
    const handleChange = vi.fn();
    render(<SegmentedControl label="Choix" options={OPTIONS} value="b" onChange={handleChange} />);
    expect(screen.getByRole("radiogroup", { name: "Choix" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Bravo" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Alpha" })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByTestId("segment-pill").style.transform).toBe("translateX(100%)");
    await userEvent.click(screen.getByRole("radio", { name: "Alpha" }));
    expect(handleChange).toHaveBeenCalledWith("a");
  });

  it("wraps long option lists with per-item pills", () => {
    render(<SegmentedControl label="Choix" options={MANY_OPTIONS} value="c" onChange={vi.fn()} />);
    expect(screen.queryByTestId("segment-pill")).toBeNull();
    expect(screen.getByRole("radio", { name: "C" }).className).toContain("bg-sway-black");
    expect(screen.getByRole("radio", { name: "A" }).className).not.toContain("bg-sway-black");
  });
});
