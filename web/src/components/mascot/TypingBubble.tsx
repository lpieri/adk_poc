"use client";

import { useTranslation } from "react-i18next";

interface TypingBubbleProps {
  className?: string;
}

const DOT_DELAYS_MS = [0, 160, 320];

const TypingBubble: React.FC<TypingBubbleProps> = (props) => {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      aria-label={t("chat.typing")}
      className={`inline-flex w-fit animate-sway-up items-center gap-1.5 rounded-2xl rounded-bl-md border border-hairline bg-neutral px-4 py-3.5 ${props.className ?? ""}`}
    >
      {DOT_DELAYS_MS.map((delay) => (
        <span key={delay} className="size-2 animate-typing-dot rounded-full bg-orange" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  );
};

export default TypingBubble;
