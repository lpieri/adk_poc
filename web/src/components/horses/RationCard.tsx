"use client";

import { useTranslation } from "react-i18next";
import type { Ration } from "../../api/types";
import { formatNumber } from "../../utils/format";
import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";
import StatRow from "../ui/StatRow";

interface RationCardProps {
  ration: Ration;
}

const RationCard: React.FC<RationCardProps> = (props) => {
  const { t } = useTranslation();
  const { ration } = props;
  const kg = (value: number): string => t("ration.kg", { value: formatNumber(value) });
  return (
    <Card className="flex flex-col gap-4">
      <SectionHeader title={t("ration.title")} />
      <dl>
        <StatRow label={t("ration.forage")} value={kg(ration.forage_kg)} />
        <StatRow
          label={t("ration.concentrate")}
          value={t("ration.concentrateValue", { value: formatNumber(ration.concentrate_kg), type: ration.concentrate_type })}
        />
        <StatRow label={t("ration.meals")} value={String(ration.meals_per_day)} />
        <StatRow label={t("ration.maxPerMeal")} value={kg(ration.max_concentrate_per_meal_kg)} />
        {ration.starch_cap_g_per_meal !== null && (
          <StatRow label={t("ration.starchCap")} value={t("ration.grams", { value: formatNumber(ration.starch_cap_g_per_meal) })} />
        )}
        <StatRow label={t("ration.oil")} value={t("ration.ml", { value: formatNumber(ration.oil_ml) })} />
        <StatRow label={t("ration.vitaminE")} value={t("ration.iu", { value: formatNumber(ration.vitamin_e_iu) })} />
        <StatRow label={t("ration.salt")} value={t("ration.grams", { value: formatNumber(ration.salt_g) })} />
        <StatRow label={t("ration.water")} value={t("ration.liters", { min: ration.water_liters[0], max: ration.water_liters[1] })} />
      </dl>
      {ration.forage_advice && <p className="rounded-xl bg-greige px-4 py-3 font-mulish text-sm leading-relaxed text-subtle">{ration.forage_advice}</p>}
      {ration.advice.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-bold text-sway-black">{t("ration.advice")}</h3>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 font-mulish text-sm leading-relaxed text-subtle marker:text-orange">
            {ration.advice.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {ration.warnings.length > 0 && (
        <div className="rounded-xl bg-orange-soft p-4 text-orange">
          <h3 className="mb-2 text-sm font-bold">{t("ration.warnings")}</h3>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 font-mulish text-sm leading-relaxed">
            {ration.warnings.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default RationCard;
