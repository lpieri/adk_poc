import { request, withUser } from "./client";
import type { Horse, HorseDetail, HorseInput } from "./types";

export const fetchHorses = (userId: string): Promise<Horse[]> => {
  return request<Horse[]>(withUser("/horses", userId));
};

export const fetchHorseDetail = (userId: string, horseId: string): Promise<HorseDetail> => {
  return request<HorseDetail>(withUser(`/horses/${horseId}`, userId));
};

export const createHorse = (userId: string, input: HorseInput): Promise<Horse> => {
  return request<Horse>("/horses", "POST", { user_id: userId, ...input });
};

export const updateHorse = (userId: string, horseId: string, input: HorseInput): Promise<Horse> => {
  return request<Horse>(`/horses/${horseId}`, "PUT", { user_id: userId, ...input });
};

export const deleteHorse = (userId: string, horseId: string): Promise<void> => {
  return request<void>(withUser(`/horses/${horseId}`, userId), "DELETE");
};
