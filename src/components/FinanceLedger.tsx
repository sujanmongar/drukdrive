import { useMemo, useState } from "react";
import Icon from "./Icon";
import { financeSummary } from "../data/mockData";

type LedgerTab = "Ledger" | "Report" | "Credit Notes" | "Debit Notes";
const ledgerTabs: LedgerTab[] = ["Ledger", "Report", "Credit Notes", "Debit Notes"];

// Same wallet, same ledger, whichever hat the account is wearing — shared by
// the customer Finance page and the driver Finance page.
export default function FinanceLedger() {
  const [tab, setTab] = useState<LedgerTab>("Ledger");

  const rows = useMemo(() => {
    let balance = 0;
    return financeSummary.transactions.map((t) => {
      const debit = t.amount < 0 ? Math.abs(t.amount) : 0;
      const credit = t.amount > 0 ? t.amount : 0;
      balance += credit - debit;
      return { ...t, debit, credit, balance };
    });
  }, []);

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
                  ? "border-[#222] bg-[#222] text-white"
                  : "border-[color:var(--color-border)] text-[#222] hover:border-[#222]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-[#222] hover:border-[#222]"
        >
          <Icon name="filter" size={16} />
          Filter
        </button>
      </div>

      {tab === "Ledger" ? (
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
                  <td className="whitespace-nowrap px-4 py-3 text-[#333]">{r.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-[#2276e3]">{r.id.toUpperCase()}</td>
                  <td className="px-4 py-3 text-[#222]">{r.label}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[#222]">
                    {r.debit ? r.debit.toFixed(2) : "0"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[#222]">
                    {r.credit ? r.credit.toFixed(2) : "0"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-[#222]">
                    {r.balance.toFixed(2)} {r.balance >= 0 ? "Cr" : "Dr"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-neutral-50">
                <td className="px-4 py-3 text-center font-bold text-[#222]" colSpan={3}>
                  Total
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-[#222]">
                  {totalDebit.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-[#222]">
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
          <p className="mt-3 text-sm font-semibold text-[#222]">No {tab.toLowerCase()} yet</p>
        </div>
      )}
    </>
  );
}
