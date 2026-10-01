export type Mood = "idle" | "happy" | "thinking" | "worried" | "surprised";

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

export interface ChatResponse {
  session_id: string;
  reply: string;
  mood: Mood;
  tool_calls: ToolCall[];
}

export type Author = "user" | "ale";

export interface HistoryMessage {
  author: Author;
  text: string;
  mood: Mood | null;
}

export type Sex = "mare" | "gelding" | "stallion";

export type Workload = "rest" | "light" | "moderate" | "intense";

export interface HorseInput {
  name: string;
  breed: string;
  sex: Sex;
  birth_year: number | null;
  weight_kg: number;
  body_condition: number | null;
  workload: Workload;
  conditions: string[];
  notes: string;
}

export interface Horse extends HorseInput {
  id: string;
  owner_id: string;
  created_at: string;
}

export type HealthKind = "vaccine" | "deworming" | "farrier" | "dentist" | "vet" | "osteo" | "other";

export interface HealthEntryInput {
  kind: HealthKind;
  date: string;
  label: string;
  next_due: string | null;
  notes: string;
}

export interface HealthEntry extends HealthEntryInput {
  id: string;
  horse_id: string;
}

export interface WeightEntry {
  id: string;
  horse_id: string;
  date: string;
  weight_kg: number;
}

export type Discipline = "dressage" | "jumping" | "cross" | "hack" | "groundwork" | "lunging";

export type Intensity = "light" | "moderate" | "intense";

export interface WorkoutInput {
  discipline: Discipline;
  duration_min: number;
  intensity: Intensity;
  notes: string;
}

export interface Workout extends WorkoutInput {
  id: string;
  horse_id: string;
  date: string;
}

export type CareStatus = "overdue" | "due_soon" | "ok" | "unknown";

export interface CareItem {
  kind: HealthKind;
  label: string;
  due_date: string | null;
  status: CareStatus;
  days_left: number | null;
}

export interface Ration {
  weight_kg: number;
  workload: Workload;
  conditions: string[];
  forage_kg: number;
  forage_advice: string;
  concentrate_kg: number;
  concentrate_type: string;
  meals_per_day: number;
  max_concentrate_per_meal_kg: number;
  starch_cap_g_per_meal: number | null;
  oil_ml: number;
  vitamin_e_iu: number;
  salt_g: number;
  water_liters: [number, number];
  advice: string[];
  warnings: string[];
}

export interface HorseDetail {
  horse: Horse;
  health: HealthEntry[];
  weights: WeightEntry[];
  workouts: Workout[];
  due_care: CareItem[];
  ration: Ration;
}

export interface Condition {
  code: string;
  label: string;
  summary: string;
}

export type PlaceKind = "stable" | "home" | "other";

export interface PlaceInput {
  name: string;
  kind: PlaceKind;
  lat: number;
  lng: number;
  radius_m: number;
}

export interface Place extends PlaceInput {
  id: string;
  owner_id: string;
}

export interface WakeupResponse {
  triggered: boolean;
  place: Place | null;
  session_id: string | null;
  reply: string | null;
  mood: Mood | null;
}
