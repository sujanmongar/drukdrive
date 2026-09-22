import { useMemo, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import { bhutanLocations } from "../data/mockData";
import { useMediaQuery } from "../hooks/useMediaQuery";
import AnchoredPopover from "./AnchoredPopover";
import EmptyState from "./EmptyState";
import { iconTile, input, rowHover } from "../lib/ui";

// Mobile (or no anchor given): full-screen sheet. Desktop with an anchorRef:
// portaled dropdown anchored to the trigger's live position — never clipped
// by an ancestor's overflow-hidden, flips above the trigger near the
// viewport bottom.
export default function LocationPickerSheet({
  label,
  anchorRef,
  onSelect,
  onClose,
}: {
  label: string;
  anchorRef?: RefObject<HTMLElement | null>;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)") && !!anchorRef;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bhutanLocations;
    return bhutanLocations.filter(
      (l) =>
        l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q),
    );
  }, [query]);

  const content = (
    <>
      <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] px-4 py-3">
        <div className="relative min-w-0 flex-1">
          <Icon
            name="search"
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]"
          />
          <input
            autoFocus
            type="text"
            placeholder={label}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${input} pl-10`}
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="icon-btn icon-btn-filled -mr-1 size-10 shrink-0 md:hidden"
        >
          <Icon
            name="close"
            size={20}
            className="text-[color:var(--color-ink)]"
          />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {results.length === 0 ? (
          <EmptyState
            icon="location"
            title="No locations found"
            description="Try another town or landmark name."
            className="m-4"
          />
        ) : (
          results.map((loc) => (
            <button
              key={`${loc.name}-${loc.city}`}
              type="button"
              onClick={() => onSelect(`${loc.city}, ${loc.name}`)}
              className={`flex min-h-14 w-full items-center gap-3 border-b border-[color:var(--color-border)] px-4 py-2.5 text-left ${rowHover}`}
            >
              <span className={iconTile}>
                <Icon
                  name="location"
                  size={17}
                  className="text-[color:var(--color-ink)]"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate t-body font-semibold text-[color:var(--color-ink)]">
                  {loc.name}
                </span>
                <span className="block t-caption">{loc.city}</span>
              </span>
            </button>
          ))
        )}
      </div>
    </>
  );

  if (isDesktop && anchorRef) {
    return (
      <>
        <button
          aria-label="Close"
          onClick={onClose}
          className="fixed inset-0 z-[59] cursor-default"
        />
        <AnchoredPopover anchorRef={anchorRef} width={380} maxHeight={420}>
          {content}
        </AnchoredPopover>
      </>
    );
  }

  return createPortal(
    <>
      <button
        aria-label="Close"
        onClick={onClose}
        className="animate-scrim-in fixed inset-0 z-[59] cursor-default bg-black/40"
      />
      <div className="animate-sheet-up fixed inset-0 z-[60] flex flex-col bg-white">
        {content}
      </div>
    </>,
    document.body,
  );
}
