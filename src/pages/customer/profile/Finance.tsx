import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import FinanceLedger from "../../../components/FinanceLedger";
import { accountTabs } from "./_tabs";

export default function AccountFinance() {
  return (
    <PageShell>
      <ProfileHero />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={accountTabs} />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <h2 className="text-2xl font-bold text-[#222]">Finance</h2>
        <FinanceLedger />
      </div>
    </PageShell>
  );
}
