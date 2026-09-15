import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import VehicleSpecs from "./VehicleSpecs";
import { vehicleClassOf } from "../data/mockData";
import type { Vehicle } from "../data/mockData";

// The "car + trip" summary at the top of Review Booking, Payment and OTP
// Verification — one component so the three screens can't drift apart.
export default function BookingRouteCard({
  vehicle,
  pickup,
  dropoff,
  date,
  total,
  days,
}: {
  vehicle: Vehicle;
  pickup: string;
  dropoff: string;
  date?: string;
  /** Formatted trip total; shown in the car card on the review step only. */
  total?: string;
  days?: number;
}) {
  const stops = [
    { key: "pickup", when: date || "Pick-up time to be confirmed", place: pickup },
    { key: "dropoff", when: "Drop-off on arrival", place: dropoff },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Vehicle — the same anatomy as a search result card. */}
      <div className="flex items-center gap-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-4 sm:gap-5 sm:p-5">
        <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-24 shrink-0 rounded-xl sm:size-28" />
        <div className="min-w-0 flex-1">
          <h3 className="t-h4 truncate text-[color:var(--color-ink)]">{vehicle.name}</h3>
          <p className="t-body-sm text-[color:var(--color-muted)]">or similar {vehicleClassOf[vehicle.category]}</p>
          <VehicleSpecs vehicle={vehicle} className="mt-3" />
          <p className="mt-2 flex items-center gap-1.5 t-body-sm text-[color:var(--color-ink)]">
            <Icon name="star" size={15} className="fill-current text-[color:var(--color-star)]" />
            <span className="font-semibold">{vehicle.rating.toFixed(1)}</span>
            <span className="text-[color:var(--color-muted)]">({vehicle.reviewCount} reviews)</span>
          </p>
        </div>
      </div>
      {total && (
        <div className="-mt-4 flex items-end justify-between gap-3 rounded-b-2xl border border-t-0 border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] px-4 py-3 sm:px-5">
          <p className="t-body-sm text-[color:var(--color-muted)]">
            Total for {days} days
            <span className="block t-caption">taxes and fees included</span>
          </p>
          <p className="t-h3 tabular text-[color:var(--color-ink)]">{total}</p>
        </div>
      )}

      {/* Pick-up and drop-off: two stops on a rail, a pin marking each. */}
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4 sm:p-5">
        <h3 className="t-h4 text-[color:var(--color-ink)]">Pick-up and drop-off</h3>
        <ol className="mt-4">
          {stops.map((stop, i) => {
            const last = i === stops.length - 1;
            return (
              <li key={stop.key} className="relative flex gap-3 pl-9">
                <span
                  aria-hidden
                  className="absolute left-0 top-0.5 flex size-6 items-center justify-center rounded-full bg-[color:var(--color-surface-soft)] text-[color:var(--color-ink)]"
                >
                  <Icon name="location" size={15} strokeWidth={2.2} />
                </span>
                {!last && <span aria-hidden className="absolute bottom-0 left-[11px] top-7 w-0.5 bg-[color:var(--color-border)]" />}
                <div className={`min-w-0 flex-1 ${last ? "" : "pb-6"}`}>
                  <p className="t-body text-[color:var(--color-ink)]">{stop.when}</p>
                  <p className="mt-0.5 t-body-lg font-bold text-[color:var(--color-ink)]">{stop.place}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
