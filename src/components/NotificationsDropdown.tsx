import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import EmptyState from "./EmptyState";
import { menu, menuItem } from "../lib/ui";
import { useNotifications } from "../lib/notifications";
import { t } from "../lib/i18n";

// Header bell: the three latest notifications, each opening the page it is
// about, and "View all" for the full list.
export default function NotificationsDropdown({
  role,
  viewAllHref,
  compact = false,
}: {
  role: "customer" | "driver";
  viewAllHref: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { items, unreadCount, markRead } = useNotifications(role);
  const latest = items.slice(0, 3);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={
          unreadCount > 0
            ? t("Notifications, {n} unread", { n: unreadCount })
            : t("Notifications")
        }
        aria-expanded={open}
        className={`icon-btn relative ${compact ? "size-10" : "size-[42px]"}`}
      >
        <Icon name="bell" size={20} />
        {unreadCount > 0 && (
          <span
            className={`absolute -right-0.5 -top-0.5 flex ${compact ? "size-[15px]" : "size-[17px]"} items-center justify-center rounded-full bg-[color:var(--color-danger)] t-label text-white ring-2 ring-white`}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            aria-label={t("Close")}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            className={`${menu} absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)]`}
          >
            <div className="border-b border-[color:var(--color-border)] px-4 py-3">
              <p className="t-body-sm font-semibold text-[color:var(--color-ink)]">
                {t("Notifications")}
              </p>
            </div>
            {latest.length === 0 ? (
              <EmptyState
                icon="bell"
                title={t("No notifications yet")}
                description={t("Booking updates and messages show up here.")}
                className="m-2"
              />
            ) : (
              latest.map((n) => (
                <Link
                  key={n.id}
                  to={n.href}
                  onClick={() => {
                    markRead(n.id);
                    setOpen(false);
                  }}
                  className={`${menuItem} items-start border-b border-[color:var(--color-border)] py-3 ${
                    n.read ? "" : "bg-[color:var(--color-surface-subtle)]"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="t-body-sm font-semibold text-[color:var(--color-ink)]">
                        {t(n.title)}
                      </span>
                      {!n.read && (
                        <span
                          aria-label={t("Unread")}
                          className="size-2 shrink-0 rounded-full bg-[color:var(--color-danger)]"
                        />
                      )}
                    </span>
                    <span className="mt-0.5 line-clamp-2 block t-caption">
                      {t(n.body)}
                    </span>
                  </span>
                  <span className="shrink-0 t-caption">{t(n.time)}</span>
                </Link>
              ))
            )}
            <Link
              to={viewAllHref}
              onClick={() => setOpen(false)}
              className={`${menuItem} justify-center font-semibold`}
            >
              {t("View all")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
