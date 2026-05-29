import { type ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "6xl" | "7xl";
}

export function PageShell({ children, className = "", maxWidth = "6xl" }: PageShellProps) {
  const maxW = maxWidth === "7xl" ? "max-w-7xl" : "max-w-6xl";

  return (
    <div className="min-h-[100dvh] bg-[#08080d] relative grain-overlay">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/6 w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-emerald-600/4 rounded-full blur-[100px]" />
      </div>
      <div className={`relative ${maxW} mx-auto px-4 sm:px-6 py-10 space-y-8 ${className}`}>
        {children}
      </div>
    </div>
  );
}
