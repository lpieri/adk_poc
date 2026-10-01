import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BARE_RATION, RATION } from "../../../test/fixtures";
import RationCard from "../RationCard";

describe("RationCard", () => {
  it("shows the full ration with advice and warnings", () => {
    render(<RationCard ration={RATION} />);
    expect(screen.getByText("11 kg")).toBeInTheDocument();
    expect(screen.getByText("1,5 kg · Floconné sans céréales")).toBeInTheDocument();
    expect(screen.getByText("200 g")).toBeInTheDocument();
    expect(screen.getByText("25 à 40 L")).toBeInTheDocument();
    expect(screen.getByText("Foin à volonté")).toBeInTheDocument();
    expect(screen.getByText("Fractionner les repas")).toBeInTheDocument();
    expect(screen.getByText("Éviter les céréales")).toBeInTheDocument();
  });

  it("hides the optional parts", () => {
    render(<RationCard ration={BARE_RATION} />);
    expect(screen.queryByText("Amidon max. par repas")).toBeNull();
    expect(screen.queryByText("Conseils")).toBeNull();
    expect(screen.queryByText("Points de vigilance")).toBeNull();
  });
});
