import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TYPE_TICK_MS, useTypewriter } from "../useTypewriter";

describe("useTypewriter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("reveals the text progressively", () => {
    const { result } = renderHook(() => useTypewriter("a", "Bonjour", true));
    expect(result.current).toEqual({ visibleText: "", done: false });
    act(() => vi.advanceTimersByTime(TYPE_TICK_MS));
    expect(result.current.visibleText).toBe("Bo");
    act(() => vi.advanceTimersByTime(TYPE_TICK_MS * 4));
    expect(result.current).toEqual({ visibleText: "Bonjour", done: true });
  });

  it("restarts for a new message and shows everything when disabled", () => {
    const { result, rerender } = renderHook((props) => useTypewriter(props.key, props.text, props.enabled), {
      initialProps: { key: "a", text: "Salut", enabled: true },
    });
    act(() => vi.advanceTimersByTime(TYPE_TICK_MS * 3));
    expect(result.current.done).toBe(true);
    rerender({ key: "b", text: "Re", enabled: true });
    expect(result.current.visibleText).toBe("");
    rerender({ key: "b", text: "Re", enabled: false });
    expect(result.current).toEqual({ visibleText: "Re", done: true });
  });
});
