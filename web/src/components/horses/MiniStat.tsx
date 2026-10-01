interface MiniStatProps {
  label: string;
  value: string;
}

const MiniStat: React.FC<MiniStatProps> = (props) => {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[0.68rem] font-bold uppercase tracking-wide text-muted">{props.label}</dt>
      <dd className="text-sm font-bold text-sway-black">{props.value}</dd>
    </div>
  );
};

export default MiniStat;
