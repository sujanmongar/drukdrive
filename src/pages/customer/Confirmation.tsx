import { useParams, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import VehicleImage from "../../components/VehicleImage";
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

  // Arriving straight from checkout (vehicleId in the URL) means this is the
  // booking that was just made — build the display entirely from that live
  // vehicle + trip params. Arriving from My Bookings has no vehicleId, so we
  // fall back to the static historical record for that id.
  const vehicleId = searchParams.get("vehicleId");
  const liveVehicle = vehicleId ? vehicles.find((v) => v.id === vehicleId) : undefined;
  const historicalBooking = bookings.find((b) => b.id === id) ?? bookings[0];
  const historicalVehicle = vehicles.find((v) => v.id === historicalBooking.vehicleId) ?? vehicles[0];

  const vehicle = liveVehicle ?? historicalVehicle;
  const totalParam = searchParams.get("total");
  const displayTotal = totalParam ? Number(totalParam) : liveVehicle ? computeFare(liveVehicle.pricePerDay).total : historicalBooking.total;

  const pickup = liveVehicle ? searchParams.get("pickup") || vehicle.location : historicalBooking.pickup;
  const dropoff = liveVehicle ? searchParams.get("dropoff") || vehicle.location : historicalBooking.dropoff;
  const date = liveVehicle ? searchParams.get("date") || "" : historicalBooking.date;
  const status = liveVehicle ? "Upcoming" : historicalBooking.status;
  const bookingType = liveVehicle ? "Daily Rides" : historicalBooking.bookingType;
  const bookingId = liveVehicle ? id ?? historicalBooking.id : historicalBooking.id;

  const invoiceUrl = totalParam
    ? `${routes.invoice(bookingId)}?${searchParams.toString()}`
    : routes.invoice(bookingId);

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
              <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-16 rounded-lg" />
              <div>
                <p className="text-base font-bold text-[#222]">{vehicle.name}</p>
                <p className="text-xs text-[color:var(--color-muted)]">{bookingType}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statusStyles[status] ?? "bg-[#f4f6f8] text-[#333]"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="my-5 h-px bg-[#e5ebf0]" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Icon name="location" size={18} className="mt-0.5 shrink-0 text-[#333]" />
              <div>
                <p className="text-xs font-semibold text-[#747474]">Pickup</p>
                <p className="text-sm text-[#222]">{pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="location" size={18} className="mt-0.5 shrink-0 text-[#333]" />
              <div>
                <p className="text-xs font-semibold text-[#747474]">Drop-off</p>
                <p className="text-sm text-[#222]">{dropoff}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="calendar" size={18} className="mt-0.5 shrink-0 text-[#333]" />
              <div>
                <p className="text-xs font-semibold text-[#747474]">Date &amp; time</p>
                <p className="text-sm text-[#222]">{date}</p>
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
            <p className="font-mono text-sm font-bold tracking-wide text-[#222]">{bookingId}</p>
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
