"use client";

import { useTranslation } from "react-i18next";
import type { ChatMessage } from "../../hooks/useChat";
import ToolBadges from "./ToolBadges";

interface MessageBubbleProps {
  message: ChatMessage;
  text: string;
}

const USER_BUBBLE_CLASS = "rounded-br-md bg-sway-black text-white";
const ALE_BUBBLE_CLASS = "rounded-bl-md border border-hairline bg-neutral text-sway-black";

const MessageBubble: React.FC<MessageBubbleProps> = (props) => {
  const { t } = useTranslation();
  const isUser = props.message.author === "user";
  return (
    <div className={`flex animate-sway-up flex-col gap-1.5 ${isUser ? "origin-bottom-right items-end" : "origin-bottom-left items-start"}`}>
      <span className="sr-only">{isUser ? t("chat.you") : t("app.name")}</span>
      <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 font-mulish text-[0.95rem] leading-relaxed ${isUser ? USER_BUBBLE_CLASS : ALE_BUBBLE_CLASS}`}>
        {props.text}
      </p>
      {props.message.toolCalls.length > 0 && <ToolBadges toolCalls={props.message.toolCalls} />}
    </div>
  );
};

export default MessageBubble;
