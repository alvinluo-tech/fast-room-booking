import { type ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function GradientButton({
  children,
  className = "",
  disabled = false,
  onClick,
  type = "button",
}: GradientButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-violet-500/70 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:scale-[1.03] active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}
