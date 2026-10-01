import { useCallback } from "react";
import { createHorse, fetchHorses } from "../api/horses";
import type { Horse, HorseInput } from "../api/types";
import { useResource } from "./useResource";

export interface HorsesState {
  horses: Horse[];
  loading: boolean;
  error: boolean;
  reload: () => Promise<void>;
  create: (input: HorseInput) => Promise<Horse | null>;
}

export const useHorses = (userId: string): HorsesState => {
  const load = useCallback(() => fetchHorses(userId), [userId]);
  const resource = useResource<Horse[]>(load, []);
  const { reload } = resource;
  const create = useCallback(
    async (input: HorseInput): Promise<Horse | null> => {
      try {
        const horse = await createHorse(userId, input);
        await reload();
        return horse;
      } catch {
        return null;
      }
    },
    [reload, userId],
  );
  return { horses: resource.data, loading: resource.loading, error: resource.error, reload, create };
};
