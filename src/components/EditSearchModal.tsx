import { useState } from "react";
import Icon from "./Icon";
import SearchFields from "./SearchFields";
import type { SearchValue } from "../lib/booking";

export type EditSearchValue = SearchValue;

// Full-screen edit of the current search on phones (a centred dialog from
// sm). The booking type stays what was searched — it is picked on Home.
export default function EditSearchModal({
  initial,
  onClose,
  onSearch,
}: {
  initial: SearchValue;
  onClose: () => void;
  onSearch: (value: SearchValue) => void;
}) {
  const [value, setValue] = useState<SearchValue>(initial);

  return (
    <div className="fixed inset-0 z-[55] flex items-start justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex h-full w-full flex-col bg-white sm:h-auto sm:max-w-[440px] sm:rounded-2xl">
        <div className="flex items-center gap-4 border-b border-[color:var(--color-border)] p-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="icon-btn size-10 -ml-2"
          >
            <Icon
              name="close"
              size={22}
              className="text-[color:var(--color-ink)]"
            />
          </button>
          <h2 className="t-h3 text-[color:var(--color-ink)]">
            Edit your search
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <SearchFields value={value} onChange={setValue} layout="stack" />
        </div>

        <div className="border-t border-[color:var(--color-border)] p-4">
          <button
            type="button"
            onClick={() => onSearch(value)}
            className="w-full rounded-xl bg-[color:var(--color-ink)] py-4 t-body font-bold text-white transition-colors hover:bg-black"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
