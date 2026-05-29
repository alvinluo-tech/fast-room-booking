import { type ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "6xl" | "7xl";
}

export function PageShell({ children, className = "", maxWidth = "6xl" }: PageShellProps) {
  const maxW = maxWidth === "7xl" ? "max-w-7xl" : "max-w-6xl";

  return (
    <div className="min-h-screen bg-slate-900 relative">
      <div className="absolute inset-0 bg-gradient-radial from-violet-600/20 via-transparent to-transparent pointer-events-none" />
      <div className={`relative ${maxW} mx-auto px-4 sm:px-6 py-12 space-y-8 ${className}`}>
        {children}
      </div>
    </div>
  );
}
