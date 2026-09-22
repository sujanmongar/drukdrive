import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import EmptyState from "./EmptyState";
import { financeSummary } from "../data/mockData";
import { card, chip, menu, menuItem, reference } from "../lib/ui";

type LedgerTab = "Ledger" | "Report" | "Credit Notes" | "Debit Notes";
const ledgerTabs: LedgerTab[] = [
  "Ledger",
  "Report",
  "Credit Notes",
  "Debit Notes",
];

const emptyHelp: Record<Exclude<LedgerTab, "Ledger">, string> = {
  Report: "Reports will appear here once your account has activity.",
  "Credit Notes": "Credit notes issued to you will appear here.",
  "Debit Notes": "Debit notes issued to you will appear here.",
};

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
        ((typeof financeSummary.transactions)[number] & {
          debit: number;
          credit: number;
          balance: number;
        })[]
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
    () =>
      statusFilter === "All"
        ? allRows
        : allRows.filter((r) => r.status === statusFilter),
    [allRows, statusFilter],
  );

  const totalDebit = rows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0);

  // Hiding the scrollbar leaves a six-column table with no hint it scrolls on
  // a phone. A right-edge fade stands in for it, and clears once the user has
  // reached the last column.
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const [moreToRight, setMoreToRight] = useState(false);
  useEffect(() => {
    const node = tableWrapRef.current;
    if (!node) return;
    const update = () =>
      setMoreToRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 1);
    update();
    node.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => {
      node.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [rows]);

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          {ledgerTabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`${chip(tab === t)} shrink-0`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className={chip(statusFilter !== "All")}
          >
            <Icon name="filter" size={16} />
            {statusFilter === "All" ? "Filter" : statusFilter}
          </button>
          {filterOpen && (
            <>
              <button
                aria-label="Close"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setFilterOpen(false)}
              />
              <div className={`${menu} absolute right-0 z-20 mt-2 w-44`}>
                {statusFilters.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setStatusFilter(s);
                      setFilterOpen(false);
                    }}
                    className={`${menuItem} justify-between ${
                      statusFilter === s
                        ? "bg-[color:var(--color-surface-soft)] font-semibold"
                        : ""
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

      {tab === "Ledger" ? (
        rows.length === 0 ? (
          <EmptyState
            icon="wallet"
            title={`No ${statusFilter.toLowerCase()} transactions`}
            description="Pick another status to see the rest of your ledger."
          />
        ) : (
          <div className={`${card} relative mt-6 overflow-hidden`}>
            <div ref={tableWrapRef} className="scrollbar-hide overflow-x-auto">
              <table className="w-full min-w-[720px] t-body-sm">
                <thead>
                  <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] text-left t-caption font-semibold">
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">
                      Reference Number
                    </th>
                    <th className="px-4 py-3 font-semibold">Particulars</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Debit
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Credit
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Running Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-[color:var(--color-border)] last:border-b-0"
                    >
                      <td className="whitespace-nowrap px-4 py-3">{r.date}</td>
                      <td
                        className={`${reference} whitespace-nowrap px-4 py-3`}
                      >
                        {r.id.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-[color:var(--color-ink)]">
                        {r.label}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right t-amount">
                        {r.debit ? r.debit.toFixed(2) : "0"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right t-amount">
                        {r.credit ? r.credit.toFixed(2) : "0"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right t-amount">
                        {r.balance.toFixed(2)} {r.balance >= 0 ? "Cr" : "Dr"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[color:var(--color-surface-subtle)]">
                    <td
                      className="px-4 py-3 text-center font-semibold text-[color:var(--color-ink)]"
                      colSpan={3}
                    >
                      Total
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right t-amount">
                      {totalDebit.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right t-amount">
                      {totalCredit.toFixed(2)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
            {moreToRight && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent"
              />
            )}
          </div>
        )
      ) : (
        <EmptyState
          icon="wallet"
          title={`No ${tab.toLowerCase()} yet`}
          description={emptyHelp[tab]}
        />
      )}
    </>
  );
}
