import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import AccountCardsGrid from "../../components/AccountCardsGrid";
import type { AccountCard } from "../../components/AccountCardsGrid";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";
import { usePageTitle } from "../../hooks/usePageTitle";

const cards: AccountCard[] = [
  {
    icon: "user",
    title: "Personal Info",
    description: "Provide personal details and how we can reach you",
    to: routes.providerAccountEdit,
  },
  {
    icon: "lock",
    title: "Login & security",
    description: "Update your password and secure your account",
    to: routes.providerAccountEdit,
  },
  {
    icon: "wallet",
    title: "Payment & payouts",
    description: "Review payments, payouts, coupons, gift cards, and taxes",
    to: routes.providerFinance,
  },
  {
    icon: "info",
    title: "Global preferences",
    description: "Set your default language, currency, and timezone",
    to: routes.providerAccountEdit,
  },
];

export default function ProviderAccount() {
  usePageTitle("Driver Account");
  return (
    <PageShell>
      <ProfileHero editHref={routes.providerAccountEdit} reviewHref={routes.providerReviews} />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <h2 className="text-2xl font-bold text-[color:var(--color-ink)]">Account</h2>
        <AccountCardsGrid cards={cards} />
      </div>
    </PageShell>
  );
}
