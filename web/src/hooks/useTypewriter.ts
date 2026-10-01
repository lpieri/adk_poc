import { useEffect, useMemo, useState } from "react";

export const TYPE_TICK_MS = 28;
const CHARS_PER_TICK = 2;

interface TypewriterProgress {
  key: string;
  count: number;
}

export interface TypewriterState {
  visibleText: string;
  done: boolean;
}

export const useTypewriter = (key: string, text: string, enabled: boolean): TypewriterState => {
  const chars = useMemo<string[]>(() => Array.from(text), [text]);
  const [progress, setProgress] = useState<TypewriterProgress>({ key, count: 0 });
  const count = progress.key === key ? progress.count : 0;
  if (progress.key !== key) {
    setProgress({ key, count: 0 });
  }
  const shown = enabled ? Math.min(count, chars.length) : chars.length;
  const done = shown >= chars.length;
  useEffect(() => {
    if (done) {
      return;
    }
    const timer = window.setInterval(() => {
      setProgress((current) => ({ key: current.key, count: current.count + CHARS_PER_TICK }));
    }, TYPE_TICK_MS);
    return () => window.clearInterval(timer);
  }, [done, key]);
  return { visibleText: chars.slice(0, shown).join(""), done };
};
