"use client";

import { useTranslation } from "react-i18next";
import type { Condition, Workload } from "../../api/types";
import type { HorseDraft } from "../../utils/horseDraft";
import { WORKLOAD_VALUES } from "../../utils/options";
import { INPUT_CLASS } from "../../utils/styles";
import Field from "../ui/Field";
import PillToggleGroup from "../ui/PillToggleGroup";
import SegmentedControl from "../ui/SegmentedControl";

interface HorseCareFieldsProps {
  draft: HorseDraft;
  conditions: Condition[];
  onChange: (patch: Partial<HorseDraft>) => void;
}

const BODY_CONDITION_MIN = 1;
const BODY_CONDITION_MAX = 9;

const HorseCareFields: React.FC<HorseCareFieldsProps> = (props) => {
  const { t } = useTranslation();
  const { draft, onChange } = props;
  const workloadOptions = WORKLOAD_VALUES.map((value) => ({ value, label: t(`workload.${value}`) }));
  const conditionOptions = props.conditions.map((condition) => ({ value: condition.code, label: condition.label }));
  return (
    <>
      <Field label={t("horseForm.bodyCondition", { value: draft.bodyCondition })}>
        <input
          type="range"
          min={BODY_CONDITION_MIN}
          max={BODY_CONDITION_MAX}
          step={1}
          value={draft.bodyCondition}
          onChange={(event) => onChange({ bodyCondition: Number(event.target.value) })}
          className="w-full"
        />
      </Field>
      <SegmentedControl
        label={t("horseForm.workload")}
        options={workloadOptions}
        value={draft.workload}
        onChange={(value) => onChange({ workload: value as Workload })}
      />
      <PillToggleGroup
        label={t("horseForm.conditions")}
        options={conditionOptions}
        selected={draft.conditions}
        onChange={(conditions) => onChange({ conditions })}
      />
      <Field label={t("common.notes")}>
        <textarea
          rows={3}
          value={draft.notes}
          placeholder={t("horseForm.notesPlaceholder")}
          onChange={(event) => onChange({ notes: event.target.value })}
          className={`${INPUT_CLASS} resize-none`}
        />
      </Field>
    </>
  );
};

export default HorseCareFields;
