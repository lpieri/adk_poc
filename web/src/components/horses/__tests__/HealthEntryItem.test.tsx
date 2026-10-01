import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DETAIL } from "../../../test/fixtures";
import HealthEntryItem from "../HealthEntryItem";

describe("HealthEntryItem", () => {
  it("shows the reminder and notes, and deletes the entry", async () => {
    const handleDelete = vi.fn();
    render(
      <ol>
        <HealthEntryItem entry={DETAIL.health[0]} onDelete={handleDelete} />
      </ol>,
    );
    expect(screen.getByText("Grippe")).toBeInTheDocument();
    expect(screen.getByText(/Vaccin/)).toBeInTheDocument();
    expect(screen.getByText(/Rappel le/)).toBeInTheDocument();
    expect(screen.getByText("RAS")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Supprimer Grippe" }));
    expect(handleDelete).toHaveBeenCalledWith("e1");
  });

  it("omits the optional lines", () => {
    render(
      <ol>
        <HealthEntryItem entry={DETAIL.health[1]} onDelete={vi.fn()} />
      </ol>,
    );
    expect(screen.queryByText(/Rappel le/)).toBeNull();
  });
});
