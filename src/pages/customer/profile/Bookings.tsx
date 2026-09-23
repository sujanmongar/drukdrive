import { useMemo } from "react";
import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import BookingsList, {
  type BookingListItem,
} from "../../../components/BookingsList";
import { bookings, vehicles } from "../../../data/mockData";
import { routes } from "../../../lib/routes";
import { accountTabs } from "./_tabs";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { t, tx } from "../../../lib/i18n";

export default function AccountBookings() {
  usePageTitle(t("My Bookings"));

  const groups = useMemo(() => {
    const items: BookingListItem[] = bookings.map((b) => ({
      ...b,
      href: routes.confirmation(b.id),
      vehicle: vehicles.find((v) => v.id === b.vehicleId) ?? vehicles[0],
    }));
    const upcoming = items.filter((b) => b.status === "Upcoming");
    return {
      [tx("Current")]: upcoming.slice(0, 1),
      [tx("Upcoming")]: upcoming.slice(1),
      [tx("Past")]: items.filter((b) => b.status !== "Upcoming"),
    };
  }, []);

  return (
    <PageShell>
      <ProfileHero />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={accountTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <BookingsList groups={groups} />
      </div>
    </PageShell>
  );
}
