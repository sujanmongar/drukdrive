const styles: Record<string, string> = {
  Upcoming: "bg-blue-50 text-blue-700",
  Completed: "bg-green-50 text-[color:var(--color-success)]",
  Cancelled: "bg-red-50 text-[color:var(--color-danger)]",
  Active: "bg-green-50 text-[color:var(--color-success)]",
  "Under review": "bg-amber-50 text-amber-700",
  "Not confirmed": "bg-blue-50 text-blue-700",
  Pending: "bg-amber-50 text-amber-700",
  Credited: "bg-green-50 text-[color:var(--color-success)]",
  Processed: "bg-blue-50 text-blue-700",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status] ?? "bg-neutral-100 text-neutral-600"}`}
    >
      {status}
    </span>
  );
}
