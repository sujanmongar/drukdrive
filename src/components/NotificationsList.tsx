import { useState } from "react";
import Icon from "./Icon";
import Button from "./Button";
import EmptyState from "./EmptyState";
import type { Notification } from "../data/mockData";
import { iconTile, rowHover } from "../lib/ui";

// The notifications page body for both roles. Tapping a row toggles it
// read; unread rows sit on a tinted card with a red dot.
export default function NotificationsList({
  initial,
}: {
  initial: Notification[];
}) {
  const [notifications, setNotifications] = useState(initial);
  const unreadCount = notifications.filter((n) => !n.read).length;

  function toggleRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="t-h2">Notifications</h2>
          <p className="mt-1 t-body-sm text-[color:var(--color-muted)]">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
              : "You're all caught up."}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="link" type="button" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No notifications yet"
          description="Booking updates and messages show up here."
        />
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {notifications.map((n) => (
            // Not `card`: its bg-white would outrank the unread tint.
            <button
              key={n.id}
              type="button"
              onClick={() => toggleRead(n.id)}
              className={`flex w-full items-start gap-3 rounded-2xl border border-[color:var(--color-border)] p-4 text-left shadow-card ${rowHover} ${
                n.read ? "bg-white" : "bg-[color:var(--color-surface-subtle)]"
              }`}
            >
              <span className={iconTile}>
                <Icon
                  name="bell"
                  size={18}
                  className="text-[color:var(--color-ink)]"
                />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="t-body-sm font-semibold text-[color:var(--color-ink)]">
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className="size-2 shrink-0 rounded-full bg-[color:var(--color-danger)]" />
                  )}
                </div>
                <p className="mt-0.5 t-body-sm text-[color:var(--color-muted)]">
                  {n.body}
                </p>
              </div>

              <span className="shrink-0 t-caption">{n.time}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
