import { Link } from "react-router-dom";
import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import Icon from "../../../components/Icon";
import type { IconName } from "../../../components/Icon";
import { routes } from "../../../lib/routes";
import { accountTabs } from "./_tabs";

const cards: { icon: IconName; title: string; description: string; to: string }[] = [
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

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="flex flex-col gap-4 rounded-xl border border-[color:var(--color-border)] p-6 hover:border-[#222]"
            >
              <Icon name={c.icon} size={26} className="text-[#222]" />
              <div>
                <p className="text-base font-bold text-[#222]">{c.title}</p>
                <p className="mt-1 text-sm text-[color:var(--color-muted)]">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
