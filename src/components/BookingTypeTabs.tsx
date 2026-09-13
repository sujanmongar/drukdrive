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
    <div className="flex flex-wrap gap-2.5 md:gap-3.5">
      {order.map((t) => {
        const active = t === value;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              active
                ? "bg-[#222] font-bold text-white"
                : "border border-[#222] text-[#222] hover:bg-neutral-50"
            }`}
          >
            {bookingTypeLabels[t]}
          </button>
        );
      })}
    </div>
  );
}
