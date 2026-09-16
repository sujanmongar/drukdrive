import Icon from "./Icon";
import type { IconName } from "./Icon";
import type { BookingType } from "../lib/routes";
import { bookingTypeLabels } from "../lib/routes";

const order: { type: BookingType; icon: IconName }[] = [
  { type: "daily", icon: "car" },
  { type: "rental", icon: "calendar" },
  { type: "self-drive", icon: "gearbox" },
];

// One white pill strip holding the three types — icon left, label right,
// the active one filled ink. It floats over the top edge of the search
// card so the two read as a single control.
export default function BookingTypeTabs({
  value,
  onChange,
}: {
  value: BookingType;
  onChange: (t: BookingType) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Booking type"
      className="scrollbar-hide inline-flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-white p-1 shadow-pop sm:gap-1 sm:p-1.5"
    >
      {order.map(({ type, icon }) => {
        const active = type === value;
        return (
          <button
            key={type}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(type)}
            className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-2 t-caption transition-all duration-200 sm:gap-2 sm:px-5  ${
              active
                ? "bg-[color:var(--color-ink)] font-bold text-white shadow-card"
                : "font-semibold text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-surface-soft)] hover:text-[color:var(--color-ink)]"
            }`}
          >
            <Icon
              name={icon}
              size={18}
              strokeWidth={active ? 2.2 : 1.9}
              className="shrink-0"
            />
            {bookingTypeLabels[type]}
          </button>
        );
      })}
    </div>
  );
}
