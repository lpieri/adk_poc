import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { fetchConditions } from "../api/conditions";
import type { Condition } from "../api/types";
import { useResource } from "./useResource";

export const KNOWN_CONDITION_CODES = [
  "pssm1",
  "colic_history",
  "ems",
  "ppid",
  "gastric_ulcers",
  "equine_asthma",
  "laminitis",
  "hypp",
  "dental_issues",
];

export interface ConditionsState {
  conditions: Condition[];
  labelFor: (code: string) => string;
}

export const useConditions = (): ConditionsState => {
  const { t } = useTranslation();
  const resource = useResource<Condition[]>(fetchConditions, []);
  const conditions = useMemo<Condition[]>(() => {
    if (resource.error || (!resource.loading && resource.data.length === 0)) {
      return KNOWN_CONDITION_CODES.map((code) => ({ code, label: t(`conditions.${code}`), summary: "" }));
    }
    return resource.data;
  }, [resource.error, resource.loading, resource.data, t]);
  const labelFor = useCallback(
    (code: string): string => {
      const match = conditions.find((condition) => condition.code === code);
      return match ? match.label : t(`conditions.${code}`, { defaultValue: code });
    },
    [conditions, t],
  );
  return { conditions, labelFor };
};
