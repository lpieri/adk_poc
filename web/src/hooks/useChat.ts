import { useCallback, useEffect, useState } from "react";
import { fetchHistory, sendChat } from "../api/chat";
import { isNotFound } from "../api/client";
import type { Author, ChatResponse, HistoryMessage, Mood, ToolCall } from "../api/types";
import { cleanReply } from "../utils/chat";
import { createId } from "../utils/ids";
import { readStorage, writeStorage } from "../utils/storage";

export const SESSION_ID_KEY = "ale.sessionId";

export interface ChatMessage {
  id: string;
  author: Author;
  text: string;
  mood: Mood | null;
  toolCalls: ToolCall[];
  animate: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  sessionId: string | null;
  pending: boolean;
  error: boolean;
  send: (text: string) => Promise<void>;
  receive: (sessionId: string, reply: string, mood: Mood) => void;
  reset: () => void;
}

const buildMessage = (author: Author, text: string, mood: Mood | null, toolCalls: ToolCall[] = []): ChatMessage => {
  const isAle = author === "ale";
  return { id: createId(), author, text: isAle ? cleanReply(text) : text, mood, toolCalls, animate: isAle };
};

const fromHistory = (entry: HistoryMessage): ChatMessage => {
  return { ...buildMessage(entry.author, entry.text, entry.mood), animate: false };
};

const sendWithRecovery = async (userId: string, sessionId: string | null, text: string): Promise<ChatResponse> => {
  try {
    return await sendChat(userId, sessionId, text);
  } catch (error) {
    if (sessionId !== null && isNotFound(error)) {
      return sendChat(userId, null, text);
    }
    throw error;
  }
};

export const useChat = (userId: string): ChatState => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionIdState] = useState<string | null>(() => readStorage(SESSION_ID_KEY));
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const setSessionId = useCallback((id: string | null) => {
    setSessionIdState(id);
    writeStorage(SESSION_ID_KEY, id);
  }, []);
  useEffect(() => {
    const storedSession = readStorage(SESSION_ID_KEY);
    if (!storedSession) {
      return;
    }
    let active = true;
    fetchHistory(userId, storedSession)
      .then((history) => {
        if (active) {
          setMessages((current) => (current.length === 0 ? history.map(fromHistory) : current));
        }
      })
      .catch((reason: unknown) => {
        if (active && isNotFound(reason)) {
          setSessionId(null);
        }
      });
    return () => {
      active = false;
    };
  }, [userId, setSessionId]);
  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || pending) {
        return;
      }
      setMessages((current) => [...current, buildMessage("user", trimmed, null)]);
      setPending(true);
      setError(false);
      try {
        const response = await sendWithRecovery(userId, sessionId, trimmed);
        setSessionId(response.session_id);
        setMessages((current) => [...current, buildMessage("ale", response.reply, response.mood, response.tool_calls)]);
      } catch {
        setError(true);
      } finally {
        setPending(false);
      }
    },
    [pending, sessionId, setSessionId, userId],
  );
  const receive = useCallback(
    (nextSessionId: string, reply: string, mood: Mood) => {
      setSessionId(nextSessionId);
      setMessages((current) => [...current, buildMessage("ale", reply, mood)]);
    },
    [setSessionId],
  );
  const reset = useCallback(() => {
    setMessages([]);
    setError(false);
    setSessionId(null);
  }, [setSessionId]);
  return { messages, sessionId, pending, error, send, receive, reset };
};
