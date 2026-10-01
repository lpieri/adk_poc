import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SuggestionChips from "../SuggestionChips";

describe("SuggestionChips", () => {
  it("sends the chosen suggestion", async () => {
    const handleSelect = vi.fn();
    render(<SuggestionChips onSelect={handleSelect} />);
    expect(screen.getAllByRole("button")).toHaveLength(4);
    await userEvent.click(screen.getByRole("button", { name: "Je suis à l'écurie" }));
    expect(handleSelect).toHaveBeenCalledWith("Je suis à l'écurie");
  });
});
