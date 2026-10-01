import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CareStatusChip from "../CareStatusChip";

describe("CareStatusChip", () => {
  it.each([
    ["overdue", "En retard", "bg-orange-soft"],
    ["due_soon", "Bientôt", "bg-purple-soft"],
    ["ok", "À jour", "bg-green-soft"],
    ["unknown", "Inconnu", "bg-greige"],
  ] as const)("renders the %s status with a dot", (status, label, tone) => {
    render(<CareStatusChip status={status} />);
    const pill = screen.getByText(label);
    expect(pill.className).toContain(tone);
    expect(pill.querySelector("span")).toBeInTheDocument();
  });
});
