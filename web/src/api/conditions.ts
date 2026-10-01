import { request } from "./client";
import type { Condition } from "./types";

export const fetchConditions = (): Promise<Condition[]> => {
  return request<Condition[]>("/conditions");
};
