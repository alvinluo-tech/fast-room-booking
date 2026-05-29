import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Durham Room | 批量预约助手",
  description: "为 St John's College 学生打造的高效房间批量预约工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-slate-950 min-h-screen antialiased`}>
        <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-slate-950/80">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg tracking-tight text-white hover:text-violet-300 transition-colors">
              Durham Room
            </Link>
            <nav className="flex items-center gap-1">
              <Link href="/login" className="px-3.5 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">登录</Link>
              <Link href="/slots" className="px-3.5 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">可预约时间</Link>
              <Link href="/bookings" className="px-3.5 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">我的预约</Link>
            </nav>
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
