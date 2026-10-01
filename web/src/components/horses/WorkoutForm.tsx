"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { Discipline, Intensity, WorkoutInput } from "../../api/types";
import { DISCIPLINES, INTENSITIES } from "../../utils/options";
import { INPUT_CLASS } from "../../utils/styles";
import Button from "../ui/Button";
import Field from "../ui/Field";
import SegmentedControl from "../ui/SegmentedControl";

interface WorkoutFormProps {
  onSubmit: (input: WorkoutInput) => Promise<void>;
  onCancel: () => void;
}

const DEFAULT_DURATION_MIN = "45";

const WorkoutForm: React.FC<WorkoutFormProps> = (props) => {
  const { t } = useTranslation();
  const [discipline, setDiscipline] = useState<Discipline>("dressage");
  const [duration, setDuration] = useState<string>(DEFAULT_DURATION_MIN);
  const [intensity, setIntensity] = useState<Intensity>("moderate");
  const [notes, setNotes] = useState<string>("");
  const disciplineOptions = DISCIPLINES.map((value) => ({ value, label: t(`workouts.disciplines.${value}`) }));
  const intensityOptions = INTENSITIES.map((value) => ({ value, label: t(`workouts.intensities.${value}`) }));
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void props.onSubmit({ discipline, duration_min: Number(duration), intensity, notes: notes.trim() });
  };
  return (
    <form onSubmit={handleSubmit} className="flex animate-sway-up flex-col gap-3 rounded-2xl border border-hairline bg-greige/50 p-4">
      <SegmentedControl
        label={t("workouts.discipline")}
        options={disciplineOptions}
        value={discipline}
        onChange={(value) => setDiscipline(value as Discipline)}
      />
      <Field label={t("workouts.duration")}>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          className={INPUT_CLASS}
        />
      </Field>
      <SegmentedControl
        label={t("workouts.intensity")}
        options={intensityOptions}
        value={intensity}
        onChange={(value) => setIntensity(value as Intensity)}
      />
      <Field label={t("common.notes")}>
        <input value={notes} onChange={(event) => setNotes(event.target.value)} className={INPUT_CLASS} />
      </Field>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="flex-1" onClick={props.onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" size="sm" className="flex-1" disabled={!(Number(duration) > 0)}>
          {t("common.save")}
        </Button>
      </div>
    </form>
  );
};

export default WorkoutForm;
