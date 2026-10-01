import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { toHorseDraft } from "../../../utils/horseDraft";
import HorseCareFields from "../HorseCareFields";

const CONDITIONS = [{ code: "ems", label: "SME", summary: "" }];

describe("HorseCareFields", () => {
  it("reports every care change", async () => {
    const handleChange = vi.fn();
    render(<HorseCareFields draft={toHorseDraft()} conditions={CONDITIONS} onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText("Note d'état corporel : 5 / 9"), { target: { value: "7" } });
    expect(handleChange).toHaveBeenLastCalledWith({ bodyCondition: 7 });
    await userEvent.click(screen.getByRole("radio", { name: "Intense" }));
    expect(handleChange).toHaveBeenLastCalledWith({ workload: "intense" });
    await userEvent.click(screen.getByRole("button", { name: "SME" }));
    expect(handleChange).toHaveBeenLastCalledWith({ conditions: ["ems"] });
    await userEvent.type(screen.getByLabelText("Notes"), "x");
    expect(handleChange).toHaveBeenLastCalledWith({ notes: "x" });
  });
});
