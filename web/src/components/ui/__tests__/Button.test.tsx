import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from "../Button";

describe("Button", () => {
  it("renders a primary button by default and handles clicks", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Go</Button>);
    const button = screen.getByRole("button", { name: "Go" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.className).toContain("bg-sway-black");
    expect(button.className).toContain("px-8");
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant, size, type, label and extra classes", () => {
    render(
      <Button variant="danger" size="sm" type="submit" ariaLabel="Supprimer" className="extra" disabled>
        x
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Supprimer" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();
    expect(button.className).toContain("bg-orange-soft");
    expect(button.className).toContain("px-4");
    expect(button.className).toContain("extra");
  });
});
