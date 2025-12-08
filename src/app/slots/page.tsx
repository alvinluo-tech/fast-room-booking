"use client";
import { useMemo, useState, useEffect } from "react";

type SlotItem = { time?: string; provider_id?: string; service_id?: string } & Record<string, unknown>;

export default function SlotsPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [info, setInfo] = useState<string>("首次加载，请选择日期");
  const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [batchBooking, setBatchBooking] = useState(false);

  // 页面加载时自动加载今天的时间槽
  useEffect(() => {
    const initialDate = new Date().toISOString().slice(0, 10);
    setDate(initialDate);
    // 延迟加载，确保状态已更新
    setTimeout(() => {
      loadSlots(initialDate);
    }, 100);
  }, []);

  const loadSlots = async (dateParam?: string) => {
    const dateToLoad = dateParam || date;
    setInfo("加载中...");
    try {
      const res = await fetch(`/api/slots?from=${dateToLoad}&to=${dateToLoad}&provider=7&service=7&count=1`);
      const data = await res.json();
      
      if (!data.ok) {
        setInfo(`加载失败: ${data.error ?? "未知错误"}`);
        setSlots([]);
        return;
      }
      
      // data.data 已经是解析过的对象，包含 items 数组
      const parsed = data.data;
      const items = parsed?.items ?? [];
      setSlots(items);
      setInfo(`加载完成，共 ${items.length} 个时间段`);
    } catch (error) {
      console.error("加载失败:", error);
      console.error("错误详情:", error);
      setInfo(`加载失败: ${error instanceof Error ? error.message : String(error)}`);
      setSlots([]);
    }
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
    const allTimes = slots.map(s => String(s.time ?? s['time']));
    setSelectedTimes(new Set(allTimes));
  };

  const clearSelection = () => {
    setSelectedTimes(new Set());
  };

  const selectMorning = () => {
    const morningTimes = slots
      .map(s => String(s.time ?? s['time']))
      .filter(time => {
        const hour = parseInt(time.split(':')[0]);
        return hour >= 6 && hour < 12;
      });
    setSelectedTimes(new Set(morningTimes));
  };

  const selectAfternoon = () => {
    const afternoonTimes = slots
      .map(s => String(s.time ?? s['time']))
      .filter(time => {
        const hour = parseInt(time.split(':')[0]);
        return hour >= 12 && hour < 18;
      });
    setSelectedTimes(new Set(afternoonTimes));
  };

  const selectEvening = () => {
    const eveningTimes = slots
      .map(s => String(s.time ?? s['time']))
      .filter(time => {
        const hour = parseInt(time.split(':')[0]);
        return hour >= 18;
      });
    setSelectedTimes(new Set(eveningTimes));
  };

  const book = async (time: string) => {
    const payload = {
      current_booking: {
        id: null,
        location_id: null,
        category_id: null,
        service_id: "7",
        provider_id: "7",
        start_date: date,
        start_time: time,
        end_date: null,
        end_time: null,
        code: null,
        hash: null,
        client_name: "",
        client_email: "",
        client_phone: "",
        promo_code: null,
        price_with_tax: null,
        price_without_tax: null,
        products: [],
        count: "1",
        with_deposit: false,
        is_pay_full_price_without_deposit: false,
        sheduler_channel: null,
        client_hash: "",
        client_id: "",
        addons: null,
        wl: null,
        dates: [],
        additional_fields: {
          adf4212dc42ee322a3a2e62524bebdf8: "1",
          af0fffc9ef6ed9e5be6e359151ca1835: "None",
        },
        additional_fields_values: [
          { field_title: "Number of users including yourself", field_type: "digits", field_position: "1", value: "1" },
          { field_title: "Name and surnames of the other users of the facility- if it is just you, please type None", field_type: "text", field_position: "3", value: "None" },
        ],
        terms: { simplybook_terms: "20200812", user_terms: true, privacy_policy: null, cancellation_terms: null, promotion_letters: "1" },
        start_datetime_raw: `${date}T${time.slice(0, 5)}.000Z`,
        start_datetime: `${date}T${time.slice(0, 5)}.000Z`,
        prices: { items: [], totals: null },
      },
      require_confirm: false,
      bookings: [],
      cart: {},
      batch_type: null,
      batch_hash: null,
      batch_id: null,
      confirm: true,
    };
    const res = await fetch("/api/book", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    alert(data.ok ? "预约成功" : `预约失败: ${data.data}`);
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

    const items = Array.from(selectedTimes).map(time => ({
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
      const successCount = data.results.filter((r: any) => r.ok).length;
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
  const monthName = current.toLocaleString("en-US", { month: "long" }).toUpperCase();
  const yearNum = current.getFullYear();
  const first = new Date(current.getFullYear(), current.getMonth(), 1);
  const startWeekday = (first.getDay() + 6) % 7; // make Monday=0
  const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
  const prevMonth = () => {
    const d = new Date(current);
    d.setMonth(d.getMonth() - 1);
    setDate(d.toISOString().slice(0, 10));
  };
  const nextMonth = () => {
    const d = new Date(current);
    d.setMonth(d.getMonth() + 1);
    setDate(d.toISOString().slice(0, 10));
  };
  const pickDay = (d: number) => {
    const dateStr = new Date(current.getFullYear(), current.getMonth(), d).toISOString().slice(0, 10);
    setDate(dateStr);
    loadSlots(dateStr);
  };

  const selectedDay = parseInt(date.slice(-2), 10);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* 更清洁的深色背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 via-slate-900 to-slate-900 pointer-events-none" />
      
      {/* 移除pt-[90px]，因为layout已经有pt-36(144px)，避免重复间距 */}
      <div className="relative max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Calendar Card - 修复：背景与主页面完全匹配 */}
        <div className="rounded-2xl border-2 border-slate-600/60 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)] bg-slate-900">
          <div className="flex items-center justify-between p-6 border-b border-slate-600/50 bg-slate-800/80">
            <button className="w-12 h-12 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-100 hover:bg-slate-600 hover:text-white transition-all font-bold text-xl flex items-center justify-center" onClick={prevMonth}>
              &lt;
            </button>
            <div className="font-bold text-2xl text-white whitespace-nowrap tracking-wide">
              {monthName} <span className="text-slate-400 mx-2">|</span> {yearNum}
            </div>
            <button className="w-12 h-12 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-100 hover:bg-slate-600 hover:text-white transition-all font-bold text-xl flex items-center justify-center" onClick={nextMonth}>
              &gt;
            </button>
          </div>
          <div className="p-6 bg-slate-900">
            <div className="grid grid-cols-7 gap-2">
              {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((w) => (
                <div key={w} className="text-center py-2 text-xs font-semibold text-slate-300">{w}</div>
              ))}
              {Array.from({ length: startWeekday }).map((_, i) => (<div key={`x${i}`}></div>))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const isSelected = d === selectedDay;
                return (
                  <button 
                    key={d} 
                    onClick={() => pickDay(d)} 
                    className={`h-12 rounded-xl font-medium transition-all duration-300 text-base ${
                      isSelected 
                        ? 'bg-violet-600 text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.6),0_4px_12px_rgba(0,0,0,0.5)] scale-105' 
                        : 'bg-slate-800/60 text-slate-100 hover:bg-slate-700 hover:text-white hover:scale-105 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_2px_6px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.4)]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time Slots Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-white">
              Available Times
            </h2>
            {selectedTimes.size > 0 && (
              <div className="flex gap-3">
                <button 
                  className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-semibold shadow-lg hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:scale-105" 
                  onClick={batchBookSelected} 
                  disabled={batchBooking}
                >
                  {batchBooking ? "预约中..." : `🚀 批量预约 (${selectedTimes.size})`}
                </button>
                <button 
                  className="px-6 py-2.5 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-100 hover:bg-slate-600 hover:text-white transition-all" 
                  onClick={clearSelection}
                >
                  清除选择
                </button>
              </div>
            )}
          </div>

          {/* Quick Select - 增强文字对比度，边框风格设计 */}
          <div className="rounded-2xl border border-slate-700/50 backdrop-blur-md bg-slate-800/40 p-6 shadow-xl">
            <div className="text-sm font-semibold mb-4 text-white flex items-center gap-2">
              ⚡ 快速选择:
            </div>
            <div className="flex gap-3 flex-wrap">
              <button 
                className="px-5 py-2.5 rounded-xl border border-slate-600/50 bg-slate-800/30 text-slate-100 hover:text-white hover:border-violet-400/80 hover:bg-violet-900/20 transition-all duration-300 font-semibold shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_3px_rgba(139,92,246,0.3),0_0_20px_rgba(139,92,246,0.4),0_6px_16px_rgba(0,0,0,0.5)] hover:scale-105" 
                onClick={selectAll}
              >
                全选 ({slots.length})
              </button>
              <button 
                className="px-5 py-2.5 rounded-xl border border-slate-600/50 bg-slate-800/30 text-slate-100 hover:text-white hover:border-violet-400/80 hover:bg-violet-900/20 transition-all duration-300 font-semibold shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_3px_rgba(139,92,246,0.3),0_0_20px_rgba(139,92,246,0.4),0_6px_16px_rgba(0,0,0,0.5)] hover:scale-105" 
                onClick={selectMorning}
              >
                🌅 上午 (6-12点)
              </button>
              <button 
                className="px-5 py-2.5 rounded-xl border border-slate-600/50 bg-slate-800/30 text-slate-100 hover:text-white hover:border-violet-400/80 hover:bg-violet-900/20 transition-all duration-300 font-semibold shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_3px_rgba(139,92,246,0.3),0_0_20px_rgba(139,92,246,0.4),0_6px_16px_rgba(0,0,0,0.5)] hover:scale-105" 
                onClick={selectAfternoon}
              >
                ☀️ 下午 (12-18点)
              </button>
              <button 
                className="px-5 py-2.5 rounded-xl border border-slate-600/50 bg-slate-800/30 text-slate-100 hover:text-white hover:border-violet-400/80 hover:bg-violet-900/20 transition-all duration-300 font-semibold shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_3px_rgba(139,92,246,0.3),0_0_20px_rgba(139,92,246,0.4),0_6px_16px_rgba(0,0,0,0.5)] hover:scale-105" 
                onClick={selectEvening}
              >
                🌙 晚上 (18点后)
              </button>
              <button 
                className="px-5 py-2.5 rounded-xl border border-red-500/70 bg-transparent text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-400 transition-all duration-300 font-semibold shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_3px_10px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_2px_rgba(239,68,68,0.3),0_0_18px_rgba(239,68,68,0.5),0_5px_14px_rgba(0,0,0,0.4)] hover:scale-105" 
                onClick={clearSelection}
              >
                ✕ 清除
              </button>
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="rounded-2xl border border-slate-700/50 backdrop-blur-md bg-slate-800/40 p-6 shadow-xl">
            {slots.length === 0 ? (
              <div className="text-center py-12 text-slate-300">
                <div className="text-4xl mb-4">📅</div>
                <p>选择日期查看可用时间</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {slots.map((s, i) => {
                  const time = String(s.time ?? s['time']);
                  const isSelected = selectedTimes.has(time);
                  const isUnavailable = false; // TODO: integrate with actual booking status from API
                  
                  if (isUnavailable) {
                    return (
                      <button 
                        key={i} 
                        disabled
                        className="px-6 py-3 rounded-xl font-semibold border border-slate-700 bg-slate-800/30 text-slate-500 cursor-not-allowed opacity-60"
                      >
                        <span className="flex items-center gap-2 line-through">
                          <span className="font-mono text-lg">{time.slice(0,5)}</span>
                        </span>
                      </button>
                    );
                  }
                  
                  return (
                    <button 
                      key={i} 
                      className={`group px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        isSelected 
                          ? 'bg-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.5),0_4px_12px_rgba(0,0,0,0.4)] scale-105 ring-2 ring-violet-400/50' 
                          : 'border-2 border-slate-500 bg-transparent text-slate-100 hover:bg-slate-700/30 hover:border-violet-400 hover:text-white hover:scale-105 shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(139,92,246,0.3)]'
                      }`}
                      onClick={() => toggleTimeSelection(time)}
                    >
                      <span className="flex items-center gap-2">
                        {isSelected && <span className="text-lg">✓</span>}
                        <span className="font-mono text-lg">{time.slice(0,5)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            
            <div className="mt-6 flex items-center justify-between text-sm">
              <div className="text-slate-300">
                💡 点击时间段进行选择，已选中的时间会高亮显示
              </div>
              <div className="text-slate-200 font-medium">{info}</div>
            </div>
            
            {/* Primary CTA Button */}
            {selectedTimes.size > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-lg shadow-[0_8px_24px_rgba(139,92,246,0.5),0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_32px_rgba(139,92,246,0.6),0_6px_16px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
                >
                  <span className="flex items-center justify-center gap-3">
                    <span className="text-2xl">✓</span>
                    <span>确认预约并提交</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">{selectedTimes.size} 个时段</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 批量预约确认弹窗 */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowConfirmModal(false)}>
            <div className="relative rounded-2xl border border-slate-600 backdrop-blur-xl bg-slate-800/95 p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-2xl shadow-xl">
                ✨
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-2 mt-4 text-white">
                确认批量预约
              </h3>
              <p className="text-center text-slate-300 mb-6">即将为您预约以下时间段</p>
              
              <div className="space-y-4 mb-8">
                <div className="max-h-72 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {Array.from(selectedTimes).sort().map((time, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 border border-slate-600 hover:bg-slate-600 transition-all">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-600 text-white text-sm font-bold shadow-lg">
                        {i + 1}
                      </span>
                      <div className="flex-1 flex items-center gap-2 text-slate-100">
                        <span className="font-mono text-sm">{date}</span>
                        <span className="text-slate-400">→</span>
                        <span className="font-mono font-bold text-base">{time.slice(0, 5)}</span>
                      </div>
                      <span className="text-green-400 text-xl">✓</span>
                    </div>
                  ))}
                </div>
                
                <div className="rounded-xl bg-amber-900/40 border border-amber-700/50 p-4 flex items-start gap-3">
                  <span className="text-amber-400 text-xl">⚠️</span>
                  <div className="flex-1">
                    <div className="text-amber-300 font-semibold">注意</div>
                    <div className="text-amber-100 text-sm">共 <span className="font-bold">{selectedTimes.size}</span> 个时间段，请确认后提交</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-100 hover:bg-slate-600 hover:text-white transition-all font-semibold" 
                  onClick={() => setShowConfirmModal(false)}
                >
                  取消
                </button>
                <button 
                  className="flex-1 px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold shadow-lg hover:bg-violet-500 transition-all hover:scale-105" 
                  onClick={confirmBatchBook}
                >
                  确认预约
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
