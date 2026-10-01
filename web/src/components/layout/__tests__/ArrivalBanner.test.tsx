import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ArrivalBanner from "../ArrivalBanner";

describe("ArrivalBanner", () => {
  it("shows the place and can be closed", async () => {
    const handleClose = vi.fn();
    render(<ArrivalBanner placeName="Écurie des Saules" onClose={handleClose} />);
    expect(screen.getByText("📍 Tu es arrivée à Écurie des Saules")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Fermer" }));
    expect(handleClose).toHaveBeenCalled();
  });
});
