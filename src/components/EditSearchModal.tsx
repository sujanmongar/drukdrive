import { useState } from "react";
import Icon from "./Icon";
import SearchFields from "./SearchFields";
import Button from "./Button";
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
    <div className="fixed inset-0 z-[55] flex items-start justify-center p-0 sm:items-center sm:p-4">
      <button
        aria-label="Close"
        className="animate-scrim-in absolute inset-0 cursor-default bg-black/40"
        onClick={onClose}
      />
      <div className="animate-popover relative flex h-full w-full flex-col bg-white shadow-modal sm:h-auto sm:max-w-[440px] sm:rounded-3xl">
        <div className="flex items-center justify-between gap-4 border-b border-[color:var(--color-border)] px-4 py-3">
          <h2 className="t-h3">Edit your search</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="icon-btn icon-btn-filled -mr-1 size-10"
          >
            <Icon
              name="close"
              size={20}
              className="text-[color:var(--color-ink)]"
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <SearchFields value={value} onChange={setValue} layout="stack" />
        </div>

        <div className="border-t border-[color:var(--color-border)] p-4">
          <Button
            size="lg"
            fullWidth
            onClick={() => onSearch(value)}
            className="h-14"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
