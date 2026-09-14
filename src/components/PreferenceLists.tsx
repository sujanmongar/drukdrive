import { useState } from "react";
import Icon from "./Icon";
import { currencies, useCurrency } from "../lib/currency";
import { languages, useLanguage } from "../lib/language";

type View = "root" | "language" | "currency";

// Two rows showing the current language and currency; picking either swaps
// the panel for that option list, so the account menu stays short.
export default function PreferenceLists() {
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage } = useLanguage();
  const [view, setView] = useState<View>("root");

  const activeCurrency = currencies.find((c) => c.code === currency)!;
  const activeLanguage = languages.find((l) => l.code === language)!;

  const rowClass =
    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[color:var(--color-ink-soft)] transition-colors hover:bg-[color:var(--color-surface-soft)]";

  if (view !== "root") {
    const isLanguage = view === "language";
    const options = isLanguage
      ? languages.map((l) => ({ key: l.code, lead: l.flag, label: l.native, selected: l.code === language }))
      : currencies.map((c) => ({ key: c.code, lead: c.flag, label: c.label, selected: c.code === currency }));

    return (
      <>
        <button
          type="button"
          onClick={() => setView("root")}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-[color:var(--color-ink)] transition-colors hover:bg-[color:var(--color-surface-soft)]"
        >
          <Icon name="chevron-left" size={16} />
          {isLanguage ? "Language" : "Currency"}
        </button>
        <div className="border-t border-[color:var(--color-border)] pt-1">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => {
                if (isLanguage) setLanguage(o.key as never);
                else setCurrency(o.key as never);
                setView("root");
              }}
              className={`${rowClass} ${o.selected ? "font-semibold text-[color:var(--color-ink)]" : ""}`}
            >
              <span className="text-base leading-none">{o.lead}</span>
              {o.label}
              {o.selected && <Icon name="check" size={15} className="ml-auto text-[color:var(--color-ink)]" />}
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setView("language")} className={rowClass}>
        <span className="text-base leading-none">{activeLanguage.flag}</span>
        {activeLanguage.native}
        <Icon name="chevron-right" size={15} className="ml-auto text-[color:var(--color-muted)]" />
      </button>
      <button type="button" onClick={() => setView("currency")} className={rowClass}>
        <span className="w-[1.05rem] text-center text-sm font-semibold text-[color:var(--color-muted)]">
          {activeCurrency.symbol.replace(".", "")}
        </span>
        {activeCurrency.label}
        <Icon name="chevron-right" size={15} className="ml-auto text-[color:var(--color-muted)]" />
      </button>
    </>
  );
}
