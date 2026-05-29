"use client";
import { useMemo, useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { GhostButton } from "@/components/GhostButton";
import { PageShell } from "@/components/PageShell";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type SlotItem = { time?: string; provider_id?: string; service_id?: string } & Record<string, unknown>;

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const WEEKDAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

const quickSelectButtons = [
  { label: "全选", action: "all" as const, icon: null },
  { label: "上午 (6-12点)", action: "morning" as const, icon: "🌅" },
  { label: "下午 (12-18点)", action: "afternoon" as const, icon: "☀️" },
  { label: "晚上 (18点后)", action: "evening" as const, icon: "🌙" },
];

export default function SlotsPage() {
  const [date, setDate] = useState<string>(toLocalDateStr(new Date()));
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [info, setInfo] = useState<string>("首次加载，请选择日期");
  const [loading, setLoading] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [batchBooking, setBatchBooking] = useState(false);

  useEffect(() => {
    const initialDate = toLocalDateStr(new Date());
    setDate(initialDate);
    setTimeout(() => {
      loadSlots(initialDate);
    }, 100);
  }, []);

  const loadSlots = async (dateParam?: string) => {
    const dateToLoad = dateParam || date;
    setLoading(true);
    setInfo("加载中...");

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(`/api/slots?from=${dateToLoad}&to=${dateToLoad}&provider=7&service=7&count=1`);
        const data = await res.json();

        if (!data.ok) {
          if (attempt < maxRetries) {
            setInfo(`加载失败，正在重试 (${attempt}/${maxRetries})...`);
            await new Promise((r) => setTimeout(r, 1000 * attempt));
            continue;
          }
          setInfo(`加载失败: ${data.error ?? "未知错误"}`);
          setSlots([]);
          return;
        }

        const parsed = data.data;
        const items = parsed?.items ?? [];
        setSlots(items);
        setInfo(`加载完成，共 ${items.length} 个时间段`);
        setLoading(false);
        return;
      } catch (error) {
        if (attempt < maxRetries) {
          setInfo(`加载失败，正在重试 (${attempt}/${maxRetries})...`);
          await new Promise((r) => setTimeout(r, 1000 * attempt));
          continue;
        }
        setInfo(`加载失败: ${error instanceof Error ? error.message : String(error)}`);
        setSlots([]);
      }
    }
    setLoading(false);
  };

  const toggleTimeSelection = (time: string) => {
    const newSet = new Set(selectedTimes);
    if (newSet.has(time)) {
      newSet.delete(time);
    } else {
      newSet.add(time);
    }
    setSelectedTimes(newSet);
  };

  const selectAll = () => {
    const allTimes = slots.map((s) => String(s.time ?? s["time"]));
    setSelectedTimes(new Set(allTimes));
  };

  const clearSelection = () => {
    setSelectedTimes(new Set());
  };

  const selectByHourRange = (start: number, end?: number) => {
    const times = slots
      .map((s) => String(s.time ?? s["time"]))
      .filter((time) => {
        const hour = Number.parseInt(time.split(":")[0]);
        return end !== undefined ? hour >= start && hour < end : hour >= start;
      });
    setSelectedTimes(new Set(times));
  };

  const handleQuickSelect = (action: "all" | "morning" | "afternoon" | "evening") => {
    switch (action) {
      case "all": selectAll(); break;
      case "morning": selectByHourRange(6, 12); break;
      case "afternoon": selectByHourRange(12, 18); break;
      case "evening": selectByHourRange(18); break;
    }
  };

  const batchBookSelected = async () => {
    if (selectedTimes.size === 0) {
      alert("请先选择要预约的时间段");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmBatchBook = async () => {
    setShowConfirmModal(false);
    setBatchBooking(true);
    setInfo(`正在批量预约 ${selectedTimes.size} 个时间段...`);

    const items = Array.from(selectedTimes).map((time) => ({
      date,
      time,
    }));

    const res = await fetch("/api/batch-book", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();
    setBatchBooking(false);

    if (data.ok) {
      const successCount = data.results.filter((r: { ok: boolean }) => r.ok).length;
      const failCount = data.results.length - successCount;
      setInfo(`批量预约完成！成功: ${successCount}，失败: ${failCount}`);
      alert(`批量预约完成！\n成功: ${successCount} 个\n失败: ${failCount} 个`);
      clearSelection();
    } else {
      setInfo(`批量预约失败: ${data.error}`);
      alert(`批量预约失败: ${data.error}`);
    }
  };

  const current = useMemo(() => new Date(date), [date]);
  const monthLabel = `${current.toLocaleString("default", { month: "long" })} ${current.getFullYear()}`;
  const first = new Date(current.getFullYear(), current.getMonth(), 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();

  const navigateMonth = (direction: -1 | 1) => {
    const d = new Date(current);
    d.setMonth(d.getMonth() + direction);
    setDate(toLocalDateStr(d));
  };

  const pickDay = (d: number) => {
    const dateStr = toLocalDateStr(new Date(current.getFullYear(), current.getMonth(), d));
    setDate(dateStr);
    loadSlots(dateStr);
  };

  const selectedDay = Number.parseInt(date.slice(-2), 10);

  return (
    <PageShell maxWidth="6xl">
      {/* Calendar */}
      <GlassCard className="!p-0 overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <GhostButton onClick={() => navigateMonth(-1)}>上一月</GhostButton>
          <div className="font-bold text-xl text-white">{monthLabel}</div>
          <GhostButton onClick={() => navigateMonth(1)}>下一月</GhostButton>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center py-2 text-xs font-semibold text-slate-400">
                {w}
              </div>
            ))}
            {Array.from({ length: startWeekday }).map((_, i) => (
              <div key={`x${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const isSelected = d === selectedDay;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => pickDay(d)}
                  className={`h-12 rounded-xl font-medium transition-all ${
                    isSelected
                      ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/50"
                      : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Time Slots Section */}
      <div className="space-y-6 animate-fade-in-up-delay-1">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            可预约时间
          </h2>
          {selectedTimes.size > 0 && (
            <div className="flex gap-3">
              <GradientButton onClick={batchBookSelected} disabled={batchBooking}>
                {batchBooking ? "预约中..." : `批量预约 (${selectedTimes.size})`}
              </GradientButton>
              <GhostButton onClick={clearSelection}>清除选择</GhostButton>
            </div>
          )}
        </div>

        {/* Quick Select */}
        <div className="rounded-2xl border border-white/10 backdrop-blur-md bg-gradient-to-br from-blue-500/10 to-violet-500/10 p-6">
          <div className="text-sm font-semibold mb-4 text-blue-300">{"⚡"} 快速选择</div>
          <div className="flex gap-3 flex-wrap">
            {quickSelectButtons.map((btn) => (
              <button
                key={btn.action}
                type="button"
                className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-slate-200 hover:bg-white/20 hover:border-white/30 transition-all font-medium active:scale-95"
                onClick={() => handleQuickSelect(btn.action)}
              >
                {btn.icon && `${btn.icon} `}
                {btn.label === "全选" ? `全选 (${slots.length})` : btn.label}
              </button>
            ))}
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 hover:border-red-500/50 transition-all font-medium active:scale-95"
              onClick={clearSelection}
            >
              {"✕"} 清除
            </button>
          </div>
        </div>

        {/* Time Slots Grid */}
        <GlassCard className="animate-fade-in-up-delay-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <LoadingSpinner size="lg" />
              <span className="text-slate-400">正在加载时间段...</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <div className="text-5xl mb-4">{"📅"}</div>
              <p className="text-lg">选择日期查看可用时间</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {slots.map((s, i) => {
                const time = String(s.time ?? s["time"]);
                const isSelected = selectedTimes.has(time);
                return (
                  <button
                    key={i}
                    type="button"
                    className={`group px-5 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none ${
                      isSelected
                        ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/50 scale-105 ring-2 ring-violet-400"
                        : "bg-white/10 border border-white/20 text-slate-200 hover:bg-white/20 hover:border-white/30 hover:scale-105 focus:ring-2 focus:ring-violet-500/40"
                    }`}
                    onClick={() => toggleTimeSelection(time)}
                  >
                    <span className="flex items-center gap-2">
                      {isSelected && <span className="text-lg">✓</span>}
                      <span className="font-mono text-lg">{time.slice(0, 5)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
            <span>{"💡"} 点击时间段进行选择，已选中的时间会高亮显示</span>
            <span className="font-medium">{info}</span>
          </div>
        </GlassCard>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="relative rounded-2xl border border-white/20 backdrop-blur-xl bg-slate-900/95 p-8 max-w-lg w-full shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-2xl shadow-xl shadow-violet-500/50">
              {"✨"}
            </div>

            <h3 className="text-2xl font-bold text-center mb-2 mt-4 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              确认批量预约
            </h3>
            <p className="text-center text-slate-400 mb-6">即将为您预约以下时间段</p>

            <div className="space-y-4 mb-8">
              <div className="max-h-72 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {Array.from(selectedTimes)
                  .sort()
                  .map((time, i) => (
                    <div
                      key={time}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-white text-sm font-bold shadow-lg shadow-violet-500/30">
                        {i + 1}
                      </span>
                      <div className="flex-1 flex items-center gap-2 text-slate-200">
                        <span className="font-mono text-sm">{date}</span>
                        <span className="text-slate-500">→</span>
                        <span className="font-mono font-bold text-base">{time.slice(0, 5)}</span>
                      </div>
                      <span className="text-green-400 text-xl">✓</span>
                    </div>
                  ))}
              </div>

              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 flex items-start gap-3">
                <span className="text-amber-400 text-xl">{"⚠️"}</span>
                <div className="flex-1">
                  <div className="text-amber-300 font-semibold">注意</div>
                  <div className="text-amber-200/80 text-sm">
                    共 <span className="font-bold">{selectedTimes.size}</span> 个时间段，请确认后提交
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <GhostButton className="flex-1 py-3 font-semibold" onClick={() => setShowConfirmModal(false)}>
                取消
              </GhostButton>
              <GradientButton className="flex-1 py-3 text-base" onClick={confirmBatchBook}>
                确认预约
              </GradientButton>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
