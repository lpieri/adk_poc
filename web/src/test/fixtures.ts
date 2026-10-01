import type { HorseDetailState } from "../hooks/useHorseDetail";
import type { ChatState } from "../hooks/useChat";
import type { Horse, HorseDetail, Place, Ration } from "../api/types";
import { vi } from "vitest";

export const HORSE: Horse = {
  id: "h1",
  owner_id: "u1",
  created_at: "2026-01-01T00:00:00Z",
  name: "Tornade",
  breed: "Selle Français",
  sex: "mare",
  birth_year: 2015,
  weight_kg: 550,
  body_condition: 6,
  workload: "moderate",
  conditions: ["pssm1"],
  notes: "Gourmande",
};

export const BARE_HORSE: Horse = {
  ...HORSE,
  id: "h2",
  name: "bijou",
  breed: "",
  sex: "gelding",
  birth_year: null,
  body_condition: null,
  conditions: [],
  notes: "",
};

export const RATION: Ration = {
  weight_kg: 550,
  workload: "moderate",
  conditions: ["pssm1"],
  forage_kg: 11,
  forage_advice: "Foin à volonté",
  concentrate_kg: 1.5,
  concentrate_type: "Floconné sans céréales",
  meals_per_day: 3,
  max_concentrate_per_meal_kg: 0.5,
  starch_cap_g_per_meal: 200,
  oil_ml: 250,
  vitamin_e_iu: 2000,
  salt_g: 30,
  water_liters: [25, 40],
  advice: ["Fractionner les repas"],
  warnings: ["Éviter les céréales"],
};

export const BARE_RATION: Ration = {
  ...RATION,
  forage_advice: "",
  starch_cap_g_per_meal: null,
  advice: [],
  warnings: [],
};

export const DETAIL: HorseDetail = {
  horse: HORSE,
  health: [
    { id: "e1", horse_id: "h1", kind: "vaccine", date: "2026-03-01", label: "Grippe", next_due: "2026-09-01", notes: "RAS" },
    { id: "e2", horse_id: "h1", kind: "farrier", date: "2026-05-01", label: "Parage", next_due: null, notes: "" },
  ],
  weights: [
    { id: "w1", horse_id: "h1", date: "2026-01-01", weight_kg: 540 },
    { id: "w2", horse_id: "h1", date: "2026-02-01", weight_kg: 550 },
  ],
  workouts: [
    { id: "k1", horse_id: "h1", date: "2026-05-02T10:00:00Z", discipline: "jumping", duration_min: 40, intensity: "intense", notes: "" },
  ],
  due_care: [
    { kind: "vaccine", label: "Vaccin grippe", due_date: "2026-09-01", status: "due_soon", days_left: 10 },
    { kind: "dentist", label: "", due_date: null, status: "unknown", days_left: null },
  ],
  ration: RATION,
};

export const PLACE: Place = {
  id: "p1",
  owner_id: "u1",
  name: "Écurie des Saules",
  kind: "stable",
  lat: 48.85661,
  lng: 2.35222,
  radius_m: 150,
};

export const labelFor = (code: string): string => `label:${code}`;

export const makeChatState = (overrides: Partial<ChatState> = {}): ChatState => {
  return {
    messages: [],
    sessionId: null,
    pending: false,
    error: false,
    send: vi.fn(async () => undefined),
    receive: vi.fn(),
    reset: vi.fn(),
    ...overrides,
  };
};

export const makeDetailActions = (ok = true): HorseDetailState["actions"] => {
  return {
    update: vi.fn(async () => ok),
    remove: vi.fn(async () => ok),
    addHealth: vi.fn(async () => ok),
    deleteHealth: vi.fn(async () => ok),
    addWeight: vi.fn(async () => ok),
    addWorkout: vi.fn(async () => ok),
  };
};

export const jsonResponse = (body: unknown, status = 200): Response => {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};
