"use client";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { GhostButton } from "@/components/GhostButton";
import { PageShell } from "@/components/PageShell";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { StatusBadge } from "@/components/StatusBadge";

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
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState<string | null>(null);

  const loadBookings = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
        loadBookings();
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
    <PageShell maxWidth="7xl">
      <div className="flex gap-6 items-center flex-wrap animate-fade-in-up">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          我的预约
        </h1>
        <GhostButton onClick={loadBookings}>{"🔄"} 刷新</GhostButton>
        <div className="ml-auto text-sm text-slate-400">{info}</div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <LoadingSpinner size="lg" />
          <span className="text-slate-400">正在加载预约记录...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-blue-600/20 text-4xl mb-6">
            {"📭"}
          </div>
          <p className="text-xl text-slate-400 mb-6">暂无预约记录</p>
          <a href="/slots">
            <GradientButton className="px-8 py-3 text-base">前往预约</GradientButton>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up-delay-1">
          {items.map((b, i) => (
            <GlassCard
              key={b.id ?? i}
              hover
              className="group space-y-4 hover:-translate-y-0.5"
            >
              <div className="font-bold text-xl text-white">
                {String(b.service?.name || b.service_name || "Room Booking")}
              </div>

              <div className="grid grid-cols-[80px_1fr] gap-x-3 gap-y-2.5 text-sm">
                <div className="text-slate-400">开始</div>
                <div className="font-mono text-slate-200 font-medium">{formatDateTime(b)}</div>

                <div className="text-slate-400">结束</div>
                <div className="font-mono text-slate-200 font-medium">{formatEndTime(b)}</div>

                <div className="text-slate-400">地点</div>
                <div className="text-slate-200">{String(b.provider?.name || b.provider_name || "")}</div>

                <div className="text-slate-400">编号</div>
                <div className="font-mono font-bold text-violet-400">{String(b.code || "")}</div>

                <div className="text-slate-400">状态</div>
                <div>
                  <StatusBadge status={String(b.status || "")} />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="w-full px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium active:scale-[0.98]"
                  onClick={() => cancelBooking(String(b.id))}
                  disabled={canceling === String(b.id)}
                >
                  {canceling === String(b.id) ? "取消中..." : "取消预约"}
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </PageShell>
  );
}
