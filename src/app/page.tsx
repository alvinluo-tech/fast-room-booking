export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* 极简主内容容器 */}
      <div className="flex flex-col items-center justify-center min-h-screen px-8">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Durham Room
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-violet-400 mb-6">
            批量预约助手
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            一次选择多个时间段，批量完成预约
          </p>
        </div>

        {/* 主操作按钮 - 增强视觉冲击力 */}
        <a 
          className="px-16 py-5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xl shadow-[0_10px_30px_rgba(139,92,246,0.6),0_4px_14px_rgba(0,0,0,0.5)] hover:shadow-[0_14px_40px_rgba(139,92,246,0.7),0_6px_18px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-[0.98] transition-all duration-300" 
          href="/login"
        >
          立即开始
        </a>
      </div>
    </div>
  );
}
