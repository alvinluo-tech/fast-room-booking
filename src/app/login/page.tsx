"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GradientButton } from "@/components/GradientButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Lock, Envelope } from "@phosphor-icons/react/dist/ssr";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.ok) {
      setMessage("登录成功");
      router.push("/slots");
    } else {
      setMessage(`登录失败: ${data.error ?? "未知错误"}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center p-6 relative grain-overlay">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-md w-full animate-fade-in-up">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 text-white shadow-2xl shadow-violet-500/30">
            <Lock size={30} weight="duotone" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            登录 SimplyBook
          </h2>
          <p className="text-slate-500 text-sm">使用账户登录后即可查看并预约房间</p>
        </div>

        <div className="rounded-2xl border border-white/10 backdrop-blur-md bg-white/[0.03] p-8 glass-highlight">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">邮箱</label>
              <div className="relative">
                <Envelope size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-slate-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all outline-none"
                  placeholder="your-email@durham.ac.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">密码</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-slate-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all outline-none"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <GradientButton
              type="submit"
              className="w-full py-3.5 text-base rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  登录中...
                </span>
              ) : (
                "登录"
              )}
            </GradientButton>
          </form>
          {message && (
            <div
              className={`mt-4 text-sm text-center px-4 py-2.5 rounded-xl ${
                message.includes("成功")
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
