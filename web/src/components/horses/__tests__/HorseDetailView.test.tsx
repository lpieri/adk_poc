import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HorseDetailState } from "../../../hooks/useHorseDetail";
import { useHorseDetail } from "../../../hooks/useHorseDetail";
import { DETAIL, labelFor, makeDetailActions } from "../../../test/fixtures";
import HorseDetailView from "../HorseDetailView";

vi.mock("../../../hooks/useHorseDetail", () => ({ useHorseDetail: vi.fn() }));

const CONDITIONS = { conditions: [], labelFor };

const mockDetail = (state: Partial<HorseDetailState>): HorseDetailState["actions"] => {
  const actions = state.actions ?? makeDetailActions();
  vi.mocked(useHorseDetail).mockReturnValue({ detail: DETAIL, loading: false, error: false, ...state, actions });
  return actions;
};

const renderView = (onBack = vi.fn(), onDeleted = vi.fn()) => {
  return render(<HorseDetailView userId="u1" horseId="h1" conditions={CONDITIONS} onBack={onBack} onDeleted={onDeleted} />);
};

describe("HorseDetailView", () => {
  beforeEach(() => {
    vi.mocked(useHorseDetail).mockReset();
  });

  it("shows a loader, then an error, with a back button", async () => {
    mockDetail({ detail: null, loading: true });
    const handleBack = vi.fn();
    const { rerender } = renderView(handleBack);
    expect(screen.getByRole("status")).toHaveTextContent("Chargement…");
    await userEvent.click(screen.getByRole("button", { name: "Retour" }));
    expect(handleBack).toHaveBeenCalled();
    mockDetail({ detail: null, loading: false, error: true });
    rerender(<HorseDetailView userId="u1" horseId="h1" conditions={CONDITIONS} onBack={handleBack} onDeleted={vi.fn()} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Oups");
  });

  it("renders every section and forwards record actions", async () => {
    const actions = mockDetail({});
    renderView();
    expect(screen.getByRole("heading", { name: "Tornade" })).toBeInTheDocument();
    expect(screen.getByText("Ration du jour")).toBeInTheDocument();
    expect(screen.getByText("Soins à prévoir")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Supprimer Grippe" }));
    expect(actions.deleteHealth).toHaveBeenCalledWith("e1");
    await userEvent.click(screen.getByRole("button", { name: "Ajouter un soin" }));
    await userEvent.click(screen.getAllByRole("button", { name: "Ajouter" })[0]);
    expect(actions.addHealth).toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText("Nouveau poids (kg)"), "555");
    await userEvent.click(screen.getByRole("button", { name: "Ajouter" }));
    expect(actions.addWeight).toHaveBeenCalledWith(555);
    await userEvent.click(screen.getByRole("button", { name: "J'ai fait une séance" }));
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(actions.addWorkout).toHaveBeenCalled();
  });

  it("edits the horse and returns to the profile on success", async () => {
    const actions = mockDetail({ actions: makeDetailActions(false) });
    renderView();
    await userEvent.click(screen.getByRole("button", { name: "Modifier" }));
    expect(screen.getByRole("heading", { name: "Modifier la fiche" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(actions.update).toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    vi.mocked(actions.update).mockResolvedValueOnce(true);
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(await screen.findByRole("heading", { name: "Tornade" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Modifier" }));
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(screen.getByRole("heading", { name: "Tornade" })).toBeInTheDocument();
  });

  it("deletes the horse only after confirmation", async () => {
    const actions = mockDetail({});
    const handleDeleted = vi.fn();
    const confirm = vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);
    renderView(vi.fn(), handleDeleted);
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(confirm).toHaveBeenCalledWith("Supprimer Tornade et tout son historique ?");
    expect(actions.remove).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(handleDeleted).toHaveBeenCalled();
  });

  it("reports a failed deletion", async () => {
    mockDetail({ actions: makeDetailActions(false) });
    const handleDeleted = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderView(vi.fn(), handleDeleted);
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("L'action n'a pas pu aboutir");
    expect(handleDeleted).not.toHaveBeenCalled();
  });
});
