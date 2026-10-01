import type { ReactNode } from "react";

export type PillTone = "orange" | "purple" | "magenta" | "green" | "blue" | "muted" | "greige";

interface PillProps {
  children: ReactNode;
  tone?: PillTone;
  dot?: boolean;
}

const TONE_CLASSES: Record<PillTone, { pill: string; dot: string }> = {
  orange: { pill: "bg-orange-soft text-orange", dot: "bg-orange" },
  purple: { pill: "bg-purple-soft text-purple", dot: "bg-purple" },
  magenta: { pill: "bg-magenta-soft text-magenta", dot: "bg-magenta" },
  green: { pill: "bg-green-soft text-green", dot: "bg-green" },
  blue: { pill: "bg-blue-soft text-link", dot: "bg-link" },
  muted: { pill: "bg-greige text-muted", dot: "bg-muted" },
  greige: { pill: "bg-greige text-subtle", dot: "bg-subtle" },
};

const Pill: React.FC<PillProps> = (props) => {
  const tone = TONE_CLASSES[props.tone ?? "purple"];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${tone.pill}`}>
      {props.dot && <span aria-hidden="true" className={`size-1.5 rounded-full ${tone.dot}`} />}
      {props.children}
    </span>
  );
};

export default Pill;
