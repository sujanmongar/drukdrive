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
    // Pills hug their own content and the row scrolls sideways rather than
    // squeezing four equal columns into the width.
    <div className="carousel-track -mx-2 -my-3 flex items-stretch gap-2 overflow-x-auto px-2 py-3 sm:gap-3">
      {order.map(({ type, icon }) => {
        const active = type === value;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            aria-pressed={active}
            className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 transition-all duration-200 sm:px-4 sm:py-3 ${
              active
                ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white shadow-[0px_4px_12px_rgba(25,32,36,0.22)]"
                : "border-[color:var(--color-border)] bg-white text-[color:var(--color-ink)] hover:-translate-y-0.5 hover:border-[color:var(--color-ink)]"
            }`}
          >
            <Icon name={icon} size={17} strokeWidth={active ? 2.2 : 1.9} className="shrink-0" />
            <span className={`whitespace-nowrap text-[13px] leading-none sm:text-sm ${active ? "font-bold" : "font-medium"}`}>
              {bookingTypeLabels[type]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
