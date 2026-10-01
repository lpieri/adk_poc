"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { HorseInput } from "../../api/types";
import { useConditions } from "../../hooks/useConditions";
import { useHorses } from "../../hooks/useHorses";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Notice from "../ui/Notice";
import SectionHeader from "../ui/SectionHeader";
import HorseDetailView from "./HorseDetailView";
import HorseForm from "./HorseForm";
import HorseList from "./HorseList";

interface HorsesScreenProps {
  userId: string;
  active: boolean;
}

type HorsesView = { mode: "list" } | { mode: "create" } | { mode: "detail"; horseId: string };

const HorsesScreen: React.FC<HorsesScreenProps> = (props) => {
  const { t } = useTranslation();
  const horses = useHorses(props.userId);
  const conditions = useConditions();
  const [view, setView] = useState<HorsesView>({ mode: "list" });
  const handleBackToList = (): void => {
    setView({ mode: "list" });
    void horses.reload();
  };
  const handleCreate = async (input: HorseInput): Promise<boolean> => {
    const horse = await horses.create(input);
    if (horse) {
      setView({ mode: "detail", horseId: horse.id });
    }
    return horse !== null;
  };
  const listContent = horses.error ? (
    <Notice tone="danger">{t("common.error")}</Notice>
  ) : horses.loading && horses.horses.length === 0 ? (
    <Notice>{t("common.loading")}</Notice>
  ) : (
    <HorseList horses={horses.horses} labelFor={conditions.labelFor} onSelect={(horseId) => setView({ mode: "detail", horseId })} />
  );
  return (
    <section className={`flex flex-col gap-5 px-4 pt-4 ${props.active ? "" : "hidden"}`}>
      {view.mode === "list" && (
        <>
          <SectionHeader
            large
            title={t("horses.title")}
            subtitle={t("horses.subtitle")}
            action={
              <Button size="sm" className="shrink-0" onClick={() => setView({ mode: "create" })}>
                <Icon name="plus" className="h-4 w-4" />
                {t("horses.add")}
              </Button>
            }
          />
          {listContent}
        </>
      )}
      {view.mode === "create" && (
        <HorseForm title={t("horses.newTitle")} conditions={conditions.conditions} onSubmit={handleCreate} onCancel={handleBackToList} />
      )}
      {view.mode === "detail" && (
        <HorseDetailView
          key={view.horseId}
          userId={props.userId}
          horseId={view.horseId}
          conditions={conditions}
          onBack={handleBackToList}
          onDeleted={handleBackToList}
        />
      )}
    </section>
  );
};

export default HorsesScreen;
