import { useMemo } from "react";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import BookingsList, {
  type BookingListItem,
} from "../../components/BookingsList";
import { driverBookings } from "../../data/mockData";
import { useDriverVehicles } from "../../lib/driverVehicles";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";
import { usePageTitle } from "../../hooks/usePageTitle";
import { t, tx } from "../../lib/i18n";

export default function ProviderBookings() {
  usePageTitle(t("Driver Bookings"));
  const { vehicles: driverVehicles } = useDriverVehicles();

  const groups = useMemo(() => {
    const items: BookingListItem[] = driverBookings.map((b) => ({
      ...b,
      href: routes.providerBookingDetail(b.id),
      vehicle:
        driverVehicles.find((v) => v.id === b.vehicleId) ?? driverVehicles[0],
    }));
    // Group names stay English (they are the filter state); the list shows t(name).
    return {
      [tx("Current")]: items.filter((b) => b.status === "Upcoming"),
      [tx("Past")]: items.filter((b) => b.status !== "Upcoming"),
    };
  }, [driverVehicles]);

  return (
    <PageShell>
      <ProfileHero editHref={routes.providerAccountEdit} />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <BookingsList groups={groups} />
      </div>
    </PageShell>
  );
}
