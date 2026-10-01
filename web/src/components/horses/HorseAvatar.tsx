interface HorseAvatarProps {
  name: string;
  large?: boolean;
}

const HorseAvatar: React.FC<HorseAvatarProps> = (props) => {
  const sizeClass = props.large ? "h-16 w-16 text-3xl" : "h-14 w-14 text-2xl";
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-sway font-display font-extrabold text-white ${sizeClass}`}
    >
      {props.name.charAt(0).toUpperCase()}
    </span>
  );
};

export default HorseAvatar;
