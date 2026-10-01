"use client";

import { useTranslation } from "react-i18next";
import { DISPLAY_TITLE_CLASS } from "../../utils/styles";

interface WakeupToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const WakeupToggle: React.FC<WakeupToggleProps> = (props) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-hairline sway-panel-glow p-5">
      <div className="min-w-0 flex-1">
        <p id="wakeup-toggle-label" className={`${DISPLAY_TITLE_CLASS} text-base`}>
          {t("wakeup.toggle")}
        </p>
        <p className="text-sm leading-snug text-muted">{t("wakeup.toggleHint")}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={props.enabled}
        aria-labelledby="wakeup-toggle-label"
        onClick={() => props.onToggle(!props.enabled)}
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-300 ${props.enabled ? "bg-orange" : "bg-black/15"}`}
      >
        <span
          className="absolute left-1 top-1 size-6 rounded-full bg-white shadow-sm transition-transform duration-300"
          style={{ transform: props.enabled ? "translateX(1.5rem)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
};

export default WakeupToggle;
