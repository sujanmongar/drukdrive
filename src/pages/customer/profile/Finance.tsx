import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import Icon from "../../../components/Icon";
import StatusBadge from "../../../components/StatusBadge";
import { financeSummary } from "../../../data/mockData";
import { accountTabs } from "./_tabs";

const summaryCards = [
  { key: "totalEarnings", label: "Total Spend", icon: "wallet" as const },
  { key: "pending", label: "Pending", icon: "clock" as const },
  { key: "withdrawn", label: "Refunded", icon: "check-circle" as const },
];

export default function AccountFinance() {
  return (
    <PageShell>
      <SecondaryTabs tabs={accountTabs} />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <h1 className="text-2xl font-bold text-[#222]">Finance</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          An overview of your payments and transactions.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.key}
              className="rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]"
            >
              <div className="flex items-center gap-2 text-[color:var(--color-muted)]">
                <Icon name={card.icon} size={16} />
                <span className="text-xs font-semibold">{card.label}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#222]">
                ${financeSummary[card.key as keyof typeof financeSummary] as number}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-base font-bold text-[#222]">Transactions</h2>

          <div className="mt-4 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
            <div className="hidden grid-cols-[1fr_140px_120px_120px] gap-3 border-b border-[color:var(--color-border)] px-5 py-3 text-xs font-semibold text-[color:var(--color-muted)] sm:grid">
              <span>Description</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Status</span>
            </div>

            <div className="divide-y divide-[color:var(--color-border)]">
              {financeSummary.transactions.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col gap-2 px-5 py-4 sm:grid sm:grid-cols-[1fr_140px_120px_120px] sm:items-center sm:gap-3"
                >
                  <span className="text-sm font-medium text-[#222]">{t.label}</span>
                  <span className="text-xs text-[color:var(--color-muted)] sm:text-sm">{t.date}</span>
                  <span
                    className={`text-sm font-bold sm:text-right ${
                      t.amount >= 0 ? "text-[color:var(--color-success)]" : "text-[color:var(--color-danger)]"
                    }`}
                  >
                    {t.amount >= 0 ? "+" : "-"}${Math.abs(t.amount)}
                  </span>
                  <span className="sm:text-right">
                    <StatusBadge status={t.status} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
