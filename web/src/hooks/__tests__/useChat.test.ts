import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fetchHistory, sendChat } from "../../api/chat";
import { ApiError } from "../../api/client";
import { SESSION_ID_KEY, useChat } from "../useChat";

vi.mock("../../api/chat", () => ({ fetchHistory: vi.fn(), sendChat: vi.fn() }));

const REPLY = { session_id: "s2", reply: "**Coucou**", mood: "happy" as const, tool_calls: [{ name: "calculate_ration", args: {} }] };

describe("useChat", () => {
  it("restores the stored conversation", async () => {
    window.localStorage.setItem(SESSION_ID_KEY, "s1");
    vi.mocked(fetchHistory).mockResolvedValue([{ author: "ale", text: "Ancien", mood: null }]);
    const { result } = renderHook(() => useChat("u1"));
    await waitFor(() => expect(result.current.messages).toHaveLength(1));
    expect(result.current.messages[0]).toMatchObject({ text: "Ancien", animate: false });
    expect(result.current.sessionId).toBe("s1");
  });

  it("forgets unknown sessions", async () => {
    window.localStorage.setItem(SESSION_ID_KEY, "gone");
    vi.mocked(fetchHistory).mockRejectedValue(new ApiError(404));
    const { result } = renderHook(() => useChat("u1"));
    await waitFor(() => expect(result.current.sessionId).toBeNull());
    expect(window.localStorage.getItem(SESSION_ID_KEY)).toBeNull();
  });

  it("keeps the session on other history errors", async () => {
    window.localStorage.setItem(SESSION_ID_KEY, "s1");
    vi.mocked(fetchHistory).mockRejectedValue(new ApiError(500));
    const { result, unmount } = renderHook(() => useChat("u1"));
    await waitFor(() => expect(fetchHistory).toHaveBeenCalled());
    expect(result.current.sessionId).toBe("s1");
    unmount();
  });

  it("sends messages and stores the new session", async () => {
    vi.mocked(sendChat).mockResolvedValue(REPLY);
    const { result } = renderHook(() => useChat("u1"));
    await act(() => result.current.send("  "));
    expect(sendChat).not.toHaveBeenCalled();
    await act(() => result.current.send(" Salut "));
    expect(sendChat).toHaveBeenCalledWith("u1", null, "Salut");
    expect(result.current.messages.map((message) => message.text)).toEqual(["Salut", "Coucou"]);
    expect(result.current.messages[1]).toMatchObject({ mood: "happy", animate: true });
    expect(window.localStorage.getItem(SESSION_ID_KEY)).toBe("s2");
  });

  it("retries without the session when it expired", async () => {
    window.localStorage.setItem(SESSION_ID_KEY, "old");
    vi.mocked(fetchHistory).mockResolvedValue([]);
    vi.mocked(sendChat).mockRejectedValueOnce(new ApiError(404)).mockResolvedValueOnce(REPLY);
    const { result } = renderHook(() => useChat("u1"));
    await act(() => result.current.send("Salut"));
    expect(sendChat).toHaveBeenLastCalledWith("u1", null, "Salut");
    expect(result.current.sessionId).toBe("s2");
  });

  it("flags errors, receives wakeups and resets", async () => {
    vi.mocked(sendChat).mockRejectedValue(new ApiError(500));
    const { result } = renderHook(() => useChat("u1"));
    await act(() => result.current.send("Salut"));
    expect(result.current.error).toBe(true);
    expect(result.current.pending).toBe(false);
    act(() => result.current.receive("s9", "Te voilà !", "surprised"));
    expect(result.current.sessionId).toBe("s9");
    expect(result.current.messages.at(-1)).toMatchObject({ author: "ale", text: "Te voilà !", mood: "surprised" });
    act(() => result.current.reset());
    expect(result.current).toMatchObject({ messages: [], sessionId: null, error: false });
  });

  it("does not override messages typed before the history arrives", async () => {
    window.localStorage.setItem(SESSION_ID_KEY, "s1");
    let resolveHistory: (value: []) => void = () => undefined;
    vi.mocked(fetchHistory).mockReturnValue(new Promise((resolve) => (resolveHistory = resolve)));
    const { result } = renderHook(() => useChat("u1"));
    act(() => result.current.receive("s1", "Bonjour", "idle"));
    await act(async () => resolveHistory([]));
    expect(result.current.messages).toHaveLength(1);
  });

  it("ignores a history that arrives after unmounting", async () => {
    window.localStorage.setItem(SESSION_ID_KEY, "s1");
    let resolveHistory: (value: { author: "ale"; text: string; mood: null }[]) => void = () => undefined;
    vi.mocked(fetchHistory).mockReturnValue(new Promise((resolve) => (resolveHistory = resolve)));
    const { result, unmount } = renderHook(() => useChat("u1"));
    unmount();
    await act(async () => resolveHistory([{ author: "ale", text: "Tard", mood: null }]));
    expect(result.current.messages).toEqual([]);
  });
});
