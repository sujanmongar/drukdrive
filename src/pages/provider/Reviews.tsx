import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import ReviewsList from "../../components/ReviewsList";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";
import { usePageTitle } from "../../hooks/usePageTitle";
import { t } from "../../lib/i18n";

export default function ProviderReviews() {
  usePageTitle(t("Driver Reviews"));

  return (
    <PageShell>
      <ProfileHero editHref={routes.providerAccountEdit} />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <ReviewsList role="driver" />
      </div>
    </PageShell>
  );
}
