import { useState, type ReactNode } from "react";
import Icon from "./Icon";

// One collapsible group in the Filters sidebar/sheet. The whole header row
// is the toggle — a 44px-tall target — with Clear as its own button beside
// the chevron. A full-width hairline separates groups.
export default function FilterSection({
  title,
  hasSelection,
  onClear,
  children,
  divider = true,
}: {
  title: string;
  hasSelection: boolean;
  onClear: () => void;
  children: ReactNode;
  divider?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div>
        <div className="-mx-2 flex items-center">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex min-h-11 flex-1 items-center justify-between gap-3 rounded-lg px-2 text-left transition-colors hover:bg-[color:var(--color-surface-soft)]"
          >
            <h4 className="t-body font-bold text-[color:var(--color-ink)]">
              {title}
            </h4>
            <Icon
              name="chevron-down"
              size={18}
              className={`shrink-0 text-[color:var(--color-muted)] transition-transform ${open ? "" : "-rotate-90"}`}
            />
          </button>
          {hasSelection && (
            <button
              type="button"
              onClick={onClear}
              className="min-h-11 shrink-0 rounded-lg px-2 t-body-sm font-semibold text-[color:var(--color-link)] hover:bg-[color:var(--color-surface-soft)]"
            >
              Clear
            </button>
          )}
        </div>
        {open && <div className="mt-2">{children}</div>}
      </div>
      {divider && (
        <div className="-mx-6 my-4 border-b border-[color:var(--color-border)]" />
      )}
    </>
  );
}
