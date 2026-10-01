import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ChatHeader from "../ChatHeader";

describe("ChatHeader", () => {
  it("shows the thinking status and a bobbing avatar while pending", () => {
    render(<ChatHeader frame="thinking" pending speaking={false} onReset={vi.fn()} />);
    expect(screen.getByText("Ale réfléchit…")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Ale/ }).className).toContain("animate-bob");
  });

  it("shows the talking status", () => {
    render(<ChatHeader frame="idle_talk" pending={false} speaking onReset={vi.fn()} />);
    expect(screen.getByText("Ale répond…")).toBeInTheDocument();
  });

  it("shows the idle status and resets the conversation", async () => {
    const handleReset = vi.fn();
    render(<ChatHeader frame="idle" pending={false} speaking={false} onReset={handleReset} />);
    expect(screen.getByText("Prête à t'aider")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Nouvelle conversation" }));
    expect(handleReset).toHaveBeenCalled();
  });
});
