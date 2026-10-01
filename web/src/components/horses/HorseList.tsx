"use client";

import { useTranslation } from "react-i18next";
import type { Horse } from "../../api/types";
import Notice from "../ui/Notice";
import HorseCard from "./HorseCard";

interface HorseListProps {
  horses: Horse[];
  labelFor: (code: string) => string;
  onSelect: (horseId: string) => void;
}

const HorseList: React.FC<HorseListProps> = (props) => {
  const { t } = useTranslation();
  if (props.horses.length === 0) {
    return <Notice>{t("horses.empty")}</Notice>;
  }
  return (
    <ul className="flex flex-col gap-4">
      {props.horses.map((horse) => (
        <li key={horse.id}>
          <HorseCard horse={horse} labelFor={props.labelFor} onSelect={props.onSelect} />
        </li>
      ))}
    </ul>
  );
};

export default HorseList;
