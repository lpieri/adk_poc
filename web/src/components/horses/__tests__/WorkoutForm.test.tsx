import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import WorkoutForm from "../WorkoutForm";

describe("WorkoutForm", () => {
  it("logs a workout", async () => {
    const handleSubmit = vi.fn(async () => undefined);
    render(<WorkoutForm onSubmit={handleSubmit} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("radio", { name: "Balade" }));
    fireEvent.change(screen.getByLabelText("Durée (min)"), { target: { value: "60" } });
    await userEvent.click(screen.getByRole("radio", { name: "Légère" }));
    await userEvent.type(screen.getByLabelText("Notes"), "Au calme ");
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(handleSubmit).toHaveBeenCalledWith({ discipline: "hack", duration_min: 60, intensity: "light", notes: "Au calme" });
  });

  it("requires a duration and can be cancelled", async () => {
    const handleCancel = vi.fn();
    render(<WorkoutForm onSubmit={vi.fn()} onCancel={handleCancel} />);
    fireEvent.change(screen.getByLabelText("Durée (min)"), { target: { value: "" } });
    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(handleCancel).toHaveBeenCalled();
  });
});
