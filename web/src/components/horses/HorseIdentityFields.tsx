"use client";

import { useTranslation } from "react-i18next";
import type { Sex } from "../../api/types";
import type { HorseDraft } from "../../utils/horseDraft";
import { SEX_VALUES } from "../../utils/options";
import { INPUT_CLASS } from "../../utils/styles";
import Field from "../ui/Field";
import SegmentedControl from "../ui/SegmentedControl";

interface HorseIdentityFieldsProps {
  draft: HorseDraft;
  onChange: (patch: Partial<HorseDraft>) => void;
}

const HorseIdentityFields: React.FC<HorseIdentityFieldsProps> = (props) => {
  const { t } = useTranslation();
  const { draft, onChange } = props;
  const sexOptions = SEX_VALUES.map((value) => ({ value, label: t(`sex.${value}`) }));
  return (
    <>
      <Field label={t("horseForm.name")}>
        <input
          required
          value={draft.name}
          placeholder={t("horseForm.namePlaceholder")}
          onChange={(event) => onChange({ name: event.target.value })}
          className={INPUT_CLASS}
        />
      </Field>
      <Field label={t("horseForm.breed")}>
        <input
          value={draft.breed}
          placeholder={t("horseForm.breedPlaceholder")}
          onChange={(event) => onChange({ breed: event.target.value })}
          className={INPUT_CLASS}
        />
      </Field>
      <SegmentedControl label={t("horseForm.sex")} options={sexOptions} value={draft.sex} onChange={(value) => onChange({ sex: value as Sex })} />
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("horseForm.birthYear")}>
          <input
            type="number"
            inputMode="numeric"
            value={draft.birthYear}
            onChange={(event) => onChange({ birthYear: event.target.value })}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label={t("horseForm.weight")}>
          <input
            required
            type="number"
            inputMode="decimal"
            min={1}
            value={draft.weightKg}
            onChange={(event) => onChange({ weightKg: event.target.value })}
            className={INPUT_CLASS}
          />
        </Field>
      </div>
    </>
  );
};

export default HorseIdentityFields;
