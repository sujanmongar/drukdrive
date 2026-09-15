import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import VehicleSpecs from "./VehicleSpecs";
import { vehicleClassOf } from "../data/mockData";
import type { Vehicle } from "../data/mockData";

function mapsHref(place: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place + ", Bhutan")}`;
}

// The "car + trip" summary at the top of Review Booking, Payment and OTP
// Verification — one component so the three screens can't drift apart.
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
  const stops = [
    { key: "pickup", when: date || "Pick-up time to be confirmed", place: pickup, link: "View pick-up instructions" },
    { key: "dropoff", when: "Drop-off on arrival", place: dropoff, link: "View drop-off instructions" },
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
        </div>
      </div>

      {/* Pick-up and drop-off: two stops on a rail, with a map link each. */}
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4 sm:p-5">
        <h3 className="t-h4 text-[color:var(--color-ink)]">Pick-up and drop-off</h3>
        <ol className="mt-4">
          {stops.map((stop, i) => {
            const last = i === stops.length - 1;
            return (
              <li key={stop.key} className="relative flex items-center gap-3 pl-6">
                <span aria-hidden className="absolute left-0 top-2 size-2.5 rounded-full bg-[color:var(--color-muted)]" />
                {!last && <span aria-hidden className="absolute bottom-0 left-[4px] top-5 w-0.5 bg-[color:var(--color-border)]" />}
                <div className={`min-w-0 flex-1 ${last ? "" : "pb-7"}`}>
                  <p className="t-body text-[color:var(--color-ink)]">{stop.when}</p>
                  <p className="mt-1 t-body-lg font-bold text-[color:var(--color-ink)]">{stop.place}</p>
                  <a
                    href={mapsHref(stop.place)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-block t-body font-medium text-[color:var(--color-link)] hover:underline"
                  >
                    {stop.link}
                  </a>
                </div>
                <a
                  href={mapsHref(stop.place)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${stop.place} in maps`}
                  className={`icon-btn size-10 shrink-0 border border-[color:var(--color-border)] text-[color:var(--color-link)] ${last ? "" : "-mt-7"}`}
                >
                  <Icon name="location" size={18} />
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
