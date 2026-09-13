import Icon from "./Icon";
import { useCurrency } from "../lib/currency";
import { RENTAL_DAYS } from "../lib/pricing";

export default function PriceSummarySheet({
  pricePerDay,
  baseFare,
  taxes,
  total,
  discount = 0,
  onClose,
}: {
  pricePerDay: number;
  baseFare: number;
  taxes: number;
  total: number;
  discount?: number;
  onClose: () => void;
}) {
  const { format, symbol } = useCurrency();
  const netPayable = total - discount;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <div className="w-full rounded-t-2xl bg-white sm:max-w-[420px] sm:rounded-2xl">
        <div className="flex items-center gap-4 border-b border-[color:var(--color-border)] p-4">
          <button type="button" onClick={onClose} aria-label="Close">
            <Icon name="close" size={22} className="text-[color:var(--color-ink)]" />
          </button>
          <h2 className="text-lg font-bold text-[color:var(--color-ink)]">Price Summary</h2>
        </div>

        <div className="flex flex-col gap-3 p-5 text-sm">
          <div className="flex items-center justify-between text-[color:var(--color-ink-soft)]">
            <span>
              Base fare &times; {RENTAL_DAYS} Day{RENTAL_DAYS > 1 ? "s" : ""} &times; {format(pricePerDay)}
            </span>
            <span className="font-medium text-[color:var(--color-ink)]">{format(baseFare)}</span>
          </div>
          <div className="flex items-center justify-between text-[color:var(--color-ink-soft)]">
            <span>Taxes &amp; Fees</span>
            <span className="font-medium text-[color:var(--color-ink)]">{format(taxes)}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-3 font-bold text-[color:var(--color-ink)]">
            <span>Total</span>
            <span>{format(total)}</span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between font-semibold text-[color:var(--color-success)]">
              <span>Discount</span>
              <span>-{format(discount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg bg-[color:var(--color-info-bg)] px-3 py-3 font-bold text-[color:var(--color-ink)]">
            <span>Net Payable (Amount in {symbol})</span>
            <span>{format(netPayable)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
