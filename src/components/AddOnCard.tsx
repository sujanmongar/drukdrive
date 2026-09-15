import { useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import Button from "./Button";
import type { AddOn } from "../lib/pricing";

function InfoBody({ addOn }: { addOn: AddOn }) {
  return (
    <>
      <h4 className="t-label uppercase text-[color:var(--color-muted)]">
        What it&rsquo;s for
      </h4>
      <p className="mt-1 t-body-sm text-[color:var(--color-ink)]">
        {addOn.purpose}
      </p>
      <h4 className="mt-4 t-label uppercase text-[color:var(--color-muted)]">
        How it works
      </h4>
      <ol className="mt-1 flex flex-col gap-1.5 t-body-sm text-[color:var(--color-ink-soft)]">
        {addOn.howItWorks.map((step, i) => (
          <li key={step} className="flex gap-2">
            <span className="tabular shrink-0 font-semibold text-[color:var(--color-ink)]">
              {i + 1}.
            </span>
            {step}
          </li>
        ))}
      </ol>
    </>
  );
}

// One add-on with its Add / Added toggle, and an info button that explains
// it — a popover next to the icon on desktop, a bottom sheet on phones.
export default function AddOnCard({
  addOn,
  added,
  price,
  onToggle,
}: {
  addOn: AddOn;
  added: boolean;
  price: string;
  onToggle: () => void;
}) {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-card transition-colors ${
        added
          ? "border-[color:var(--color-ink)]"
          : "border-[color:var(--color-border)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="t-h4 text-[color:var(--color-ink)]">{addOn.name}</h3>
          <p className="mt-1 t-body-sm text-[color:var(--color-ink-soft)]">
            {addOn.description}
          </p>
        </div>
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setInfoOpen((v) => !v)}
            aria-label={`About ${addOn.name}`}
            aria-expanded={infoOpen}
            className="icon-btn -mr-2 -mt-2 size-9 text-[color:var(--color-muted)]"
          >
            <Icon name="info" size={19} />
          </button>
          {/* Desktop popover */}
          {infoOpen && (
            <>
              <button
                aria-label="Close"
                className="fixed inset-0 z-40 hidden cursor-default lg:block"
                onClick={() => setInfoOpen(false)}
              />
              <div className="animate-popover absolute right-0 top-full z-50 mt-1 hidden w-80 rounded-2xl border border-[color:var(--color-border)] bg-white p-4 shadow-pop lg:block">
                <InfoBody addOn={addOn} />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p>
          <span className="block t-body-lg tabular font-bold text-[color:var(--color-ink)]">
            {price}
          </span>
          <span className="block t-caption text-[color:var(--color-muted)]">
            per day
          </span>
        </p>
        <Button
          variant={added ? "secondary" : "primary"}
          size="md"
          onClick={onToggle}
          aria-pressed={added}
          className="min-w-[104px]"
        >
          {added ? (
            <span className="flex items-center gap-1.5">
              <Icon name="check" size={16} strokeWidth={2.5} />
              Added
            </span>
          ) : (
            "Add"
          )}
        </Button>
      </div>

      {/* Mobile sheet */}
      {infoOpen &&
        createPortal(
          <div className="fixed inset-0 z-[70] flex items-end lg:hidden">
            <button
              aria-label="Close"
              className="animate-scrim-in absolute inset-0 cursor-default bg-black/40"
              onClick={() => setInfoOpen(false)}
            />
            <div className="animate-sheet-up relative w-full rounded-t-3xl bg-white pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between px-5 pb-3 pt-5">
                <h2 className="t-h3 text-[color:var(--color-ink)]">
                  {addOn.name}
                </h2>
                <button
                  type="button"
                  onClick={() => setInfoOpen(false)}
                  aria-label="Close"
                  className="icon-btn icon-btn-filled size-10"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>
              <div className="px-5 pt-1">
                <InfoBody addOn={addOn} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
