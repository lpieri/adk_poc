import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const hasMatchMedia = (): boolean => {
  return typeof window !== "undefined" && typeof window.matchMedia === "function";
};

const readPreference = (): boolean => {
  return hasMatchMedia() && window.matchMedia(REDUCED_MOTION_QUERY).matches;
};

export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState<boolean>(readPreference);
  useEffect(() => {
    if (!hasMatchMedia()) {
      return;
    }
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = (): void => setReduced(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);
  return reduced;
};
