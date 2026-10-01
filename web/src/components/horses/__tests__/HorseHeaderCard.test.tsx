import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BARE_HORSE, HORSE, labelFor } from "../../../test/fixtures";
import HorseHeaderCard from "../HorseHeaderCard";

describe("HorseHeaderCard", () => {
  it("shows the full profile and its actions", async () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    render(<HorseHeaderCard horse={HORSE} labelFor={labelFor} onEdit={handleEdit} onDelete={handleDelete} />);
    expect(screen.getByRole("heading", { name: "Tornade" })).toBeInTheDocument();
    expect(screen.getByText("Selle Français · Jument")).toBeInTheDocument();
    expect(screen.getByText("6 / 9")).toBeInTheDocument();
    expect(screen.getByText("label:pssm1")).toBeInTheDocument();
    expect(screen.getByText("Gourmande")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Modifier" }));
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(handleEdit).toHaveBeenCalled();
    expect(handleDelete).toHaveBeenCalled();
  });

  it("handles a sparse profile", () => {
    render(<HorseHeaderCard horse={BARE_HORSE} labelFor={labelFor} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Race non précisée · Hongre")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText("Aucune pathologie signalée")).toBeInTheDocument();
  });
});
