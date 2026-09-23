import FareSummary from "./FareSummary";
import type { Fare } from "../lib/pricing";
import { currencies, useCurrency } from "../lib/currency";
import { card, inset } from "../lib/ui";
import { t } from "../lib/i18n";

// The one price card used on Review, Details, Payment and Confirmation:
// total, the fare breakdown behind a chevron, and how the payment splits.
// Promo entry lives in PromoCard; only an applied discount is listed here. The ngultrum equivalent shows whenever the display currency
// is not Nu, since the balance is settled locally.
export default function PriceSummaryCard({
  fare,
  netPayable,
  payNow,
  payLater,
  discount = 0,
  promoCode = null,
  laterLabel,
  id,
}: {
  fare: Fare;
  netPayable: number;
  payNow: number;
  payLater: number;
  discount?: number;
  promoCode?: string | null;
  /** How the balance is paid: to the driver, or at the desk on self drive. */
  /** Overrides the balance line; by default self drive (deposit) pays at the desk, everyone else pays the driver. */
  laterLabel?: string;
  id?: string;
}) {
  const balanceLabel =
    laterLabel ??
    (fare.deposit > 0
      ? t("The other half, at the desk when you collect the car")
      : t("The other half, to the driver by mBoB, card or cash"));
  const { format, currency } = useCurrency();
  const nu = currencies.find((c) => c.code === "BTN")!;
  const inNu = (usd: number) =>
    `${nu.symbol} ${Math.round(usd * nu.rateFromUsd).toLocaleString()}`;
  const showNu = currency !== "BTN";
  return (
    <div id={id} className={`${card} scroll-mt-24 p-5`}>
      <p className="t-h2 t-amount">{format(netPayable)}</p>
      <p className="t-body-sm text-[color:var(--color-muted)]">
        {t("Total for {unit}, taxes and fees included", { unit: fare.unit })}
        {showNu && (
          <>
            <span className="block">
              ≈ <span className="t-amount">{inNu(netPayable)}</span>
            </span>
          </>
        )}
      </p>

      <div className="mt-3">
        <FareSummary
          total={format(netPayable)}
          lines={[
            ...fare.lines.map((l) => ({
              label: t(l.label),
              value: format(l.amount),
            })),
            ...(discount > 0 && promoCode
              ? [
                  {
                    label: t("Promo {code}", { code: promoCode }),
                    value: `−${format(discount)}`,
                    success: true,
                  },
                ]
              : []),
          ]}
        />
      </div>

      <dl className={`${inset} mt-4 flex flex-col gap-2 px-4 py-3.5`}>
        <div className="flex items-center justify-between gap-3">
          <dt>
            <span className="block t-body-sm font-semibold text-[color:var(--color-ink)]">
              {t("Pay now")}
            </span>
            <span className="block t-caption">
              {payLater > 0
                ? t("Half the fare, to confirm your booking")
                : t("The full fare, to confirm your booking")}
              {showNu && (
                <>
                  <span className="block">
                    ≈ <span className="t-amount">{inNu(payNow)}</span>
                  </span>
                </>
              )}
            </span>
          </dt>
          <dd className="shrink-0 t-body t-amount">{format(payNow)}</dd>
        </div>
        {payLater > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-2">
            <dt>
              <span className="block t-body-sm font-semibold text-[color:var(--color-ink)]">
                {t("Pay at pick-up")}
              </span>
              <span className="block t-caption">
                {balanceLabel}
                {showNu && (
                  <>
                    <span className="block">
                      ≈ <span className="t-amount">{inNu(payLater)}</span>
                    </span>
                  </>
                )}
              </span>
            </dt>
            <dd className="shrink-0 t-body t-amount">{format(payLater)}</dd>
          </div>
        )}
        {fare.deposit > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-2">
            <dt>
              <span className="block t-body-sm font-semibold text-[color:var(--color-ink)]">
                {t("Deposit at collection")}
              </span>
              <span className="block t-caption">
                {t("Refundable, released within 3 days of return")}
              </span>
            </dt>
            <dd className="shrink-0 t-body t-amount">{format(fare.deposit)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
