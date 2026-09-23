import { Link, useParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import VehicleImage from "../../components/VehicleImage";
import StatusBadge from "../../components/StatusBadge";
import { driverBookings } from "../../data/mockData";
import { useDriverVehicles } from "../../lib/driverVehicles";
import { routes } from "../../lib/routes";
import { usePageTitle } from "../../hooks/usePageTitle";
import { t } from "../../lib/i18n";
import { card, metaLabel, metaValue, reference } from "../../lib/ui";

import { formatStored } from "../../lib/dates";
export default function ProviderBookingDetail() {
  usePageTitle(t("Booking Details"));
  const { id } = useParams<{ id: string }>();
  const { vehicles: driverVehicles } = useDriverVehicles();
  const booking = driverBookings.find((b) => b.id === id) ?? driverBookings[0];
  const vehicle =
    driverVehicles.find((v) => v.id === booking.vehicleId) ?? driverVehicles[0];

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[720px] px-4 py-6 md:px-10 md:py-10">
        <div className="mb-5 flex items-center gap-2">
          <Link
            to={routes.providerBookings}
            aria-label={t("Back to bookings")}
            className="icon-btn -ml-2 size-10"
          >
            <Icon name="chevron-left" size={22} />
          </Link>
          <h1 className="t-h2">{t("Booking details")}</h1>
        </div>

        <div className={`${card} p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <VehicleImage
                vehicleId={vehicle.id}
                category={vehicle.category}
                className="size-16 rounded-xl"
              />
              <div>
                <p className="t-h4">{vehicle.name}</p>
                <p className="t-caption">{vehicle.plate}</p>
              </div>
            </div>
            <StatusBadge
              status={
                booking.status === "Upcoming" ? "Confirmed" : booking.status
              }
            />
          </div>

          <div className="my-5 h-px bg-[color:var(--color-border)]" />

          <div className="flex items-center gap-3">
            <Icon
              name="user"
              size={18}
              className="text-[color:var(--color-ink-soft)]"
            />
            <div>
              <p className={metaLabel}>{t("Rider")}</p>
              <p className={metaValue}>{booking.riderName}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Icon
                name="location"
                size={18}
                className="mt-0.5 shrink-0 text-[color:var(--color-ink-soft)]"
              />
              <div>
                <p className={metaLabel}>{t("Pickup")}</p>
                <p className={metaValue}>{booking.pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon
                name="location"
                size={18}
                className="mt-0.5 shrink-0 text-[color:var(--color-ink-soft)]"
              />
              <div>
                <p className={metaLabel}>{t("Drop-off")}</p>
                <p className={metaValue}>{booking.dropoff}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon
                name="calendar"
                size={18}
                className="mt-0.5 shrink-0 text-[color:var(--color-ink-soft)]"
              />
              <div>
                <p className={metaLabel}>{t("Date & time")}</p>
                <p className={metaValue}>{formatStored(booking.date)}</p>
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-[color:var(--color-border)]" />

          <div className="flex items-center justify-between">
            <p className={metaLabel}>{t("Booking reference")}</p>
            <p className={reference}>{booking.id}</p>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          to={routes.providerBookings}
          fullWidth
          className="mt-8"
        >
          {t("Back to bookings")}
        </Button>
      </div>
    </PageShell>
  );
}
