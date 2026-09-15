import Icon from "./Icon";

const rows = [
  {
    icon: "phone" as const,
    label: "Call or WhatsApp",
    value: "+975 17 617 107",
    href: "tel:+97517617107",
  },
  {
    icon: "mail" as const,
    label: "Email",
    value: "support@drukdrive.bt",
    href: "mailto:support@drukdrive.bt",
  },
  {
    icon: "clock" as const,
    label: "Hours",
    value: "7:00–22:00, every day",
    href: null,
  },
];

// Quick ways to reach DrukDrive while booking — a phone number matters more
// than a running total on a review page.
export default function ContactCard() {
  return (
    <div className="rounded-2xl border border-[color:var(--color-success)]/25 bg-white p-5 shadow-card">
      <ul className="flex flex-col gap-3">
        {rows.map((r) => {
          const inner = (
            <>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-success-bg)] text-[color:var(--color-success-deep)]">
                <Icon name={r.icon} size={17} />
              </span>
              <span className="min-w-0">
                <span className="block t-caption text-[color:var(--color-muted)]">
                  {r.label}
                </span>
                <span
                  className={`block truncate t-body font-semibold ${r.href ? "text-[color:var(--color-success-deep)]" : "text-[color:var(--color-ink)]"}`}
                >
                  {r.value}
                </span>
              </span>
            </>
          );
          return (
            <li key={r.label}>
              {r.href ? (
                <a
                  href={r.href}
                  className="-mx-2 flex min-h-11 items-center gap-3 rounded-lg px-2 hover:bg-[color:var(--color-surface-soft)]"
                >
                  {inner}
                </a>
              ) : (
                <div className="-mx-2 flex min-h-11 items-center gap-3 px-2">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
