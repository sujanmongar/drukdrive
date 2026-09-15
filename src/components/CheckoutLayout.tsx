import type { ReactNode } from "react";

// The one grid every checkout step uses. Desktop: the car card and the
// step's own content down the left; pick-up/drop-off, price summary, promo
// code and help down the right. Phones read car, stops, the step's content,
// then price, promo and help.
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-8 lg:gap-y-0">
      <div className="order-1 lg:col-start-1 lg:row-start-1">{vehicle}</div>
      <div className="order-2 lg:col-start-2 lg:row-start-1">{trip}</div>
      <div className="order-3 min-w-0 lg:col-start-1 lg:row-span-3 lg:row-start-2 lg:mt-10">
        {main}
      </div>
      {price && (
        <div className="order-4 lg:col-start-2 lg:row-start-2 lg:mt-8">
          <h2 className="t-h3">Price summary</h2>
          <div className="mt-4">{price}</div>
        </div>
      )}
      {promo && (
        <div className="order-5 lg:col-start-2 lg:row-start-3 lg:mt-8">
          <h2 className="t-h3">Promo code</h2>
          <div className="mt-4">{promo}</div>
        </div>
      )}
      {help && (
        <div className="order-6 lg:col-start-2 lg:row-start-4 lg:mt-8">
          <h2 className="t-h3">Need a hand?</h2>
          <div className="mt-4">{help}</div>
        </div>
      )}
    </div>
  );
}
