import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "./PageShell";
import Icon, { type IconName } from "./Icon";
import { routes } from "../lib/routes";
import { inlineLink, input } from "../lib/ui";
import { t, tr, tx } from "../lib/i18n";

// The one card every auth page sits in: a round close/back button, the
// page title, an optional line under it, then the page's own content.
export default function AuthShell({
  title,
  subtitle,
  back = false,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  /** Chevron "Back" instead of the "Close" cross. */
  back?: boolean;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <PageShell noFooter>
      <div className="mx-auto flex min-h-[75vh] w-full max-w-[1280px] items-center justify-center px-4 py-12 md:px-10">
        <div className="relative flex w-full max-w-[440px] flex-col rounded-3xl bg-white p-6 shadow-modal sm:p-9">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={back ? t("Back") : t("Close")}
            className="icon-btn icon-btn-filled absolute left-4 top-4 size-10"
          >
            <Icon
              name={back ? "chevron-left" : "close"}
              size={back ? 22 : 20}
            />
          </button>
          <h1 className={`t-h2 mt-8 ${subtitle ? "mb-1" : "mb-6"}`}>{title}</h1>
          {subtitle && (
            <p className="mb-6 t-body-sm text-[color:var(--color-muted)]">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </PageShell>
  );
}

export type AuthMethod = "email" | "phone";

/** Email / Phone segmented switch. */
export function MethodTabs({
  value,
  onChange,
}: {
  value: AuthMethod;
  onChange: (m: AuthMethod) => void;
}) {
  const tabs: [AuthMethod, string][] = [
    ["email", tx("Email")],
    ["phone", tx("Phone")],
  ];
  return (
    <div className="mb-5 flex gap-2 rounded-xl border border-[color:var(--color-border)] bg-white p-1">
      {tabs.map(([m, label]) => (
        <button
          key={m}
          type="button"
          aria-pressed={value === m}
          onClick={() => onChange(m)}
          className={`min-h-11 flex-1 rounded-lg px-4 py-2 t-body-sm font-semibold transition-colors duration-150 ${
            value === m
              ? "bg-[color:var(--color-ink)] text-white"
              : "text-[color:var(--color-muted)] hover:bg-[color:var(--color-surface-soft)] hover:text-[color:var(--color-ink)]"
          }`}
        >
          {t(label)}
        </button>
      ))}
    </div>
  );
}

/** Shared field with a leading icon; `password` adds the show/hide toggle. */
export function AuthInput({
  icon,
  password = false,
  ...rest
}: { icon: IconName; password?: boolean } & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...rest}
        type={password ? (show ? "text" : "password") : rest.type}
        className={`${input} pl-11 ${password ? "pr-11" : ""}`}
      />
      <Icon
        name={icon}
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]"
      />
      {password && (
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="icon-btn absolute right-2 top-1/2 size-10 -translate-y-1/2 text-[color:var(--color-muted)]"
          aria-label={show ? t("Hide password") : t("Show password")}
        >
          <Icon name={show ? "eye-off" : "eye"} size={18} />
        </button>
      )}
    </div>
  );
}

/** Legal line under every auth form. */
export function AuthTerms() {
  return (
    <p className="mt-6 text-center t-caption">
      {tr("By continuing, you agree our {terms} and {privacy}.", {
        terms: (
          <Link
            to={routes.termsOfService}
            target="_blank"
            rel="noopener noreferrer"
            className={inlineLink}
          >
            {t("Terms of Services")}
          </Link>
        ),
        privacy: (
          <Link
            to={routes.privacyPolicy}
            target="_blank"
            rel="noopener noreferrer"
            className={inlineLink}
          >
            {t("Privacy Policy")}
          </Link>
        ),
      })}
    </p>
  );
}
