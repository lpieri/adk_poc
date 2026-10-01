import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PLACE } from "../../../test/fixtures";
import PlaceCard from "../PlaceCard";

describe("PlaceCard", () => {
  it("describes the place", () => {
    render(<PlaceCard place={PLACE} onSimulate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Écurie des Saules")).toBeInTheDocument();
    expect(screen.getByText("48.8566, 2.3522 · Rayon 150 m")).toBeInTheDocument();
    expect(screen.getByText("Écurie")).toBeInTheDocument();
  });

  it("simulates an arrival and disables the button meanwhile", async () => {
    let finish: () => void = () => undefined;
    const handleSimulate = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    render(<PlaceCard place={PLACE} onSimulate={handleSimulate} onDelete={vi.fn()} />);
    const button = screen.getByRole("button", { name: "Simuler mon arrivée" });
    await userEvent.click(button);
    expect(handleSimulate).toHaveBeenCalledWith("p1");
    expect(button).toBeDisabled();
    finish();
    await vi.waitFor(() => expect(button).toBeEnabled());
  });

  it("asks to delete the place", async () => {
    const handleDelete = vi.fn();
    render(<PlaceCard place={PLACE} onSimulate={vi.fn()} onDelete={handleDelete} />);
    await userEvent.click(screen.getByRole("button", { name: "Supprimer Écurie des Saules" }));
    expect(handleDelete).toHaveBeenCalledWith(PLACE);
  });
});
