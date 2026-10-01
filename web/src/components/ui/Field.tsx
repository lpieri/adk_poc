import type { ReactNode } from "react";
import { LABEL_CLASS } from "../../utils/styles";

interface FieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

const Field: React.FC<FieldProps> = (props) => {
  return (
    <label className={`flex flex-col gap-1.5 ${props.className ?? ""}`}>
      <span className={LABEL_CLASS}>{props.label}</span>
      {props.children}
    </label>
  );
};

export default Field;
