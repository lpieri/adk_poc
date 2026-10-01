import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ChatMessage } from "../../../hooks/useChat";
import MessageBubble from "../MessageBubble";

const ALE_MESSAGE: ChatMessage = {
  id: "m1",
  author: "ale",
  text: "Bonjour",
  mood: "happy",
  toolCalls: [{ name: "calculate_ration", args: {} }],
  animate: false,
};

describe("MessageBubble", () => {
  it("renders an Ale bubble with its tools", () => {
    render(<MessageBubble message={ALE_MESSAGE} text="Bonj" />);
    expect(screen.getByText("Ale")).toHaveClass("sr-only");
    expect(screen.getByText("Bonj").className).toContain("bg-neutral");
    expect(screen.getByText("Ration calculée")).toBeInTheDocument();
  });

  it("renders a user bubble without tools", () => {
    render(<MessageBubble message={{ ...ALE_MESSAGE, author: "user", toolCalls: [] }} text="Salut" />);
    expect(screen.getByText("Toi")).toBeInTheDocument();
    expect(screen.getByText("Salut").className).toContain("bg-sway-black");
    expect(screen.queryByRole("list")).toBeNull();
  });
});
