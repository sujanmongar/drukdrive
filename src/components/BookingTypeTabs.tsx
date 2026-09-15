import Icon from "./Icon";
import type { IconName } from "./Icon";
import type { BookingType } from "../lib/routes";
import { bookingTypeLabels } from "../lib/routes";

const order: { type: BookingType; icon: IconName }[] = [
  { type: "daily", icon: "car" },
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
    // Three equal tiles, icon above the label. They fill the row on every
    // width, so nothing scrolls or wraps.
    <div
      className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:flex lg:w-fit"
      role="tablist"
      aria-label="Booking type"
    >
      {order.map(({ type, icon }) => {
        const active = type === value;
        return (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(type)}
            className={`flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 transition-all duration-200 sm:min-h-[80px] lg:w-[150px] ${
              active
                ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white shadow-card"
                : "border-[color:var(--color-border)] bg-white text-[color:var(--color-ink)] hover:-translate-y-0.5 hover:border-[color:var(--color-ink)]"
            }`}
          >
            <Icon
              name={icon}
              size={22}
              strokeWidth={active ? 2.2 : 1.9}
              className="shrink-0"
            />
            <span
              className={`whitespace-nowrap t-caption leading-none sm:t-body-sm ${active ? "font-bold" : "font-medium"}`}
            >
              {bookingTypeLabels[type]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
