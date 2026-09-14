import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import type { Vehicle } from "../data/mockData";

const checklist = ["Tourist Standard Vehicle", "Pick up & drop", "Up to 4 person, 2 luggage bags"];

// The "trip + vehicle" summary shown at the top of Review Booking, Payment
// and OTP Verification — kept as one component so those three screens
// can't visually drift apart from each other.
export default function BookingRouteCard({
  vehicle,
  pickup,
  dropoff,
  date,
}: {
  vehicle: Vehicle;
  pickup: string;
  dropoff: string;
  date?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Trip strip */}
      <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3.5">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-[color:var(--color-muted)]">Pick up</p>
          <p className="truncate text-sm font-bold text-[color:var(--color-ink)]">{pickup}</p>
          {date && <p className="truncate text-xs text-[color:var(--color-muted)]">{date}</p>}
        </div>
        <Icon name="car" size={18} className="shrink-0 text-[color:var(--color-ink-soft)]" />
        <div className="min-w-0 flex-1 text-right">
          <p className="text-[11px] font-semibold text-[color:var(--color-muted)]">Drop off</p>
          <p className="truncate text-sm font-bold text-[color:var(--color-ink)]">{dropoff}</p>
        </div>
      </div>

      {/* Vehicle card */}
      <div className="flex gap-3 rounded-xl border border-[color:var(--color-border)] bg-white p-3">
        <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-20 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-[color:var(--color-ink)]">{vehicle.name}</p>
            <span className="rounded-full bg-[color:var(--color-info-bg)] px-2 py-0.5 text-[9px] font-semibold uppercase text-[color:var(--color-info-text)]">
              {vehicle.category}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-[color:var(--color-ink-soft)]">
            <span className="flex items-center gap-1">
              <Icon name="seat" size={13} />
              {vehicle.seats}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="fuel" size={13} />
              {vehicle.fuel}
            </span>
          </div>
          <ul className="mt-2 flex flex-col gap-0.5">
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-[11px] text-[color:var(--color-ink-soft)]">
                <Icon name="check" size={11} className="shrink-0 text-[color:var(--color-success)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
