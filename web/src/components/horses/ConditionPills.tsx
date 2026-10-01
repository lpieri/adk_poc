import Pill from "../ui/Pill";

interface ConditionPillsProps {
  codes: string[];
  labelFor: (code: string) => string;
}

const ConditionPills: React.FC<ConditionPillsProps> = (props) => {
  if (props.codes.length === 0) {
    return null;
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {props.codes.map((code) => (
        <li key={code}>
          <Pill tone="purple">{props.labelFor(code)}</Pill>
        </li>
      ))}
    </ul>
  );
};

export default ConditionPills;
