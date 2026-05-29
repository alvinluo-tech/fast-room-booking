"use client";
import { useMemo, useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { GhostButton } from "@/components/GhostButton";
import { PageShell } from "@/components/PageShell";
import {
  CaretLeft,
  CaretRight,
  Lightning,
  Sun,
  Moon,
  Check,
  CalendarCheck,
  Clock,
  WarningCircle,
  Trash,
  Info,
} from "@phosphor-icons/react/dist/ssr";

type SlotItem = { time?: string; provider_id?: string; service_id?: string } & Record<string, unknown>;

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const WEEKDAYS = [
  { label: "一", weekend: false },
  { label: "二", weekend: false },
  { label: "三", weekend: false },
  { label: "四", weekend: false },
  { label: "五", weekend: false },
  { label: "六", weekend: true },
  { label: "日", weekend: true },
];

const BOOKING_CONFIG = {
  provider: 7,
  service: 7,
  count: 1,
} as const;

const quickSelectButtons = [
  { label: "全选", action: "all" as const, icon: null },
  { label: "上午", action: "morning" as const, icon: Sun },
  { label: "下午", action: "afternoon" as const, icon: Sun },
  { label: "晚上", action: "evening" as const, icon: Moon },
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
        const res = await fetch(`/api/slots?from=${dateToLoad}&to=${dateToLoad}&provider=${BOOKING_CONFIG.provider}&service=${BOOKING_CONFIG.service}&count=${BOOKING_CONFIG.count}`);
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

  const selectedDay = current.getDate();
  const today = new Date();

  return (
    <PageShell maxWidth="6xl">
      {/* Calendar */}
      <GlassCard className="!p-0 overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <GhostButton onClick={() => navigateMonth(-1)}>
            <CaretLeft size={18} />
          </GhostButton>
          <div className="font-semibold text-base text-white tracking-tight">{monthLabel}</div>
          <GhostButton onClick={() => navigateMonth(1)}>
            <CaretRight size={18} />
          </GhostButton>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((w) => (
              <div
                key={w.label}
                className={`text-center py-2 text-[11px] font-medium uppercase tracking-wider ${
                  w.weekend ? "text-violet-400/50" : "text-slate-600"
                }`}
              >
                {w.label}
              </div>
            ))}
            {Array.from({ length: startWeekday }).map((_, i) => (
              <div key={`x${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const isSelected = d === selectedDay;
              const isToday = d === today.getDate() && current.getMonth() === today.getMonth() && current.getFullYear() === today.getFullYear();
              const dayOfWeek = (startWeekday + d - 1) % 7;
              const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => pickDay(d)}
                  className={`h-10 rounded-lg font-medium text-sm transition-all duration-150 relative ${
                    isSelected
                      ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/30 animate-pulse-glow"
                      : isToday
                        ? "bg-white/[0.08] text-white border border-violet-500/30"
                        : isWeekend
                          ? "text-violet-400/40 hover:bg-white/[0.04] hover:text-violet-300 active:scale-95"
                          : "text-slate-400 hover:bg-white/[0.05] hover:text-white active:scale-95"
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
      <div className="space-y-5 animate-fade-in-up-delay-1">
        {/* Header with count badge */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2.5">
            <Clock size={20} className="text-violet-400" weight="duotone" />
            可预约时间
            {slots.length > 0 && !loading && (
              <span className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-300">
                {slots.length} 个可用
              </span>
            )}
          </h2>
          {selectedTimes.size > 0 && (
            <div className="flex gap-2.5">
              <GradientButton onClick={batchBookSelected} disabled={batchBooking}>
                {batchBooking ? "预约中..." : `批量预约 (${selectedTimes.size})`}
              </GradientButton>
              <GhostButton onClick={clearSelection}>清除选择</GhostButton>
            </div>
          )}
        </div>

        {/* Quick Select - integrated bar */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1.5">
              <Lightning size={13} className="text-violet-400" weight="fill" />
              快速选择
            </span>
            {quickSelectButtons.map((btn) => (
              <button
                key={btn.action}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all duration-150 font-medium active:scale-95"
                onClick={() => handleQuickSelect(btn.action)}
              >
                {btn.icon && <btn.icon size={13} className="text-slate-400" />}
                {btn.label === "全选" ? `全选 (${slots.length})` : btn.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/15 transition-all duration-150 font-medium active:scale-95"
                onClick={clearSelection}
              >
                <Trash size={13} />
                清除
              </button>
            </div>
          </div>
        </div>

        {/* Time Slots Grid */}
        <GlassCard className="animate-fade-in-up-delay-2">
          {loading ? (
            <div className="py-16 space-y-4">
              <div className="flex flex-wrap gap-2.5 justify-center">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton w-24 h-10 rounded-xl" />
                ))}
              </div>
              <div className="text-center">
                <span className="text-xs text-slate-500">正在加载时间段...</span>
              </div>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <CalendarCheck size={48} className="mx-auto mb-4 text-slate-600" weight="duotone" />
              <p className="text-sm">选择日期查看可用时间</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => {
                const time = String(s.time ?? s["time"]);
                const isSelected = selectedTimes.has(time);
                return (
                  <button
                    key={time}
                    type="button"
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-150 focus:outline-none ${
                      isSelected
                        ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20 scale-[1.03] ring-1 ring-violet-400/40"
                        : "bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white active:scale-95 focus:ring-2 focus:ring-violet-500/30"
                    }`}
                    onClick={() => toggleTimeSelection(time)}
                  >
                    <span className="flex items-center gap-1.5">
                      {isSelected && <Check size={15} weight="bold" />}
                      <span className="font-mono">{time.slice(0, 5)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Status bar with live indicator */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Info size={13} />
              点击时间段进行选择
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              {!loading && slots.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
              {info}
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="relative rounded-2xl border border-white/10 backdrop-blur-xl bg-[#0e0e16]/95 p-8 max-w-lg w-full shadow-2xl animate-scale-in glass-highlight"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
              <CalendarCheck size={20} className="text-white" weight="duotone" />
            </div>

            <h3 className="text-xl font-bold text-center mb-1.5 mt-4 text-white tracking-tight">
              确认批量预约
            </h3>
            <p className="text-center text-slate-500 text-sm mb-6">即将为您预约以下时间段</p>

            <div className="space-y-4 mb-6">
              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                {Array.from(selectedTimes)
                  .sort()
                  .map((time, i) => (
                    <div
                      key={time}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.06] text-slate-400 text-xs font-bold">
                        {i + 1}
                      </span>
                      <div className="flex-1 flex items-center gap-2 text-slate-300 text-sm">
                        <span className="font-mono text-slate-500">{date}</span>
                        <span className="text-slate-600">-</span>
                        <span className="font-mono font-semibold text-white">{time.slice(0, 5)}</span>
                      </div>
                      <Check size={16} className="text-emerald-400" weight="bold" />
                    </div>
                  ))}
              </div>

              <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 flex items-start gap-3">
                <WarningCircle size={20} className="text-amber-400 shrink-0 mt-0.5" weight="duotone" />
                <div className="flex-1">
                  <div className="text-amber-300 font-semibold text-sm">注意</div>
                  <div className="text-amber-200/60 text-xs">
                    共 <span className="font-bold text-amber-200">{selectedTimes.size}</span> 个时间段，请确认后提交
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
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
