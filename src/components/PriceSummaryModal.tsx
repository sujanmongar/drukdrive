import Icon from "./Icon";

export default function PriceSummaryModal({
  baseFare,
  taxes,
  total,
  discount,
  netPayable,
  days,
  format,
  symbol,
  onClose,
}: {
  baseFare: number;
  taxes: number;
  total: number;
  discount: number;
  netPayable: number;
  days: number;
  format: (n: number) => string;
  symbol: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 sm:items-center">
      <button aria-label="Close" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div className="relative w-full max-w-[420px] rounded-t-2xl bg-white sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-5 py-4">
          <h2 className="text-base font-bold text-[color:var(--color-ink)]">Price Summary</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} className="text-[color:var(--color-ink)]" />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[color:var(--color-ink-soft)]">Base fare</span>
            <span className="font-semibold text-[color:var(--color-ink)]">
              {format(baseFare / days)} &times; {days} Day{days > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[color:var(--color-ink-soft)]">Taxes &amp; Fees</span>
            <span className="font-semibold text-[color:var(--color-ink)]">{format(taxes)}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2.5 text-sm font-bold text-[color:var(--color-ink)]">
            <span>Total</span>
            <span>{format(total)}</span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between text-sm font-semibold text-[color:var(--color-success)]">
              <span>Discount</span>
              <span>-{format(discount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg bg-[color:var(--color-info-bg)] px-3 py-2.5 text-sm font-bold text-[color:var(--color-ink)]">
            <span>Net Payable (Amount in {symbol})</span>
            <span>{format(netPayable)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
