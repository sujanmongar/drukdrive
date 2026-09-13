import { useState } from "react";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import Icon from "../../components/Icon";
import { notifications as initialNotifications, type Notification } from "../../data/mockData";
import { providerTabs } from "./_tabs";

export default function ProviderNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function toggleRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <PageShell>
      <SecondaryTabs tabs={providerTabs} />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#222]">Notifications</h1>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
                : "You're all caught up."}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs font-bold text-[#222] underline underline-offset-2 hover:no-underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-white py-16 text-center shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
            <Icon name="bell" size={32} className="text-[color:var(--color-muted)]" />
            <p className="mt-3 text-sm font-semibold text-[#222]">No notifications yet</p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => toggleRead(n.id)}
                className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left shadow-[0px_1px_3px_rgba(25,32,36,0.16)] transition-colors ${
                  n.read ? "border-[color:var(--color-border)] bg-white" : "border-[#222]/20 bg-[#f7f7f7]"
                }`}
              >
                <span className="mt-1.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eef1f4]">
                  <Icon name="bell" size={16} className="text-[#222]" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm text-[#222] ${n.read ? "font-medium" : "font-bold"}`}>{n.title}</p>
                    {!n.read && <span className="size-2 shrink-0 rounded-full bg-[color:var(--color-danger)]" />}
                  </div>
                  <p className="mt-0.5 text-sm text-[color:var(--color-muted)]">{n.body}</p>
                </div>

                <span className="shrink-0 text-xs text-[color:var(--color-muted)]">{n.time}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
