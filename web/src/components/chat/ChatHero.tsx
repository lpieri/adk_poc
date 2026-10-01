"use client";

import { useTranslation } from "react-i18next";
import type { MascotFrame } from "../../utils/mascot";
import { DISPLAY_TITLE_CLASS } from "../../utils/styles";
import Mascot from "../mascot/Mascot";
import SuggestionChips from "./SuggestionChips";

interface ChatHeroProps {
  frame: MascotFrame;
  onSuggestion: (text: string) => void;
}

const TITLE_DELAY = { animationDelay: "80ms" };
const SUBTITLE_DELAY = { animationDelay: "160ms" };
const SUGGESTIONS_DELAY = { animationDelay: "240ms" };

const ChatHero: React.FC<ChatHeroProps> = (props) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-col items-center px-5 pt-2 text-center">
      <div className="relative flex items-center justify-center">
        <div aria-hidden="true" className="absolute inset-[-12%] motion-safe:animate-blob-spin">
          <div className="sway-blob h-full w-full motion-safe:animate-blob" />
        </div>
        <div className="relative origin-bottom motion-safe:animate-float">
          <Mascot frame={props.frame} size="hero" />
        </div>
      </div>
      <h1 className={`${DISPLAY_TITLE_CLASS} mt-2 text-4xl motion-safe:animate-sway-up`} style={TITLE_DELAY}>
        {t("chat.greetingLead")} <span className="text-orange">{t("app.name")}</span>
      </h1>
      <p className="mt-3 max-w-xs text-base leading-relaxed text-muted motion-safe:animate-sway-up" style={SUBTITLE_DELAY}>{t("chat.subtitle")}</p>
      <div className="mt-7 w-full motion-safe:animate-sway-up" style={SUGGESTIONS_DELAY}>
        <SuggestionChips onSelect={props.onSuggestion} />
      </div>
    </div>
  );
};

export default ChatHero;
