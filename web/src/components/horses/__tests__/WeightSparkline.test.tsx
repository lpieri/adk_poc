import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DETAIL } from "../../../test/fixtures";
import WeightSparkline from "../WeightSparkline";

describe("WeightSparkline", () => {
  it("needs at least two weights", () => {
    const { container } = render(<WeightSparkline weights={DETAIL.weights.slice(0, 1)} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("draws the weight curve", () => {
    const { container } = render(<WeightSparkline weights={DETAIL.weights} />);
    expect(screen.getByRole("img", { name: "Évolution du poids" })).toBeInTheDocument();
    expect(container.querySelector("polyline")?.getAttribute("points")).toBe("8.0,64.0 292.0,8.0");
    expect(container.querySelector("circle")).toHaveAttribute("cx", "292.0");
  });
});
