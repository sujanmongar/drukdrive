import { useState } from "react";
import Icon from "./Icon";
import FareSummary from "./FareSummary";
import type { Fare } from "../lib/pricing";
import { PROMO_CODES } from "../lib/pricing";
import { currencies, useCurrency } from "../lib/currency";

// The one price card used on Review, Details and Payment: total, the fare
// breakdown behind a chevron, how the payment splits, and (where allowed)
// a promo code. The ngultrum equivalent shows whenever the display currency
// is not Nu, since the balance is settled locally.
export default function PriceSummaryCard({
  fare,
  netPayable,
  payNow,
  payLater,
  discount = 0,
  promoCode = null,
  onPromoChange,
  id,
}: {
  fare: Fare;
  netPayable: number;
  payNow: number;
  payLater: number;
  discount?: number;
  promoCode?: string | null;
  /** When given, a promo code field is shown and this receives a valid code (or null on clear). */
  onPromoChange?: (code: string | null) => void;
  id?: string;
}) {
  const { format, currency } = useCurrency();
  const nu = currencies.find((c) => c.code === "BTN")!;
  const inNu = (usd: number) =>
    `${nu.symbol} ${Math.round(usd * nu.rateFromUsd).toLocaleString()}`;
  const showNu = currency !== "BTN";
  const [promoInput, setPromoInput] = useState(promoCode ?? "");
  const [promoError, setPromoError] = useState("");

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (PROMO_CODES[code]) {
      setPromoError("");
      onPromoChange?.(code);
    } else {
      setPromoError("That code isn't valid.");
      onPromoChange?.(null);
    }
  }

  return (
    <div
      id={id}
      className="scroll-mt-24 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card"
    >
      <p className="t-h2 tabular text-[color:var(--color-ink)]">
        {format(netPayable)}
      </p>
      <p className="t-body-sm text-[color:var(--color-muted)]">
        Total for {fare.unit}, taxes and fees included
        {showNu && ` · ≈ ${inNu(netPayable)}`}
      </p>

      <div className="mt-3">
        <FareSummary
          total={format(netPayable)}
          lines={[
            ...fare.lines.map((l) => ({
              label: l.label,
              value: format(l.amount),
            })),
            ...(discount > 0 && promoCode
              ? [
                  {
                    label: `Promo ${promoCode}`,
                    value: `−${format(discount)}`,
                    success: true,
                  },
                ]
              : []),
          ]}
        />
      </div>

      <dl className="mt-4 flex flex-col gap-2 rounded-xl bg-[color:var(--color-surface-subtle)] px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <dt>
            <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">
              Pay now
            </span>
            <span className="block t-caption text-[color:var(--color-muted)]">
              {payLater > 0
                ? "Half the fare, to confirm your booking"
                : "The full fare, to confirm your booking"}
              {showNu && ` · ≈ ${inNu(payNow)}`}
            </span>
          </dt>
          <dd className="shrink-0 t-body font-bold tabular text-[color:var(--color-ink)]">
            {format(payNow)}
          </dd>
        </div>
        {payLater > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-2">
            <dt>
              <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">
                Pay at pick-up
              </span>
              <span className="block t-caption text-[color:var(--color-muted)]">
                The other half, to the driver by mBoB, card or cash
                {showNu && ` · ≈ ${inNu(payLater)}`}
              </span>
            </dt>
            <dd className="shrink-0 t-body font-bold tabular text-[color:var(--color-ink)]">
              {format(payLater)}
            </dd>
          </div>
        )}
        {fare.deposit > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-2">
            <dt>
              <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">
                Deposit at collection
              </span>
              <span className="block t-caption text-[color:var(--color-muted)]">
                Refundable, released within 3 days of return
              </span>
            </dt>
            <dd className="shrink-0 t-body font-bold tabular text-[color:var(--color-ink)]">
              {format(fare.deposit)}
            </dd>
          </div>
        )}
      </dl>

      {onPromoChange && (
        <div className="mt-4 border-t border-[color:var(--color-border)] pt-4">
          <p className="flex items-center gap-1.5 t-label uppercase text-[color:var(--color-muted)]">
            <Icon name="info" size={13} />
            Promo code
          </p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Got a code? Enter it here"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="h-11 min-w-0 flex-1 rounded-lg border border-[color:var(--color-border)] px-3 t-body text-[color:var(--color-ink)] outline-none placeholder:text-[color:var(--color-muted)] focus:border-[color:var(--color-ink)]"
            />
            <button
              type="button"
              onClick={applyPromo}
              className="h-11 shrink-0 rounded-lg bg-[color:var(--color-ink)] px-4 t-body-sm font-bold text-white transition-all duration-200 hover:bg-black"
            >
              Apply
            </button>
          </div>
          {promoCode && discount > 0 && (
            <p className="mt-2 t-caption font-semibold text-[color:var(--color-success)]">
              {promoCode} applied — {format(discount)} off
            </p>
          )}
          {promoError && (
            <p className="mt-2 t-caption text-[color:var(--color-danger)]">
              {promoError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
