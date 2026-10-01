import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DETAIL } from "../../../test/fixtures";
import WeightSection from "../WeightSection";

describe("WeightSection", () => {
  it("shows an empty history", () => {
    render(<WeightSection weights={[]} onAdd={vi.fn()} />);
    expect(screen.getByText("Aucune pesée enregistrée.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ajouter" })).toBeDisabled();
  });

  it("lists weights and keeps the value when saving fails", async () => {
    const handleAdd = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    render(<WeightSection weights={DETAIL.weights} onAdd={handleAdd} />);
    expect(screen.getByText("540 kg")).toBeInTheDocument();
    const input = screen.getByLabelText("Nouveau poids (kg)");
    await userEvent.type(input, "560");
    await userEvent.click(screen.getByRole("button", { name: "Ajouter" }));
    expect(handleAdd).toHaveBeenCalledWith(560);
    expect(input).toHaveValue(560);
    await userEvent.click(screen.getByRole("button", { name: "Ajouter" }));
    expect(input).toHaveValue(null);
  });
});
