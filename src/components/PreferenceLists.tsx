import { useState } from "react";
import Icon from "./Icon";
import { currencies, useCurrency } from "../lib/currency";
import { languages, useLanguage } from "../lib/language";
import { menuItem } from "../lib/ui";
import { t } from "../lib/i18n";

type View = "root" | "language" | "currency";

// Two rows showing the current language and currency; picking either swaps
// the panel for that option list, so the account menu stays short.
export default function PreferenceLists() {
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage } = useLanguage();
  const [view, setView] = useState<View>("root");

  const activeCurrency = currencies.find((c) => c.code === currency)!;
  const activeLanguage = languages.find((l) => l.code === language)!;

  if (view !== "root") {
    const isLanguage = view === "language";
    const options = isLanguage
      ? languages.map((l) => ({
          key: l.code,
          lead: l.flag,
          label: l.native,
          selected: l.code === language,
        }))
      : currencies.map((c) => ({
          key: c.code,
          lead: c.flag,
          label: t(c.label),
          selected: c.code === currency,
        }));

    return (
      <>
        <button
          type="button"
          onClick={() => setView("root")}
          className={`${menuItem} font-semibold`}
        >
          <Icon name="chevron-left" size={16} />
          {isLanguage ? t("Language") : t("Currency")}
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
              className={`${menuItem} ${o.selected ? "bg-[color:var(--color-surface-soft)] font-semibold" : ""}`}
            >
              <span className="t-body">{o.lead}</span>
              {o.label}
              {o.selected && (
                <Icon
                  name="check"
                  size={15}
                  className="ml-auto text-[color:var(--color-ink)]"
                />
              )}
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setView("language")}
        className={menuItem}
      >
        <span className="t-body">{activeLanguage.flag}</span>
        {activeLanguage.native}
        <Icon
          name="chevron-right"
          size={15}
          className="ml-auto text-[color:var(--color-muted)]"
        />
      </button>
      <button
        type="button"
        onClick={() => setView("currency")}
        className={menuItem}
      >
        <span className="w-[1.05rem] text-center t-body-sm font-semibold text-[color:var(--color-muted)]">
          {activeCurrency.symbol.replace(".", "")}
        </span>
        {t(activeCurrency.label)}
        <Icon
          name="chevron-right"
          size={15}
          className="ml-auto text-[color:var(--color-muted)]"
        />
      </button>
    </>
  );
}
