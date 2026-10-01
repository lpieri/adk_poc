import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { toHorseDraft } from "../../../utils/horseDraft";
import HorseIdentityFields from "../HorseIdentityFields";

describe("HorseIdentityFields", () => {
  it("reports every identity change", async () => {
    const handleChange = vi.fn();
    render(<HorseIdentityFields draft={toHorseDraft()} onChange={handleChange} />);
    await userEvent.type(screen.getByLabelText("Nom"), "T");
    expect(handleChange).toHaveBeenLastCalledWith({ name: "T" });
    await userEvent.type(screen.getByLabelText("Race"), "A");
    expect(handleChange).toHaveBeenLastCalledWith({ breed: "A" });
    await userEvent.click(screen.getByRole("radio", { name: "Étalon" }));
    expect(handleChange).toHaveBeenLastCalledWith({ sex: "stallion" });
    fireEvent.change(screen.getByLabelText("Année de naissance"), { target: { value: "2012" } });
    expect(handleChange).toHaveBeenLastCalledWith({ birthYear: "2012" });
    fireEvent.change(screen.getByLabelText("Poids (kg)"), { target: { value: "480" } });
    expect(handleChange).toHaveBeenLastCalledWith({ weightKg: "480" });
  });
});
