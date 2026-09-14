import { useState, type ReactNode } from "react";
import Icon from "./Icon";

// One collapsible row in the Filters sidebar/sheet: title, an optional
// Clear link, and a chevron to expand/collapse — with a full-width divider
// below (skip it on the last section in a list).
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
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[color:var(--color-ink)]">{title}</h3>
          <div className="flex items-center gap-3">
            {hasSelection && (
              <button type="button" onClick={onClear} className="text-xs font-semibold text-[color:var(--color-link)]">
                Clear
              </button>
            )}
            <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Collapse" : "Expand"}>
              <Icon
                name="chevron-down"
                size={16}
                className={`text-[color:var(--color-ink)] transition-transform ${open ? "" : "-rotate-90"}`}
              />
            </button>
          </div>
        </div>
        {open && children}
      </div>
      {divider && <div className="-mx-5 my-5 border-b border-[color:var(--color-border)]" />}
    </>
  );
}
