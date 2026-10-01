"use client";

import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonSize = "md" | "sm";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  onClick?: () => void;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-sway-black text-white hover:bg-sway-black/80",
  secondary: "border border-black/6 bg-white text-sway-black hover:bg-greige",
  ghost: "bg-transparent text-muted hover:bg-greige hover:text-sway-black",
  danger: "bg-orange-soft text-orange hover:bg-orange hover:text-white",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-8 py-4",
  sm: "px-4 py-2",
};

const Button: React.FC<ButtonProps> = (props) => {
  const variant = VARIANT_CLASSES[props.variant ?? "primary"];
  const size = SIZE_CLASSES[props.size ?? "md"];
  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      aria-label={props.ariaLabel}
      onClick={props.onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${variant} ${size} ${props.className ?? ""}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
