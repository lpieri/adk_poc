export type IconName = "chat" | "horse" | "pin" | "send" | "plus" | "back" | "trash" | "edit" | "close" | "refresh" | "target";

interface IconProps {
  name: IconName;
  className?: string;
}

const ICON_PATHS: Record<IconName, string> = {
  chat: "M4 5h16v11H8l-4 4V5z",
  horse: "M6 20v-6l-2-3 3-6 5-2 6 3 2 5-3 1-2-2-2 4v6M10 7h.01",
  pin: "M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  send: "M4 12l16-8-6 16-2.5-6.5L4 12z",
  plus: "M12 5v14M5 12h14",
  back: "M15 5l-7 7 7 7",
  trash: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",
  edit: "M4 20h4L19 9l-4-4L4 16v4z",
  close: "M6 6l12 12M18 6L6 18",
  refresh: "M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4",
  target: "M12 3v3M12 18v3M3 12h3M18 12h3M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

const Icon: React.FC<IconProps> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={props.className ?? "h-5 w-5"}
    >
      <path d={ICON_PATHS[props.name]} />
    </svg>
  );
};

export default Icon;
