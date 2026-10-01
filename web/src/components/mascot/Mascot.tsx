"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MASCOT_FALLBACK_SRC, MASCOT_FRAMES, frameSrc } from "../../utils/mascot";
import type { MascotFrame } from "../../utils/mascot";

type MascotSize = "hero" | "avatar";

interface MascotProps {
  frame: MascotFrame;
  size: MascotSize;
  bob?: boolean;
}

const SIZE_CLASSES: Record<MascotSize, string> = {
  hero: "h-60 w-60 sm:h-72 sm:w-72",
  avatar: "h-24 w-24",
};

const IMAGE_CLASS = "pointer-events-none absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-75";

const Mascot: React.FC<MascotProps> = (props) => {
  const { t } = useTranslation();
  const [failedFrames, setFailedFrames] = useState<MascotFrame[]>([]);
  const shownFrame = [props.frame, "idle" as const].find((frame) => !failedFrames.includes(frame));
  const handleError = (frame: MascotFrame): void => {
    setFailedFrames((current) => [...current, frame]);
  };
  return (
    <div
      role="img"
      aria-label={t("mascot.alt")}
      data-frame={shownFrame ?? "fallback"}
      className={`relative shrink-0 overflow-hidden ${SIZE_CLASSES[props.size]} ${props.bob ? "motion-safe:animate-bob" : ""}`}
    >
      {MASCOT_FRAMES.map((frame) => (
        <img
          key={frame}
          src={frameSrc(frame)}
          alt=""
          draggable={false}
          onError={() => handleError(frame)}
          className={IMAGE_CLASS}
          style={{ opacity: frame === shownFrame ? 1 : 0 }}
        />
      ))}
      {shownFrame === undefined && <img src={MASCOT_FALLBACK_SRC} alt="" className={IMAGE_CLASS} />}
    </div>
  );
};

export default Mascot;
