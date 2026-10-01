"use client";

import { useTranslation } from "react-i18next";

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

const SUGGESTIONS = [
  { key: "ration", halo: "bg-orange-soft", emoji: "🌾" },
  { key: "pssm", halo: "bg-purple-soft", emoji: "💪" },
  { key: "stable", halo: "bg-magenta-soft", emoji: "🐎" },
  { key: "care", halo: "bg-blue-soft", emoji: "🩺" },
];

const STAGGER_MS = 70;
const BASE_DELAY_MS = 260;

const SuggestionChips: React.FC<SuggestionChipsProps> = (props) => {
  const { t } = useTranslation();
  return (
    <ul aria-label={t("chat.suggestionsLabel")} className="grid w-full grid-cols-2 gap-2.5">
      {SUGGESTIONS.map((suggestion, index) => {
        const text = t(`chat.suggestions.${suggestion.key}`);
        return (
          <li key={suggestion.key} className="motion-safe:animate-sway-up" style={{ animationDelay: `${BASE_DELAY_MS + index * STAGGER_MS}ms` }}>
            <button
              type="button"
              onClick={() => props.onSelect(text)}
              className="group flex h-full w-full flex-col items-start gap-3 rounded-2xl border border-hairline bg-neutral p-4 text-left text-sm font-bold leading-snug text-sway-black transition-all duration-500 ease-spring hover:-translate-y-1 hover:bg-greige active:scale-[0.96]"
            >
              <span aria-hidden="true" className={`flex size-9 items-center justify-center rounded-full text-lg transition-transform duration-500 ease-spring group-hover:-rotate-12 group-hover:scale-110 ${suggestion.halo}`}>
                {suggestion.emoji}
              </span>
              {text}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default SuggestionChips;
