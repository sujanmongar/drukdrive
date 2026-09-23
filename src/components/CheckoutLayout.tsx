import type { ReactNode } from "react";
import { t } from "../lib/i18n";

// The one grid every checkout step uses. Desktop: two independent columns —
// the car card and the step's own content flow down the left; pick-up/drop-off,
// price summary, promo code and help flow down the right — so neither column
// leaves holes for the other. Phones read car, stops, the step's content,
// then price, promo and help; `contents` lets the children of each column
// take part in that single-column order.
export default function CheckoutLayout({
  vehicle,
  trip,
  main,
  price,
  promo,
  help,
}: {
  vehicle: ReactNode;
  trip: ReactNode;
  main: ReactNode;
  price?: ReactNode;
  promo?: ReactNode;
  help?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-x-8">
      <div className="contents lg:block lg:min-w-0">
        <div className="order-1">{vehicle}</div>
        <div className="order-3 min-w-0 lg:mt-10">{main}</div>
      </div>
      <div className="contents lg:block">
        <div className="order-2">{trip}</div>
        {price && (
          <div className="order-4 lg:mt-8">
            <h2 className="t-h3">{t("Price summary")}</h2>
            <div className="mt-4">{price}</div>
          </div>
        )}
        {promo && (
          <div className="order-5 lg:mt-8">
            <h2 className="t-h3">{t("Promo code")}</h2>
            <div className="mt-4">{promo}</div>
          </div>
        )}
        {help && (
          <div className="order-6 lg:mt-8">
            <h2 className="t-h3">{t("Need a hand?")}</h2>
            <div className="mt-4">{help}</div>
          </div>
        )}
      </div>
    </div>
  );
}
