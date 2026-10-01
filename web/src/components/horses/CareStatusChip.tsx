"use client";

import { useTranslation } from "react-i18next";
import type { CareStatus } from "../../api/types";
import Pill from "../ui/Pill";
import type { PillTone } from "../ui/Pill";

interface CareStatusChipProps {
  status: CareStatus;
}

const STATUS_TONES: Record<CareStatus, PillTone> = {
  overdue: "orange",
  due_soon: "purple",
  ok: "green",
  unknown: "muted",
};

const CareStatusChip: React.FC<CareStatusChipProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Pill tone={STATUS_TONES[props.status]} dot>
      {t(`care.status.${props.status}`)}
    </Pill>
  );
};

export default CareStatusChip;
