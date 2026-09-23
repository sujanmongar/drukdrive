import { t, tx } from "../lib/i18n";

// The English status is the key; the badge shows t(status).
const styles: Record<string, string> = {
  [tx("Upcoming")]:
    "bg-[color:var(--color-info-bg)] text-[color:var(--color-info-text)]",
  [tx("Completed")]:
    "bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]",
  [tx("Cancelled")]:
    "bg-[color:var(--color-danger-bg)] text-[color:var(--color-danger)]",
  [tx("Active")]:
    "bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]",
  [tx("Under review")]:
    "bg-[color:var(--color-warning-bg)] text-[color:var(--color-warning)]",
  [tx("Not confirmed")]:
    "bg-[color:var(--color-info-bg)] text-[color:var(--color-info-text)]",
  [tx("Confirmed")]:
    "bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]",
  [tx("Pending")]:
    "bg-[color:var(--color-warning-bg)] text-[color:var(--color-warning)]",
  [tx("Credited")]:
    "bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]",
  [tx("Processed")]:
    "bg-[color:var(--color-info-bg)] text-[color:var(--color-info-text)]",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 t-label ${styles[status] ?? "bg-[color:var(--color-surface-soft)] text-[color:var(--color-muted)]"}`}
    >
      {t(status)}
    </span>
  );
}
