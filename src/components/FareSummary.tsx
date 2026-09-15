import { useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

export type FareLine = { label: string; value: string; success?: boolean };

// "Fare summary" trigger. On desktop it reveals a dark tooltip anchored
// under the link (hover or click); on phones the same lines open as a
// bottom sheet with a close button, matching the app's other sheets.
export default function FareSummary({ lines, total }: { lines: FareLine[]; total: string }) {
  const [open, setOpen] = useState(false);

  const rows = (dark: boolean) => (
    <dl className="flex flex-col gap-2">
      {lines.map((l) => (
        <div key={l.label} className="flex justify-between gap-4 t-body-sm">
          <dt className={l.success ? "text-[color:var(--color-success)]" : dark ? "text-white/75" : "text-[color:var(--color-ink-soft)]"}>{l.label}</dt>
          <dd className={`tabular font-semibold ${l.success ? "text-[color:var(--color-success)]" : dark ? "text-white" : "text-[color:var(--color-ink)]"}`}>{l.value}</dd>
        </div>
      ))}
      <div className={`flex justify-between gap-4 border-t pt-2 t-body-sm font-bold ${dark ? "border-white/15 text-white" : "border-[color:var(--color-border)] text-[color:var(--color-ink)]"}`}>
        <dt>Total</dt>
        <dd className="tabular">{total}</dd>
      </div>
    </dl>
  );

  return (
    <>
      {/* Desktop: tooltip */}
      <div className="group relative hidden lg:block">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={open}
          className="whitespace-nowrap t-body-sm font-semibold text-[color:var(--color-link)] underline decoration-dotted underline-offset-2"
        >
          Fare summary
        </button>
        <div
          role="tooltip"
          className={`animate-popover absolute right-0 top-full z-30 mt-2.5 w-64 rounded-xl bg-[color:var(--color-ink)] p-4 shadow-pop before:absolute before:-top-1.5 before:right-6 before:size-3 before:rotate-45 before:bg-[color:var(--color-ink)] ${
            open ? "block" : "hidden group-hover:block"
          }`}
        >
          {rows(true)}
        </div>
      </div>

      {/* Mobile: bottom sheet */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="whitespace-nowrap t-body-sm font-semibold text-[color:var(--color-link)] underline decoration-dotted underline-offset-2 lg:hidden"
      >
        Fare summary
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[70] flex items-end lg:hidden">
            <button aria-label="Close" className="animate-scrim-in absolute inset-0 cursor-default bg-black/40" onClick={() => setOpen(false)} />
            <div className="animate-sheet-up relative w-full rounded-t-3xl bg-white pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between px-5 pb-3 pt-5">
                <h2 className="t-h3 text-[color:var(--color-ink)]">Fare summary</h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="icon-btn icon-btn-filled size-10">
                  <Icon name="close" size={20} />
                </button>
              </div>
              <div className="px-5 pt-1">{rows(false)}</div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
