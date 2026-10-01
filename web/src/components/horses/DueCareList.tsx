"use client";

import { useTranslation } from "react-i18next";
import type { CareItem } from "../../api/types";
import { careTiming } from "../../utils/horseLabels";
import Card from "../ui/Card";
import Notice from "../ui/Notice";
import SectionHeader from "../ui/SectionHeader";
import CareStatusChip from "./CareStatusChip";

interface DueCareListProps {
  items: CareItem[];
}

const DueCareList: React.FC<DueCareListProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Card className="flex flex-col gap-3">
      <SectionHeader title={t("care.title")} />
      {props.items.length === 0 ? (
        <Notice>{t("care.empty")}</Notice>
      ) : (
        <ul className="flex flex-col">
          {props.items.map((item, index) => (
            <li key={`${item.kind}-${index}`} className="flex items-center justify-between gap-3 border-b border-hairline py-2.5 last:border-b-0">
              <div className="min-w-0">
                <p className="text-sm font-bold text-sway-black">{item.label || t(`health.kinds.${item.kind}`)}</p>
                <p className="text-sm text-muted">{careTiming(t, item)}</p>
              </div>
              <CareStatusChip status={item.status} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default DueCareList;
