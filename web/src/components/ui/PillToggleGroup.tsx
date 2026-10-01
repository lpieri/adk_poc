"use client";

import { LABEL_CLASS } from "../../utils/styles";
import type { ChoiceOption } from "./SegmentedControl";

interface PillToggleGroupProps {
  label: string;
  options: ChoiceOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const PillToggleGroup: React.FC<PillToggleGroupProps> = (props) => {
  const handleToggle = (value: string): void => {
    const active = props.selected.includes(value);
    props.onChange(active ? props.selected.filter((item) => item !== value) : [...props.selected, value]);
  };
  return (
    <div className="flex flex-col gap-1.5">
      <span className={LABEL_CLASS}>{props.label}</span>
      <div role="group" aria-label={props.label} className="flex flex-wrap gap-2">
        {props.options.map((option) => {
          const active = props.selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => handleToggle(option.value)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors duration-300 ${active ? "border-sway-black bg-sway-black text-white" : "border-black/6 bg-white text-subtle hover:bg-greige"}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PillToggleGroup;
