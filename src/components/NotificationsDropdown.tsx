import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import EmptyState from "./EmptyState";
import { menu, menuItem } from "../lib/ui";
import {
  notifications as customerNotifications,
  driverNotifications,
} from "../data/mockData";

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
      ? driverNotifications
          .slice(0, 3)
          .map((n) => ({ id: n.id, title: n.title, body: n.body }))
      : customerNotifications
          .slice(0, 3)
          .map((n) => ({ id: n.id, title: n.title, body: n.body }));

  const unreadCount = (
    role === "customer" ? customerNotifications : driverNotifications
  ).filter((n) => !n.read).length;

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
          <span className="absolute -right-0.5 -top-0.5 flex size-[17px] items-center justify-center rounded-full bg-[color:var(--color-danger)] t-label text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            aria-label="Close"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className={`${menu} absolute right-0 top-full z-50 mt-2 w-72`}>
            <div className="border-b border-[color:var(--color-border)] px-4 py-3">
              <p className="t-body-sm font-semibold text-[color:var(--color-ink)]">
                Notifications
              </p>
            </div>
            {items.length === 0 ? (
              <EmptyState
                icon="bell"
                title="No notifications yet"
                description="Booking updates and messages show up here."
                className="m-2"
              />
            ) : (
              <div>
                {items.map((n) => (
                  <div
                    key={n.id}
                    className="border-b border-[color:var(--color-border)] px-4 py-3 last:border-b-0"
                  >
                    <p className="t-body-sm font-semibold text-[color:var(--color-ink)]">
                      {n.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 t-caption">{n.body}</p>
                  </div>
                ))}
              </div>
            )}
            <Link
              to={viewAllHref}
              onClick={() => setOpen(false)}
              className={`${menuItem} justify-center font-semibold`}
            >
              View all
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
