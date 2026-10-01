"use client";

import { useTranslation } from "react-i18next";
import type { ToolCall } from "../../api/types";
import Pill from "../ui/Pill";

interface ToolBadgesProps {
  toolCalls: ToolCall[];
}

const ToolBadges: React.FC<ToolBadgesProps> = (props) => {
  const { t } = useTranslation();
  const names = Array.from(new Set(props.toolCalls.map((call) => call.name)));
  return (
    <ul aria-label={t("chat.toolsLabel")} className="flex flex-wrap gap-1.5 pl-1">
      {names.map((name) => (
        <li key={name}>
          <Pill tone="greige">{t(`tools.${name}`, { defaultValue: name })}</Pill>
        </li>
      ))}
    </ul>
  );
};

export default ToolBadges;
