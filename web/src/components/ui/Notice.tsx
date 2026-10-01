import type { ReactNode } from "react";

type NoticeTone = "danger" | "muted";

interface NoticeProps {
  children: ReactNode;
  tone?: NoticeTone;
}

const TONE_CLASSES: Record<NoticeTone, string> = {
  danger: "bg-orange-soft text-orange",
  muted: "bg-greige text-muted",
};

const Notice: React.FC<NoticeProps> = (props) => {
  const tone = props.tone ?? "muted";
  return (
    <p role={tone === "danger" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm font-medium ${TONE_CLASSES[tone]}`}>
      {props.children}
    </p>
  );
};

export default Notice;
