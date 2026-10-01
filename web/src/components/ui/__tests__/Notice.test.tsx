import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Notice from "../Notice";

describe("Notice", () => {
  it("is a muted status by default", () => {
    render(<Notice>Rien</Notice>);
    expect(screen.getByRole("status")).toHaveTextContent("Rien");
  });

  it("is an alert in the danger tone", () => {
    render(<Notice tone="danger">Erreur</Notice>);
    expect(screen.getByRole("alert")).toHaveTextContent("Erreur");
  });
});
