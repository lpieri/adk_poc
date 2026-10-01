import type { HorseInput, Sex, Workload } from "../api/types";

export interface HorseDraft {
  name: string;
  breed: string;
  sex: Sex;
  birthYear: string;
  weightKg: string;
  bodyCondition: number;
  workload: Workload;
  conditions: string[];
  notes: string;
}

export const DEFAULT_BODY_CONDITION = 5;

export const toHorseDraft = (horse?: HorseInput): HorseDraft => {
  return {
    name: horse?.name ?? "",
    breed: horse?.breed ?? "",
    sex: horse?.sex ?? "mare",
    birthYear: horse?.birth_year ? String(horse.birth_year) : "",
    weightKg: horse ? String(horse.weight_kg) : "",
    bodyCondition: horse?.body_condition ?? DEFAULT_BODY_CONDITION,
    workload: horse?.workload ?? "light",
    conditions: horse?.conditions ?? [],
    notes: horse?.notes ?? "",
  };
};

export const isHorseDraftValid = (draft: HorseDraft): boolean => {
  return draft.name.trim() !== "" && Number(draft.weightKg) > 0;
};

export const fromHorseDraft = (draft: HorseDraft): HorseInput => {
  return {
    name: draft.name.trim(),
    breed: draft.breed.trim(),
    sex: draft.sex,
    birth_year: draft.birthYear ? Number(draft.birthYear) : null,
    weight_kg: Number(draft.weightKg),
    body_condition: draft.bodyCondition,
    workload: draft.workload,
    conditions: draft.conditions,
    notes: draft.notes.trim(),
  };
};
