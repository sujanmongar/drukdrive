import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import Header from "./Header";
import WishlistSheet from "./WishlistSheet";
import SearchFields from "./SearchFields";
import type { EditSearchValue } from "./EditSearchModal";
import { useWishlist } from "../lib/wishlist";
import { bookingTypeLabels } from "../lib/routes";

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// Replaces the default logo/nav Header on the search results page.
// Mobile: a compact bar (back, truncated route, date, edit) takes over the
// whole top area, and the pencil opens the full-screen EditSearchModal.
// Desktop: the normal logo Header stays, with an always-editable field row
// underneath it (pickup/drop-off/date/time + Update) — one consistent bar,
// no separate collapsed display state to toggle in and out of.
export default function SearchSummaryHeader({
  search,
  onSearch,
  onEditMobile,
  tripQuery = "",
}: {
  search: EditSearchValue;
  onSearch: (value: EditSearchValue) => void;
  onEditMobile: () => void;
  tripQuery?: string;
}) {
  const navigate = useNavigate();
  const { ids: wishlistIds } = useWishlist();
  const [draft, setDraft] = useState<EditSearchValue>(search);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const dateLabel = formatDate(search.pickupDate);

  function handleUpdate() {
    onSearch(draft);
  }

  return (
    <>
      {/* Mobile */}
      <header className="relative z-20 border-b border-[color:var(--color-border)] bg-white lg:hidden">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="icon-btn icon-btn-filled size-9 shrink-0"
          >
            <Icon
              name="chevron-left"
              size={20}
              className="text-[color:var(--color-ink)]"
            />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[color:var(--color-ink)]">
              {search.pickup}
              {search.dropoff !== search.pickup && (
                <>
                  {" "}
                  <span className="text-[color:var(--color-muted)]">
                    &ndash;
                  </span>{" "}
                  {search.dropoff}
                </>
              )}
            </p>
            <p className="truncate text-xs text-[color:var(--color-muted)]">
              {bookingTypeLabels[search.type]} &middot; {dateLabel},{" "}
              {search.pickupTime}
            </p>
          </div>

          <button
            type="button"
            onClick={onEditMobile}
            aria-label="Edit search"
            className="icon-btn icon-btn-filled size-9 shrink-0"
          >
            <Icon name="edit" size={15} />
          </button>

          <button
            type="button"
            onClick={() => setWishlistOpen(true)}
            aria-label="Wishlist"
            className="icon-btn icon-btn-filled relative size-9 shrink-0"
          >
            <Icon
              name="heart"
              size={18}
              className="text-[color:var(--color-ink)]"
            />
            {wishlistIds.length > 0 && (
              <span className="absolute right-0 top-0 flex size-[15px] items-center justify-center rounded-full bg-[color:var(--color-danger)] text-[9px] font-medium text-white">
                {wishlistIds.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {wishlistOpen && (
        <WishlistSheet
          onClose={() => setWishlistOpen(false)}
          tripQuery={tripQuery}
        />
      )}

      {/* Desktop */}
      <div className="hidden lg:block">
        <Header />
        <div className="border-b border-[color:var(--color-border)] bg-white py-4">
          {/* Ride type is chosen on Home — changing it here would swap the
              whole product mid-results. Everything else is editable in place. */}
          <div className="mx-auto max-w-[1280px] px-10">
            <SearchFields
              value={draft}
              onChange={setDraft}
              layout="row"
              anchored
              action={
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="flex h-[56px] shrink-0 items-center gap-2 rounded-xl bg-[color:var(--color-ink)] px-6 text-sm font-bold text-white transition-all duration-200 hover:bg-black"
                >
                  <Icon name="search" size={16} />
                  Update
                </button>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
