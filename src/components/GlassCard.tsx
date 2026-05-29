import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = "", hover = false, onClick }: GlassCardProps) {
  const hoverClasses = hover
    ? "hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 ease-out"
    : "";

  return (
    <div
      className={["rounded-2xl border border-white/10 backdrop-blur-md bg-white/[0.04] p-6 glass-highlight", hoverClasses, className].filter(Boolean).join(" ")}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
