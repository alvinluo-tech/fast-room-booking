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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-slate-900 min-h-screen antialiased`}>
        <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-slate-900/80">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent hover:from-violet-300 hover:to-blue-300 transition-all">
              Durham Room
            </Link>
            <nav className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all">登录</Link>
              <Link href="/slots" className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all">可预约时间</Link>
              <Link href="/bookings" className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all">我的预约</Link>
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
