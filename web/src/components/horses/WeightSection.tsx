"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { WeightEntry } from "../../api/types";
import { formatDate, formatNumber, sortByDateDesc } from "../../utils/format";
import { INPUT_CLASS } from "../../utils/styles";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Field from "../ui/Field";
import Notice from "../ui/Notice";
import SectionHeader from "../ui/SectionHeader";
import WeightSparkline from "./WeightSparkline";

interface WeightSectionProps {
  weights: WeightEntry[];
  onAdd: (weightKg: number) => Promise<boolean>;
}

const WEIGHT_LIST_LIMIT = 5;

const WeightSection: React.FC<WeightSectionProps> = (props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>("");
  const recent = sortByDateDesc(props.weights).slice(0, WEIGHT_LIST_LIMIT);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const ok = await props.onAdd(Number(value));
    setValue(ok ? "" : value);
  };
  return (
    <Card className="flex flex-col gap-4">
      <SectionHeader title={t("weight.title")} />
      <WeightSparkline weights={props.weights} />
      {recent.length === 0 ? (
        <Notice>{t("weight.empty")}</Notice>
      ) : (
        <ul className="flex flex-col">
          {recent.map((entry) => (
            <li key={entry.id} className="flex justify-between border-b border-hairline py-2.5 text-sm last:border-b-0">
              <span className="text-muted">{formatDate(entry.date)}</span>
              <span className="font-bold text-sway-black">{t("horses.weightValue", { value: formatNumber(entry.weight_kg) })}</span>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Field label={t("weight.input")} className="flex-1">
          <input
            type="number"
            inputMode="decimal"
            min={1}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Button type="submit" size="sm" className="mb-0.5 py-3" disabled={!(Number(value) > 0)}>
          {t("common.add")}
        </Button>
      </form>
    </Card>
  );
};

export default WeightSection;
