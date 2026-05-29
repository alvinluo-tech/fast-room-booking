"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GradientButton } from "@/components/GradientButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-radial from-violet-600/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-md w-full animate-fade-in-up">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 text-white text-3xl shadow-2xl shadow-violet-500/50">
            {"🔒"}
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            登录 SimplyBook
          </h2>
          <p className="text-slate-400">使用账户登录后即可查看并预约房间</p>
        </div>

        <div className="rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 p-8 shadow-2xl">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">邮箱</label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all outline-none"
                placeholder="your-email@durham.ac.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">密码</label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all outline-none"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
                  ? "bg-green-500/15 text-green-300 border border-green-500/30"
                  : "bg-red-500/15 text-red-300 border border-red-500/30"
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
