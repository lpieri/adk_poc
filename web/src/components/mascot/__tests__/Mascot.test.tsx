import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Mascot from "../Mascot";

const findImage = (container: HTMLElement, name: string): HTMLImageElement => {
  return container.querySelector(`img[src="/mascot/${name}.webp"]`) as HTMLImageElement;
};

describe("Mascot", () => {
  it("stacks every frame and only shows the requested one", () => {
    const { container } = render(<Mascot frame="happy" size="hero" />);
    const mascot = screen.getByRole("img", { name: "Ale, la licorne dorée en sweat rose" });
    expect(mascot).toHaveAttribute("data-frame", "happy");
    expect(mascot.className).not.toContain("animate-bob");
    expect(container.querySelectorAll("img")).toHaveLength(9);
    expect(findImage(container, "happy").style.opacity).toBe("1");
    expect(findImage(container, "idle").style.opacity).toBe("0");
  });

  it("bobs when asked to", () => {
    render(<Mascot frame="thinking" size="avatar" bob />);
    expect(screen.getByRole("img").className).toContain("animate-bob");
  });

  it("falls back to idle, then to the reference picture, when frames fail", () => {
    const { container } = render(<Mascot frame="worried" size="avatar" />);
    fireEvent.error(findImage(container, "worried"));
    expect(screen.getByRole("img")).toHaveAttribute("data-frame", "idle");
    fireEvent.error(findImage(container, "idle"));
    expect(screen.getByRole("img")).toHaveAttribute("data-frame", "fallback");
    expect(container.querySelector("img[src='/mascot/reference.webp']")).toBeInTheDocument();
  });
});
