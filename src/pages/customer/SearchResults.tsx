import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import VehicleCard from "../../components/VehicleCard";
import VehicleListCard from "../../components/VehicleListCard";
import Icon from "../../components/Icon";
import EditSearchModal from "../../components/EditSearchModal";
import type { EditSearchValue } from "../../components/EditSearchModal";
import SearchSummaryHeader from "../../components/SearchSummaryHeader";
import FilterSection from "../../components/FilterSection";
import CheckboxRow from "../../components/CheckboxRow";
import PriceRangeSlider from "../../components/PriceRangeSlider";
import { vehicles as allVehicles, type Vehicle } from "../../data/mockData";
import { formatTripDate } from "../../lib/formatTripDate";
import { useCurrency } from "../../lib/currency";
import { cityOf } from "../../lib/tripDuration";
import { usePageTitle } from "../../hooks/usePageTitle";
import type { BookingType } from "../../lib/routes";

const bookingTypes: BookingType[] = ["daily", "outstation", "rental", "self-drive"];

const DEFAULT_PICKUP = "Thimphu, Clock Tower Square";
const DEFAULT_DROPOFF = "Paro, Airport";

type SortOption = "recommended" | "price-low" | "price-high" | "rating";
type ViewMode = "grid" | "list";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
];

type CapacityRange = { label: string; min: number; max: number };
const capacityRanges: CapacityRange[] = [
  { label: "1 to 5", min: 1, max: 5 },
  { label: "5 to 10", min: 5, max: 10 },
  { label: "10 to 20", min: 10, max: 20 },
];

const vehicleTypeOptions = Array.from(new Set(allVehicles.map((v) => v.category)));
const brandOptions = Array.from(new Set(allVehicles.map((v) => v.brand)));
const fuelOptions = Array.from(new Set(allVehicles.map((v) => v.fuel)));
const ratingOptions = [3, 4, 4.5];
const priceBounds = {
  min: Math.min(...allVehicles.map((v) => v.pricePerDay)),
  max: Math.max(...allVehicles.map((v) => v.pricePerDay)),
};

// How many result cards to reveal per infinite-scroll batch.
const PAGE_SIZE = 6;

function sortVehicles(list: Vehicle[], sort: SortOption): Vehicle[] {
  const copy = [...list];
  switch (sort) {
    case "price-low":
      return copy.sort((a, b) => a.pricePerDay - b.pricePerDay);
    case "price-high":
      return copy.sort((a, b) => b.pricePerDay - a.pricePerDay);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    default:
      return copy;
  }
}

// Checkbox list that truncates to `initialCount` options with a "View
// more"/"View less" link — for filter sections with a long option list.
function ExpandableCheckboxList({
  options,
  selected,
  onToggle,
  initialCount = 6,
}: {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  initialCount?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? options : options.slice(0, initialCount);
  const hasMore = options.length > initialCount;
  return (
    <div className="flex flex-col gap-2.5">
      {visible.map((option) => (
        <CheckboxRow key={option} label={option} checked={selected.includes(option)} onChange={() => onToggle(option)} />
      ))}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-left text-xs font-semibold text-[color:var(--color-link)]"
        >
          {expanded ? "View less" : "View more"}
        </button>
      )}
    </div>
  );
}

export default function SearchResults() {
  usePageTitle("Search results");
  const { format } = useCurrency();
  const [initialParams] = useSearchParams();

  const [search, setSearch] = useState<EditSearchValue>(() => {
    const pickupDateParam = initialParams.get("pickupDate");
    const dropoffDateParam = initialParams.get("dropoffDate");
    const typeParam = initialParams.get("type");
    return {
      type: bookingTypes.includes(typeParam as BookingType) ? (typeParam as BookingType) : "daily",
      tripMode: initialParams.get("tripMode") === "return" ? "return" : "one-way",
      pickup: initialParams.get("pickup") || DEFAULT_PICKUP,
      dropoff: initialParams.get("dropoff") || DEFAULT_DROPOFF,
      pickupDate: pickupDateParam ? new Date(pickupDateParam) : new Date(),
      pickupTime: initialParams.get("pickupTime") || "10:00",
      dropoffDate: dropoffDateParam ? new Date(dropoffDateParam) : null,
      dropoffTime: initialParams.get("dropoffTime") || "13:00",
    };
  });
  const [editOpen, setEditOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const [view, setView] = useState<ViewMode>("grid");
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("recommended");

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
    const category = initialParams.get("category");
    return category ? [category] : [];
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([priceBounds.min, priceBounds.max]);

  // Sticky header block (trip bar) reports its own height so the filter
  // sidebar and sort/filter row below it know how far down to pin themselves.
  const headerWrapRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    const node = headerWrapRef.current;
    if (!node) return;
    const update = () => setHeaderHeight(node.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const results = useMemo(() => {
    const filtered = allVehicles.filter((v) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(v.category)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(v.brand)) return false;
      if (selectedFuels.length > 0 && !selectedFuels.includes(v.fuel)) return false;
      if (v.pricePerDay < priceRange[0] || v.pricePerDay > priceRange[1]) return false;
      if (minRating !== null && v.rating < minRating) return false;
      if (capacity) {
        const range = capacityRanges.find((r) => r.label === capacity);
        if (range && (v.seats < range.min || v.seats > range.max)) return false;
      }
      return true;
    });
    return sortVehicles(filtered, sort);
  }, [sort, selectedTypes, selectedBrands, selectedFuels, capacity, minRating, priceRange]);

  // Infinite scroll: only render a batch of `results` at a time, growing it
  // as the sentinel below the list comes into view.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const visibleResults = results.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [results]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || loadingMore || visibleCount >= results.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setLoadingMore(true);
        window.setTimeout(() => {
          setVisibleCount((v) => Math.min(v + PAGE_SIZE, results.length));
          setLoadingMore(false);
        }, 500);
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
    // `loading` matters: the sentinel only mounts once the spinner clears.
  }, [results, visibleCount, loadingMore, loading]);

  const tripQuery = new URLSearchParams({
    pickup: search.pickup,
    dropoff: search.dropoff,
    date: formatTripDate(search.pickupDate, search.pickupTime),
  }).toString();

  function toggle(list: string[], value: string, setList: (v: string[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function reload() {
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  }

  function handleEditSearch(value: EditSearchValue) {
    setSearch(value);
    setEditOpen(false);
    reload();
  }

  function clearAllFilters() {
    setSelectedTypes([]);
    setSelectedBrands([]);
    setSelectedFuels([]);
    setCapacity(null);
    setMinRating(null);
    setPriceRange([priceBounds.min, priceBounds.max]);
  }

  const filterPanel = (
    <div className="flex flex-col">
      <FilterSection title="Vehicle type" hasSelection={selectedTypes.length > 0} onClear={() => setSelectedTypes([])}>
        <ExpandableCheckboxList
          options={vehicleTypeOptions}
          selected={selectedTypes}
          onToggle={(option) => toggle(selectedTypes, option, setSelectedTypes)}
        />
      </FilterSection>

      <FilterSection title="Brand" hasSelection={selectedBrands.length > 0} onClear={() => setSelectedBrands([])}>
        <ExpandableCheckboxList
          options={brandOptions}
          selected={selectedBrands}
          onToggle={(option) => toggle(selectedBrands, option, setSelectedBrands)}
        />
      </FilterSection>

      <FilterSection title="Capacity" hasSelection={capacity !== null} onClear={() => setCapacity(null)}>
        <div className="flex flex-wrap gap-2">
          {capacityRanges.map((range) => (
            <button
              key={range.label}
              type="button"
              onClick={() => setCapacity(capacity === range.label ? null : range.label)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                capacity === range.label
                  ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                  : "border-[color:var(--color-border)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Fuel Type" hasSelection={selectedFuels.length > 0} onClear={() => setSelectedFuels([])}>
        <ExpandableCheckboxList
          options={fuelOptions}
          selected={selectedFuels}
          onToggle={(option) => toggle(selectedFuels, option, setSelectedFuels)}
        />
      </FilterSection>

      <FilterSection
        title="Price / day"
        hasSelection={priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max}
        onClear={() => setPriceRange([priceBounds.min, priceBounds.max])}
      >
        <PriceRangeSlider min={priceBounds.min} max={priceBounds.max} value={priceRange} onChange={setPriceRange} formatLabel={format} />
      </FilterSection>

      <FilterSection title="Ratings" hasSelection={minRating !== null} onClear={() => setMinRating(null)} divider={false}>
        <div className="flex flex-wrap gap-2">
          {ratingOptions.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setMinRating(minRating === r ? null : r)}
              className={`flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                minRating === r
                  ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                  : "border-[color:var(--color-border)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
              }`}
            >
              {r}+
            </button>
          ))}
          <button
            type="button"
            onClick={() => setMinRating(null)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              minRating === null
                ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                : "border-[color:var(--color-border)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
            }`}
          >
            All
          </button>
        </div>
      </FilterSection>
    </div>
  );

  const viewToggle = (
    <div className="flex h-11 items-center rounded-xl border border-[color:var(--color-border)] px-1">
      <button
        type="button"
        aria-label="Grid view"
        aria-pressed={view === "grid"}
        onClick={() => setView("grid")}
        className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
          view === "grid" ? "bg-[color:var(--color-ink)] text-white" : "text-[color:var(--color-ink-soft)] hover:bg-neutral-100"
        }`}
      >
        <Icon name="grid" size={15} />
      </button>
      <button
        type="button"
        aria-label="List view"
        aria-pressed={view === "list"}
        onClick={() => setView("list")}
        className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
          view === "list" ? "bg-[color:var(--color-ink)] text-white" : "text-[color:var(--color-ink-soft)] hover:bg-neutral-100"
        }`}
      >
        <Icon name="list" size={15} />
      </button>
    </div>
  );

  const activeFilterCount =
    selectedTypes.length +
    selectedBrands.length +
    selectedFuels.length +
    (capacity ? 1 : 0) +
    (minRating !== null ? 1 : 0) +
    (priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max ? 1 : 0);

  return (
    <PageShell
      header={
        <div ref={headerWrapRef} className="sticky top-0 z-30 bg-white">
          <SearchSummaryHeader search={search} onSearch={handleEditSearch} onEditMobile={() => setEditOpen(true)} tripQuery={tripQuery} />
        </div>
      }
    >
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-10 md:py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Desktop filter sidebar — pinned below the header, scrolls on its own */}
          <aside
            className="hidden w-[292px] shrink-0 self-start overflow-y-auto lg:sticky lg:block"
            style={{ top: headerHeight + 16, maxHeight: `calc(100svh - ${headerHeight + 32}px)` }}
          >
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-[0px_1px_3px_rgba(25,32,36,0.10)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="t-h3 text-[color:var(--color-ink)]">Filters</h2>
                {activeFilterCount > 0 && (
                  <button type="button" onClick={clearAllFilters} className="text-xs font-semibold text-[color:var(--color-link)]">
                    Clear all
                  </button>
                )}
              </div>
              <div className="-mx-5 mb-5 border-b border-[color:var(--color-border)]" />
              {filterPanel}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24">
                <div
                  className="size-10 animate-spin rounded-full border-4 border-[color:var(--color-border)] border-t-[color:var(--color-ink)]"
                  role="status"
                  aria-label="Loading results"
                />
                <p className="text-sm text-[color:var(--color-muted)]">Finding the best rides for you&hellip;</p>
              </div>
            ) : (
              <>
                {/* Mobile: title on its own row, then the sticky Sort + Filter
                    row. Both sit directly in the (tall) results column — a
                    short wrapper would cap how far the sticky row can travel. */}
                <h1 className="t-h3 mb-3 text-[color:var(--color-ink)] lg:hidden">
                  Found {results.length} cars
                </h1>
                <div
                  className="sticky z-20 -mx-4 mb-4 flex items-center justify-between gap-3 border-b border-[color:var(--color-border)] bg-white px-4 py-2 lg:hidden"
                  style={{ top: headerHeight }}
                >
                    <button type="button" onClick={() => setSortOpen(true)} className="flex h-11 flex-col justify-center text-left">
                      <span className="text-xs text-[color:var(--color-muted)]">Sorted by</span>
                      <span className="flex items-center gap-1 text-sm font-bold text-[color:var(--color-ink)]">
                        {sortOptions.find((o) => o.value === sort)?.label}
                        <Icon name="chevron-down" size={14} />
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFilterOpen(true)}
                        className="flex h-11 items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] px-4 text-sm font-semibold text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
                      >
                        <Icon name="filter" size={16} />
                        Filter
                        {activeFilterCount > 0 && (
                          <span className="flex size-4 items-center justify-center rounded-full bg-[color:var(--color-ink)] text-[9px] font-bold text-white">
                            {activeFilterCount}
                          </span>
                        )}
                      </button>
                      {viewToggle}
                    </div>
                </div>

                {/* Desktop: title left, sort inline right, on one row */}
                <div
                  className="sticky z-20 mb-4 hidden items-center justify-between gap-3 border-b border-[color:var(--color-border)] bg-white py-3 lg:flex"
                  style={{ top: headerHeight }}
                >
                  <h1 className="t-h3 text-[color:var(--color-ink)]">
                    Found {results.length} cabs from {cityOf(search.pickup)} to {cityOf(search.dropoff)}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSortOpen((v) => !v)}
                        className="flex items-center gap-1.5 text-sm text-[color:var(--color-ink-soft)]"
                      >
                        Sorted by
                        <span className="font-bold text-[color:var(--color-ink)]">{sortOptions.find((o) => o.value === sort)?.label}</span>
                        <Icon name="chevron-down" size={14} />
                      </button>
                      {sortOpen && (
                        <>
                          <button aria-label="Close" className="fixed inset-0 z-10 cursor-default" onClick={() => setSortOpen(false)} />
                          <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-[color:var(--color-border)] bg-white p-1.5 shadow-[0px_2px_14px_rgba(0,0,0,0.1)]">
                            {sortOptions.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setSort(opt.value);
                                  setSortOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                                  sort === opt.value ? "bg-[#f4f4f4] font-semibold text-[color:var(--color-ink)]" : "text-[color:var(--color-ink-soft)] hover:bg-neutral-50"
                                }`}
                              >
                                {opt.label}
                                {sort === opt.value && <Icon name="check" size={14} />}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    {viewToggle}
                  </div>
                </div>

                {results.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[color:var(--color-border)] py-16 text-center">
                    <Icon name="car" size={32} className="text-[color:var(--color-muted)]" />
                    <p className="text-sm font-semibold text-[color:var(--color-ink)]">No vehicles match these filters</p>
                    <button type="button" onClick={clearAllFilters} className="text-sm font-semibold text-[color:var(--color-ink)] underline">
                      Clear filters
                    </button>
                  </div>
                ) : view === "grid" ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
                    {visibleResults.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} tripQuery={tripQuery} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {visibleResults.map((vehicle) => (
                      <VehicleListCard key={vehicle.id} vehicle={vehicle} tripQuery={tripQuery} />
                    ))}
                  </div>
                )}

                {visibleCount < results.length && (
                  <div ref={sentinelRef} className="flex h-16 items-center justify-center">
                    {loadingMore && (
                      <div
                        className="size-7 animate-spin rounded-full border-[3px] border-[color:var(--color-border)] border-t-[color:var(--color-ink)]"
                        role="status"
                        aria-label="Loading more results"
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / tablet filter sheet */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          <button
            aria-label="Close filters"
            className="animate-scrim-in absolute inset-0 cursor-default bg-black/40"
            onClick={() => setFilterOpen(false)}
          />
          <div className="animate-sheet-up relative flex h-[88svh] w-full flex-col overflow-hidden rounded-t-2xl bg-white">
            <div className="flex shrink-0 items-center justify-between border-b border-[color:var(--color-border)] px-4 py-4">
              <button type="button" onClick={() => setFilterOpen(false)} aria-label="Close filters">
                <Icon name="close" size={20} className="text-[color:var(--color-ink)]" />
              </button>
              <h2 className="t-h3 text-[color:var(--color-ink)]">Filters</h2>
              {activeFilterCount > 0 ? (
                <button type="button" onClick={clearAllFilters} className="text-xs font-semibold text-[color:var(--color-link)]">
                  Clear all
                </button>
              ) : (
                <span className="w-[52px]" />
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{filterPanel}</div>
            <div className="shrink-0 border-t border-[color:var(--color-border)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="w-full rounded-xl bg-[color:var(--color-ink)] py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-black"
              >
                See {results.length} cars
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sort bottom sheet */}
      {sortOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center lg:hidden">
          <button
            aria-label="Close"
            className="animate-scrim-in absolute inset-0 cursor-default bg-black/40"
            onClick={() => setSortOpen(false)}
          />
          <div className="animate-sheet-up relative w-full rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-4 py-4">
              <h2 className="t-h3 text-[color:var(--color-ink)]">Sort by</h2>
              <button type="button" onClick={() => setSortOpen(false)} aria-label="Close sort options">
                <Icon name="close" size={20} className="text-[color:var(--color-ink)]" />
              </button>
            </div>
            <div className="flex flex-col p-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSort(opt.value);
                    setSortOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left hover:bg-neutral-50"
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      sort === opt.value ? "border-[color:var(--color-ink)]" : "border-[color:var(--color-border)]"
                    }`}
                  >
                    {sort === opt.value && <span className="size-2.5 rounded-full bg-[color:var(--color-ink)]" />}
                  </span>
                  <span className={`text-sm ${sort === opt.value ? "font-bold text-[color:var(--color-ink)]" : "text-[color:var(--color-ink-soft)]"}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {editOpen && (
        <EditSearchModal initial={search} onClose={() => setEditOpen(false)} onSearch={handleEditSearch} />
      )}
    </PageShell>
  );
}
