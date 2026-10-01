import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BrandHeader from "../BrandHeader";

describe("BrandHeader", () => {
  it("shows the Sway lockup", () => {
    render(<BrandHeader />);
    expect(screen.getByRole("img", { name: "Sway" })).toHaveAttribute("src", "/brand/sway_logo_min.svg");
    expect(screen.getByText("Ale")).toHaveClass("text-orange");
    expect(screen.getByText("Coach équine · par Sway")).toBeInTheDocument();
  });

  it("accepts an extra class", () => {
    render(<BrandHeader className="sticky" />);
    expect(screen.getByRole("banner").className).toContain("sticky");
  });
});
