"use client";

import { useTranslation } from "react-i18next";
import type { Horse } from "../../api/types";
import { formatNumber } from "../../utils/format";
import { formatAge } from "../../utils/horseLabels";
import { DISPLAY_TITLE_CLASS } from "../../utils/styles";
import ConditionPills from "./ConditionPills";
import HorseAvatar from "./HorseAvatar";
import MiniStat from "./MiniStat";

interface HorseCardProps {
  horse: Horse;
  labelFor: (code: string) => string;
  onSelect: (horseId: string) => void;
}

const HorseCard: React.FC<HorseCardProps> = (props) => {
  const { t } = useTranslation();
  const { horse } = props;
  return (
    <button
      type="button"
      onClick={() => props.onSelect(horse.id)}
      className="flex w-full flex-col gap-4 rounded-2xl border border-hairline bg-neutral p-5 text-left transition-all duration-300 hover:bg-white hover:shadow-sm active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <HorseAvatar name={horse.name} />
        <div className="min-w-0">
          <p className={`${DISPLAY_TITLE_CLASS} truncate text-xl`}>{horse.name}</p>
          <p className="truncate text-sm text-muted">{horse.breed || t("horses.breedUnknown")}</p>
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-2 rounded-xl bg-greige px-4 py-3">
        <MiniStat label={t("horses.stats.age")} value={formatAge(t, horse.birth_year)} />
        <MiniStat label={t("horses.stats.weight")} value={t("horses.weightValue", { value: formatNumber(horse.weight_kg) })} />
        <MiniStat label={t("horses.stats.workload")} value={t(`workload.${horse.workload}`)} />
      </dl>
      <ConditionPills codes={horse.conditions} labelFor={props.labelFor} />
    </button>
  );
};

export default HorseCard;
