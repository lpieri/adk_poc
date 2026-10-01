import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BARE_HORSE, HORSE, labelFor } from "../../../test/fixtures";
import HorseList from "../HorseList";

describe("HorseList", () => {
  it("invites to add a horse when empty", () => {
    render(<HorseList horses={[]} labelFor={labelFor} onSelect={vi.fn()} />);
    expect(screen.getByRole("status")).toHaveTextContent("Aucun cheval pour l'instant");
  });

  it("lists horses", async () => {
    const handleSelect = vi.fn();
    render(<HorseList horses={[HORSE, BARE_HORSE]} labelFor={labelFor} onSelect={handleSelect} />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
    await userEvent.click(screen.getByText("bijou"));
    expect(handleSelect).toHaveBeenCalledWith("h2");
  });
});
