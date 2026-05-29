import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = "", hover = false, onClick }: GlassCardProps) {
  const hoverClasses = hover
    ? "hover:bg-white/10 hover:border-white/20 transition-all duration-300"
    : "";

  return (
    <div
      className={`rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 p-6 ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
