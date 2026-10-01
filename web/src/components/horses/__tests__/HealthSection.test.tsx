import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DETAIL } from "../../../test/fixtures";
import HealthSection from "../HealthSection";

describe("HealthSection", () => {
  it("shows an empty notebook", () => {
    render(<HealthSection entries={[]} onAdd={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Le carnet est vide pour l'instant.")).toBeInTheDocument();
  });

  it("lists entries newest first and forwards deletions", async () => {
    const handleDelete = vi.fn();
    render(<HealthSection entries={DETAIL.health} onAdd={vi.fn()} onDelete={handleDelete} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Parage");
    await userEvent.click(screen.getByRole("button", { name: "Supprimer Grippe" }));
    expect(handleDelete).toHaveBeenCalledWith("e1");
  });

  it("closes the form only when the entry was saved", async () => {
    const handleAdd = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    render(<HealthSection entries={[]} onAdd={handleAdd} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Ajouter un soin" }));
    await userEvent.click(screen.getByRole("button", { name: "Ajouter" }));
    expect(screen.getByLabelText("Intitulé")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Ajouter" }));
    expect(screen.queryByLabelText("Intitulé")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Ajouter un soin" }));
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(screen.queryByLabelText("Intitulé")).toBeNull();
  });
});
