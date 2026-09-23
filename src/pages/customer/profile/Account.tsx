import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import AccountCardsGrid from "../../../components/AccountCardsGrid";
import type { AccountCard } from "../../../components/AccountCardsGrid";
import { routes } from "../../../lib/routes";
import { accountTabs } from "./_tabs";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { t, tx } from "../../../lib/i18n";

const cards: AccountCard[] = [
  {
    icon: "user",
    title: tx("Personal info"),
    description: tx("Provide personal details and how we can reach you"),
    to: routes.accountProfileEdit,
  },
  {
    icon: "lock",
    title: tx("Login & security"),
    description: tx("Update your password and secure your account"),
    to: `${routes.accountProfileEdit}?section=security`,
  },
  {
    icon: "wallet",
    title: tx("Payment & payouts"),
    description: tx("Review payments, payouts, coupons, gift cards, and taxes"),
    to: routes.accountFinance,
  },
  {
    icon: "info",
    title: tx("Global preferences"),
    description: tx("Set your default language, currency, and timezone"),
    to: routes.accountPreferences,
  },
];

export default function AccountProfile() {
  usePageTitle(t("Account"));
  return (
    <PageShell>
      <ProfileHero />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={accountTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <h2 className="t-h2">{t("Account")}</h2>
        <AccountCardsGrid cards={cards} />
      </div>
    </PageShell>
  );
}
