import type { Mood } from "../api/types";

export const MASCOT_FRAMES = [
  "idle",
  "idle_talk",
  "happy",
  "happy_talk",
  "thinking",
  "worried",
  "worried_talk",
  "surprised",
  "blink",
] as const;

export type MascotFrame = (typeof MASCOT_FRAMES)[number];

export const MASCOT_FALLBACK_SRC = "/mascot/reference.webp";

const TALK_FRAMES: Record<Mood, MascotFrame> = {
  idle: "idle_talk",
  happy: "happy_talk",
  thinking: "idle_talk",
  worried: "worried_talk",
  surprised: "idle_talk",
};

const BLINKABLE_MOODS: Mood[] = ["idle"];

export interface FrameState {
  mood: Mood;
  pending: boolean;
  mouthOpen: boolean;
  blinking: boolean;
}

export const frameSrc = (frame: MascotFrame): string => {
  return `/mascot/${frame}.webp`;
};

export const canBlink = (mood: Mood): boolean => {
  return BLINKABLE_MOODS.includes(mood);
};

export const resolveFrame = (state: FrameState): MascotFrame => {
  if (state.pending) {
    return "thinking";
  }
  if (state.mouthOpen) {
    return TALK_FRAMES[state.mood];
  }
  if (state.blinking && canBlink(state.mood)) {
    return "blink";
  }
  return state.mood;
};
