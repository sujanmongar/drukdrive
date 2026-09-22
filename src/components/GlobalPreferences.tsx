import Icon from "./Icon";
import { currencies, useCurrency } from "../lib/currency";
import { chip } from "../lib/ui";

// Read-only value shown in the same pill as the currency chips beside it,
// minus the hover (nothing to pick).
const staticPill =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-white px-4 t-body-sm font-semibold text-[color:var(--color-ink)] lg:min-h-9 lg:px-3.5";
const rowLabel = "t-body-sm font-semibold text-[color:var(--color-ink)]";

// Shared "Global preferences" content used by both the customer and driver
// Account areas — language/timezone are informational (this prototype only
// ships English / Bhutan Time), currency is the one real, working setting.
export default function GlobalPreferences() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="mt-6 max-w-2xl">
      <div className="border-b border-[color:var(--color-border)] pb-5">
        <p className={rowLabel}>Language</p>
        <p className="mt-0.5 t-caption">
          DrukDrive is currently available in English only.
        </p>
        <div className={`mt-3 ${staticPill}`}>
          <Icon
            name="check"
            size={14}
            className="text-[color:var(--color-success)]"
          />
          English
        </div>
      </div>

      <div className="border-b border-[color:var(--color-border)] py-5">
        <p className={rowLabel}>Currency</p>
        <p className="mt-0.5 t-caption">
          Prices across the app are shown in your selected currency.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {currencies.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrency(c.code)}
              className={chip(currency === c.code)}
            >
              <span>{c.flag}</span>
              {c.code}
            </button>
          ))}
        </div>
      </div>

      <div className="py-5">
        <p className={rowLabel}>Timezone</p>
        <p className="mt-0.5 t-caption">
          All dates and times across DrukDrive are shown in Bhutan Time.
        </p>
        <div className={`mt-3 ${staticPill}`}>
          <Icon name="clock" size={14} />
          Bhutan Time (UTC+6)
        </div>
      </div>
    </div>
  );
}
