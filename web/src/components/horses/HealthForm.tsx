"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { HealthEntryInput, HealthKind } from "../../api/types";
import { todayIso } from "../../utils/format";
import { HEALTH_KINDS } from "../../utils/options";
import { INPUT_CLASS } from "../../utils/styles";
import Button from "../ui/Button";
import Field from "../ui/Field";

interface HealthFormProps {
  onSubmit: (input: HealthEntryInput) => Promise<void>;
  onCancel: () => void;
}

const HealthForm: React.FC<HealthFormProps> = (props) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<HealthEntryInput>(() => ({ kind: "vaccine", date: todayIso(), label: "", next_due: null, notes: "" }));
  const handleChange = (patch: Partial<HealthEntryInput>): void => {
    setDraft((current) => ({ ...current, ...patch }));
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const label = draft.label.trim() || t(`health.kinds.${draft.kind}`);
    void props.onSubmit({ ...draft, label, notes: draft.notes.trim() });
  };
  return (
    <form onSubmit={handleSubmit} className="flex animate-sway-up flex-col gap-3 rounded-2xl border border-hairline bg-greige/50 p-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("health.kind")}>
          <select value={draft.kind} onChange={(event) => handleChange({ kind: event.target.value as HealthKind })} className={INPUT_CLASS}>
            {HEALTH_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {t(`health.kinds.${kind}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("health.date")}>
          <input required type="date" value={draft.date} onChange={(event) => handleChange({ date: event.target.value })} className={INPUT_CLASS} />
        </Field>
      </div>
      <Field label={t("health.label")}>
        <input
          value={draft.label}
          placeholder={t("health.labelPlaceholder")}
          onChange={(event) => handleChange({ label: event.target.value })}
          className={INPUT_CLASS}
        />
      </Field>
      <Field label={t("health.nextDue")}>
        <input
          type="date"
          value={draft.next_due ?? ""}
          onChange={(event) => handleChange({ next_due: event.target.value || null })}
          className={INPUT_CLASS}
        />
      </Field>
      <Field label={t("common.notes")}>
        <input value={draft.notes} onChange={(event) => handleChange({ notes: event.target.value })} className={INPUT_CLASS} />
      </Field>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="flex-1" onClick={props.onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" size="sm" className="flex-1">
          {t("common.add")}
        </Button>
      </div>
    </form>
  );
};

export default HealthForm;
