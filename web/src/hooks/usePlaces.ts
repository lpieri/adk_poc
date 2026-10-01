import { useCallback } from "react";
import { createPlace, deletePlace, fetchPlaces } from "../api/places";
import type { Place, PlaceInput } from "../api/types";
import { useResource } from "./useResource";

export interface PlacesState {
  places: Place[];
  loading: boolean;
  error: boolean;
  create: (input: PlaceInput) => Promise<boolean>;
  remove: (placeId: string) => Promise<boolean>;
}

export const usePlaces = (userId: string): PlacesState => {
  const load = useCallback(() => fetchPlaces(userId), [userId]);
  const resource = useResource<Place[]>(load, []);
  const { reload } = resource;
  const run = useCallback(
    async (action: () => Promise<unknown>): Promise<boolean> => {
      try {
        await action();
        await reload();
        return true;
      } catch {
        return false;
      }
    },
    [reload],
  );
  const create = useCallback((input: PlaceInput) => run(() => createPlace(userId, input)), [run, userId]);
  const remove = useCallback((placeId: string) => run(() => deletePlace(userId, placeId)), [run, userId]);
  return { places: resource.data, loading: resource.loading, error: resource.error, create, remove };
};
