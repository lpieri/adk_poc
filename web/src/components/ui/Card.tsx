import type { ReactNode } from "react";

type CardTone = "neutral" | "glow" | "greige";

interface CardProps {
  children: ReactNode;
  tone?: CardTone;
  className?: string;
}

const TONE_CLASSES: Record<CardTone, string> = {
  neutral: "border border-hairline bg-neutral",
  glow: "border border-hairline sway-panel-glow",
  greige: "bg-greige",
};

const Card: React.FC<CardProps> = (props) => {
  return <div className={`rounded-2xl p-5 ${TONE_CLASSES[props.tone ?? "neutral"]} ${props.className ?? ""}`}>{props.children}</div>;
};

export default Card;
