"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { Condition, HorseInput } from "../../api/types";
import { fromHorseDraft, isHorseDraftValid, toHorseDraft } from "../../utils/horseDraft";
import type { HorseDraft } from "../../utils/horseDraft";
import { DISPLAY_TITLE_CLASS } from "../../utils/styles";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Icon from "../ui/Icon";
import Notice from "../ui/Notice";
import HorseCareFields from "./HorseCareFields";
import HorseIdentityFields from "./HorseIdentityFields";

interface HorseFormProps {
  title: string;
  initial?: HorseInput;
  conditions: Condition[];
  onSubmit: (input: HorseInput) => Promise<boolean>;
  onCancel: () => void;
}

const HorseForm: React.FC<HorseFormProps> = (props) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<HorseDraft>(() => toHorseDraft(props.initial));
  const [saving, setSaving] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const handleChange = (patch: Partial<HorseDraft>): void => {
    setDraft((current) => ({ ...current, ...patch }));
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSaving(true);
    const ok = await props.onSubmit(fromHorseDraft(draft));
    setSaving(false);
    setFailed(!ok);
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" ariaLabel={t("common.back")} onClick={props.onCancel}>
          <Icon name="back" />
        </Button>
        <h1 className={`${DISPLAY_TITLE_CLASS} text-2xl`}>{props.title}</h1>
      </div>
      <Card className="flex flex-col gap-5">
        <HorseIdentityFields draft={draft} onChange={handleChange} />
        <HorseCareFields draft={draft} conditions={props.conditions} onChange={handleChange} />
      </Card>
      {failed && <Notice tone="danger">{t("common.actionError")}</Notice>}
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={props.onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" className="flex-1" disabled={saving || !isHorseDraftValid(draft)}>
          {t("common.save")}
        </Button>
      </div>
    </form>
  );
};

export default HorseForm;
