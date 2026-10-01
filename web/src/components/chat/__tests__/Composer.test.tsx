import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Composer from "../Composer";

describe("Composer", () => {
  it("sends the typed message and clears the input", async () => {
    const handleSend = vi.fn();
    render(<Composer disabled={false} onSend={handleSend} />);
    const input = screen.getByRole("textbox", { name: "Écris à Ale…" });
    const send = screen.getByRole("button", { name: "Envoyer" });
    expect(send).toBeDisabled();
    await userEvent.type(input, "Bonjour Ale{Enter}");
    expect(handleSend).toHaveBeenCalledWith("Bonjour Ale");
    expect(input).toHaveValue("");
  });

  it("disables sending while Ale is busy", async () => {
    render(<Composer disabled onSend={vi.fn()} />);
    await userEvent.type(screen.getByRole("textbox"), "Coucou");
    expect(screen.getByRole("button", { name: "Envoyer" })).toBeDisabled();
  });
});
