export const COORDINATE_DIGITS = 6;

export const COORDINATE_DISPLAY_DIGITS = 4;

export const parseCoordinate = (value: string): number | null => {
  const trimmed = value.trim().replace(",", ".");
  if (trimmed === "") {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

export const hasGeolocation = (): boolean => {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
};
