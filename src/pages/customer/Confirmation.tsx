import { useParams, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import VehicleImage from "../../components/VehicleImage";
import StatusBadge from "../../components/StatusBadge";
import { routes, bookingTypeLabels } from "../../lib/routes";
import { bookings, vehicles } from "../../data/mockData";
import { addOns, computeFare, isAddOnId } from "../../lib/pricing";
import { formatDropoff, formatPickup, parseBooking } from "../../lib/booking";
import { useCurrency } from "../../lib/currency";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function Confirmation() {
  usePageTitle("Booking confirmed");
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();

  // Arriving straight from checkout (vehicleId in the URL) means this is the
  // booking that was just made — build the display entirely from that live
  // vehicle + trip params. Arriving from My Bookings has no vehicleId, so we
  // fall back to the static historical record for that id.
  const vehicleId = searchParams.get("vehicleId");
  const liveVehicle = vehicleId
    ? vehicles.find((v) => v.id === vehicleId)
    : undefined;
  const historicalBooking = bookings.find((b) => b.id === id) ?? bookings[0];
  const historicalVehicle =
    vehicles.find((v) => v.id === historicalBooking.vehicleId) ?? vehicles[0];

  const vehicle = liveVehicle ?? historicalVehicle;
  const booking = parseBooking(searchParams, isAddOnId);
  const fare = liveVehicle
    ? computeFare(booking, liveVehicle.pricePerDay, format)
    : null;
  const totalParam = searchParams.get("total");
  const displayTotal = totalParam
    ? Number(totalParam)
    : fare
      ? fare.total
      : historicalBooking.total;
  const amountPaid = Number(searchParams.get("amountDue")) || displayTotal;
  const balance = Math.round((displayTotal - amountPaid) * 100) / 100;
  const chosenAddOns = liveVehicle
    ? addOns.filter((a) => booking.addOnIds.includes(a.id))
    : [];

  const pickup = liveVehicle
    ? searchParams.get("pickup") || vehicle.location
    : historicalBooking.pickup;
  const dropoff = liveVehicle
    ? searchParams.get("dropoff") || vehicle.location
    : historicalBooking.dropoff;
  const date = liveVehicle ? formatPickup(booking) : historicalBooking.date;
  const dropoffWhen = liveVehicle ? formatDropoff(booking) : null;
  const status = liveVehicle ? "Upcoming" : historicalBooking.status;
  const bookingType = liveVehicle
    ? `${bookingTypeLabels[booking.type]}${fare ? ` · ${fare.unit}` : ""}`
    : historicalBooking.bookingType;
  const bookingId = liveVehicle
    ? (id ?? historicalBooking.id)
    : historicalBooking.id;

  const invoiceUrl = totalParam
    ? `${routes.invoice(bookingId)}?${searchParams.toString()}`
    : routes.invoice(bookingId);

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[720px] px-4 py-12 md:px-10">
        <div className="flex flex-col items-center text-center">
          <Icon
            name="check-circle"
            size={56}
            className="text-[color:var(--color-success)]"
          />
          <h1 className="t-h1 mt-4 text-[color:var(--color-ink)]">
            Booking confirmed
          </h1>
          <p className="mt-1.5 text-sm text-[color:var(--color-muted)]">
            Your ride is booked. Details have been sent to your email.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-[color:var(--color-border)] p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <VehicleImage
                vehicleId={vehicle.id}
                category={vehicle.category}
                className="size-16 rounded-lg"
              />
              <div>
                <p className="text-base font-bold text-[color:var(--color-ink)]">
                  {vehicle.name}
                </p>
                <p className="text-xs text-[color:var(--color-muted)]">
                  {bookingType}
                </p>
              </div>
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="my-5 h-px bg-[color:var(--color-border)]" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Icon
                name="location"
                size={18}
                className="mt-0.5 shrink-0 text-[color:var(--color-ink-soft)]"
              />
              <div>
                <p className="text-xs font-semibold text-[color:var(--color-muted)]">
                  Pickup
                </p>
                <p className="text-sm text-[color:var(--color-ink)]">
                  {pickup}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon
                name="location"
                size={18}
                className="mt-0.5 shrink-0 text-[color:var(--color-ink-soft)]"
              />
              <div>
                <p className="text-xs font-semibold text-[color:var(--color-muted)]">
                  Drop-off
                </p>
                <p className="text-sm text-[color:var(--color-ink)]">
                  {dropoff}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon
                name="calendar"
                size={18}
                className="mt-0.5 shrink-0 text-[color:var(--color-ink-soft)]"
              />
              <div>
                <p className="text-xs font-semibold text-[color:var(--color-muted)]">
                  {dropoffWhen ? "Pick-up · Drop-off" : "Date & time"}
                </p>
                <p className="text-sm text-[color:var(--color-ink)]">{date}</p>
                {dropoffWhen && (
                  <p className="text-sm text-[color:var(--color-ink)]">
                    {dropoffWhen}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon
                name="credit-card"
                size={18}
                className="mt-0.5 shrink-0 text-[color:var(--color-ink-soft)]"
              />
              <div>
                <p className="text-xs font-semibold text-[color:var(--color-muted)]">
                  Amount paid
                </p>
                <p className="text-sm text-[color:var(--color-ink)]">
                  {format(amountPaid)}
                </p>
                {balance > 0 && (
                  <p className="text-xs text-[color:var(--color-muted)]">
                    {format(balance)} due to the driver at pick-up
                  </p>
                )}
                {fare && fare.deposit > 0 && (
                  <p className="text-xs text-[color:var(--color-muted)]">
                    {format(fare.deposit)} refundable deposit at collection
                  </p>
                )}
              </div>
            </div>
          </div>

          {chosenAddOns.length > 0 && (
            <>
              <div className="my-5 h-px bg-[color:var(--color-border)]" />
              <div className="flex items-start gap-3">
                <Icon
                  name="check-circle"
                  size={18}
                  className="mt-0.5 shrink-0 text-[color:var(--color-ink-soft)]"
                />
                <div>
                  <p className="text-xs font-semibold text-[color:var(--color-muted)]">
                    Add-ons
                  </p>
                  <p className="text-sm text-[color:var(--color-ink)]">
                    {chosenAddOns.map((a) => a.name).join(", ")}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="my-5 h-px bg-[color:var(--color-border)]" />

          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[color:var(--color-muted)]">
              Booking reference
            </p>
            <p className="font-mono text-sm font-bold tracking-wide text-[color:var(--color-ink)]">
              {bookingId}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" size="lg" to={invoiceUrl} fullWidth>
            <Icon name="download" size={18} />
            Download invoice
          </Button>
          <Button
            variant="primary"
            size="lg"
            to={routes.accountBookings}
            fullWidth
          >
            View my bookings
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
