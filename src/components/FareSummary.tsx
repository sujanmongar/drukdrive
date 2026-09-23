import { useState } from "react";
import Icon from "./Icon";
import { t } from "../lib/i18n";

export type FareLine = { label: string; value: string; success?: boolean };

// Fare breakdown that expands in place under the total — one behaviour on
// every screen size.
export default function FareSummary({
  lines,
  total,
}: {
  lines: FareLine[];
  total: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-[color:var(--color-border)] pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between gap-3 t-body-sm font-semibold text-[color:var(--color-ink)]"
      >
        {t("Fare summary")}
        <Icon
          name="chevron-down"
          size={18}
          className={`shrink-0 text-[color:var(--color-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <dl className="animate-popover mt-2 flex flex-col gap-2">
          {lines.map((l) => (
            <div key={l.label} className="flex justify-between gap-4 t-body-sm">
              <dt
                className={
                  l.success ? "text-[color:var(--color-success-deep)]" : ""
                }
              >
                {l.label}
              </dt>
              <dd
                className={`t-amount ${l.success ? "text-[color:var(--color-success-deep)]" : ""}`}
              >
                {l.value}
              </dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 border-t border-[color:var(--color-border)] pt-2 t-body-sm font-semibold text-[color:var(--color-ink)]">
            <dt>{t("Total")}</dt>
            <dd className="t-amount">{total}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
