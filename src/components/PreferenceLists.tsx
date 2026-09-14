import Icon from "./Icon";
import { currencies, useCurrency } from "../lib/currency";
import { languages, useLanguage } from "../lib/language";

// Currency and language pickers, rendered inside the account menu so all
// account-level settings live behind one control in the header.
export default function PreferenceLists() {
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage } = useLanguage();

  const row = (selected: boolean) =>
    `flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors hover:bg-neutral-50 ${
      selected ? "font-semibold text-[color:var(--color-ink)]" : "text-[color:var(--color-ink-soft)]"
    }`;

  return (
    <>
      <p className="t-label px-4 pb-1 pt-2.5 uppercase tracking-wide text-[color:var(--color-muted)]">Currency</p>
      {currencies.map((c) => (
        <button key={c.code} type="button" onClick={() => setCurrency(c.code)} className={row(c.code === currency)}>
          <span className="text-base leading-none">{c.flag}</span>
          {c.code}
          {c.code === currency && <Icon name="check" size={15} className="ml-auto text-[color:var(--color-ink)]" />}
        </button>
      ))}

      <p className="t-label px-4 pb-1 pt-3 uppercase tracking-wide text-[color:var(--color-muted)]">Language</p>
      {languages.map((l) => (
        <button key={l.code} type="button" onClick={() => setLanguage(l.code)} className={row(l.code === language)}>
          {l.native}
          {l.code === language && <Icon name="check" size={15} className="ml-auto text-[color:var(--color-ink)]" />}
        </button>
      ))}
    </>
  );
}
