import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useConditions } from "../../../hooks/useConditions";
import { useHorseDetail } from "../../../hooks/useHorseDetail";
import type { HorsesState } from "../../../hooks/useHorses";
import { useHorses } from "../../../hooks/useHorses";
import { DETAIL, HORSE, labelFor, makeDetailActions } from "../../../test/fixtures";
import HorsesScreen from "../HorsesScreen";

vi.mock("../../../hooks/useHorses", () => ({ useHorses: vi.fn() }));
vi.mock("../../../hooks/useConditions", () => ({ useConditions: vi.fn() }));
vi.mock("../../../hooks/useHorseDetail", () => ({ useHorseDetail: vi.fn() }));

const mockHorses = (state: Partial<HorsesState>): HorsesState => {
  const value: HorsesState = {
    horses: [HORSE],
    loading: false,
    error: false,
    reload: vi.fn(async () => undefined),
    create: vi.fn(async () => HORSE),
    ...state,
  };
  vi.mocked(useHorses).mockReturnValue(value);
  return value;
};

describe("HorsesScreen", () => {
  beforeEach(() => {
    vi.mocked(useConditions).mockReturnValue({ conditions: [{ code: "pssm1", label: "PSSM1", summary: "" }], labelFor });
    vi.mocked(useHorseDetail).mockReturnValue({ detail: DETAIL, loading: false, error: false, actions: makeDetailActions() });
  });

  it("shows loading and error states, hidden when inactive", () => {
    mockHorses({ horses: [], loading: true });
    const { container, rerender } = render(<HorsesScreen userId="u1" active={false} />);
    expect(container.querySelector("section")).toHaveClass("hidden");
    expect(screen.getByText("Chargement…")).toBeInTheDocument();
    mockHorses({ error: true });
    rerender(<HorsesScreen userId="u1" active />);
    expect(screen.getByText(/Oups/)).toBeInTheDocument();
  });

  it("opens a horse and goes back to a refreshed list", async () => {
    const horses = mockHorses({ loading: true });
    render(<HorsesScreen userId="u1" active />);
    await userEvent.click(screen.getByText("Tornade"));
    expect(screen.getByText("Ration du jour")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Retour" }));
    expect(horses.reload).toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Mes chevaux" })).toBeInTheDocument();
  });

  it("creates a horse and opens it", async () => {
    const horses = mockHorses({});
    render(<HorsesScreen userId="u1" active />);
    await userEvent.click(screen.getByRole("button", { name: "Ajouter un cheval" }));
    expect(screen.getByRole("heading", { name: "Nouveau cheval" })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Nom"), "Tornade");
    await userEvent.type(screen.getByLabelText("Poids (kg)"), "550");
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(horses.create).toHaveBeenCalled();
    expect(await screen.findByText("Ration du jour")).toBeInTheDocument();
  });

  it("stays on the form when creation fails", async () => {
    mockHorses({ create: vi.fn(async () => null) });
    render(<HorsesScreen userId="u1" active />);
    await userEvent.click(screen.getByRole("button", { name: "Ajouter un cheval" }));
    await userEvent.type(screen.getByLabelText("Nom"), "Tornade");
    await userEvent.type(screen.getByLabelText("Poids (kg)"), "550");
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nouveau cheval" })).toBeInTheDocument();
  });
});
