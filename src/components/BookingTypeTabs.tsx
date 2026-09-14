import type { BookingType } from "../lib/routes";
import { bookingTypeLabels } from "../lib/routes";

const order: BookingType[] = ["daily", "outstation", "rental", "self-drive"];

export default function BookingTypeTabs({
  value,
  onChange,
}: {
  value: BookingType;
  onChange: (t: BookingType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {order.map((t) => {
        const active = t === value;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={`shrink-0 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors md:px-4 md:py-3 ${
              active
                ? "bg-[color:var(--color-ink)] font-bold text-white"
                : "border border-[color:var(--color-ink)] text-[color:var(--color-ink)] hover:bg-neutral-50"
            }`}
          >
            {bookingTypeLabels[t]}
          </button>
        );
      })}
    </div>
  );
}
