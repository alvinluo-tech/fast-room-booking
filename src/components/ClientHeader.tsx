"use client";
import Link from "next/link";
import HeaderNav from "./HeaderNav";

export default function ClientHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-700/50 bg-slate-900 shadow-xl">
      <div className="w-full px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl transition-colors" style={{ color: '#C4B5FD' }}>
          Durham Room
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
