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
    <div className="flex flex-nowrap gap-2.5 overflow-x-auto pb-0.5 md:flex-wrap md:gap-3.5 md:overflow-visible">
      {order.map((t) => {
        const active = t === value;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={`shrink-0 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
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
