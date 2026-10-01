"use client";

import { useTranslation } from "react-i18next";
import type { MascotFrame } from "../../utils/mascot";
import { DISPLAY_TITLE_CLASS } from "../../utils/styles";
import Mascot from "../mascot/Mascot";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

interface ChatHeaderProps {
  frame: MascotFrame;
  pending: boolean;
  speaking: boolean;
  onReset: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = (props) => {
  const { t } = useTranslation();
  const statusKey = props.pending ? "chat.statusThinking" : props.speaking ? "chat.statusTalking" : "chat.statusOnline";
  return (
    <header className="sticky top-2 z-20 mx-3 flex items-center gap-3 rounded-2xl border border-hairline bg-neutral/90 py-1 pl-1 pr-3 backdrop-blur-md">
      <div className="sway-gradient-light rounded-xl">
        <div className={`origin-bottom ${props.pending ? "" : "motion-safe:animate-float"}`}>
          <Mascot frame={props.frame} size="avatar" bob={props.pending} />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className={`${DISPLAY_TITLE_CLASS} text-xl`}>{t("app.name")}</p>
        <p className="truncate text-sm text-muted">{t(statusKey)}</p>
      </div>
      <Button variant="secondary" size="sm" ariaLabel={t("chat.newConversation")} onClick={props.onReset}>
        <Icon name="refresh" className="h-4 w-4" />
        <span className="hidden sm:inline">{t("chat.newConversation")}</span>
      </Button>
    </header>
  );
};

export default ChatHeader;
