import type { Mood } from "../api/types";
import type { ChatMessage } from "../hooks/useChat";

export interface Speech {
  key: string;
  text: string;
  mood: Mood;
  animate: boolean;
}

const SILENT_SPEECH: Speech = { key: "", text: "", mood: "idle", animate: false };

export const currentSpeech = (messages: ChatMessage[]): Speech => {
  const latest = [...messages].reverse().find((message) => message.author === "ale");
  if (!latest) {
    return SILENT_SPEECH;
  }
  return { key: latest.id, text: latest.text, mood: latest.mood ?? "idle", animate: latest.animate };
};

export const cleanReply = (text: string): string => {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .trim();
};
