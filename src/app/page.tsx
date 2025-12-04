export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-violet-600/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-blue-600 text-white text-4xl mb-6 shadow-2xl shadow-violet-500/50">
            🏛️
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            Durham Room
            <br />
            批量预约助手
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            告别逐个预约的繁琐，一次选择多个时间段，批量完成预约。
            <br />
            为 St John&apos;s College 学生打造的高效预约工具。
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <a 
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold shadow-2xl shadow-violet-500/50 hover:shadow-violet-500/70 transition-all hover:scale-105 hover:brightness-110" 
            href="/login"
          >
            <span className="flex items-center gap-2">
              立即开始
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </a>
          <a 
            className="px-8 py-4 rounded-2xl border-2 border-white/10 backdrop-blur-md bg-white/5 text-slate-200 font-semibold hover:bg-white/10 hover:border-white/20 transition-all" 
            href="/slots"
          >
            查看可预约时间
          </a>
        </div>

        {/* Bento Grid Features */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="group rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 p-8 space-y-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-violet-500/50 group-hover:shadow-xl group-hover:shadow-violet-500/70 transition-all">
              ⚡
            </div>
            <h3 className="text-2xl font-bold text-white">批量预约</h3>
            <p className="text-slate-400 leading-relaxed">
              一次选择多个时间段，批量完成预约。支持全选、按时间段选择等便捷操作。
            </p>
          </div>

          <div className="group rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 p-8 space-y-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/50 group-hover:shadow-xl group-hover:shadow-blue-500/70 transition-all">
              📅
            </div>
            <h3 className="text-2xl font-bold text-white">可视化日历</h3>
            <p className="text-slate-400 leading-relaxed">
              清晰的月历视图，直观选择日期。实时显示可用时间段，预约状态一目了然。
            </p>
          </div>

          <div className="group rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 p-8 space-y-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl shadow-lg shadow-green-500/50 group-hover:shadow-xl group-hover:shadow-green-500/70 transition-all">
              ✅
            </div>
            <h3 className="text-2xl font-bold text-white">智能管理</h3>
            <p className="text-slate-400 leading-relaxed">
              查看所有即将到来的预约，支持一键取消。批量预约进度实时反馈，成功失败清晰统计。
            </p>
          </div>
        </div>

        {/* Quick Guide */}
        <div className="rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 p-10 space-y-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">🚀 使用步骤</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white flex items-center justify-center mx-auto font-bold text-xl shadow-lg shadow-violet-500/50">1</div>
              <div className="font-semibold text-white text-lg">登录账户</div>
              <div className="text-sm text-slate-400">使用 Durham 邮箱登录</div>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white flex items-center justify-center mx-auto font-bold text-xl shadow-lg shadow-violet-500/50">2</div>
              <div className="font-semibold text-white text-lg">选择日期</div>
              <div className="text-sm text-slate-400">在月历中选择预约日期</div>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white flex items-center justify-center mx-auto font-bold text-xl shadow-lg shadow-violet-500/50">3</div>
              <div className="font-semibold text-white text-lg">批量选择</div>
              <div className="text-sm text-slate-400">勾选多个时间段</div>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white flex items-center justify-center mx-auto font-bold text-xl shadow-lg shadow-violet-500/50">4</div>
              <div className="font-semibold text-white text-lg">确认预约</div>
              <div className="text-sm text-slate-400">一键完成批量预约</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 p-8 text-center space-y-2 hover:bg-white/10 transition-all">
            <div className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">10x</div>
            <div className="text-slate-400 font-medium">效率提升</div>
          </div>
          <div className="rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 p-8 text-center space-y-2 hover:bg-white/10 transition-all">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">3</div>
            <div className="text-slate-400 font-medium">核心功能</div>
          </div>
          <div className="rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 p-8 text-center space-y-2 hover:bg-white/10 transition-all">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">100%</div>
            <div className="text-slate-400 font-medium">免费使用</div>
          </div>
        </div>
      </div>
    </div>
  );
}
