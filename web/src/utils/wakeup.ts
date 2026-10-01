import type { Mood, WakeupResponse } from "../api/types";

export interface Arrival {
  sessionId: string;
  reply: string;
  mood: Mood;
  placeName: string;
}

const DEFAULT_ARRIVAL_MOOD: Mood = "happy";

export const toArrival = (response: WakeupResponse): Arrival | null => {
  if (!response.triggered || !response.session_id || !response.reply) {
    return null;
  }
  return {
    sessionId: response.session_id,
    reply: response.reply,
    mood: response.mood ?? DEFAULT_ARRIVAL_MOOD,
    placeName: response.place?.name ?? "",
  };
};
