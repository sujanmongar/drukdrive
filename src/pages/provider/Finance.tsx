import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import FinanceLedger from "../../components/FinanceLedger";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";

export default function ProviderFinance() {
  return (
    <PageShell>
      <ProfileHero editHref={routes.providerAccountEdit} reviewHref={routes.providerReviews} />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <h2 className="text-2xl font-bold text-[#222]">Finance</h2>
        <FinanceLedger />
      </div>
    </PageShell>
  );
}
