import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import NotificationsList from "../../components/NotificationsList";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ProviderNotifications() {
  usePageTitle("Driver Notifications");

  return (
    <PageShell>
      <ProfileHero
        editHref={routes.providerAccountEdit}
        reviewHref={routes.providerReviews}
      />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <NotificationsList role="driver" />
      </div>
    </PageShell>
  );
}
