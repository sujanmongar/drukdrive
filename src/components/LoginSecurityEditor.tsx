import { useState } from "react";
import Button from "./Button";
import Icon from "./Icon";
import { useCurrentUser } from "../lib/currentUser";
import { card, fieldError, input, label } from "../lib/ui";
import { t, tx } from "../lib/i18n";

// Password, phone verification and sessions — the security half of the
// account, separate from personal details.
export default function LoginSecurityEditor() {
  const { user } = useCurrentUser();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saved, setSaved] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const canSave = current.length >= 6 && next.length >= 8 && next === confirm;

  return (
    <div className="mt-6 flex flex-col gap-6">
      <section className={`${card} p-5 sm:p-6`}>
        <h3 className="t-h4">{t("Password")}</h3>
        <p className="mt-1 t-body-sm">
          {t(
            "Use at least 8 characters. You’ll stay signed in on this device.",
          )}
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label>
            <span className={label}>{t("Current password")}</span>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className={input}
              autoComplete="current-password"
            />
          </label>
          <label>
            <span className={label}>{t("New password")}</span>
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className={input}
              autoComplete="new-password"
            />
          </label>
          <label>
            <span className={label}>{t("Confirm new password")}</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={input}
              autoComplete="new-password"
            />
            {confirm && next !== confirm && (
              <p className={fieldError}>{t("Passwords don’t match.")}</p>
            )}
          </label>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            disabled={!canSave}
            onClick={() => {
              setSaved(true);
              setCurrent("");
              setNext("");
              setConfirm("");
            }}
          >
            {t("Update password")}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 t-body-sm font-semibold text-[color:var(--color-success)]">
              <Icon name="check-circle" size={16} />
              {t("Password updated")}
            </span>
          )}
        </div>
      </section>

      <section className={`${card} p-5 sm:p-6`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="two-step-title" className="t-h4">
              {t("Two-step verification")}
            </h3>
            <p className="mt-1 t-body-sm">
              {t(
                "A one-time code is sent to {phone} whenever you sign in on a new device.",
                { phone: user.phone },
              )}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={twoFactor}
            aria-labelledby="two-step-title"
            onClick={() => setTwoFactor((v) => !v)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-150 before:absolute before:-inset-2 before:content-[""] ${twoFactor ? "bg-[color:var(--color-success)]" : "bg-[color:var(--color-border)]"}`}
          >
            <span
              className={`absolute top-1 size-5 rounded-full bg-white shadow-card transition-transform duration-200 ${twoFactor ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
      </section>

      <section className={`${card} p-5 sm:p-6`}>
        <h3 className="t-h4">{t("Where you’re signed in")}</h3>
        <ul className="mt-4 divide-y divide-[color:var(--color-border)]">
          {[
            {
              device: "iPhone · Safari",
              place: "Thimphu, Bhutan",
              when: tx("This device"),
            },
            {
              device: "MacBook · Chrome",
              place: "Paro, Bhutan",
              when: tx("2 days ago"),
            },
          ].map((s) => (
            <li
              key={s.device}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div>
                <p className="t-body font-semibold text-[color:var(--color-ink)]">
                  {s.device}
                </p>
                <p className="t-caption">
                  {s.place} · {t(s.when)}
                </p>
              </div>
              {s.when !== "This device" && (
                <button
                  type="button"
                  className="min-h-11 rounded-xl px-3 t-body-sm font-semibold text-[color:var(--color-danger)] transition-colors duration-150 hover:bg-[color:var(--color-danger-bg)]"
                >
                  {t("Sign out")}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
