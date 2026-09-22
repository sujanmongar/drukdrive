import { useSyncExternalStore } from "react";
import {
  driverNotifications,
  notifications,
  type Notification,
} from "../data/mockData";

// Read state lives here, not in a page, so the header bell and the
// notifications page always agree on what is unread.
// ponytail: in memory, resets on reload; persist once there is a backend.
const readIds = new Set(
  [...notifications, ...driverNotifications]
    .filter((n) => n.read)
    .map((n) => n.id),
);
let version = 0;
const listeners = new Set<() => void>();

function emit() {
  version++;
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useNotifications(role: "customer" | "driver") {
  useSyncExternalStore(subscribe, () => version);
  const source: Notification[] =
    role === "driver" ? driverNotifications : notifications;
  const items = source.map((n) => ({ ...n, read: readIds.has(n.id) }));
  return {
    items,
    unreadCount: items.filter((n) => !n.read).length,
    markRead(id: string) {
      if (readIds.has(id)) return;
      readIds.add(id);
      emit();
    },
    markAllRead() {
      source.forEach((n) => readIds.add(n.id));
      emit();
    },
  };
}
