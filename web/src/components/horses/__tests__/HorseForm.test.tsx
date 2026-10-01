import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HORSE } from "../../../test/fixtures";
import HorseForm from "../HorseForm";

describe("HorseForm", () => {
  it("creates a horse once the required fields are filled", async () => {
    const handleSubmit = vi.fn(async () => true);
    render(<HorseForm title="Nouveau cheval" conditions={[]} onSubmit={handleSubmit} onCancel={vi.fn()} />);
    const save = screen.getByRole("button", { name: "Enregistrer" });
    expect(save).toBeDisabled();
    await userEvent.type(screen.getByLabelText("Nom"), "Tornade");
    await userEvent.type(screen.getByLabelText("Poids (kg)"), "500");
    await userEvent.click(save);
    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: "Tornade", weight_kg: 500, birth_year: null }));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows an error when saving fails and can be cancelled", async () => {
    const handleCancel = vi.fn();
    render(<HorseForm title="Modifier" initial={HORSE} conditions={[]} onSubmit={vi.fn(async () => false)} onCancel={handleCancel} />);
    expect(screen.getByLabelText("Nom")).toHaveValue("Tornade");
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("L'action n'a pas pu aboutir");
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    await userEvent.click(screen.getByRole("button", { name: "Retour" }));
    expect(handleCancel).toHaveBeenCalledTimes(2);
  });
});
