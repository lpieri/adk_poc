"use client";

import { LABEL_CLASS } from "../../utils/styles";

export interface ChoiceOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  label: string;
  options: ChoiceOption[];
  value: string;
  onChange: (value: string) => void;
}

const SLIDING_MAX_OPTIONS = 4;
const ITEM_CLASS = "relative z-10 rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-300";
const ITEM_OFF_CLASS = "text-muted hover:bg-greige hover:text-sway-black";

const SegmentedControl: React.FC<SegmentedControlProps> = (props) => {
  const count = props.options.length;
  const sliding = count <= SLIDING_MAX_OPTIONS;
  const index = props.options.findIndex((option) => option.value === props.value);
  const activeClass = sliding ? "text-white" : "bg-sway-black text-white";
  return (
    <div className="flex flex-col gap-1.5">
      <span className={LABEL_CLASS}>{props.label}</span>
      <div
        role="radiogroup"
        aria-label={props.label}
        className={`relative overflow-hidden border border-black/6 bg-white p-1 ${sliding ? "grid rounded-full" : "flex flex-wrap gap-1 rounded-3xl"}`}
        style={sliding ? { gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` } : undefined}
      >
        {sliding && (
          <span
            aria-hidden="true"
            data-testid="segment-pill"
            className="absolute inset-y-1 left-1 rounded-full bg-sway-black transition-transform duration-500 ease-spring"
            style={{ width: `calc((100% - 0.5rem) / ${count})`, transform: `translateX(${index * 100}%)` }}
          />
        )}
        {props.options.map((option) => {
          const selected = option.value === props.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => props.onChange(option.value)}
              className={`${ITEM_CLASS} ${selected ? activeClass : ITEM_OFF_CLASS}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentedControl;
