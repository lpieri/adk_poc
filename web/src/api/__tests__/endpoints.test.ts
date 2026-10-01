import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { jsonResponse } from "../../test/fixtures";
import { fetchHistory, sendChat } from "../chat";
import { fetchConditions } from "../conditions";
import { addHealthEntry, addWeight, addWorkout, deleteHealthEntry } from "../horseRecords";
import { createHorse, deleteHorse, fetchHorseDetail, fetchHorses, updateHorse } from "../horses";
import { createPlace, deletePlace, fetchPlaces } from "../places";
import { postPresence, postWakeup } from "../wakeup";

let fetchMock: Mock;

const lastCall = (): { url: string; method: string; body: unknown } => {
  const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
  return { url, method: String(init.method), body: init.body ? JSON.parse(String(init.body)) : undefined };
};

describe("api endpoints", () => {
  beforeEach(() => {
    fetchMock = vi.fn(async () => jsonResponse({}));
    vi.stubGlobal("fetch", fetchMock);
  });

  it("talks to the chat endpoints", async () => {
    await sendChat("u1", null, "Salut");
    expect(lastCall()).toEqual({ url: "/api/chat", method: "POST", body: { user_id: "u1", session_id: null, message: "Salut" } });
    await fetchHistory("u 1", "s/1");
    expect(lastCall().url).toBe("/api/sessions/u%201/s%2F1");
    await fetchConditions();
    expect(lastCall().url).toBe("/api/conditions");
  });

  it("talks to the horse endpoints", async () => {
    const input = { name: "T", breed: "", sex: "mare" as const, birth_year: null, weight_kg: 500, body_condition: 5, workload: "light" as const, conditions: [], notes: "" };
    await fetchHorses("u1");
    expect(lastCall().url).toBe("/api/horses?user_id=u1");
    await fetchHorseDetail("u1", "h1");
    expect(lastCall().url).toBe("/api/horses/h1?user_id=u1");
    await createHorse("u1", input);
    expect(lastCall()).toEqual({ url: "/api/horses", method: "POST", body: { user_id: "u1", ...input } });
    await updateHorse("u1", "h1", input);
    expect(lastCall()).toMatchObject({ url: "/api/horses/h1", method: "PUT" });
    await deleteHorse("u1", "h1");
    expect(lastCall()).toMatchObject({ url: "/api/horses/h1?user_id=u1", method: "DELETE" });
  });

  it("talks to the horse record endpoints", async () => {
    await addHealthEntry("u1", "h1", { kind: "vet", date: "2026-01-01", label: "Visite", next_due: null, notes: "" });
    expect(lastCall()).toMatchObject({ url: "/api/horses/h1/health", method: "POST", body: { user_id: "u1", kind: "vet" } });
    await deleteHealthEntry("u1", "h1", "e1");
    expect(lastCall()).toMatchObject({ url: "/api/horses/h1/health/e1?user_id=u1", method: "DELETE" });
    await addWeight("u1", "h1", 510);
    expect(lastCall()).toEqual({ url: "/api/horses/h1/weights", method: "POST", body: { user_id: "u1", weight_kg: 510 } });
    await addWorkout("u1", "h1", { discipline: "hack", duration_min: 30, intensity: "light", notes: "" });
    expect(lastCall()).toMatchObject({ url: "/api/horses/h1/workouts", body: { discipline: "hack" } });
  });

  it("talks to the place and wakeup endpoints", async () => {
    await fetchPlaces("u1");
    expect(lastCall().url).toBe("/api/places?user_id=u1");
    await createPlace("u1", { name: "E", kind: "stable", lat: 1, lng: 2, radius_m: 100 });
    expect(lastCall()).toMatchObject({ url: "/api/places", method: "POST", body: { user_id: "u1", lat: 1 } });
    await deletePlace("u1", "p1");
    expect(lastCall()).toMatchObject({ url: "/api/places/p1?user_id=u1", method: "DELETE" });
    await postPresence({ userId: "u1", sessionId: "s1", lat: 1, lng: 2 });
    expect(lastCall()).toEqual({ url: "/api/presence", method: "POST", body: { user_id: "u1", session_id: "s1", lat: 1, lng: 2 } });
    await postWakeup("u1", null, "p1");
    expect(lastCall()).toEqual({ url: "/api/wakeup", method: "POST", body: { user_id: "u1", session_id: null, place_id: "p1" } });
  });
});
