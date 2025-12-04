"use client";
import { useEffect, useState } from "react";

type Booking = {
  id?: string;
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

  const cancelBooking = async (bookingId: string) => {
    if (!confirm("确定要取消这个预约吗？")) return;
    
    setCanceling(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.ok) {
        alert("预约已取消");
        loadBookings(); // 重新加载列表
      } else {
        alert(`取消失败: ${data.data}`);
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
      <div className="absolute inset-0 bg-gradient-radial from-violet-600/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="flex gap-6 items-center flex-wrap">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Upcoming Bookings
          </h1>
          <button 
            className="px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all" 
            onClick={loadBookings}
          >
            🔄 刷新
          </button>
          <div className="ml-auto text-sm text-slate-400">{info}</div>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-blue-600/20 text-4xl mb-6">
              📭
            </div>
            <p className="text-xl text-slate-400 mb-6">暂无预约记录</p>
            <a href="/slots" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-violet-500/70 transition-all hover:scale-105">
              前往预约
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((b, i) => (
              <div key={i} className="group rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 p-6 space-y-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="font-bold text-xl text-white">
                  {String(b.service?.name || b.service_name || "Room Booking")}
                </div>
                
                <div className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-sm">
                  <div className="text-slate-400">Start:</div>
                  <div className="font-mono text-slate-200 font-medium">{formatDateTime(b)}</div>
                  
                  <div className="text-slate-400">End:</div>
                  <div className="font-mono text-slate-200 font-medium">{formatEndTime(b)}</div>
                  
                  <div className="text-slate-400">Location:</div>
                  <div className="text-slate-200">{String(b.provider?.name || b.provider_name || "")}</div>
                  
                  <div className="text-slate-400">Code:</div>
                  <div className="font-mono font-bold text-violet-400">{String(b.code || "")}</div>
                  
                  <div className="text-slate-400">Status:</div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      b.status === "confirmed" 
                        ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                        : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                    }`}>
                      {String(b.status || "")}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    className="flex-1 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    onClick={() => cancelBooking(String(b.id))}
                    disabled={canceling === String(b.id)}
                  >
                    {canceling === String(b.id) ? "取消中..." : "取消预约"}
                  </button>
                  <button className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50">
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
