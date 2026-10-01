import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DETAIL } from "../../../test/fixtures";
import WorkoutSection from "../WorkoutSection";

describe("WorkoutSection", () => {
  it("shows an empty log", () => {
    render(<WorkoutSection workouts={[]} onAdd={vi.fn()} />);
    expect(screen.getByText("Aucune séance enregistrée.")).toBeInTheDocument();
  });

  it("lists workouts", () => {
    render(<WorkoutSection workouts={DETAIL.workouts} onAdd={vi.fn()} />);
    expect(screen.getByText("Saut")).toBeInTheDocument();
    expect(screen.getByText(/40 min/)).toBeInTheDocument();
    expect(screen.getByText("Intense")).toBeInTheDocument();
  });

  it("closes the form only once the workout is saved", async () => {
    const handleAdd = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    render(<WorkoutSection workouts={[]} onAdd={handleAdd} />);
    await userEvent.click(screen.getByRole("button", { name: "J'ai fait une séance" }));
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(screen.getByLabelText("Durée (min)")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(screen.queryByLabelText("Durée (min)")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "J'ai fait une séance" }));
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(screen.queryByLabelText("Durée (min)")).toBeNull();
  });
});
