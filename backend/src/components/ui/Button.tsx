// src/components/ui/Button.tsx
"use client";

type Variant = "voir" | "creer-projet" | "creer-tache";

type Props = {
  variant?: Variant;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

const variants: Record<Variant, string> = {
  "voir":
    "text-xs bg-btn-black w-20 h-10 md:w-30.25 md:h-12.5  text-text-white hover:text-brand-dark hover:bg-bg-content hover:border border-brand-dark focus:ring-2 focus:ring-brand-dark rounded-md transition",
  "creer-projet":
    "px-4 py-2 w-10 h-10 md:w-45.25 md:h-12.5 rounded-md bg-btn-2-Black text-white text-[16px] hover:text-brand-dark hover:bg-bg-content hover:border border-brand-dark transition",
  "creer-tache":
    "w-20 h-10 md:w-35.25 md:h-12.5  bg-btn-black text-text-white text-sm rounded-[10px] hover:text-brand-dark hover:bg-bg-content border border-brand-dark transition",
};

export default function Button({
  variant = "voir",
  children,
  onClick,
  type = "button",
  disabled,
  className = "",
  ariaLabel,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${variants[variant]} disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}