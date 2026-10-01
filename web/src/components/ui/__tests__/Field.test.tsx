import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Field from "../Field";

describe("Field", () => {
  it("labels its child input", () => {
    render(
      <Field label="Nom">
        <input />
      </Field>,
    );
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
  });

  it("accepts an extra class", () => {
    const { container } = render(
      <Field label="Poids" className="flex-1">
        <input />
      </Field>,
    );
    expect(container.querySelector("label")?.className).toContain("flex-1");
  });
});
