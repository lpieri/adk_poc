const ISO_DATE_LENGTH = 10;
const LOCALE = "fr-FR";

const parseDate = (value: string): Date => {
  return value.length === ISO_DATE_LENGTH ? new Date(`${value}T00:00:00`) : new Date(value);
};

const pad = (value: number): string => {
  return String(value).padStart(2, "0");
};

export const formatDate = (value: string): string => {
  return parseDate(value).toLocaleDateString(LOCALE, { day: "numeric", month: "short", year: "numeric" });
};

export const formatNumber = (value: number): string => {
  return value.toLocaleString(LOCALE, { maximumFractionDigits: 1 });
};

export const todayIso = (now: Date = new Date()): string => {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export const horseAge = (birthYear: number | null, now: Date = new Date()): number | null => {
  return birthYear === null ? null : Math.max(0, now.getFullYear() - birthYear);
};

export const sortByDateDesc = <T extends { date: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
};
