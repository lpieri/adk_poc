import { useCallback, useMemo } from "react";
import { deleteHorse, fetchHorseDetail, updateHorse } from "../api/horses";
import { addHealthEntry, addWeight, addWorkout, deleteHealthEntry } from "../api/horseRecords";
import type { HealthEntryInput, HorseDetail, HorseInput, WorkoutInput } from "../api/types";
import { useResource } from "./useResource";

export interface HorseDetailActions {
  update: (input: HorseInput) => Promise<boolean>;
  remove: () => Promise<boolean>;
  addHealth: (input: HealthEntryInput) => Promise<boolean>;
  deleteHealth: (entryId: string) => Promise<boolean>;
  addWeight: (weightKg: number) => Promise<boolean>;
  addWorkout: (input: WorkoutInput) => Promise<boolean>;
}

export interface HorseDetailState {
  detail: HorseDetail | null;
  loading: boolean;
  error: boolean;
  actions: HorseDetailActions;
}

const attempt = async (action: () => Promise<unknown>): Promise<boolean> => {
  try {
    await action();
    return true;
  } catch {
    return false;
  }
};

export const useHorseDetail = (userId: string, horseId: string): HorseDetailState => {
  const load = useCallback(() => fetchHorseDetail(userId, horseId), [userId, horseId]);
  const resource = useResource<HorseDetail | null>(load, null);
  const { reload } = resource;
  const actions = useMemo<HorseDetailActions>(() => {
    const mutate = async (action: () => Promise<unknown>): Promise<boolean> => {
      const ok = await attempt(action);
      await reload();
      return ok;
    };
    return {
      update: (input) => mutate(() => updateHorse(userId, horseId, input)),
      remove: () => attempt(() => deleteHorse(userId, horseId)),
      addHealth: (input) => mutate(() => addHealthEntry(userId, horseId, input)),
      deleteHealth: (entryId) => mutate(() => deleteHealthEntry(userId, horseId, entryId)),
      addWeight: (weightKg) => mutate(() => addWeight(userId, horseId, weightKg)),
      addWorkout: (input) => mutate(() => addWorkout(userId, horseId, input)),
    };
  }, [horseId, reload, userId]);
  return { detail: resource.data, loading: resource.loading, error: resource.error, actions };
};
