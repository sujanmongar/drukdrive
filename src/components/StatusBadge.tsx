const styles: Record<string, string> = {
  Upcoming:
    "bg-[color:var(--color-info-bg)] text-[color:var(--color-info-text)]",
  Completed:
    "bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]",
  Cancelled:
    "bg-[color:var(--color-danger-bg)] text-[color:var(--color-danger)]",
  Active:
    "bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]",
  "Under review":
    "bg-[color:var(--color-warning-bg)] text-[color:var(--color-warning)]",
  "Not confirmed":
    "bg-[color:var(--color-info-bg)] text-[color:var(--color-info-text)]",
  Confirmed:
    "bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]",
  Pending:
    "bg-[color:var(--color-warning-bg)] text-[color:var(--color-warning)]",
  Credited:
    "bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]",
  Processed:
    "bg-[color:var(--color-info-bg)] text-[color:var(--color-info-text)]",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 t-label font-semibold ${styles[status] ?? "bg-[color:var(--color-surface-soft)] text-[color:var(--color-muted)]"}`}
    >
      {status}
    </span>
  );
}
