import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ChatHero from "../ChatHero";

describe("ChatHero", () => {
  it("greets the user with the big mascot and suggestions", async () => {
    const handleSuggestion = vi.fn();
    render(<ChatHero frame="blink" onSuggestion={handleSuggestion} />);
    expect(screen.getByRole("heading", { name: "Salut, moi c'est Ale" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Ale/ })).toHaveAttribute("data-frame", "blink");
    await userEvent.click(screen.getByRole("button", { name: "Calcule la ration de mon cheval" }));
    expect(handleSuggestion).toHaveBeenCalledWith("Calcule la ration de mon cheval");
  });
});
