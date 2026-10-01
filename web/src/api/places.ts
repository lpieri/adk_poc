import { request, withUser } from "./client";
import type { Place, PlaceInput } from "./types";

export const fetchPlaces = (userId: string): Promise<Place[]> => {
  return request<Place[]>(withUser("/places", userId));
};

export const createPlace = (userId: string, input: PlaceInput): Promise<Place> => {
  return request<Place>("/places", "POST", { user_id: userId, ...input });
};

export const deletePlace = (userId: string, placeId: string): Promise<void> => {
  return request<void>(withUser(`/places/${placeId}`, userId), "DELETE");
};
