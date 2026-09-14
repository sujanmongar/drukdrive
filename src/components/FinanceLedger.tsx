import { useMemo, useState } from "react";
import Icon from "./Icon";
import { financeSummary } from "../data/mockData";

type LedgerTab = "Ledger" | "Report" | "Credit Notes" | "Debit Notes";
const ledgerTabs: LedgerTab[] = ["Ledger", "Report", "Credit Notes", "Debit Notes"];

// Same wallet, same ledger, whichever hat the account is wearing — shared by
// the customer Finance page and the driver Finance page.
const statusFilters = ["All", "Credited", "Processed", "Pending"] as const;
type StatusFilter = (typeof statusFilters)[number];

export default function FinanceLedger() {
  const [tab, setTab] = useState<LedgerTab>("Ledger");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [filterOpen, setFilterOpen] = useState(false);

  const allRows = useMemo(
    () =>
      financeSummary.transactions.reduce<
        ((typeof financeSummary.transactions)[number] & { debit: number; credit: number; balance: number })[]
      >((acc, t) => {
        const debit = t.amount < 0 ? Math.abs(t.amount) : 0;
        const credit = t.amount > 0 ? t.amount : 0;
        const balance = (acc.at(-1)?.balance ?? 0) + credit - debit;
        acc.push({ ...t, debit, credit, balance });
        return acc;
      }, []),
    [],
  );

  const rows = useMemo(
    () => (statusFilter === "All" ? allRows : allRows.filter((r) => r.status === statusFilter)),
    [allRows, statusFilter],
  );

  const totalDebit = rows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0);

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto">
          {ledgerTabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                  : "border-[color:var(--color-border)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter !== "All"
                ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                : "border-[color:var(--color-border)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
            }`}
          >
            <Icon name="filter" size={16} />
            {statusFilter === "All" ? "Filter" : statusFilter}
          </button>
          {filterOpen && (
            <>
              <button aria-label="Close" className="fixed inset-0 z-10 cursor-default" onClick={() => setFilterOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white p-1.5 shadow-pop">
                {statusFilters.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setStatusFilter(s);
                      setFilterOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                      statusFilter === s ? "bg-neutral-100 font-semibold text-[color:var(--color-ink)]" : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-surface-soft)]"
                    }`}
                  >
                    {s}
                    {statusFilter === s && <Icon name="check" size={14} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {tab === "Ledger" ? rows.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-[color:var(--color-border)] py-16 text-center">
          <Icon name="wallet" size={32} className="text-[color:var(--color-muted)]" />
          <p className="mt-3 text-sm font-semibold text-[color:var(--color-ink)]">No {statusFilter.toLowerCase()} transactions</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[color:var(--color-border)]">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] bg-neutral-50 text-left text-xs font-semibold text-[color:var(--color-muted)]">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Reference Number</th>
                <th className="px-4 py-3 font-semibold">Particulars</th>
                <th className="px-4 py-3 text-right font-semibold">Debit</th>
                <th className="px-4 py-3 text-right font-semibold">Credit</th>
                <th className="px-4 py-3 text-right font-semibold">Running Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[color:var(--color-border)] last:border-b-0">
                  <td className="whitespace-nowrap px-4 py-3 text-[color:var(--color-ink-soft)]">{r.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-[color:var(--color-link)]">{r.id.toUpperCase()}</td>
                  <td className="px-4 py-3 text-[color:var(--color-ink)]">{r.label}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[color:var(--color-ink)]">
                    {r.debit ? r.debit.toFixed(2) : "0"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[color:var(--color-ink)]">
                    {r.credit ? r.credit.toFixed(2) : "0"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-[color:var(--color-ink)]">
                    {r.balance.toFixed(2)} {r.balance >= 0 ? "Cr" : "Dr"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-neutral-50">
                <td className="px-4 py-3 text-center font-bold text-[color:var(--color-ink)]" colSpan={3}>
                  Total
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-[color:var(--color-ink)]">
                  {totalDebit.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-[color:var(--color-ink)]">
                  {totalCredit.toFixed(2)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-[color:var(--color-border)] py-16 text-center">
          <Icon name="wallet" size={32} className="text-[color:var(--color-muted)]" />
          <p className="mt-3 text-sm font-semibold text-[color:var(--color-ink)]">No {tab.toLowerCase()} yet</p>
        </div>
      )}
    </>
  );
}
