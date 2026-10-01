import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { postPresence, postWakeup } from "../../api/wakeup";
import { PLACE } from "../../test/fixtures";
import { clearGeolocation, makePosition, mockGeolocation } from "../../test/geo";
import { PRESENCE_INTERVAL_MS, useGeoWakeup } from "../useGeoWakeup";

vi.mock("../../api/wakeup", () => ({ postPresence: vi.fn(), postWakeup: vi.fn() }));

const TRIGGERED = { triggered: true, place: PLACE, session_id: "s1", reply: "Hello", mood: "happy" as const };
const QUIET = { triggered: false, place: null, session_id: null, reply: null, mood: null };

describe("useGeoWakeup", () => {
  afterEach(() => {
    clearGeolocation();
  });

  it("does nothing when disabled or unsupported", () => {
    const onWakeup = vi.fn();
    renderHook(() => useGeoWakeup({ userId: "u1", sessionId: null, enabled: true, onWakeup }));
    const watchPosition = vi.fn();
    mockGeolocation({ watchPosition });
    renderHook(() => useGeoWakeup({ userId: "u1", sessionId: null, enabled: false, onWakeup }));
    expect(watchPosition).not.toHaveBeenCalled();
  });

  it("reports positions at most once a minute and wakes Ale up", async () => {
    let emit: (position: GeolocationPosition) => void = () => undefined;
    const clearWatch = vi.fn();
    const watchPosition = vi.fn((success: PositionCallback, error?: PositionErrorCallback | null) => {
      emit = success;
      error?.({} as GeolocationPositionError);
      return 7;
    });
    mockGeolocation({ watchPosition, clearWatch });
    vi.mocked(postPresence).mockResolvedValueOnce(QUIET).mockResolvedValueOnce(TRIGGERED).mockRejectedValueOnce(new Error("offline"));
    const now = vi.spyOn(Date, "now").mockReturnValue(PRESENCE_INTERVAL_MS);
    const onWakeup = vi.fn();
    const { unmount } = renderHook(() => useGeoWakeup({ userId: "u1", sessionId: "s0", enabled: true, onWakeup }));
    expect(watchPosition).toHaveBeenCalledWith(expect.any(Function), expect.any(Function), { enableHighAccuracy: false, maximumAge: PRESENCE_INTERVAL_MS });
    await act(async () => emit(makePosition(1, 2)));
    await act(async () => emit(makePosition(1, 2)));
    expect(postPresence).toHaveBeenCalledTimes(1);
    expect(postPresence).toHaveBeenCalledWith({ userId: "u1", sessionId: "s0", lat: 1, lng: 2 });
    expect(onWakeup).not.toHaveBeenCalled();
    now.mockReturnValue(PRESENCE_INTERVAL_MS * 2);
    await act(async () => emit(makePosition(3, 4)));
    expect(onWakeup).toHaveBeenCalledWith(TRIGGERED);
    now.mockReturnValue(PRESENCE_INTERVAL_MS * 3);
    await act(async () => emit(makePosition(3, 4)));
    expect(onWakeup).toHaveBeenCalledTimes(1);
    unmount();
    expect(clearWatch).toHaveBeenCalledWith(7);
  });

  it("simulates an arrival", async () => {
    vi.mocked(postWakeup).mockResolvedValueOnce(TRIGGERED).mockRejectedValueOnce(new Error("offline"));
    const onWakeup = vi.fn();
    const { result } = renderHook(() => useGeoWakeup({ userId: "u1", sessionId: "s0", enabled: false, onWakeup }));
    await expect(result.current.simulate("p1")).resolves.toBe(true);
    expect(postWakeup).toHaveBeenCalledWith("u1", "s0", "p1");
    expect(onWakeup).toHaveBeenCalledWith(TRIGGERED);
    await expect(result.current.simulate("p1")).resolves.toBe(false);
  });
});
