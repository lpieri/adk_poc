"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Intensity, Workout, WorkoutInput } from "../../api/types";
import { formatDate, sortByDateDesc } from "../../utils/format";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Icon from "../ui/Icon";
import Notice from "../ui/Notice";
import Pill from "../ui/Pill";
import type { PillTone } from "../ui/Pill";
import SectionHeader from "../ui/SectionHeader";
import WorkoutForm from "./WorkoutForm";

interface WorkoutSectionProps {
  workouts: Workout[];
  onAdd: (input: WorkoutInput) => Promise<boolean>;
}

const INTENSITY_TONES: Record<Intensity, PillTone> = {
  light: "green",
  moderate: "purple",
  intense: "orange",
};

const WORKOUT_LIST_LIMIT = 8;

const WorkoutSection: React.FC<WorkoutSectionProps> = (props) => {
  const { t } = useTranslation();
  const [adding, setAdding] = useState<boolean>(false);
  const handleAdd = async (input: WorkoutInput): Promise<void> => {
    const ok = await props.onAdd(input);
    setAdding(!ok);
  };
  const addButton = (
    <Button variant="secondary" size="sm" onClick={() => setAdding(true)}>
      <Icon name="plus" className="h-4 w-4" />
      {t("workouts.add")}
    </Button>
  );
  return (
    <Card className="flex flex-col gap-4">
      <SectionHeader title={t("workouts.title")} action={adding ? null : addButton} />
      {adding && <WorkoutForm onSubmit={handleAdd} onCancel={() => setAdding(false)} />}
      {props.workouts.length === 0 ? (
        <Notice>{t("workouts.empty")}</Notice>
      ) : (
        <ul className="flex flex-col">
          {sortByDateDesc(props.workouts)
            .slice(0, WORKOUT_LIST_LIMIT)
            .map((workout) => (
              <li key={workout.id} className="flex items-center justify-between gap-3 border-b border-hairline py-2.5 last:border-b-0">
                <div>
                  <p className="text-sm font-bold text-sway-black">{t(`workouts.disciplines.${workout.discipline}`)}</p>
                  <p className="text-sm text-muted">
                    {formatDate(workout.date)} · {t("workouts.durationValue", { value: workout.duration_min })}
                  </p>
                </div>
                <Pill tone={INTENSITY_TONES[workout.intensity]} dot>{t(`workouts.intensities.${workout.intensity}`)}</Pill>
              </li>
            ))}
        </ul>
      )}
    </Card>
  );
};

export default WorkoutSection;
