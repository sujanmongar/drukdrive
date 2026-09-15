import Icon from "./Icon";
import { currencies, useCurrency } from "../lib/currency";

// Shared "Global preferences" content used by both the customer and driver
// Account areas — language/timezone are informational (this prototype only
// ships English / Bhutan Time), currency is the one real, working setting.
export default function GlobalPreferences() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="mt-6 max-w-2xl">
      <div className="border-b border-[color:var(--color-border)] pb-5">
        <p className="t-body-sm font-semibold text-[color:var(--color-ink)]">
          Language
        </p>
        <p className="mt-0.5 t-caption text-[color:var(--color-muted)]">
          DrukDrive is currently available in English only.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 t-body-sm font-semibold text-[color:var(--color-ink)]">
          <Icon
            name="check"
            size={14}
            className="text-[color:var(--color-success)]"
          />
          English
        </div>
      </div>

      <div className="border-b border-[color:var(--color-border)] py-5">
        <p className="t-body-sm font-semibold text-[color:var(--color-ink)]">
          Currency
        </p>
        <p className="mt-0.5 t-caption text-[color:var(--color-muted)]">
          Prices across the app are shown in your selected currency.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {currencies.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrency(c.code)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 t-body-sm font-semibold transition-colors ${
                currency === c.code
                  ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                  : "border-[color:var(--color-border)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
              }`}
            >
              <span>{c.flag}</span>
              {c.code}
            </button>
          ))}
        </div>
      </div>

      <div className="py-5">
        <p className="t-body-sm font-semibold text-[color:var(--color-ink)]">
          Timezone
        </p>
        <p className="mt-0.5 t-caption text-[color:var(--color-muted)]">
          All dates and times across DrukDrive are shown in Bhutan Time.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 t-body-sm font-semibold text-[color:var(--color-ink)]">
          <Icon name="clock" size={14} />
          Bhutan Time (UTC+6)
        </div>
      </div>
    </div>
  );
}
