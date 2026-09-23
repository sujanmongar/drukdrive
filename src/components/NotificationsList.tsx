import { Link } from "react-router-dom";
import Icon from "./Icon";
import Button from "./Button";
import EmptyState from "./EmptyState";
import { useNotifications } from "../lib/notifications";
import { iconTile, rowHover } from "../lib/ui";
import { t, tn } from "../lib/i18n";

// The notifications page body for both roles. Each row opens the page it
// is about and is marked read; unread rows sit on a tint with a red dot.
export default function NotificationsList({
  role,
}: {
  role: "customer" | "driver";
}) {
  const { items, unreadCount, markRead, markAllRead } = useNotifications(role);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="t-h2">{t("Notifications")}</h2>
          <p className="mt-1 t-body-sm text-[color:var(--color-muted)]">
            {unreadCount > 0
              ? tn(
                  unreadCount,
                  "You have {n} unread notification.",
                  "You have {n} unread notifications.",
                )
              : t("You're all caught up.")}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="link" type="button" onClick={markAllRead}>
            {t("Mark all as read")}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="bell"
          title={t("No notifications yet")}
          description={t("Booking updates and messages show up here.")}
        />
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {items.map((n) => (
            // Not `card`: its bg-white would outrank the unread tint.
            <Link
              key={n.id}
              to={n.href}
              onClick={() => markRead(n.id)}
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
                    {t(n.title)}
                  </p>
                  {!n.read && (
                    <span
                      aria-label={t("Unread")}
                      className="size-2 shrink-0 rounded-full bg-[color:var(--color-danger)]"
                    />
                  )}
                </div>
                <p className="mt-0.5 t-body-sm text-[color:var(--color-muted)]">
                  {t(n.body)}
                </p>
              </div>

              <span className="shrink-0 t-caption">{t(n.time)}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
