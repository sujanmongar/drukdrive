import { useMemo, useState } from "react";
import Icon from "./Icon";
import { bhutanLocations } from "../data/mockData";

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
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex h-full w-full flex-col bg-white sm:h-auto sm:max-h-[80vh] sm:max-w-[480px] sm:rounded-2xl">
        <div className="flex items-center gap-4 border-b border-[color:var(--color-border)] p-4">
          <button type="button" onClick={onClose} aria-label="Close">
            <Icon name="close" size={22} className="text-[#222]" />
          </button>
          <input
            autoFocus
            type="text"
            placeholder={label}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base text-[#222] outline-none placeholder:text-[color:var(--color-muted)]"
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
                className="flex w-full items-center gap-3 border-b border-[color:var(--color-border)] px-4 py-3.5 text-left hover:bg-neutral-50"
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
    </div>
  );
}
