import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import VehicleSpecs from "./VehicleSpecs";
import { vehicleClassOf } from "../data/mockData";
import type { Vehicle } from "../data/mockData";
import {
  estimateDurationHours,
  formatDurationHours,
} from "../lib/tripDuration";

type Props = {
  vehicle: Vehicle;
  pickup: string;
  dropoff: string;
  date?: string;
  /** Formatted drop-off date and time, when the booking has one. */
  dropoffWhen?: string;
  /** Formatted trip total; shown in the car card on the review step only. */
  total?: string;
  days?: number;
};

// The car, laid out like a search-results list card.
export function VehicleSummaryCard({
  vehicle,
  total,
  days,
}: Pick<Props, "vehicle" | "total" | "days">) {
  return (
    <>
      {/* Vehicle — the search results list card, with the trip total where
          the per-day price and Book Now would be. */}
      <div className="@container flex w-full items-stretch overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white shadow-card">
        <div className="relative w-[112px] shrink-0 self-stretch overflow-hidden @md:w-[180px] @2xl:w-[200px]">
          <VehicleImage
            vehicleId={vehicle.id}
            category={vehicle.category}
            className="size-full p-2 lg:p-3"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 @md:gap-4 @md:p-5 @2xl:flex-row @2xl:items-stretch @2xl:gap-6">
          <div className="min-w-0 flex-1">
            <h3 className="t-h4 truncate text-[color:var(--color-ink)]">
              {vehicle.name}
            </h3>
            <p className="t-caption text-[color:var(--color-muted)]">
              or similar {vehicleClassOf[vehicle.category]}
            </p>

            <div className="t-caption mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[color:var(--color-ink)]">
              <span className="flex min-w-0 items-center gap-1.5">
                <Icon
                  name="location"
                  size={14}
                  strokeWidth={2.3}
                  className="shrink-0"
                />
                <span className="truncate">{vehicle.location}</span>
              </span>
              <span className="text-[color:var(--color-muted)]">•</span>
              <span className="flex items-center gap-1">
                <Icon
                  name="star"
                  size={13}
                  className="fill-current text-[color:var(--color-star)]"
                  strokeWidth={2.3}
                />
                <span className="font-semibold">{vehicle.rating}</span>
                <span className="text-[color:var(--color-muted)]">
                  ({vehicle.reviewCount})
                </span>
              </span>
            </div>

            <VehicleSpecs vehicle={vehicle} className="mt-2.5" />
          </div>

          {total && (
            <div className="flex items-end justify-between gap-3 border-t border-[color:var(--color-border)] pt-3 sm:pt-4 lg:w-[168px] lg:shrink-0 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="whitespace-nowrap t-caption text-[color:var(--color-muted)] lg:text-right">
                Total for {days} days
              </p>
              <div className="lg:text-right">
                <span className="block t-h3 font-bold tabular text-[color:var(--color-ink)] ">
                  {total}
                </span>
                <p className="t-label mt-0.5 whitespace-nowrap text-[color:var(--color-muted)]">
                  incl. taxes &amp; fees
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Pick-up and drop-off as two stops on a rail, with the estimated driving
// time between them.
export function StopsCard({
  pickup,
  dropoff,
  date,
  dropoffWhen,
}: Pick<Props, "pickup" | "dropoff" | "date" | "dropoffWhen">) {
  const hours = estimateDurationHours(pickup, dropoff);
  const stops = [
    {
      key: "pickup",
      label: "Pick up",
      place: pickup,
      when: date || "Time to be confirmed",
    },
    {
      key: "dropoff",
      label: "Drop off",
      place: dropoff,
      when: dropoffWhen || "On arrival",
    },
  ];

  return (
    <>
      {/* Pick-up and drop-off: title outside the card, like every other section. */}
      <h2 className="t-h3 text-[color:var(--color-ink)]">
        Pick-up and drop-off
      </h2>
      <div className="mt-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-4 shadow-card sm:p-5">
        <ol>
          {stops.map((stop, i) => (
            <li key={stop.key}>
              <div className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-surface-soft)] text-[color:var(--color-ink)]"
                >
                  <Icon name="location" size={15} strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="t-caption text-[color:var(--color-muted)]">
                    {stop.label}
                  </p>
                  <p className="mt-0.5 t-body-lg font-bold text-[color:var(--color-ink)]">
                    {stop.place}
                  </p>
                  <p className="mt-0.5 t-body-sm text-[color:var(--color-ink)]">
                    {stop.when}
                  </p>
                </div>
              </div>
              {i === 0 && (
                <div className="my-2 flex gap-3">
                  <span
                    aria-hidden
                    className="relative flex w-6 shrink-0 justify-center"
                  >
                    <span className="w-0.5 rounded-full bg-[color:var(--color-ink)]" />
                    <span className="absolute bottom-0 size-2 rounded-full bg-[color:var(--color-ink)]" />
                  </span>
                  <div className="flex flex-col py-2">
                    <span className="t-body-sm font-semibold text-[color:var(--color-ink)]">
                      {formatDurationHours(hours)}
                    </span>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

// The "car + trip" summary at the top of Payment and OTP Verification —
// one component so those screens can't drift apart. The review step lays
// the two pieces out in its own columns.
export default function BookingRouteCard({
  vehicle,
  pickup,
  dropoff,
  date,
  dropoffWhen,
  total,
  days,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <VehicleSummaryCard vehicle={vehicle} total={total} days={days} />
      <StopsCard
        pickup={pickup}
        dropoff={dropoff}
        date={date}
        dropoffWhen={dropoffWhen}
      />
    </div>
  );
}
