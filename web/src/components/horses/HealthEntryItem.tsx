"use client";

import { useTranslation } from "react-i18next";
import type { HealthEntry } from "../../api/types";
import { formatDate } from "../../utils/format";
import Icon from "../ui/Icon";

interface HealthEntryItemProps {
  entry: HealthEntry;
  onDelete: (entryId: string) => void;
}

const HealthEntryItem: React.FC<HealthEntryItemProps> = (props) => {
  const { t } = useTranslation();
  const { entry } = props;
  return (
    <li className="relative pb-5 last:pb-0">
      <span aria-hidden="true" className="absolute -left-[1.6rem] top-1 size-3 rounded-full bg-orange ring-4 ring-neutral" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            {formatDate(entry.date)} · {t(`health.kinds.${entry.kind}`)}
          </p>
          <p className="text-sm font-bold text-sway-black">{entry.label}</p>
          {entry.next_due && <p className="text-sm font-semibold text-purple">{t("health.nextDueValue", { date: formatDate(entry.next_due) })}</p>}
          {entry.notes && <p className="text-sm text-muted">{entry.notes}</p>}
        </div>
        <button
          type="button"
          aria-label={`${t("common.delete")} ${entry.label}`}
          onClick={() => props.onDelete(entry.id)}
          className="rounded-full p-2 text-muted transition-colors hover:bg-orange-soft hover:text-orange"
        >
          <Icon name="trash" className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
};

export default HealthEntryItem;
