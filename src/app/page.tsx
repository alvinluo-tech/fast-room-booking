import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { Lightning, CalendarCheck, StackSimple, ArrowRight, SignIn, Clock, CheckCircle } from "@phosphor-icons/react/dist/ssr";

const features = [
  {
    icon: Lightning,
    title: "批量预约",
    description: "一次选择多个时间段，批量完成预约。支持全选、按时间段选择等便捷操作。",
    gradient: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-400",
  },
  {
    icon: CalendarCheck,
    title: "可视化日历",
    description: "清晰的月历视图，直观选择日期。实时显示可用时间段，预约状态一目了然。",
    gradient: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-400",
  },
  {
    icon: StackSimple,
    title: "智能管理",
    description: "查看所有即将到来的预约，支持一键取消。批量预约进度实时反馈。",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400",
  },
];

const steps = [
  { num: 1, label: "登录账户", desc: "使用 Durham 邮箱登录", icon: SignIn },
  { num: 2, label: "选择日期", desc: "在月历中选择预约日期", icon: CalendarCheck },
  { num: 3, label: "批量选择", desc: "勾选多个时间段", icon: Clock },
  { num: 4, label: "确认预约", desc: "一键完成批量预约", icon: CheckCircle },
];

const stats = [
  { value: "10x", label: "效率提升" },
  { value: "3", label: "核心功能" },
  { value: "100%", label: "免费使用" },
];

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-slate-950 relative grain-overlay">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-20">
        {/* Hero */}
        <div className="text-center space-y-6 animate-fade-in-up pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 text-white shadow-2xl shadow-violet-500/30">
            <CalendarCheck size={40} weight="duotone" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Durham Room
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              批量预约助手
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            告别逐个预约的繁琐，一次选择多个时间段，批量完成预约。
            <br />
            为 St John&apos;s College 学生打造。
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 flex-wrap animate-fade-in-up-delay-1">
          <a href="/login">
            <GradientButton className="px-8 py-4 text-base rounded-2xl">
              <span className="flex items-center gap-2">
                立即开始
                <ArrowRight size={18} />
              </span>
            </GradientButton>
          </a>
          <a
            className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300 font-semibold hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-200"
            href="/slots"
          >
            查看可预约时间
          </a>
        </div>

        {/* Features - Asymmetric layout: 1 large + 2 stacked */}
        <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up-delay-2">
          {/* Large feature card */}
          <GlassCard hover className="md:row-span-2 p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-600/5 flex items-center justify-center">
              <Lightning size={28} className="text-violet-400" weight="duotone" />
            </div>
            <h3 className="text-2xl font-bold text-white">{features[0].title}</h3>
            <p className="text-slate-400 leading-relaxed">{features[0].description}</p>
            <div className="pt-4 mt-auto">
              <div className="flex gap-3 flex-wrap">
                {["全选时间段", "按上午/下午/晚筛选", "一键批量预约"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-slate-300 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Two stacked cards */}
          {features.slice(1).map((f) => (
            <GlassCard key={f.title} hover className="p-8 space-y-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center`}>
                <f.icon size={24} className={f.iconColor} weight="duotone" />
              </div>
              <h3 className="text-xl font-bold text-white">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{f.description}</p>
            </GlassCard>
          ))}
        </div>

        {/* Steps */}
        <GlassCard className="p-10 space-y-8 animate-fade-in-up-delay-3">
          <h2 className="text-2xl font-bold text-center text-white">
            使用步骤
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 text-violet-400 flex items-center justify-center mx-auto">
                  <s.icon size={22} weight="duotone" />
                </div>
                <div className="font-semibold text-white text-sm">{s.label}</div>
                <div className="text-xs text-slate-500">{s.desc}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <GlassCard key={s.label} hover className="p-8 text-center space-y-2">
              <div className={`text-4xl font-bold tracking-tight ${i === 0 ? "text-violet-400" : i === 1 ? "text-blue-400" : "text-emerald-400"}`}>
                {s.value}
              </div>
              <div className="text-sm text-slate-500 font-medium">{s.label}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
