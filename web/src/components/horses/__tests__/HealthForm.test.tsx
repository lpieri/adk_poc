import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import HealthForm from "../HealthForm";

describe("HealthForm", () => {
  it("uses the kind as label when none is given", async () => {
    const handleSubmit = vi.fn(async () => undefined);
    render(<HealthForm onSubmit={handleSubmit} onCancel={vi.fn()} />);
    await userEvent.selectOptions(screen.getByLabelText("Type de soin"), "deworming");
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2026-04-02" } });
    fireEvent.change(screen.getByLabelText("Prochain rappel"), { target: { value: "2026-07-02" } });
    await userEvent.type(screen.getByLabelText("Notes"), " Equest ");
    await userEvent.click(screen.getByRole("button", { name: "Ajouter" }));
    expect(handleSubmit).toHaveBeenCalledWith({
      kind: "deworming",
      date: "2026-04-02",
      label: "Vermifuge",
      next_due: "2026-07-02",
      notes: "Equest",
    });
  });

  it("keeps a custom label, clears the reminder and can be cancelled", async () => {
    const handleSubmit = vi.fn(async () => undefined);
    const handleCancel = vi.fn();
    render(<HealthForm onSubmit={handleSubmit} onCancel={handleCancel} />);
    await userEvent.type(screen.getByLabelText("Intitulé"), "Grippe");
    fireEvent.change(screen.getByLabelText("Prochain rappel"), { target: { value: "2026-07-02" } });
    fireEvent.change(screen.getByLabelText("Prochain rappel"), { target: { value: "" } });
    await userEvent.click(screen.getByRole("button", { name: "Ajouter" }));
    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({ kind: "vaccine", label: "Grippe", next_due: null }));
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(handleCancel).toHaveBeenCalled();
  });
});
