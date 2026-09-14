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
    <div className="flex items-stretch gap-2 sm:gap-3">
      {order.map(({ type, icon }) => {
        const active = type === value;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            aria-pressed={active}
            className={`flex flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-center transition-all duration-200 sm:flex-none sm:flex-row sm:gap-2 sm:px-4 sm:py-3 ${
              active
                ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white shadow-[0px_4px_12px_rgba(25,32,36,0.22)]"
                : "border-[color:var(--color-border)] bg-white text-[color:var(--color-ink)] hover:-translate-y-0.5 hover:border-[color:var(--color-ink)]"
            }`}
          >
            <Icon name={icon} size={18} strokeWidth={active ? 2.2 : 1.9} className="shrink-0 sm:size-[17px]" />
            <span className={`whitespace-nowrap text-[12px] leading-tight sm:text-sm ${active ? "font-bold" : "font-medium"}`}>
              {bookingTypeLabels[type]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
