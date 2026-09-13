import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import BookingTypeTabs from "../../components/BookingTypeTabs";
import VehicleCard from "../../components/VehicleCard";
import Icon from "../../components/Icon";
import { vehicles as allVehicles, type Vehicle } from "../../data/mockData";
import type { BookingType } from "../../lib/routes";

type SortOption = "recommended" | "price-low" | "price-high" | "rating";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
];

const vehicleTypeOptions = Array.from(new Set(allVehicles.map((v) => v.category)));
const fuelOptions = Array.from(new Set(allVehicles.map((v) => v.fuel)));

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

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const bookingType = (searchParams.get("type") as BookingType) || "daily";
  const [type, setType] = useState<BookingType>(bookingType);

  const pickup = searchParams.get("pickup") || "Thimphu, Clock Tower Square";
  const dropoff = searchParams.get("dropoff") || "Paro, Airport";
  const date = searchParams.get("date") || "Thu, 24 Sep · 10:00 AM";

  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("recommended");

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(80);

  const results = useMemo(() => sortVehicles(allVehicles, sort), [sort]);

  function toggle(list: string[], value: string, setList: (v: string[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filterPanel = (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-bold text-[#222]">Vehicle Type</h3>
        <div className="flex flex-col gap-2.5">
          {vehicleTypeOptions.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-2.5 text-sm text-[#222]">
              <input
                type="checkbox"
                checked={selectedTypes.includes(option)}
                onChange={() => toggle(selectedTypes, option, setSelectedTypes)}
                className="size-4 rounded border-[color:var(--color-border)] accent-[#222]"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-[#222]">Fuel Type</h3>
        <div className="flex flex-col gap-2.5">
          {fuelOptions.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-2.5 text-sm text-[#222]">
              <input
                type="checkbox"
                checked={selectedFuels.includes(option)}
                onChange={() => toggle(selectedFuels, option, setSelectedFuels)}
                className="size-4 rounded border-[color:var(--color-border)] accent-[#222]"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-[#222]">Max Price / day</h3>
        <input
          type="range"
          min={40}
          max={80}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#222]"
        />
        <div className="mt-1 flex justify-between text-xs text-[color:var(--color-muted)]">
          <span>$40</span>
          <span className="font-semibold text-[#222]">${maxPrice}</span>
          <span>$80</span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-[#222]">Minimum Rating</h3>
        <div className="flex gap-2">
          {[3, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              className="flex items-center gap-1 rounded-lg border border-[color:var(--color-border)] px-2.5 py-1.5 text-xs font-medium text-[#222] hover:border-[#222]"
            >
              <Icon name="star" size={12} className="fill-current text-amber-400" />
              {r}+
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <BookingTypeTabs value={type} onChange={setType} />

        {/* Edit search summary bar */}
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4 shadow-[0px_1px_3px_rgba(25,32,36,0.16)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-2 text-sm text-[#222]">
              <Icon name="location" size={16} className="shrink-0 text-[color:var(--color-muted)]" />
              <span className="font-semibold">{pickup}</span>
              <Icon name="chevron-right" size={14} className="text-[color:var(--color-muted)]" />
              <span className="font-semibold">{dropoff}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[color:var(--color-muted)]">
              <Icon name="calendar" size={16} />
              {date}
            </div>
          </div>
          <button
            type="button"
            className="self-start rounded-xl border border-[#222] px-4 py-2 text-xs font-bold text-[#222] hover:bg-neutral-50 sm:self-auto"
          >
            Edit Search
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* Desktop filter sidebar */}
          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
              <h2 className="mb-4 text-base font-bold text-[#222]">Filters</h2>
              {filterPanel}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#222]">{results.length} vehicles found</p>

              <div className="flex items-center gap-2">
                {/* Mobile / tablet filter trigger */}
                <button
                  type="button"
                  onClick={() => setFilterOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] px-3.5 py-2 text-xs font-semibold text-[#222] hover:border-[#222] lg:hidden"
                >
                  <Icon name="filter" size={15} />
                  Filter
                </button>

                {/* Sort by */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSortOpen((v) => !v)}
                    className="flex items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] px-3.5 py-2 text-xs font-semibold text-[#222] hover:border-[#222]"
                  >
                    <Icon name="sort" size={15} />
                    Sort by
                    <Icon name="chevron-down" size={13} />
                  </button>
                  {sortOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
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
                              sort === opt.value ? "bg-[#f4f4f4] font-semibold text-[#222]" : "text-[#333] hover:bg-neutral-50"
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
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {results.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet filter sheet */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-4 py-4">
            <h2 className="text-base font-bold text-[#222]">Filters</h2>
            <button type="button" onClick={() => setFilterOpen(false)} aria-label="Close filters">
              <Icon name="close" size={20} className="text-[#222]" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5">{filterPanel}</div>
          <div className="border-t border-[color:var(--color-border)] p-4">
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="w-full rounded-xl bg-[#222] py-3.5 text-sm font-bold text-white hover:bg-black"
            >
              Show {results.length} vehicles
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
