import Icon from "./Icon";
import type { IconName } from "./Icon";
import type { BookingType } from "../lib/routes";
import { bookingTypeLabels } from "../lib/routes";
import { t } from "../lib/i18n";

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
      aria-label={t("Booking type")}
      className="scrollbar-hide inline-flex max-w-full gap-0.5 overflow-x-auto rounded-xl bg-white p-1 shadow-pop sm:gap-1 sm:p-1.5"
    >
      {order.map(({ type, icon }) => {
        const active = type === value;
        return (
          <button
            key={type}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(type)}
            className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 t-caption font-semibold transition-colors duration-150 sm:gap-2 sm:px-5 ${
              active
                ? "bg-[color:var(--color-ink)] text-white shadow-card"
                : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-surface-soft)] hover:text-[color:var(--color-ink)]"
            }`}
          >
            <Icon
              name={icon}
              size={18}
              strokeWidth={active ? 2.2 : 1.9}
              className="shrink-0"
            />
            {t(bookingTypeLabels[type])}
          </button>
        );
      })}
    </div>
  );
}
