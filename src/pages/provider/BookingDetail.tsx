import { useParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import VehicleImage from "../../components/VehicleImage";
import StatusBadge from "../../components/StatusBadge";
import { driverBookings } from "../../data/mockData";
import { useDriverVehicles } from "../../lib/driverVehicles";
import { routes } from "../../lib/routes";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ProviderBookingDetail() {
  usePageTitle("Booking Details");
  const { id } = useParams<{ id: string }>();
  const { vehicles: driverVehicles } = useDriverVehicles();
  const booking = driverBookings.find((b) => b.id === id) ?? driverBookings[0];
  const vehicle = driverVehicles.find((v) => v.id === booking.vehicleId) ?? driverVehicles[0];

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[720px] px-4 py-8 md:px-[60px] md:py-10">
        <Button variant="ghost" size="sm" to={routes.providerBookings} className="mb-4">
          <Icon name="arrow-left" size={16} />
          Back to bookings
        </Button>

        <div className="rounded-xl border border-[color:var(--color-border)] p-6 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-16 rounded-lg" />
              <div>
                <p className="text-base font-bold text-[color:var(--color-ink)]">{vehicle.name}</p>
                <p className="text-xs text-[color:var(--color-muted)]">{vehicle.plate}</p>
              </div>
            </div>
            <StatusBadge status={booking.status === "Upcoming" ? "Not confirmed" : booking.status} />
          </div>

          <div className="my-5 h-px bg-[color:var(--color-border)]" />

          <div className="flex items-center gap-3">
            <Icon name="user" size={18} className="text-[color:var(--color-ink-soft)]" />
            <div>
              <p className="text-xs font-semibold text-[color:var(--color-muted)]">Rider</p>
              <p className="text-sm text-[color:var(--color-ink)]">{booking.riderName}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Icon name="location" size={18} className="mt-0.5 shrink-0 text-[color:var(--color-ink-soft)]" />
              <div>
                <p className="text-xs font-semibold text-[color:var(--color-muted)]">Pickup</p>
                <p className="text-sm text-[color:var(--color-ink)]">{booking.pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="location" size={18} className="mt-0.5 shrink-0 text-[color:var(--color-ink-soft)]" />
              <div>
                <p className="text-xs font-semibold text-[color:var(--color-muted)]">Drop-off</p>
                <p className="text-sm text-[color:var(--color-ink)]">{booking.dropoff}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="calendar" size={18} className="mt-0.5 shrink-0 text-[color:var(--color-ink-soft)]" />
              <div>
                <p className="text-xs font-semibold text-[color:var(--color-muted)]">Date &amp; time</p>
                <p className="text-sm text-[color:var(--color-ink)]">{booking.date}</p>
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-[color:var(--color-border)]" />

          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[color:var(--color-muted)]">Booking reference</p>
            <p className="font-mono text-sm font-bold tracking-wide text-[color:var(--color-ink)]">{booking.id}</p>
          </div>
        </div>

        <Button variant="primary" size="lg" to={routes.providerBookings} fullWidth className="mt-8">
          Back to bookings
        </Button>
      </div>
    </PageShell>
  );
}
