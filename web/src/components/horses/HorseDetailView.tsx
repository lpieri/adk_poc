"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { HorseInput } from "../../api/types";
import type { ConditionsState } from "../../hooks/useConditions";
import { useHorseDetail } from "../../hooks/useHorseDetail";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Notice from "../ui/Notice";
import DueCareList from "./DueCareList";
import HealthSection from "./HealthSection";
import HorseForm from "./HorseForm";
import HorseHeaderCard from "./HorseHeaderCard";
import RationCard from "./RationCard";
import WeightSection from "./WeightSection";
import WorkoutSection from "./WorkoutSection";

interface HorseDetailViewProps {
  userId: string;
  horseId: string;
  conditions: ConditionsState;
  onBack: () => void;
  onDeleted: () => void;
}

const HorseDetailView: React.FC<HorseDetailViewProps> = (props) => {
  const { t } = useTranslation();
  const { detail, loading, actions } = useHorseDetail(props.userId, props.horseId);
  const [editing, setEditing] = useState<boolean>(false);
  const [actionFailed, setActionFailed] = useState<boolean>(false);
  const track = async (action: Promise<boolean>): Promise<boolean> => {
    const ok = await action;
    setActionFailed(!ok);
    return ok;
  };
  const backButton = (
    <Button variant="ghost" size="sm" className="self-start" onClick={props.onBack}>
      <Icon name="back" className="h-4 w-4" />
      {t("common.back")}
    </Button>
  );
  if (!detail) {
    return (
      <div className="flex flex-col gap-4">
        {backButton}
        <Notice tone={loading ? "muted" : "danger"}>{t(loading ? "common.loading" : "common.error")}</Notice>
      </div>
    );
  }
  const handleUpdate = async (input: HorseInput): Promise<boolean> => {
    const ok = await actions.update(input);
    setEditing(!ok);
    return ok;
  };
  const handleDelete = async (): Promise<void> => {
    if (window.confirm(t("horses.deleteConfirm", { name: detail.horse.name })) && (await track(actions.remove()))) {
      props.onDeleted();
    }
  };
  if (editing) {
    return (
      <HorseForm
        title={t("horses.editTitle")}
        initial={detail.horse}
        conditions={props.conditions.conditions}
        onSubmit={handleUpdate}
        onCancel={() => setEditing(false)}
      />
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {backButton}
      <HorseHeaderCard horse={detail.horse} labelFor={props.conditions.labelFor} onEdit={() => setEditing(true)} onDelete={handleDelete} />
      {actionFailed && <Notice tone="danger">{t("common.actionError")}</Notice>}
      <RationCard ration={detail.ration} />
      <DueCareList items={detail.due_care} />
      <HealthSection
        entries={detail.health}
        onAdd={(input) => track(actions.addHealth(input))}
        onDelete={(entryId) => void track(actions.deleteHealth(entryId))}
      />
      <WeightSection weights={detail.weights} onAdd={(weightKg) => track(actions.addWeight(weightKg))} />
      <WorkoutSection workouts={detail.workouts} onAdd={(input) => track(actions.addWorkout(input))} />
    </div>
  );
};

export default HorseDetailView;
