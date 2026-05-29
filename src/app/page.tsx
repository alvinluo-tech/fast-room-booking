import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";

const features = [
  {
    icon: "⚡",
    title: "批量预约",
    description: "一次选择多个时间段，批量完成预约。支持全选、按时间段选择等便捷操作。",
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/50",
  },
  {
    icon: "📅",
    title: "可视化日历",
    description: "清晰的月历视图，直观选择日期。实时显示可用时间段，预约状态一目了然。",
    gradient: "from-blue-500 to-cyan-600",
    shadow: "shadow-blue-500/50",
  },
  {
    icon: "✅",
    title: "智能管理",
    description: "查看所有即将到来的预约，支持一键取消。批量预约进度实时反馈，成功失败清晰统计。",
    gradient: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/50",
  },
];

const steps = [
  { num: 1, label: "登录账户", desc: "使用 Durham 邮箱登录" },
  { num: 2, label: "选择日期", desc: "在月历中选择预约日期" },
  { num: 3, label: "批量选择", desc: "勾选多个时间段" },
  { num: 4, label: "确认预约", desc: "一键完成批量预约" },
];

const stats = [
  { value: "10x", label: "效率提升", gradient: "from-violet-400 to-purple-400" },
  { value: "3", label: "核心功能", gradient: "from-blue-400 to-cyan-400" },
  { value: "100%", label: "免费使用", gradient: "from-green-400 to-emerald-400" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 relative">
      <div className="absolute inset-0 bg-gradient-radial from-violet-600/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* Hero */}
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-blue-600 text-white text-4xl mb-6 shadow-2xl shadow-violet-500/50">
            {/* biome-ignore lint/a11y/useSemanticElements: decorative emoji icon */}
            <span role="img" aria-hidden="true">{"🏛️"}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            Durham Room
            <br />
            批量预约助手
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            告别逐个预约的繁琐，一次选择多个时间段，批量完成预约。
            <br />
            为 St John&apos;s College 学生打造的高效预约工具。
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 flex-wrap animate-fade-in-up-delay-1">
          <a href="/login">
            <GradientButton className="px-8 py-4 text-base rounded-2xl shadow-2xl hover:scale-105">
              <span className="flex items-center gap-2">
                立即开始
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </GradientButton>
          </a>
          <a
            className="px-8 py-4 rounded-2xl border-2 border-white/10 backdrop-blur-md bg-white/5 text-slate-200 font-semibold hover:bg-white/10 hover:border-white/20 transition-all"
            href="/slots"
          >
            查看可预约时间
          </a>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 animate-fade-in-up-delay-2">
          {features.map((f) => (
            <GlassCard key={f.title} hover className="group p-8 space-y-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-3xl shadow-lg ${f.shadow} group-hover:shadow-xl group-hover:scale-105 transition-all`}
              >
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold text-white">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.description}</p>
            </GlassCard>
          ))}
        </div>

        {/* Steps */}
        <GlassCard className="p-10 space-y-8 animate-fade-in-up-delay-3">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            {"🚀"} 使用步骤
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white flex items-center justify-center mx-auto font-bold text-xl shadow-lg shadow-violet-500/50">
                  {s.num}
                </div>
                <div className="font-semibold text-white text-lg">{s.label}</div>
                <div className="text-sm text-slate-400">{s.desc}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((s) => (
            <GlassCard key={s.label} hover className="p-8 text-center space-y-2">
              <div className={`text-5xl font-bold bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
                {s.value}
              </div>
              <div className="text-slate-400 font-medium">{s.label}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
