"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { ChatState } from "../../hooks/useChat";
import { useMascot } from "../../hooks/useMascot";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useTypewriter } from "../../hooks/useTypewriter";
import { currentSpeech } from "../../utils/chat";
import Notice from "../ui/Notice";
import ChatHeader from "./ChatHeader";
import ChatHero from "./ChatHero";
import Composer from "./Composer";
import MessageList from "./MessageList";

interface ChatScreenProps {
  chat: ChatState;
  active: boolean;
}

const ChatScreen: React.FC<ChatScreenProps> = (props) => {
  const { t } = useTranslation();
  const { chat, active } = props;
  const reducedMotion = usePrefersReducedMotion();
  const speech = currentSpeech(chat.messages);
  const typewriter = useTypewriter(speech.key, speech.text, speech.animate && !reducedMotion);
  const frame = useMascot({ mood: speech.mood, pending: chat.pending, speaking: !typewriter.done });
  const empty = chat.messages.length === 0;
  const handleSend = (text: string): void => {
    void chat.send(text);
  };
  useEffect(() => {
    if (active && !empty) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" });
    }
  }, [active, empty, chat.messages.length, chat.pending, typewriter.visibleText, reducedMotion]);
  return (
    <section className={`flex min-h-[calc(100dvh-5.5rem)] flex-col ${active ? "" : "hidden"}`}>
      {empty ? (
        <ChatHero frame={frame} onSuggestion={handleSend} />
      ) : (
        <>
          <ChatHeader frame={frame} pending={chat.pending} speaking={!typewriter.done} onReset={chat.reset} />
          <MessageList messages={chat.messages} speakingId={speech.key} speakingText={typewriter.visibleText} pending={chat.pending} />
        </>
      )}
      {chat.error && (
        <div className="px-4">
          <Notice tone="danger">{t("chat.error")}</Notice>
        </div>
      )}
      <Composer disabled={chat.pending} onSend={handleSend} />
    </section>
  );
};

export default ChatScreen;
