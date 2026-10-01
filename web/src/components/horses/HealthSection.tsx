"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { HealthEntry, HealthEntryInput } from "../../api/types";
import { sortByDateDesc } from "../../utils/format";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Icon from "../ui/Icon";
import Notice from "../ui/Notice";
import SectionHeader from "../ui/SectionHeader";
import HealthEntryItem from "./HealthEntryItem";
import HealthForm from "./HealthForm";

interface HealthSectionProps {
  entries: HealthEntry[];
  onAdd: (input: HealthEntryInput) => Promise<boolean>;
  onDelete: (entryId: string) => void;
}

const HealthSection: React.FC<HealthSectionProps> = (props) => {
  const { t } = useTranslation();
  const [adding, setAdding] = useState<boolean>(false);
  const handleAdd = async (input: HealthEntryInput): Promise<void> => {
    const ok = await props.onAdd(input);
    setAdding(!ok);
  };
  const addButton = (
    <Button variant="secondary" size="sm" onClick={() => setAdding(true)}>
      <Icon name="plus" className="h-4 w-4" />
      {t("health.add")}
    </Button>
  );
  return (
    <Card className="flex flex-col gap-4">
      <SectionHeader title={t("health.title")} action={adding ? null : addButton} />
      {adding && <HealthForm onSubmit={handleAdd} onCancel={() => setAdding(false)} />}
      {props.entries.length === 0 ? (
        <Notice>{t("health.empty")}</Notice>
      ) : (
        <ol className="ml-2 border-l-2 border-black/10 pl-5">
          {sortByDateDesc(props.entries).map((entry) => (
            <HealthEntryItem key={entry.id} entry={entry} onDelete={props.onDelete} />
          ))}
        </ol>
      )}
    </Card>
  );
};

export default HealthSection;
