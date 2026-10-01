"use client";

import { useTranslation } from "react-i18next";
import type { Horse } from "../../api/types";
import { formatNumber } from "../../utils/format";
import { formatAge } from "../../utils/horseLabels";
import { DISPLAY_TITLE_CLASS } from "../../utils/styles";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Icon from "../ui/Icon";
import StatRow from "../ui/StatRow";
import ConditionPills from "./ConditionPills";
import HorseAvatar from "./HorseAvatar";

interface HorseHeaderCardProps {
  horse: Horse;
  labelFor: (code: string) => string;
  onEdit: () => void;
  onDelete: () => void;
}

const HorseHeaderCard: React.FC<HorseHeaderCardProps> = (props) => {
  const { t } = useTranslation();
  const { horse } = props;
  const bodyCondition = horse.body_condition === null ? "—" : t("horses.bodyConditionValue", { value: horse.body_condition });
  return (
    <Card tone="glow" className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <HorseAvatar name={horse.name} large />
        <div className="min-w-0">
          <h1 className={`${DISPLAY_TITLE_CLASS} truncate text-3xl`}>{horse.name}</h1>
          <p className="text-sm text-muted">
            {horse.breed || t("horses.breedUnknown")} · {t(`sex.${horse.sex}`)}
          </p>
        </div>
      </div>
      <dl className="rounded-xl border border-hairline bg-neutral px-4 py-1">
        <StatRow label={t("horses.stats.age")} value={formatAge(t, horse.birth_year)} />
        <StatRow label={t("horses.stats.weight")} value={t("horses.weightValue", { value: formatNumber(horse.weight_kg) })} />
        <StatRow label={t("horses.stats.workload")} value={t(`workload.${horse.workload}`)} />
        <StatRow label={t("horses.stats.bodyCondition")} value={bodyCondition} />
      </dl>
      {horse.conditions.length > 0 ? (
        <ConditionPills codes={horse.conditions} labelFor={props.labelFor} />
      ) : (
        <p className="text-sm text-muted">{t("horses.noConditions")}</p>
      )}
      {horse.notes && <p className="whitespace-pre-wrap font-mulish text-sm leading-relaxed text-subtle">{horse.notes}</p>}
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={props.onEdit}>
          <Icon name="edit" className="h-4 w-4" />
          {t("common.edit")}
        </Button>
        <Button variant="danger" size="sm" onClick={props.onDelete}>
          <Icon name="trash" className="h-4 w-4" />
          {t("common.delete")}
        </Button>
      </div>
    </Card>
  );
};

export default HorseHeaderCard;
