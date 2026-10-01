import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { clearMatchMedia, mockReducedMotion } from "../../test/media";
import { usePersistentToggle } from "../usePersistentToggle";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";
import { USER_ID_KEY, useUserId } from "../useUserId";

describe("browser hooks", () => {
  afterEach(() => {
    clearMatchMedia();
  });

  it("creates then reuses a stable user id", () => {
    const first = renderHook(() => useUserId()).result.current;
    expect(window.localStorage.getItem(USER_ID_KEY)).toBe(first);
    expect(renderHook(() => useUserId()).result.current).toBe(first);
  });

  it("persists a toggle", () => {
    const { result } = renderHook(() => usePersistentToggle("flag"));
    expect(result.current[0]).toBe(false);
    act(() => result.current[1](true));
    expect(result.current[0]).toBe(true);
    expect(renderHook(() => usePersistentToggle("flag")).result.current[0]).toBe(true);
  });

  it("follows the reduced motion preference", () => {
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(false);
    mockReducedMotion(true);
    const { result, unmount } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
    const query = vi.mocked(window.matchMedia).mock.results.at(-1)?.value as { addEventListener: ReturnType<typeof vi.fn>; matches: boolean };
    query.matches = false;
    act(() => (query.addEventListener.mock.calls[0][1] as () => void)());
    expect(result.current).toBe(false);
    unmount();
  });
});
