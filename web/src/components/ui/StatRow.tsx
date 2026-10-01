interface StatRowProps {
  label: string;
  value: string;
}

const StatRow: React.FC<StatRowProps> = (props) => {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5 last:border-b-0">
      <dt className="text-sm text-muted">{props.label}</dt>
      <dd className="text-right text-sm font-bold text-sway-black">{props.value}</dd>
    </div>
  );
};

export default StatRow;
