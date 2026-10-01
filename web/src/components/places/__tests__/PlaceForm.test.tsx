import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PlaceForm from "../PlaceForm";

describe("PlaceForm", () => {
  it("saves a complete place", async () => {
    const handleSubmit = vi.fn(async () => undefined);
    render(<PlaceForm onSubmit={handleSubmit} onCancel={vi.fn()} />);
    const save = screen.getByRole("button", { name: "Enregistrer" });
    expect(save).toBeDisabled();
    await userEvent.type(screen.getByLabelText("Nom du lieu"), " Pré ");
    await userEvent.click(screen.getByRole("radio", { name: "Maison" }));
    fireEvent.change(screen.getByLabelText("Rayon (m)"), { target: { value: "300" } });
    fireEvent.change(screen.getByLabelText("Latitude"), { target: { value: "45,5" } });
    expect(save).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Longitude"), { target: { value: "4.8" } });
    await userEvent.click(save);
    expect(handleSubmit).toHaveBeenCalledWith({ name: "Pré", kind: "home", lat: 45.5, lng: 4.8, radius_m: 300 });
  });

  it("can be cancelled", async () => {
    const handleCancel = vi.fn();
    render(<PlaceForm onSubmit={vi.fn()} onCancel={handleCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(handleCancel).toHaveBeenCalled();
  });
});
