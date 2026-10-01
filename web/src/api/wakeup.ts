import { request } from "./client";
import type { WakeupResponse } from "./types";

interface PresenceInput {
  userId: string;
  sessionId: string | null;
  lat: number;
  lng: number;
}

export const postPresence = (input: PresenceInput): Promise<WakeupResponse> => {
  return request<WakeupResponse>("/presence", "POST", {
    user_id: input.userId,
    session_id: input.sessionId,
    lat: input.lat,
    lng: input.lng,
  });
};

export const postWakeup = (userId: string, sessionId: string | null, placeId: string): Promise<WakeupResponse> => {
  return request<WakeupResponse>("/wakeup", "POST", { user_id: userId, session_id: sessionId, place_id: placeId });
};
