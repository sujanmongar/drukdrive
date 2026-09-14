import { useState } from "react";
import Icon from "./Icon";
import { currencies, useCurrency } from "../lib/currency";
import { languages, useLanguage } from "../lib/language";

// One control for both regional preferences — currency and language — since
// travellers tend to set them together. The trigger shows the active currency
// flag + code; the panel holds both lists.
export default function CurrencySwitcher({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const activeCurrency = currencies.find((c) => c.code === currency)!;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Currency and language"
        className="flex h-9 items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-neutral-50 px-3 text-sm font-medium text-[color:var(--color-ink)] transition-colors hover:border-[color:var(--color-ink)] hover:bg-neutral-100 md:h-[42px] md:px-3.5"
      >
        <span className="text-base leading-none">{activeCurrency.flag}</span>
        {activeCurrency.code}
      </button>

      {open && (
        <>
          <button aria-label="Close" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white py-1 shadow-[0px_2px_14px_rgba(0,0,0,0.1)]">
            <p className="t-label px-3 pb-1 pt-2 uppercase tracking-wide text-[color:var(--color-muted)]">Currency</p>
            {currencies.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setCurrency(c.code)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-50 ${
                  c.code === currency ? "font-semibold text-[color:var(--color-ink)]" : "text-[color:var(--color-ink-soft)]"
                }`}
              >
                <span className="text-base leading-none">{c.flag}</span>
                {c.code}
                {c.code === currency && <Icon name="check" size={14} className="ml-auto text-[color:var(--color-ink)]" />}
              </button>
            ))}

            <div className="my-1 border-t border-[color:var(--color-border)]" />

            <p className="t-label px-3 pb-1 pt-2 uppercase tracking-wide text-[color:var(--color-muted)]">Language</p>
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-50 ${
                  l.code === language ? "font-semibold text-[color:var(--color-ink)]" : "text-[color:var(--color-ink-soft)]"
                }`}
              >
                {l.native}
                {l.code === language && <Icon name="check" size={14} className="ml-auto text-[color:var(--color-ink)]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
