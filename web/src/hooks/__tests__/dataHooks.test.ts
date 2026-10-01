import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fetchConditions } from "../../api/conditions";
import { addHealthEntry, addWeight, addWorkout, deleteHealthEntry } from "../../api/horseRecords";
import { createHorse, deleteHorse, fetchHorseDetail, fetchHorses, updateHorse } from "../../api/horses";
import { createPlace, deletePlace, fetchPlaces } from "../../api/places";
import { DETAIL, HORSE, PLACE } from "../../test/fixtures";
import { useConditions } from "../useConditions";
import { useHorseDetail } from "../useHorseDetail";
import { useHorses } from "../useHorses";
import { usePlaces } from "../usePlaces";

vi.mock("../../api/conditions", () => ({ fetchConditions: vi.fn() }));
vi.mock("../../api/horses", () => ({
  fetchHorses: vi.fn(),
  fetchHorseDetail: vi.fn(),
  createHorse: vi.fn(),
  updateHorse: vi.fn(),
  deleteHorse: vi.fn(),
}));
vi.mock("../../api/horseRecords", () => ({ addHealthEntry: vi.fn(), deleteHealthEntry: vi.fn(), addWeight: vi.fn(), addWorkout: vi.fn() }));
vi.mock("../../api/places", () => ({ fetchPlaces: vi.fn(), createPlace: vi.fn(), deletePlace: vi.fn() }));

describe("data hooks", () => {
  it("loads conditions and labels them", async () => {
    vi.mocked(fetchConditions).mockResolvedValue([{ code: "ems", label: "SME (API)", summary: "" }]);
    const { result } = renderHook(() => useConditions());
    await waitFor(() => expect(result.current.conditions).toHaveLength(1));
    expect(result.current.labelFor("ems")).toBe("SME (API)");
    expect(result.current.labelFor("ppid")).toBe("Cushing (PPID)");
    expect(result.current.labelFor("zzz")).toBe("zzz");
  });

  it("falls back to known conditions", async () => {
    vi.mocked(fetchConditions).mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useConditions());
    await waitFor(() => expect(result.current.conditions).toHaveLength(9));
    expect(result.current.labelFor("laminitis")).toBe("Fourbure");
  });

  it("loads and creates horses", async () => {
    vi.mocked(fetchHorses).mockResolvedValue([HORSE]);
    vi.mocked(createHorse).mockResolvedValueOnce(HORSE).mockRejectedValueOnce(new Error("bad"));
    const { result } = renderHook(() => useHorses("u1"));
    await waitFor(() => expect(result.current.horses).toEqual([HORSE]));
    await act(async () => expect(await result.current.create(HORSE)).toEqual(HORSE));
    expect(fetchHorses).toHaveBeenCalledTimes(2);
    await act(async () => expect(await result.current.create(HORSE)).toBeNull());
  });

  it("loads a horse and runs its actions", async () => {
    vi.mocked(fetchHorseDetail).mockResolvedValue(DETAIL);
    vi.mocked(updateHorse).mockRejectedValue(new Error("bad"));
    vi.mocked(deleteHorse).mockResolvedValue(undefined);
    const { result } = renderHook(() => useHorseDetail("u1", "h1"));
    await waitFor(() => expect(result.current.detail).toEqual(DETAIL));
    const { actions } = result.current;
    await act(async () => {
      expect(await actions.update(HORSE)).toBe(false);
      expect(await actions.remove()).toBe(true);
      expect(await actions.addHealth(DETAIL.health[0])).toBe(true);
      expect(await actions.deleteHealth("e1")).toBe(true);
      expect(await actions.addWeight(500)).toBe(true);
      expect(await actions.addWorkout(DETAIL.workouts[0])).toBe(true);
    });
    expect(addHealthEntry).toHaveBeenCalledWith("u1", "h1", DETAIL.health[0]);
    expect(deleteHealthEntry).toHaveBeenCalledWith("u1", "h1", "e1");
    expect(addWeight).toHaveBeenCalledWith("u1", "h1", 500);
    expect(addWorkout).toHaveBeenCalledWith("u1", "h1", DETAIL.workouts[0]);
  });

  it("flags loading errors", async () => {
    vi.mocked(fetchHorseDetail).mockRejectedValue(new Error("bad"));
    const { result } = renderHook(() => useHorseDetail("u1", "h1"));
    await waitFor(() => expect(result.current.error).toBe(true));
    expect(result.current.detail).toBeNull();
  });

  it("manages places", async () => {
    vi.mocked(fetchPlaces).mockResolvedValue([PLACE]);
    vi.mocked(createPlace).mockResolvedValue(PLACE);
    vi.mocked(deletePlace).mockRejectedValue(new Error("bad"));
    const { result } = renderHook(() => usePlaces("u1"));
    await waitFor(() => expect(result.current.places).toEqual([PLACE]));
    await act(async () => expect(await result.current.create(PLACE)).toBe(true));
    await act(async () => expect(await result.current.remove("p1")).toBe(false));
  });
});
