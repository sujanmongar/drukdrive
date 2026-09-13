import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import type { Vehicle } from "../data/mockData";

// The "vehicle + route" summary card shown in the booking sidebar across
// Review Booking, Payment and OTP Verification — kept as one component so
// those three screens can't visually drift apart from each other.
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
    <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-4">
      <div className="flex items-center gap-3">
        <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-16 shrink-0 rounded-lg" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-[color:var(--color-ink)]">{vehicle.name}</p>
            <span className="rounded-full bg-[color:var(--color-info-bg)] px-2 py-0.5 text-[9px] font-semibold uppercase text-[color:var(--color-info-text)]">
              {vehicle.category}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[color:var(--color-muted)]">
            <span className="flex items-center gap-1">
              <Icon name="seat" size={13} />
              {vehicle.seats}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="fuel" size={13} />
              {vehicle.fuel}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="star" size={12} className="fill-current text-amber-400" />
              {vehicle.rating}/5
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 border-t border-[color:var(--color-border)] pt-4">
        <div className="flex flex-col items-center">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100">
            <Icon name="location" size={11} className="text-[color:var(--color-ink)]" />
          </span>
          <span className="my-1 h-8 w-px bg-[color:var(--color-border)]" />
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100">
            <Icon name="car" size={11} className="text-[color:var(--color-ink)]" />
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-5 text-sm">
          <div>
            <p className="text-xs text-[color:var(--color-muted)]">Pick up</p>
            <p className="font-semibold text-[color:var(--color-ink)]">{pickup}</p>
            {date && <p className="mt-0.5 text-xs text-[color:var(--color-muted)]">{date}</p>}
          </div>
          <div>
            <p className="text-xs text-[color:var(--color-muted)]">Drop off</p>
            <p className="font-semibold text-[color:var(--color-ink)]">{dropoff}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
