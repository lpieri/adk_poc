import type { TFunction } from "i18next";
import type { CareItem } from "../api/types";
import { horseAge } from "./format";

export const formatAge = (t: TFunction, birthYear: number | null): string => {
  const age = horseAge(birthYear);
  return age === null ? t("horses.ageUnknown") : t("horses.age", { count: age });
};

export const careTiming = (t: TFunction, item: CareItem): string => {
  if (item.days_left === null) {
    return t("care.noDate");
  }
  if (item.days_left < 0) {
    return t("care.daysLate", { count: Math.abs(item.days_left) });
  }
  if (item.days_left === 0) {
    return t("care.dueToday");
  }
  return t("care.daysLeft", { count: item.days_left });
};
