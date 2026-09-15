import type { ReactNode } from "react";

// The one grid every checkout step uses. Desktop: the step's own content on
// the left; trip card, price summary and help down the right. Phones read
// trip card first, then the step's content, then price and help.
export default function CheckoutLayout({
  main,
  trip,
  price,
  help,
}: {
  main: ReactNode;
  trip: ReactNode;
  price?: ReactNode;
  help?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:gap-y-0">
      <div className="order-1 lg:col-start-2 lg:row-start-1">{trip}</div>
      <div className="order-2 min-w-0 lg:col-start-1 lg:row-span-3 lg:row-start-1">
        {main}
      </div>
      {price && (
        <div className="order-3 lg:col-start-2 lg:row-start-2 lg:mt-8">
          <h2 className="t-h3 text-[color:var(--color-ink)]">Price summary</h2>
          <div className="mt-4">{price}</div>
        </div>
      )}
      {help && (
        <div className="order-4 lg:col-start-2 lg:row-start-3 lg:mt-8">
          <h2 className="t-h3 text-[color:var(--color-ink)]">Need a hand?</h2>
          <div className="mt-4">{help}</div>
        </div>
      )}
    </div>
  );
}
