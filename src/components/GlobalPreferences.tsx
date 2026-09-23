import Icon from "./Icon";
import { currencies, useCurrency } from "../lib/currency";
import { languages, useLanguage } from "../lib/language";
import { chip } from "../lib/ui";
import { t } from "../lib/i18n";

// Read-only value shown in the same pill as the currency chips beside it,
// minus the hover (nothing to pick).
const staticPill =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-white px-4 t-body-sm font-semibold text-[color:var(--color-ink)] lg:min-h-9 lg:px-3.5";
const rowLabel = "t-body-sm font-semibold text-[color:var(--color-ink)]";

// Shared "Global preferences" content used by both the customer and driver
// Account areas. Language and currency are real settings; timezone is fixed
// to Bhutan Time.
export default function GlobalPreferences() {
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="mt-6 max-w-2xl">
      <div className="border-b border-[color:var(--color-border)] pb-5">
        <p className={rowLabel}>{t("Language")}</p>
        <p className="mt-0.5 t-caption">
          {t("The whole site is shown in the language you pick.")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              lang={l.code}
              onClick={() => setLanguage(l.code)}
              className={chip(language === l.code)}
            >
              <span>{l.flag}</span>
              {l.native}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-[color:var(--color-border)] py-5">
        <p className={rowLabel}>{t("Currency")}</p>
        <p className="mt-0.5 t-caption">
          {t("Prices across the app are shown in your selected currency.")}
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
        <p className={rowLabel}>{t("Timezone")}</p>
        <p className="mt-0.5 t-caption">
          {t("All dates and times across DrukDrive are shown in Bhutan Time.")}
        </p>
        <div className={`mt-3 ${staticPill}`}>
          <Icon name="clock" size={14} />
          {t("Bhutan Time (UTC+6)")}
        </div>
      </div>
    </div>
  );
}
