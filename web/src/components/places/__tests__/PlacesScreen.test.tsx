import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { PlacesState } from "../../../hooks/usePlaces";
import { usePlaces } from "../../../hooks/usePlaces";
import { PLACE } from "../../../test/fixtures";
import PlacesScreen from "../PlacesScreen";

vi.mock("../../../hooks/usePlaces", () => ({ usePlaces: vi.fn() }));

const mockPlaces = (state: Partial<PlacesState>): PlacesState => {
  const value: PlacesState = {
    places: [PLACE],
    loading: false,
    error: false,
    create: vi.fn(async () => true),
    remove: vi.fn(async () => true),
    ...state,
  };
  vi.mocked(usePlaces).mockReturnValue(value);
  return value;
};

const renderScreen = (onSimulate = vi.fn(async () => true), onToggleGeo = vi.fn(), active = true) => {
  return render(<PlacesScreen userId="u1" active={active} geoEnabled={false} onToggleGeo={onToggleGeo} onSimulate={onSimulate} />);
};

const fillPlace = async (): Promise<void> => {
  await userEvent.type(screen.getByLabelText("Nom du lieu"), "Pré");
  fireEvent.change(screen.getByLabelText("Latitude"), { target: { value: "45" } });
  fireEvent.change(screen.getByLabelText("Longitude"), { target: { value: "4" } });
  await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
};

describe("PlacesScreen", () => {
  it("shows loading, empty and error states", () => {
    mockPlaces({ places: [], loading: true });
    const { container, rerender } = renderScreen(vi.fn(), vi.fn(), false);
    expect(container.querySelector("section")).toHaveClass("hidden");
    expect(screen.getByText("Chargement…")).toBeInTheDocument();
    mockPlaces({ places: [] });
    rerender(<PlacesScreen userId="u1" active geoEnabled onToggleGeo={vi.fn()} onSimulate={vi.fn()} />);
    expect(screen.getByText("Aucun lieu enregistré.")).toBeInTheDocument();
    mockPlaces({ places: [], error: true });
    rerender(<PlacesScreen userId="u1" active geoEnabled onToggleGeo={vi.fn()} onSimulate={vi.fn()} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Oups");
  });

  it("toggles the wakeup and simulates arrivals", async () => {
    mockPlaces({});
    const handleSimulate = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const handleToggle = vi.fn();
    renderScreen(handleSimulate, handleToggle);
    await userEvent.click(screen.getByRole("switch"));
    expect(handleToggle).toHaveBeenCalledWith(true);
    await userEvent.click(screen.getByRole("button", { name: "Simuler mon arrivée" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("L'action n'a pas pu aboutir");
    await userEvent.click(screen.getByRole("button", { name: "Simuler mon arrivée" }));
    await vi.waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  it("adds a place, keeping the form open on failure", async () => {
    const places = mockPlaces({ create: vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true) });
    renderScreen();
    await userEvent.click(screen.getByRole("button", { name: "Ajouter un lieu" }));
    await fillPlace();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(places.create).toHaveBeenCalledTimes(2);
    await vi.waitFor(() => expect(screen.queryByLabelText("Nom du lieu")).toBeNull());
    await userEvent.click(screen.getByRole("button", { name: "Ajouter un lieu" }));
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(screen.queryByLabelText("Nom du lieu")).toBeNull();
  });

  it("deletes a place after confirmation", async () => {
    const places = mockPlaces({ remove: vi.fn(async () => false) });
    vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);
    renderScreen();
    const deleteButton = screen.getByRole("button", { name: "Supprimer Écurie des Saules" });
    await userEvent.click(deleteButton);
    expect(places.remove).not.toHaveBeenCalled();
    await userEvent.click(deleteButton);
    expect(places.remove).toHaveBeenCalledWith("p1");
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
