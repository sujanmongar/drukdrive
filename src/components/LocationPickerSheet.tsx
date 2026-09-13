import { useMemo, useState } from "react";
import Icon from "./Icon";
import { bhutanLocations } from "../data/mockData";

// Mobile: full-screen sheet. Desktop (md+): anchored dropdown — render this
// inside a `position:relative` wrapper around the field that opens it.
export default function LocationPickerSheet({
  label,
  onSelect,
  onClose,
}: {
  label: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bhutanLocations;
    return bhutanLocations.filter(
      (l) => l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <>
      <button
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 z-[59] cursor-default bg-black/40 md:bg-transparent"
      />
      <div className="fixed inset-x-0 top-0 z-[60] flex h-full flex-col bg-white md:absolute md:inset-x-auto md:top-[calc(100%+8px)] md:left-0 md:h-auto md:max-h-[420px] md:w-[380px] md:rounded-xl md:border md:border-[color:var(--color-border)] md:shadow-[0px_8px_24px_rgba(0,0,0,0.14)]">
        <div className="flex items-center gap-4 border-b border-[color:var(--color-border)] p-4 md:p-3">
          <button type="button" onClick={onClose} aria-label="Close" className="md:hidden">
            <Icon name="close" size={22} className="text-[#222]" />
          </button>
          <input
            autoFocus
            type="text"
            placeholder={label}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base text-[#222] outline-none placeholder:text-[color:var(--color-muted)] md:text-sm"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {results.length === 0 ? (
            <p className="p-6 text-center text-sm text-[color:var(--color-muted)]">No locations found.</p>
          ) : (
            results.map((loc) => (
              <button
                key={`${loc.name}-${loc.city}`}
                type="button"
                onClick={() => onSelect(`${loc.city}, ${loc.name}`)}
                className="flex w-full items-center gap-3 border-b border-[color:var(--color-border)] px-4 py-3.5 text-left hover:bg-neutral-50 md:px-3 md:py-2.5"
              >
                <Icon name="location" size={18} className="shrink-0 -rotate-45 text-[#222]" />
                <span>
                  <span className="block text-sm font-bold text-[#222]">{loc.name}</span>
                  <span className="block text-xs text-[color:var(--color-muted)]">{loc.city}</span>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
