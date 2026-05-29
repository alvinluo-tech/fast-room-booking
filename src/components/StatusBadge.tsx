interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: "bg-green-500/20 border-green-500/30", text: "text-green-300", label: "已确认" },
  pending: { bg: "bg-amber-500/20 border-amber-500/30", text: "text-amber-300", label: "待确认" },
  cancelled: { bg: "bg-red-500/20 border-red-500/30", text: "text-red-300", label: "已取消" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
        style ? `${style.bg} ${style.text}` : "bg-slate-500/20 text-slate-300 border-slate-500/30"
      }`}
    >
      {style?.label ?? status}
    </span>
  );
}
