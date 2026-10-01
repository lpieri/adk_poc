import { request, withUser } from "./client";
import type { HealthEntry, HealthEntryInput, WeightEntry, Workout, WorkoutInput } from "./types";

export const addHealthEntry = (userId: string, horseId: string, input: HealthEntryInput): Promise<HealthEntry> => {
  return request<HealthEntry>(`/horses/${horseId}/health`, "POST", { user_id: userId, ...input });
};

export const deleteHealthEntry = (userId: string, horseId: string, entryId: string): Promise<void> => {
  return request<void>(withUser(`/horses/${horseId}/health/${entryId}`, userId), "DELETE");
};

export const addWeight = (userId: string, horseId: string, weightKg: number): Promise<WeightEntry> => {
  return request<WeightEntry>(`/horses/${horseId}/weights`, "POST", { user_id: userId, weight_kg: weightKg });
};

export const addWorkout = (userId: string, horseId: string, input: WorkoutInput): Promise<Workout> => {
  return request<Workout>(`/horses/${horseId}/workouts`, "POST", { user_id: userId, ...input });
};
