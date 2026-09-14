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
    <div className="flex items-stretch gap-2 border-b border-[color:var(--color-border)] sm:gap-7">
      {order.map(({ type, icon }) => {
        const active = type === value;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            aria-pressed={active}
            className={`group relative flex flex-1 flex-col items-center gap-1.5 pb-3 text-center transition-colors duration-200 sm:flex-none sm:flex-row sm:gap-2 sm:pb-2.5 ${
              active ? "text-[color:var(--color-ink)]" : "text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]"
            }`}
          >
            <Icon name={icon} size={19} strokeWidth={active ? 2.3 : 1.9} className="shrink-0 sm:size-[17px]" />
            <span className={`whitespace-nowrap text-[12px] leading-tight sm:text-sm ${active ? "font-bold" : "font-medium"}`}>
              {bookingTypeLabels[type]}
            </span>
            <span
              className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[color:var(--color-ink)] transition-transform duration-200 ${
                active ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
