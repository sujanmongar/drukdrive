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
    title: "Personal info",
    description: "Provide personal details and how we can reach you",
    to: routes.providerAccountEdit,
  },
  {
    icon: "lock",
    title: "Login & security",
    description: "Update your password and secure your account",
    to: `${routes.providerAccountEdit}?section=security`,
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
    to: routes.providerPreferences,
  },
];

export default function ProviderAccount() {
  usePageTitle("Driver Account");
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
        <h2 className="t-h2">Account</h2>
        <AccountCardsGrid cards={cards} />
      </div>
    </PageShell>
  );
}
