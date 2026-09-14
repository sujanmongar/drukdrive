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
    <div className="inline-flex flex-wrap items-center gap-1 rounded-full border border-[color:var(--color-border)] bg-white p-1">
      {order.map(({ type, icon }) => {
        const active = type === value;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            aria-pressed={active}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-all duration-200 ${
              active
                ? "bg-[color:var(--color-ink)] font-semibold text-white shadow-sm"
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
