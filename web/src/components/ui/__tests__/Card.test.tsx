import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Card from "../Card";

describe("Card", () => {
  it("is a neutral hairline panel by default", () => {
    render(<Card>contenu</Card>);
    expect(screen.getByText("contenu").className).toContain("bg-neutral");
  });

  it("applies a custom tone and class", () => {
    render(
      <Card tone="glow" className="custom">
        lueur
      </Card>,
    );
    const card = screen.getByText("lueur");
    expect(card.className).toContain("sway-panel-glow");
    expect(card.className).toContain("custom");
  });
});
