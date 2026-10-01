import type { ReactNode } from "react";
import { DISPLAY_TITLE_CLASS } from "../../utils/styles";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  large?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
  const HeadingTag = props.large ? "h1" : "h2";
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <HeadingTag className={`${DISPLAY_TITLE_CLASS} ${props.large ? "text-3xl" : "text-lg"}`}>{props.title}</HeadingTag>
        {props.subtitle && <p className="mt-1 text-sm text-muted">{props.subtitle}</p>}
      </div>
      {props.action}
    </div>
  );
};

export default SectionHeader;
