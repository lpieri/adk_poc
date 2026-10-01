import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ChatMessage } from "../../../hooks/useChat";
import { makeChatState } from "../../../test/fixtures";
import { clearMatchMedia, mockReducedMotion } from "../../../test/media";
import ChatScreen from "../ChatScreen";

const MESSAGES: ChatMessage[] = [
  { id: "u1", author: "user", text: "Coucou", mood: null, toolCalls: [], animate: false },
  { id: "a1", author: "ale", text: "Bonjour toi !", mood: "happy", toolCalls: [], animate: true },
];

describe("ChatScreen", () => {
  afterEach(() => {
    clearMatchMedia();
  });

  it("shows the hero when the conversation is empty and sends suggestions", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo");
    const chat = makeChatState();
    render(<ChatScreen chat={chat} active />);
    expect(screen.getByRole("heading", { name: "Salut, moi c'est Ale" })).toBeInTheDocument();
    expect(scrollTo).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Quels soins sont à prévoir ?" }));
    expect(chat.send).toHaveBeenCalledWith("Quels soins sont à prévoir ?");
  });

  it("types Ale's latest reply then settles", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo");
    render(<ChatScreen chat={makeChatState({ messages: MESSAGES })} active />);
    expect(screen.getByText("Ale répond…")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Bonjour toi !")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Prête à t'aider")).toBeInTheDocument());
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
  });

  it("shows the full reply instantly when motion is reduced", () => {
    mockReducedMotion(true);
    const scrollTo = vi.spyOn(window, "scrollTo");
    render(<ChatScreen chat={makeChatState({ messages: MESSAGES, pending: true })} active />);
    expect(screen.getByText("Bonjour toi !")).toBeInTheDocument();
    expect(screen.getByText("Ale réfléchit…")).toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "auto" }));
  });

  it("stays hidden and still when inactive, and reports errors", () => {
    const scrollTo = vi.spyOn(window, "scrollTo");
    const { container } = render(<ChatScreen chat={makeChatState({ error: true })} active={false} />);
    expect(container.querySelector("section")).toHaveClass("hidden");
    expect(scrollTo).not.toHaveBeenCalled();
    expect(screen.getByRole("alert", { hidden: true })).toHaveTextContent("Ale n'a pas pu répondre");
  });
});
