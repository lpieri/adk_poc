import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DETAIL } from "../../../test/fixtures";
import DueCareList from "../DueCareList";

describe("DueCareList", () => {
  it("says when nothing is due", () => {
    render(<DueCareList items={[]} />);
    expect(screen.getByText("Rien à signaler pour le moment.")).toBeInTheDocument();
  });

  it("lists due care with timing and status", () => {
    render(<DueCareList items={DETAIL.due_care} />);
    expect(screen.getByText("Vaccin grippe")).toBeInTheDocument();
    expect(screen.getByText("Dans 10 jours")).toBeInTheDocument();
    expect(screen.getByText("Dentiste")).toBeInTheDocument();
    expect(screen.getByText("Aucune date connue")).toBeInTheDocument();
    expect(screen.getByText("Bientôt")).toBeInTheDocument();
  });
});
