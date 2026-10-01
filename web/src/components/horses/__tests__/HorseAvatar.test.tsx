import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HorseAvatar from "../HorseAvatar";

describe("HorseAvatar", () => {
  it("shows the capitalised initial", () => {
    const { container } = render(<HorseAvatar name="bijou" />);
    expect(container.textContent).toBe("B");
    expect(container.firstElementChild?.className).toContain("h-14");
  });

  it("can be large", () => {
    const { container } = render(<HorseAvatar name="Tornade" large />);
    expect(container.firstElementChild?.className).toContain("h-16");
  });
});
