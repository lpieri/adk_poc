import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SectionHeader from "../SectionHeader";

describe("SectionHeader", () => {
  it("renders only the title when nothing else is given", () => {
    const { container } = render(<SectionHeader title="Titre" />);
    expect(screen.getByRole("heading", { name: "Titre" })).toBeInTheDocument();
    expect(container.querySelector("p")).toBeNull();
  });

  it("renders the subtitle and the action", () => {
    render(<SectionHeader title="Titre" subtitle="Sous-titre" action={<button type="button">Action</button>} />);
    expect(screen.getByText("Sous-titre")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("renders a page title when large", () => {
    render(<SectionHeader title="Mes chevaux" large />);
    expect(screen.getByRole("heading", { level: 1, name: "Mes chevaux" }).className).toContain("text-3xl");
  });
});
