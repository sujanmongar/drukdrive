import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import AccountCardsGrid from "../../../components/AccountCardsGrid";
import type { AccountCard } from "../../../components/AccountCardsGrid";
import { routes } from "../../../lib/routes";
import { accountTabs } from "./_tabs";

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
    to: routes.accountProfileEdit,
  },
];

export default function AccountProfile() {
  return (
    <PageShell>
      <ProfileHero />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={accountTabs} />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <h2 className="text-2xl font-bold text-[#222]">Account</h2>
        <AccountCardsGrid cards={cards} />
      </div>
    </PageShell>
  );
}
