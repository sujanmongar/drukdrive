import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import AccountCardsGrid from "../../../components/AccountCardsGrid";
import type { AccountCard } from "../../../components/AccountCardsGrid";
import { routes } from "../../../lib/routes";
import { accountTabs } from "./_tabs";
import { usePageTitle } from "../../../hooks/usePageTitle";

const cards: AccountCard[] = [
  {
    icon: "user",
    title: "Personal Info",
    description: "Provide personal details and how we can reach you",
    to: routes.accountProfileEdit,
  },
  {
    icon: "lock",
    title: "Login & security",
    description: "Update your password and secure your account",
    to: routes.accountProfileEdit,
  },
  {
    icon: "wallet",
    title: "Payment & payouts",
    description: "Review payments, payouts, coupons, gift cards, and taxes",
    to: routes.accountFinance,
  },
  {
    icon: "info",
    title: "Global preferences",
    description: "Set your default language, currency, and timezone",
    to: routes.accountPreferences,
  },
];

export default function AccountProfile() {
  usePageTitle("Account");
  return (
    <PageShell>
      <ProfileHero />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={accountTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <h2 className="t-h2 text-[color:var(--color-ink)]">Account</h2>
        <AccountCardsGrid cards={cards} />
      </div>
    </PageShell>
  );
}
