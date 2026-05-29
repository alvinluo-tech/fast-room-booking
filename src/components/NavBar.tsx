"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck } from "@phosphor-icons/react/dist/ssr";

const navItems = [
  { href: "/login", label: "登录" },
  { href: "/slots", label: "可预约时间" },
  { href: "/bookings", label: "我的预约" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-[#08080d]/80">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-base tracking-tight text-white hover:text-violet-300 transition-colors">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
            <CalendarCheck size={14} className="text-white" weight="bold" />
          </div>
          Durham Room
        </Link>
        <nav className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "text-white bg-white/[0.06]"
                    : "text-slate-500 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
