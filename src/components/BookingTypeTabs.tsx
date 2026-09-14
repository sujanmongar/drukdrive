import Icon from "./Icon";
import type { IconName } from "./Icon";
import type { BookingType } from "../lib/routes";
import { bookingTypeLabels } from "../lib/routes";

const order: { type: BookingType; icon: IconName }[] = [
  { type: "daily", icon: "car" },
  { type: "outstation", icon: "location" },
  { type: "rental", icon: "calendar" },
  { type: "self-drive", icon: "gearbox" },
];

// Segmented control rather than four standalone buttons: one rounded track
// with the active pill inside it, so the group reads as a single switch.
export default function BookingTypeTabs({
  value,
  onChange,
}: {
  value: BookingType;
  onChange: (t: BookingType) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-[color:var(--color-border)] bg-white p-1 sm:inline-flex sm:rounded-full">
      {order.map(({ type, icon }) => {
        const active = type === value;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            aria-pressed={active}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 sm:justify-start sm:rounded-full sm:px-3.5 sm:py-2 ${
              active
                ? "bg-[color:var(--color-ink)] font-semibold text-white"
                : "text-[color:var(--color-ink-soft)] hover:bg-neutral-100"
            }`}
          >
            <Icon name={icon} size={15} strokeWidth={2.1} className="shrink-0" />
            {bookingTypeLabels[type]}
          </button>
        );
      })}
    </div>
  );
}
