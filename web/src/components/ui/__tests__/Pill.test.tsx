import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Pill from "../Pill";

describe("Pill", () => {
  it("is purple without a dot by default", () => {
    render(<Pill>PSSM1</Pill>);
    const pill = screen.getByText("PSSM1");
    expect(pill.className).toContain("bg-purple-soft");
    expect(pill.querySelector("span")).toBeNull();
  });

  it("applies the requested tone and dot", () => {
    render(
      <Pill tone="green" dot>
        À jour
      </Pill>,
    );
    const pill = screen.getByText("À jour");
    expect(pill.className).toContain("bg-green-soft");
    expect(pill.querySelector("span")?.className).toContain("bg-green");
  });
});
