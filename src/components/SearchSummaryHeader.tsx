import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import Header from "./Header";
import LocationPickerSheet from "./LocationPickerSheet";
import DatePickerSheet from "./DatePickerSheet";
import WishlistSheet from "./WishlistSheet";
import type { EditSearchValue } from "./EditSearchModal";
import { useWishlist } from "../lib/wishlist";
import { bookingTypeLabels } from "../lib/routes";

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
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
  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | "date" | null>(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropoffRef = useRef<HTMLDivElement>(null);
  const pickupDateRef = useRef<HTMLDivElement>(null);

  const showTripModeTabs = draft.type === "daily" || draft.type === "outstation";
  const isSingleLocation = draft.type === "outstation" || draft.type === "self-drive";
  const showSecondDate =
    draft.type === "rental" || draft.type === "self-drive" || (showTripModeTabs && draft.tripMode === "return");
  const dateLabel = formatDate(search.pickupDate);

  function handleUpdate() {
    onSearch(draft);
    setActiveField(null);
  }

  // Switching One Way / Return changes which fields apply, so re-run the
  // search straight away rather than waiting for Update.
  function handleTripModeChange(tripMode: EditSearchValue["tripMode"]) {
    const next = { ...draft, tripMode };
    setDraft(next);
    onSearch(next);
    setActiveField(null);
  }

  function fieldBox(
    ref: React.RefObject<HTMLDivElement | null>,
    icon: "location" | "calendar" | "clock",
    label: string,
    text: string,
    onClick: () => void,
  ) {
    return (
      <div ref={ref} className="relative min-w-[150px] flex-1">
        <button
          type="button"
          onClick={onClick}
          className="flex h-[52px] w-full items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3 text-left hover:border-[color:var(--color-ink)]"
        >
          <Icon name={icon} size={17} className="shrink-0 text-[color:var(--color-ink)]" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] text-[color:var(--color-ink-soft)]">{label}</span>
            <span className="block truncate text-sm font-bold text-[color:var(--color-ink)]">{text}</span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile */}
      <header className="relative z-20 border-b border-[color:var(--color-border)] bg-white lg:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-neutral-50 text-[color:var(--color-ink)] transition-colors hover:border-[color:var(--color-ink)] hover:bg-neutral-100"
          >
            <Icon name="chevron-left" size={20} className="text-[color:var(--color-ink)]" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[color:var(--color-ink)]">
              {search.pickup} <span className="text-[color:var(--color-muted)]">&ndash;</span> {search.dropoff}
            </p>
            <p className="truncate text-xs text-[color:var(--color-muted)]">
              {bookingTypeLabels[search.type]} &middot; {dateLabel}, {search.pickupTime}
            </p>
          </div>

          <button
            type="button"
            onClick={onEditMobile}
            aria-label="Edit search"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-neutral-50 text-[color:var(--color-ink)] transition-colors hover:border-[color:var(--color-ink)] hover:bg-neutral-100"
          >
            <Icon name="edit" size={15} />
          </button>

          <button
            type="button"
            onClick={() => setWishlistOpen(true)}
            aria-label="Wishlist"
            className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-neutral-50 transition-colors hover:border-[color:var(--color-ink)] hover:bg-neutral-100"
          >
            <Icon name="heart" size={18} className="text-[color:var(--color-ink)]" />
            {wishlistIds.length > 0 && (
              <span className="absolute right-0 top-0 flex size-[15px] items-center justify-center rounded-full bg-[color:var(--color-danger)] text-[9px] font-medium text-white">
                {wishlistIds.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {wishlistOpen && <WishlistSheet onClose={() => setWishlistOpen(false)} tripQuery={tripQuery} />}

      {/* Desktop */}
      <div className="hidden lg:block">
        <Header />
        <div className="border-b border-[color:var(--color-border)] bg-white py-4">
          {/* Ride type is chosen on Home — changing it here would swap the
              whole product mid-results. One Way / Return only modifies the
              current search, so that stays editable. */}
          {showTripModeTabs && (
            <div className="mx-auto mb-3 flex max-w-[1440px] gap-5 px-[60px]">
              {(["one-way", "return"] as const).map((m) => {
                const active = draft.tripMode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleTripModeChange(m)}
                    className={`pb-1.5 text-sm transition-colors ${
                      active
                        ? "border-b-2 border-[color:var(--color-ink)] font-bold text-[color:var(--color-ink)]"
                        : "text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]"
                    }`}
                  >
                    {m === "one-way" ? "One Way" : "Return"}
                  </button>
                );
              })}
            </div>
          )}
          <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-3 px-[60px]">
            {fieldBox(pickupRef, "location", isSingleLocation ? "Location" : "Pick up location", draft.pickup, () =>
              setActiveField(activeField === "pickup" ? null : "pickup"),
            )}
            {!isSingleLocation &&
              fieldBox(dropoffRef, "location", "Drop off location", draft.dropoff, () =>
                setActiveField(activeField === "dropoff" ? null : "dropoff"),
              )}
            {fieldBox(pickupDateRef, "calendar", "Pickup date", `${formatDate(draft.pickupDate)} ${draft.pickupTime}`, () =>
              setActiveField(activeField === "date" ? null : "date"),
            )}
            <button
              type="button"
              onClick={handleUpdate}
              className="flex h-[52px] shrink-0 items-center gap-2 rounded-xl bg-[color:var(--color-ink)] px-6 text-sm font-bold text-white hover:bg-black"
            >
              <Icon name="search" size={16} />
              Update
            </button>
          </div>

          {activeField === "pickup" && (
            <LocationPickerSheet
              label="Pick up location"
              anchorRef={pickupRef}
              onSelect={(v) => {
                setDraft((s) => ({ ...s, pickup: v }));
                setActiveField(null);
              }}
              onClose={() => setActiveField(null)}
            />
          )}
          {activeField === "dropoff" && (
            <LocationPickerSheet
              label="Drop off location"
              anchorRef={dropoffRef}
              onSelect={(v) => {
                setDraft((s) => ({ ...s, dropoff: v }));
                setActiveField(null);
              }}
              onClose={() => setActiveField(null)}
            />
          )}
          {activeField === "date" && (
            <DatePickerSheet
              mode={showSecondDate ? "range" : "single"}
              anchorRef={pickupDateRef}
              initialPickup={draft.pickupDate}
              initialDropoff={draft.dropoffDate ?? undefined}
              initialPickupTime={draft.pickupTime}
              initialDropoffTime={draft.dropoffTime}
              pickupLabel="Pickup"
              dropoffLabel="Drop off"
              onConfirm={({ pickup, pickupTime, dropoff, dropoffTime }) => {
                setDraft((s) => ({
                  ...s,
                  pickupDate: pickup,
                  pickupTime,
                  dropoffDate: dropoff ?? s.dropoffDate,
                  dropoffTime: dropoffTime ?? s.dropoffTime,
                }));
                setActiveField(null);
              }}
              onClose={() => setActiveField(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
