import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import FinanceLedger from "../../../components/FinanceLedger";
import { accountTabs } from "./_tabs";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { t } from "../../../lib/i18n";

export default function AccountFinance() {
  usePageTitle(t("Finance"));
  return (
    <PageShell>
      <ProfileHero />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={accountTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <h2 className="t-h2">{t("Finance")}</h2>
        <FinanceLedger role="customer" />
      </div>
    </PageShell>
  );
}
