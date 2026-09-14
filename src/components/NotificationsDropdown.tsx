import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { notifications as customerNotifications, driverNotifications } from "../data/mockData";

export default function NotificationsDropdown({
  role,
  viewAllHref,
}: {
  role: "customer" | "driver";
  viewAllHref: string;
}) {
  const [open, setOpen] = useState(false);

  const items =
    role === "driver"
      ? driverNotifications.slice(0, 3).map((n) => ({ id: n.id, title: n.title, body: n.body }))
      : customerNotifications.slice(0, 3).map((n) => ({ id: n.id, title: n.title, body: n.body }));

  const unreadCount = (role === "customer" ? customerNotifications : driverNotifications).filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="icon-btn relative size-[42px]"
      >
        <Icon name="bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-[17px] items-center justify-center rounded-full bg-[color:var(--color-danger)] text-[10px] font-semibold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button aria-label="Close" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="animate-popover absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white shadow-pop">
            <div className="border-b border-[color:var(--color-border)] px-4 py-3">
              <p className="text-sm font-bold text-[color:var(--color-ink)]">Notifications</p>
            </div>
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-[color:var(--color-muted)]">No notifications yet</p>
            ) : (
              <div>
                {items.map((n) => (
                  <div key={n.id} className="border-b border-[color:var(--color-border)] px-4 py-3 last:border-b-0">
                    <p className="text-sm font-semibold text-[color:var(--color-ink)]">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[color:var(--color-muted)]">{n.body}</p>
                  </div>
                ))}
              </div>
            )}
            <Link
              to={viewAllHref}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-center text-sm font-semibold text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-soft)]"
            >
              View all
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
