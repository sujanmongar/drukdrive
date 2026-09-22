import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import Button from "./Button";
import EmptyState from "./EmptyState";
import StatusBadge from "./StatusBadge";
import {
  customerLedger,
  driverLedger,
  kindFilters,
  kindLabel,
  payoutAccount,
  r2,
  sideOf,
  signed,
  type LedgerEntry,
  type LedgerKind,
} from "../data/finance";
import { driverBookings, driverVehicles } from "../data/mockData";
import { currencies, useCurrency } from "../lib/currency";
import {
  card,
  chip,
  fieldError,
  fieldHint,
  input,
  label,
  menu,
  reference,
  sheet,
} from "../lib/ui";

type Role = "customer" | "driver";
type Tab = "Ledger" | "Report" | "Credit Notes" | "Debit Notes";
const tabs: Tab[] = ["Ledger", "Report", "Credit Notes", "Debit Notes"];

const PAYOUTS_KEY = "drukdrive:payouts";

const monthKey = (iso: string) => iso.slice(0, 7);
const monthName = (key: string) =>
  new Date(`${key}-01T00:00:00`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
// Fixed month names: some browsers print "Sept" in en-GB, the app says "Sep".
const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const dayLabel = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

// Payouts a driver requests here, kept in the browser so the ledger still
// shows them after a reload.
function usePayoutRequests() {
  const [items, setItems] = useState<LedgerEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(PAYOUTS_KEY) || "[]");
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(PAYOUTS_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);
  return [items, (e: LedgerEntry) => setItems((p) => [...p, e])] as const;
}

export default function FinanceLedger({ role }: { role: Role }) {
  const { format } = useCurrency();
  const [tab, setTab] = useState<Tab>("Ledger");
  const [kind, setKind] = useState<LedgerKind | "all">("all");
  const [month, setMonth] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [payoutRequests, addPayout] = usePayoutRequests();

  // Running balance is worked out over the whole statement, in date order,
  // before any filter, so a filtered row still shows the true balance.
  const all = useMemo(() => {
    const base =
      role === "driver"
        ? [...driverLedger, ...payoutRequests]
        : [...customerLedger];
    let balance = 0;
    return base
      .map((e, i) => ({ e, i }))
      .sort((a, b) => a.e.date.localeCompare(b.e.date) || a.i - b.i)
      .map(({ e }) => {
        balance = r2(balance + signed(e));
        return { ...e, balance };
      });
  }, [role, payoutRequests]);

  const months = useMemo(
    () => [...new Set(all.map((e) => monthKey(e.date)))],
    [all],
  );
  const rows = all.filter(
    (e) =>
      (kind === "all" || e.kind === kind) &&
      (month === "all" || monthKey(e.date) === month),
  );
  const totalDebit = r2(
    rows
      .filter((e) => sideOf[e.kind] === "debit")
      .reduce((s, e) => s + e.amount, 0),
  );
  const totalCredit = r2(
    rows
      .filter((e) => sideOf[e.kind] === "credit")
      .reduce((s, e) => s + e.amount, 0),
  );
  const closing = all.at(-1)?.balance ?? 0;
  const filtered = kind !== "all" || month !== "all";

  const sum = (k: LedgerKind[]) =>
    r2(all.filter((e) => k.includes(e.kind)).reduce((s, e) => s + e.amount, 0));
  const fmtBalance = (b: number) =>
    b === 0 ? format(0) : `${format(Math.abs(b))} ${b > 0 ? "Cr" : "Dr"}`;

  // Right-edge fade on phones while the table has more columns to show.
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
  }, [rows.length, tab]);

  const notes = (k: LedgerKind) => all.filter((e) => e.kind === k);
  const creditNotes = notes("credit-note");
  const debitNotes =
    role === "driver" ? notes("service-fee") : notes("debit-note");

  const upcoming = driverBookings.filter((b) => b.status === "Upcoming");
  const upcomingFares = r2(
    upcoming.reduce(
      (s, b) =>
        s +
        (driverVehicles.find((v) => v.id === b.vehicleId)?.pricePerDay ?? 0),
      0,
    ),
  );

  const legend =
    role === "driver"
      ? "Trip fares and cancellation fees are credits; DrukDrive's service fee and payouts are debits. The balance is what you can withdraw."
      : "Bookings and extra charges are debits; your payments and credit notes are credits. A Dr balance is what you still owe.";

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {tabs.map((t) => (
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
        {role === "driver" && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setWithdrawOpen(true)}
            disabled={closing <= 0}
          >
            <Icon name="wallet" size={16} />
            Withdraw {format(Math.max(closing, 0))}
          </Button>
        )}
      </div>

      {tab === "Ledger" && (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-2xl t-caption">{legend}</p>
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                aria-expanded={filterOpen}
                className={chip(filtered)}
              >
                <Icon name="filter" size={16} />
                {filtered ? "Filtered" : "Filter"}
              </button>
              {filterOpen && (
                <>
                  <button
                    aria-label="Close"
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setFilterOpen(false)}
                  />
                  <div
                    className={`${menu} absolute right-0 z-20 mt-2 w-64 p-3`}
                  >
                    <label className="block">
                      <span className={label}>Type</span>
                      <select
                        value={kind}
                        onChange={(e) =>
                          setKind(e.target.value as LedgerKind | "all")
                        }
                        className={input}
                      >
                        <option value="all">All entries</option>
                        {kindFilters[role].map((k) => (
                          <option key={k} value={k}>
                            {kindLabel[k]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="mt-3 block">
                      <span className={label}>Month</span>
                      <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className={input}
                      >
                        <option value="all">All months</option>
                        {months.map((m) => (
                          <option key={m} value={m}>
                            {monthName(m)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="mt-3 flex justify-between">
                      <Button
                        variant="link"
                        type="button"
                        className="mx-0"
                        disabled={!filtered}
                        onClick={() => {
                          setKind("all");
                          setMonth("all");
                        }}
                      >
                        Clear
                      </Button>
                      <Button
                        size="md"
                        type="button"
                        onClick={() => setFilterOpen(false)}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {rows.length === 0 ? (
            <EmptyState
              icon="wallet"
              title="No entries match"
              description="Try another type or month, or clear the filter."
            />
          ) : (
            <div className={`${card} relative mt-4 overflow-hidden`}>
              <div
                ref={tableWrapRef}
                className="scrollbar-hide overflow-x-auto"
              >
                <table className="w-full min-w-[760px] t-body-sm">
                  <thead>
                    <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] text-left t-caption">
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Reference</th>
                      <th className="px-4 py-3 font-semibold">Particulars</th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Debit
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Credit
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const debit = sideOf[r.kind] === "debit";
                      return (
                        <tr
                          key={r.id}
                          className="border-b border-[color:var(--color-border)] last:border-b-0"
                        >
                          <td className="whitespace-nowrap px-4 py-3">
                            {dayLabel(r.date)}
                          </td>
                          <td
                            className={`${reference} whitespace-nowrap px-4 py-3`}
                          >
                            {r.id}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-[color:var(--color-ink)]">
                              {kindLabel[r.kind]}
                            </span>
                            {r.bookingId && (
                              <span className="t-caption">
                                {" "}
                                · {r.bookingId}
                              </span>
                            )}
                            {r.status && (
                              <span className="ml-2 align-middle">
                                <StatusBadge status={r.status} />
                              </span>
                            )}
                            <span className="block t-caption">
                              {r.particulars}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right t-amount">
                            {debit ? format(r.amount) : "—"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right t-amount">
                            {debit ? "—" : format(r.amount)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right t-amount">
                            {fmtBalance(r.balance)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[color:var(--color-surface-subtle)]">
                      <td
                        className="px-4 py-3 font-semibold text-[color:var(--color-ink)]"
                        colSpan={3}
                      >
                        {filtered ? "Total of shown entries" : "Total"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right t-amount">
                        {format(totalDebit)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right t-amount">
                        {format(totalCredit)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right t-amount">
                        {fmtBalance(closing)}
                      </td>
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
          )}
        </>
      )}

      {tab === "Report" && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {(role === "driver"
              ? [
                  ["Trip fares", sum(["fare", "cancellation-fee"])],
                  ["Service fees", sum(["service-fee"])],
                  ["Paid out", sum(["payout"])],
                  ["Available", closing],
                ]
              : [
                  ["Charged", sum(["charge", "debit-note"])],
                  ["Paid", sum(["payment"])],
                  ["Refunded", sum(["refund"])],
                  ["Balance due", Math.max(-closing, 0)],
                ]
            ).map(([k, v]) => (
              <div key={k as string} className={`${card} p-4`}>
                <p className="t-caption">{k}</p>
                <p className="mt-1 t-h3 t-amount">{format(v as number)}</p>
              </div>
            ))}
          </div>
          {role === "driver" && upcoming.length > 0 && (
            <p className={fieldHint}>
              Coming up: {format(upcomingFares)} from {upcoming.length} booked
              trip
              {upcoming.length > 1 ? "s" : ""}, credited after each trip.
            </p>
          )}
          <h3 className="mt-8 t-h4">By month</h3>
          <div className={`${card} mt-3 overflow-x-auto`}>
            <table className="w-full min-w-[520px] t-body-sm">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] text-left t-caption">
                  <th className="px-4 py-3 font-semibold">Month</th>
                  <th className="px-4 py-3 text-right font-semibold">Debit</th>
                  <th className="px-4 py-3 text-right font-semibold">Credit</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Closing balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {months.map((m) => {
                  const inMonth = all.filter((e) => monthKey(e.date) === m);
                  const d = r2(
                    inMonth
                      .filter((e) => sideOf[e.kind] === "debit")
                      .reduce((s, e) => s + e.amount, 0),
                  );
                  const c = r2(
                    inMonth
                      .filter((e) => sideOf[e.kind] === "credit")
                      .reduce((s, e) => s + e.amount, 0),
                  );
                  return (
                    <tr
                      key={m}
                      className="border-b border-[color:var(--color-border)] last:border-b-0"
                    >
                      <td className="px-4 py-3 font-semibold text-[color:var(--color-ink)]">
                        {monthName(m)}
                      </td>
                      <td className="px-4 py-3 text-right t-amount">
                        {format(d)}
                      </td>
                      <td className="px-4 py-3 text-right t-amount">
                        {format(c)}
                      </td>
                      <td className="px-4 py-3 text-right t-amount">
                        {fmtBalance(inMonth.at(-1)?.balance ?? 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {(tab === "Credit Notes" || tab === "Debit Notes") &&
        (() => {
          const list = tab === "Credit Notes" ? creditNotes : debitNotes;
          const help =
            tab === "Credit Notes"
              ? role === "driver"
                ? "A credit note appears if DrukDrive refunds a service fee to you."
                : "A credit note appears when a booking is cancelled or reduced."
              : role === "driver"
                ? "DrukDrive's service fee on each trip is issued as a debit note."
                : "A debit note appears when a trip costs more than booked, such as extra hours.";
          return list.length === 0 ? (
            <EmptyState
              icon="wallet"
              title={`No ${tab.toLowerCase()}`}
              description={help}
            />
          ) : (
            <>
              <p className="mt-5 t-caption">{help}</p>
              <div className="mt-4 flex flex-col gap-3">
                {list.map((n) => (
                  <div
                    key={n.id}
                    className={`${card} flex items-start justify-between gap-4 p-4`}
                  >
                    <div className="min-w-0">
                      <p className={reference}>{n.id}</p>
                      <p className="mt-0.5 t-body-sm">{n.particulars}</p>
                      <p className="mt-1 t-caption">
                        {dayLabel(n.date)}
                        {n.bookingId && ` · Booking ${n.bookingId}`}
                      </p>
                    </div>
                    <p className="shrink-0 t-h4 t-amount">{format(n.amount)}</p>
                  </div>
                ))}
              </div>
            </>
          );
        })()}

      {withdrawOpen && (
        <WithdrawSheet
          available={closing}
          onClose={() => setWithdrawOpen(false)}
          onConfirm={(amount) => {
            addPayout({
              id: `PO-${Date.now().toString().slice(-6)}`,
              date: new Date().toISOString().slice(0, 10),
              kind: "payout",
              particulars: `Payout to ${payoutAccount}`,
              amount,
              status: "Pending",
            });
            setWithdrawOpen(false);
            setTab("Ledger");
          }}
        />
      )}
    </>
  );
}

// Amount is entered in the display currency and converted back to USD,
// the unit every stored amount uses.
function WithdrawSheet({
  available,
  onClose,
  onConfirm,
}: {
  available: number;
  onClose: () => void;
  onConfirm: (amountUsd: number) => void;
}) {
  const { format, currency } = useCurrency();
  const rate = currencies.find((c) => c.code === currency)?.rateFromUsd ?? 1;
  const max = r2(available * rate);
  const [value, setValue] = useState(max.toFixed(2));
  const [touched, setTouched] = useState(false);
  const n = Number(value);
  const error =
    !value.trim() || Number.isNaN(n)
      ? "Enter an amount."
      : n <= 0
        ? "Enter more than zero."
        : n > max
          ? `You can withdraw up to ${format(available)}.`
          : "";

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
      <button
        aria-label="Close"
        className="animate-scrim-in absolute inset-0 cursor-default bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="withdraw-title"
        className={`${sheet} relative w-full max-w-[440px] p-5 sm:rounded-b-3xl`}
      >
        <div className="flex items-center justify-between">
          <h2 id="withdraw-title" className="t-h3">
            Withdraw
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="icon-btn icon-btn-filled -mr-1 size-10"
          >
            <Icon
              name="close"
              size={20}
              className="text-[color:var(--color-ink)]"
            />
          </button>
        </div>
        <p className="mt-1 t-body-sm">
          Available:{" "}
          <span className="t-amount font-semibold text-[color:var(--color-ink)]">
            {format(available)}
          </span>
        </p>

        <label className="mt-5 block">
          <span className={label}>Amount ({currency})</span>
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^\d.]/g, ""))}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && !!error}
            aria-describedby="withdraw-error"
            className={`${input} t-amount ${touched && error ? "border-[color:var(--color-danger)]" : ""}`}
          />
          <p
            id="withdraw-error"
            className={touched && error ? fieldError : fieldHint}
          >
            {touched && error
              ? error
              : `Paid to ${payoutAccount} within 2 working days.`}
          </p>
        </label>

        <Button
          size="lg"
          fullWidth
          className="mt-5"
          onClick={() => {
            setTouched(true);
            if (!error) onConfirm(r2(n / rate));
          }}
        >
          Request payout
        </Button>
      </div>
    </div>
  );
}
