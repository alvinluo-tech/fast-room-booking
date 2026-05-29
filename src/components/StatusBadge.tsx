interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isConfirmed = status === "confirmed";

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
        isConfirmed
          ? "bg-green-500/20 text-green-300 border border-green-500/30"
          : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
      }`}
    >
      {isConfirmed ? "已确认" : status}
    </span>
  );
}
