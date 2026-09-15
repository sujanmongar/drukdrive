import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import VehicleSpecs from "./VehicleSpecs";
import { vehicleClassOf } from "../data/mockData";
import type { Vehicle } from "../data/mockData";

// What a DrukDrive fare covers — the reassurance list every booking
// platform puts next to the car (fuel, driver, cancellation terms).
const included = [
  "Professional driver, fuel and tolls",
  "Free cancellation up to 24 hours before pick-up",
  "Door-to-door pick-up and drop-off",
  "One meal stop on the way",
];

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
    { key: "pickup", label: "Pick-up", when: date || "Time to be confirmed", place: pickup, link: "View pick-up instructions" },
    { key: "dropoff", label: "Drop-off", when: "Same day, on arrival", place: dropoff, link: "View drop-off instructions" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Cancellation terms up top, the way Booking / Economy Bookings do it. */}
      <div className="flex items-center gap-3 rounded-xl border border-[color:var(--color-success)]/30 bg-[color:var(--color-success-bg)] px-4 py-3">
        <Icon name="check-circle" size={20} className="shrink-0 text-[color:var(--color-success)]" />
        <p className="t-body-sm font-semibold text-[color:var(--color-success)]">
          Free cancellation up to 24 hours before pick-up
        </p>
      </div>

      {/* Vehicle — same anatomy as the search result cards. */}
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4 sm:p-5">
        <div className="flex gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="t-h4 truncate text-[color:var(--color-ink)]">{vehicle.name}</h3>
            <p className="t-body-sm text-[color:var(--color-muted)]">or similar {vehicleClassOf[vehicle.category]}</p>
            <VehicleSpecs vehicle={vehicle} className="mt-3" />
          </div>
          <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-24 shrink-0 rounded-xl sm:size-28" />
        </div>
        <ul className="mt-4 grid grid-cols-1 gap-2 border-t border-[color:var(--color-border)] pt-4 sm:grid-cols-2">
          {included.map((item) => (
            <li key={item} className="flex items-start gap-2 t-body-sm text-[color:var(--color-ink-soft)]">
              <Icon name="check" size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[color:var(--color-success)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Pick-up and drop-off as a two-stop timeline. */}
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4 sm:p-5">
        <h3 className="t-h4 text-[color:var(--color-ink)]">Pick-up and drop-off</h3>
        <ol className="mt-4">
          {stops.map((stop, i) => (
            <li key={stop.key} className="relative flex gap-4 pl-5">
              {/* dot + rail */}
              <span aria-hidden className="absolute left-0 top-1.5 size-2.5 rounded-full bg-[color:var(--color-ink)]" />
              {i < stops.length - 1 && (
                <span aria-hidden className="absolute left-[4px] top-4 bottom-0 w-0.5 bg-[color:var(--color-border)]" />
              )}
              <div className={`min-w-0 flex-1 ${i < stops.length - 1 ? "pb-6" : ""}`}>
                <p className="t-caption font-medium text-[color:var(--color-muted)]">
                  {stop.label} &middot; {stop.when}
                </p>
                <p className="mt-0.5 t-body font-semibold text-[color:var(--color-ink)]">{stop.place}</p>
                <a
                  href={mapsHref(stop.place)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block t-body-sm font-medium text-[color:var(--color-link)] hover:underline"
                >
                  {stop.link}
                </a>
              </div>
              <a
                href={mapsHref(stop.place)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${stop.place} in maps`}
                className="icon-btn icon-btn-filled size-10 shrink-0 self-center"
              >
                <Icon name="location" size={18} />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
