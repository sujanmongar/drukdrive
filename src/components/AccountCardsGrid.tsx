import { Link } from "react-router-dom";
import Icon from "./Icon";
import type { IconName } from "./Icon";

export type AccountCard = { icon: IconName; title: string; description: string; to: string };

// Same account-settings grid shape for both roles — only the `to` targets
// differ (customer vs. driver Personal Info/Finance routes).
export default function AccountCardsGrid({ cards }: { cards: AccountCard[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Link
          key={c.title}
          to={c.to}
          className="flex flex-col gap-4 rounded-xl border border-[color:var(--color-border)] p-6 hover:border-[color:var(--color-ink)]"
        >
          <Icon name={c.icon} size={26} className="text-[color:var(--color-ink)]" />
          <div>
            <p className="text-base font-bold text-[color:var(--color-ink)]">{c.title}</p>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">{c.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
