import { request } from "./client";
import type { ChatResponse, HistoryMessage } from "./types";

export const sendChat = (userId: string, sessionId: string | null, message: string): Promise<ChatResponse> => {
  return request<ChatResponse>("/chat", "POST", { user_id: userId, session_id: sessionId, message });
};

export const fetchHistory = (userId: string, sessionId: string): Promise<HistoryMessage[]> => {
  const path = `/sessions/${encodeURIComponent(userId)}/${encodeURIComponent(sessionId)}`;
  return request<HistoryMessage[]>(path);
};
