import { useState } from "react";
import Icon from "./Icon";
import Button from "./Button";
import { card, fieldError, input as inputClass } from "../lib/ui";
import { PROMO_CODES } from "../lib/pricing";
import { useCurrency } from "../lib/currency";
import { t, tr, tx } from "../lib/i18n";

// Promo code entry, its own card beside the price summary. A valid code is
// handed up and lives in the URL so every later step honours it.
export default function PromoCard({
  promoCode,
  discount,
  onChange,
}: {
  promoCode: string | null;
  discount: number;
  onChange: (code: string | null) => void;
}) {
  const { format } = useCurrency();
  const [input, setInput] = useState(promoCode ?? "");
  const [error, setError] = useState("");

  function apply() {
    const code = input.trim().toUpperCase();
    if (!code) return;
    if (PROMO_CODES[code]) {
      setError("");
      onChange(code);
    } else {
      setError(tx("That code isn't valid."));
      onChange(null);
    }
  }

  return (
    <div className={`${card} p-5`}>
      <div className="flex gap-2">
        <span className="relative min-w-0 flex-1">
          <Icon
            name="info"
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]"
          />
          <input
            type="text"
            placeholder={t("Enter promo code")}
            aria-label={t("Promo code")}
            aria-invalid={!!error}
            aria-describedby="promo-feedback"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") apply();
            }}
            className={`${inputClass} pl-10`}
          />
        </span>
        <Button type="button" onClick={apply} className="h-12 shrink-0 px-5">
          {t("Apply")}
        </Button>
      </div>
      <div id="promo-feedback" role="status">
        {promoCode && discount > 0 && (
          <p className="mt-3 flex items-center gap-1.5 t-body-sm font-semibold text-[color:var(--color-success-deep)]">
            <Icon name="check-circle" size={16} />
            <span>
              {tr("{code} applied — {amount} off", {
                code: promoCode,
                amount: (
                  <span className="t-amount text-[color:var(--color-success-deep)]">
                    {format(discount)}
                  </span>
                ),
              })}
            </span>
          </p>
        )}
        {error && <p className={`${fieldError} mt-3`}>{t(error)}</p>}
        {!promoCode && !error && (
          <p className="mt-3 t-caption">
            {t("Try {code} for 10% off your first booking.", {
              code: "DRUK10",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
