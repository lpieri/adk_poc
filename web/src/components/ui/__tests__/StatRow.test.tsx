import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatRow from "../StatRow";

describe("StatRow", () => {
  it("renders a label and its value", () => {
    render(
      <dl>
        <StatRow label="Poids" value="550 kg" />
      </dl>,
    );
    expect(screen.getByText("Poids").tagName).toBe("DT");
    expect(screen.getByText("550 kg").tagName).toBe("DD");
  });
});
