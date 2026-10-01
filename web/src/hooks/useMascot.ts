import { useEffect, useState } from "react";
import type { Mood } from "../api/types";
import { resolveFrame } from "../utils/mascot";
import type { MascotFrame } from "../utils/mascot";

export const TALK_INTERVAL_MS = 140;
export const BLINK_DURATION_MS = 120;
export const BLINK_MIN_DELAY_MS = 3000;
const BLINK_DELAY_SPREAD_MS = 3000;

interface UseMascotOptions {
  mood: Mood;
  pending: boolean;
  speaking: boolean;
}

export const useMascot = (options: UseMascotOptions): MascotFrame => {
  const [mouthOpen, setMouthOpen] = useState<boolean>(false);
  const [blinking, setBlinking] = useState<boolean>(false);
  const talking = options.speaking && !options.pending;
  const resting = !options.speaking && !options.pending;
  useEffect(() => {
    if (!talking) {
      return;
    }
    const timer = window.setInterval(() => setMouthOpen((open) => !open), TALK_INTERVAL_MS);
    return () => {
      window.clearInterval(timer);
      setMouthOpen(false);
    };
  }, [talking]);
  useEffect(() => {
    if (!resting) {
      return;
    }
    let timer = 0;
    const scheduleBlink = (): void => {
      timer = window.setTimeout(() => {
        setBlinking(true);
        timer = window.setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, BLINK_DURATION_MS);
      }, BLINK_MIN_DELAY_MS + Math.random() * BLINK_DELAY_SPREAD_MS);
    };
    scheduleBlink();
    return () => {
      window.clearTimeout(timer);
      setBlinking(false);
    };
  }, [resting]);
  return resolveFrame({
    mood: options.mood,
    pending: options.pending,
    mouthOpen: talking && mouthOpen,
    blinking: resting && blinking,
  });
};
