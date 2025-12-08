"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("正在登录");
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
      
      <div className="relative max-w-md w-full">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white text-4xl shadow-[0_0_40px_rgba(139,92,246,0.7),0_0_80px_rgba(139,92,246,0.4),0_8px_24px_rgba(0,0,0,0.5)] animate-pulse">
            🔒
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">登录 SimplyBook</h2>
          <p className="text-slate-400">使用账户登录后即可查看并预约房间</p>
        </div>
        
        {/* Premium Card Container with floating depth */}
        <div className="rounded-3xl border border-slate-600/50 bg-slate-800/90 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_1px_rgba(139,92,246,0.3)] ring-1 ring-white/5">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">邮箱</label>
              <input 
                className="w-full h-14 px-5 rounded-xl border border-slate-600/50 bg-slate-900/60 text-white text-base placeholder-slate-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.5),inset_0_1px_2px_rgba(139,92,246,0.2)] focus:border-violet-400 focus:bg-slate-900/80 transition-all duration-300 outline-none" 
                placeholder="your-email@durham.ac.uk"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">密码</label>
              <input 
                className="w-full h-14 px-5 rounded-xl border border-slate-600/50 bg-slate-900/60 text-white text-base placeholder-slate-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.5),inset_0_1px_2px_rgba(139,92,246,0.2)] focus:border-violet-400 focus:bg-slate-900/80 transition-all duration-300 outline-none" 
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full h-12 px-6 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_16px_rgba(139,92,246,0.5),0_3px_10px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_24px_rgba(139,92,246,0.6),0_4px_14px_rgba(0,0,0,0.5)] active:shadow-[inset_0_3px_8px_rgba(0,0,0,0.3),0_2px_8px_rgba(139,92,246,0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02]" 
              disabled={loading}
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>
          {message && (
            <div className={`mt-4 text-sm text-center px-4 py-2 rounded-xl ${
              message.includes("成功") 
                ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
