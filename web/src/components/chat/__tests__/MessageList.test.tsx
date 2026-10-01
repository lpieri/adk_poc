import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ChatMessage } from "../../../hooks/useChat";
import MessageList from "../MessageList";

const MESSAGES: ChatMessage[] = [
  { id: "u1", author: "user", text: "Question", mood: null, toolCalls: [], animate: false },
  { id: "a1", author: "ale", text: "Réponse complète", mood: "idle", toolCalls: [], animate: true },
];

describe("MessageList", () => {
  it("uses the typewriter text for the speaking message", () => {
    render(<MessageList messages={MESSAGES} speakingId="a1" speakingText="Répo" pending={false} />);
    expect(screen.getByText("Question")).toBeInTheDocument();
    expect(screen.getByText("Répo")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("shows the typing bubble while pending", () => {
    render(<MessageList messages={MESSAGES} speakingId="" speakingText="" pending />);
    expect(screen.getByText("Réponse complète")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Ale est en train d'écrire" })).toBeInTheDocument();
  });
});
