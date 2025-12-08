"use client";
import { useEffect, useState } from "react";

type Booking = {
  id?: string;
  hash?: string;
  service_name?: string;
  provider_name?: string;
  start_datetime?: string;
  start_date?: string;
  start_time?: string;
  end_datetime?: string;
  end_date?: string;
  end_time?: string;
  code?: string;
  status?: string;
  is_cancellable?: string;
  service?: { name?: string };
  provider?: { name?: string };
} & Record<string, unknown>;

export default function BookingsPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [info, setInfo] = useState("");
  const [canceling, setCanceling] = useState<string | null>(null);

  const loadBookings = async () => {
    setInfo("加载中...");
    const res = await fetch("/api/bookings");
    const data = await res.json();
    try {
      const parsed = JSON.parse(data.data);
      const list: Booking[] = Array.isArray(parsed) ? parsed : (parsed?.items ?? []);
      setItems(list);
      setInfo(`共 ${list.length} 条预约`);
    } catch {
      setInfo("解析失败");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (bookingId: string, bookingHash: string) => {
    if (!confirm("确定要取消这个预约吗？")) return;
    
    setCanceling(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hash: bookingHash }),
      });
      const data = await res.json();
      
      if (data.ok) {
        alert("预约已取消");
        loadBookings(); // 重新加载列表
      } else {
        alert(`取消失败: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      alert(`取消失败: ${error}`);
    } finally {
      setCanceling(null);
    }
  };

  const formatDateTime = (b: Booking) => {
    const startDate = b.start_date || b.start_datetime?.split("T")[0] || "";
    const startTime = b.start_time?.slice(0, 5) || b.start_datetime?.split("T")[1]?.slice(0, 5) || "";
    return `${startDate} ${startTime}`;
  };

  const formatEndTime = (b: Booking) => {
    const endDate = b.end_date || b.end_datetime?.split("T")[0] || "";
    const endTime = b.end_time?.slice(0, 5) || b.end_datetime?.split("T")[1]?.slice(0, 5) || "";
    return `${endDate} ${endTime}`;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/30 via-slate-900 to-slate-900 pointer-events-none" />
      
      {/* 移除pt-[90px]，使用layout的pt-36统一间距 */}
      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex gap-6 items-center flex-wrap">
          <h1 className="text-3xl font-bold text-white">
            Upcoming Bookings
          </h1>
          <button 
            className="px-4 py-2 rounded-xl border border-slate-600 backdrop-blur-md bg-slate-700/50 text-slate-100 hover:bg-slate-600 hover:text-white transition-all" 
            onClick={loadBookings}
          >
            🔄 刷新
          </button>
          <div className="ml-auto text-sm text-slate-200">{info}</div>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-800/60 text-4xl mb-6">
              📭
            </div>
            <p className="text-xl text-slate-300 mb-6">暂无预约记录</p>
            <a href="/slots" className="inline-block px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold shadow-lg hover:bg-violet-500 transition-all hover:scale-105">
              前往预约
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((b, i) => (
              <div key={i} className="group rounded-2xl border border-slate-700/50 backdrop-blur-md bg-slate-800/40 p-6 space-y-4 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-300 shadow-xl">
                <div className="font-bold text-xl text-white">
                  {String(b.service?.name || b.service_name || "Room Booking")}
                </div>
                
                <div className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-sm">
                  <div className="text-slate-300">Start:</div>
                  <div className="font-mono text-slate-100 font-medium">{formatDateTime(b)}</div>
                  
                  <div className="text-slate-300">End:</div>
                  <div className="font-mono text-slate-100 font-medium">{formatEndTime(b)}</div>
                  
                  <div className="text-slate-300">Location:</div>
                  <div className="text-slate-100">{String(b.provider?.name || b.provider_name || "")}</div>
                  
                  <div className="text-slate-300">Code:</div>
                  <div className="font-mono font-bold text-violet-400">{String(b.code || "")}</div>
                  
                  <div className="text-slate-300">Status:</div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      b.status === "confirmed" 
                        ? "bg-green-600/80 text-white border border-green-500" 
                        : "bg-slate-600 text-slate-200 border border-slate-500"
                    }`}>
                      {String(b.status || "")}
                    </span>
                  </div>
                  
                  <div className="text-slate-300">ID:</div>
                  <div className="font-mono text-xs text-slate-400">{String(b.id || "")}</div>
                  
                  <div className="text-slate-300">Hash:</div>
                  <div className="font-mono text-xs text-slate-400">{String(b.hash || "").substring(0, 16)}...</div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    className="flex-1 px-4 py-2.5 rounded-xl border border-red-500 bg-red-600/80 text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    onClick={() => cancelBooking(String(b.id), String(b.hash || ""))}
                    disabled={canceling === String(b.id) || b.is_cancellable !== "1"}
                  >
                    {canceling === String(b.id) ? "取消中..." : b.is_cancellable !== "1" ? "不可取消" : "取消预约"}
                  </button>
                  <button className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-500 transition-all font-medium shadow-lg">
                    📅 Add to calendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
