import { useState } from "react";
import Icon from "./Icon";
import { currencies, useCurrency } from "../lib/currency";

export default function CurrencySwitcher({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const active = currencies.find((c) => c.code === currency)!;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium hover:bg-neutral-100"
      >
        <span className="text-base leading-none">{active.flag}</span>
        {active.code}
        <Icon name="chevron-down" size={12} />
      </button>

      {open && (
        <>
          <button aria-label="Close" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white py-1 shadow-[0px_2px_14px_rgba(0,0,0,0.1)]">
            {currencies.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCurrency(c.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-50 ${
                  c.code === currency ? "font-semibold text-[#222]" : "text-[#333]"
                }`}
              >
                <span className="text-base leading-none">{c.flag}</span>
                {c.code}
                {c.code === currency && <Icon name="check" size={14} className="ml-auto text-[#222]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
