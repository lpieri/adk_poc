import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BARE_HORSE, HORSE, labelFor } from "../../../test/fixtures";
import HorseCard from "../HorseCard";

describe("HorseCard", () => {
  it("summarises a horse and opens it", async () => {
    const handleSelect = vi.fn();
    render(<HorseCard horse={HORSE} labelFor={labelFor} onSelect={handleSelect} />);
    expect(screen.getByText("Tornade")).toBeInTheDocument();
    expect(screen.getByText("Selle Français")).toBeInTheDocument();
    expect(screen.getByText(/\d+ ans/)).toBeInTheDocument();
    expect(screen.getByText("550 kg")).toBeInTheDocument();
    expect(screen.getByText("Modéré")).toBeInTheDocument();
    expect(screen.getByText("label:pssm1")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button"));
    expect(handleSelect).toHaveBeenCalledWith("h1");
  });

  it("handles missing breed and birth year", () => {
    render(<HorseCard horse={BARE_HORSE} labelFor={labelFor} onSelect={vi.fn()} />);
    expect(screen.getByText("Race non précisée")).toBeInTheDocument();
    expect(screen.getByText("Âge inconnu")).toBeInTheDocument();
  });
});
