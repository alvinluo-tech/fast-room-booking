import { type ReactNode } from "react";

interface GhostButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function GhostButton({
  children,
  className = "",
  disabled = false,
  onClick,
  type = "button",
}: GhostButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-200 ease-out active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
