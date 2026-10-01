import type { Discipline, HealthKind, Intensity, PlaceKind, Sex, Workload } from "../api/types";

export const SEX_VALUES: Sex[] = ["mare", "gelding", "stallion"];

export const WORKLOAD_VALUES: Workload[] = ["rest", "light", "moderate", "intense"];

export const HEALTH_KINDS: HealthKind[] = ["vaccine", "deworming", "farrier", "dentist", "vet", "osteo", "other"];

export const DISCIPLINES: Discipline[] = ["dressage", "jumping", "cross", "hack", "groundwork", "lunging"];

export const INTENSITIES: Intensity[] = ["light", "moderate", "intense"];

export const PLACE_KINDS: PlaceKind[] = ["stable", "home", "other"];
