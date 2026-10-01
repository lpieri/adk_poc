import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TypingBubble from "../TypingBubble";

describe("TypingBubble", () => {
  it("announces that Ale is typing with three dots", () => {
    const { container } = render(<TypingBubble />);
    expect(screen.getByRole("status", { name: "Ale est en train d'écrire" })).toBeInTheDocument();
    expect(container.querySelectorAll("span")).toHaveLength(3);
  });

  it("accepts an extra class", () => {
    render(<TypingBubble className="mt-2" />);
    expect(screen.getByRole("status").className).toContain("mt-2");
  });
});
