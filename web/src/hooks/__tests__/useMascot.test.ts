import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BLINK_DURATION_MS, BLINK_MIN_DELAY_MS, TALK_INTERVAL_MS, useMascot } from "../useMascot";

describe("useMascot", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("thinks while pending", () => {
    const { result } = renderHook(() => useMascot({ mood: "happy", pending: true, speaking: true }));
    expect(result.current).toBe("thinking");
  });

  it("alternates mouth frames while speaking", () => {
    const { result, rerender } = renderHook((props) => useMascot(props), {
      initialProps: { mood: "worried" as const, pending: false, speaking: true },
    });
    expect(result.current).toBe("worried");
    act(() => vi.advanceTimersByTime(TALK_INTERVAL_MS));
    expect(result.current).toBe("worried_talk");
    act(() => vi.advanceTimersByTime(TALK_INTERVAL_MS));
    expect(result.current).toBe("worried");
    act(() => vi.advanceTimersByTime(TALK_INTERVAL_MS));
    rerender({ mood: "worried", pending: false, speaking: false });
    expect(result.current).toBe("worried");
  });

  it("blinks from time to time while resting", () => {
    const { result, unmount } = renderHook(() => useMascot({ mood: "idle", pending: false, speaking: false }));
    expect(result.current).toBe("idle");
    act(() => vi.advanceTimersByTime(BLINK_MIN_DELAY_MS));
    expect(result.current).toBe("blink");
    act(() => vi.advanceTimersByTime(BLINK_DURATION_MS));
    expect(result.current).toBe("idle");
    act(() => vi.advanceTimersByTime(BLINK_MIN_DELAY_MS));
    expect(result.current).toBe("blink");
    unmount();
  });
});
