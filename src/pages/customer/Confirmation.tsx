import { useParams, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { routes } from "../../lib/routes";
import { bookings, vehicles } from "../../data/mockData";
import { computeFare } from "../../lib/pricing";
import { useCurrency } from "../../lib/currency";

const statusStyles: Record<string, string> = {
  Upcoming: "bg-[color:var(--color-info-bg)] text-[color:var(--color-info-text)]",
  Completed: "bg-[#e6f8ea] text-[color:var(--color-success)]",
  Cancelled: "bg-[#fde8e6] text-[color:var(--color-danger)]",
};

export default function Confirmation() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();
  const booking = bookings.find((b) => b.id === id) ?? bookings[0];

  // If we arrived straight from checkout (vehicleId/total in the URL), that's
  // the live booking that was just made — prefer its real numbers over the
  // static mock record. Landing here from My Bookings has no vehicleId, so it
  // falls back to the historical mock booking's own total.
  const vehicleId = searchParams.get("vehicleId");
  const totalParam = searchParams.get("total");
  const vehicle = vehicleId ? vehicles.find((v) => v.id === vehicleId) : undefined;
  const displayTotal = totalParam
    ? Number(totalParam)
    : vehicle
      ? computeFare(vehicle.pricePerDay).total
      : booking.total;
  const invoiceUrl = totalParam
    ? `${routes.invoice(booking.id)}?total=${totalParam}`
    : routes.invoice(booking.id);

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[720px] px-4 py-12 md:px-[60px]">
        <div className="flex flex-col items-center text-center">
          <Icon name="check-circle" size={56} className="text-[color:var(--color-success)]" />
          <h1 className="mt-4 text-2xl font-bold text-[#222] md:text-3xl">Booking confirmed</h1>
          <p className="mt-1.5 text-sm text-[color:var(--color-muted)]">
            Your ride is booked. Details have been sent to your email.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-[#e5ebf0] p-6 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={booking.image}
                alt={booking.vehicle}
                className="size-16 rounded-lg object-cover"
              />
              <div>
                <p className="text-base font-bold text-[#222]">{booking.vehicle}</p>
                <p className="text-xs text-[color:var(--color-muted)]">{booking.bookingType}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statusStyles[booking.status] ?? "bg-[#f4f6f8] text-[#333]"
              }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="my-5 h-px bg-[#e5ebf0]" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Icon name="location" size={18} className="mt-0.5 shrink-0 text-[#333]" />
              <div>
                <p className="text-xs font-semibold text-[#747474]">Pickup</p>
                <p className="text-sm text-[#222]">{booking.pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="location" size={18} className="mt-0.5 shrink-0 text-[#333]" />
              <div>
                <p className="text-xs font-semibold text-[#747474]">Drop-off</p>
                <p className="text-sm text-[#222]">{booking.dropoff}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="calendar" size={18} className="mt-0.5 shrink-0 text-[#333]" />
              <div>
                <p className="text-xs font-semibold text-[#747474]">Date &amp; time</p>
                <p className="text-sm text-[#222]">{booking.date}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="credit-card" size={18} className="mt-0.5 shrink-0 text-[#333]" />
              <div>
                <p className="text-xs font-semibold text-[#747474]">Amount paid</p>
                <p className="text-sm text-[#222]">{format(displayTotal)}</p>
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-[#e5ebf0]" />

          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#747474]">Booking reference</p>
            <p className="font-mono text-sm font-bold tracking-wide text-[#222]">{booking.id}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" size="lg" to={invoiceUrl} fullWidth>
            <Icon name="download" size={18} />
            Download invoice
          </Button>
          <Button variant="primary" size="lg" to={routes.accountBookings} fullWidth>
            View my bookings
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
