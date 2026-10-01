import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MiniStat from "../MiniStat";

describe("MiniStat", () => {
  it("renders a compact stat", () => {
    render(
      <dl>
        <MiniStat label="Âge" value="11 ans" />
      </dl>,
    );
    expect(screen.getByText("Âge").tagName).toBe("DT");
    expect(screen.getByText("11 ans").tagName).toBe("DD");
  });
});
