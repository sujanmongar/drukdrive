import { useMemo, useState } from "react";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import StatusBadge from "../../components/StatusBadge";
import Icon from "../../components/Icon";
import { bookings, reviews, type Booking } from "../../data/mockData";
import { providerTabs } from "./_tabs";

type Filter = "All" | Booking["status"];

const filters: Filter[] = ["All", "Upcoming", "Completed", "Cancelled"];

// Reuse the shared `bookings` fixture but reframe it as rides driven, with a
// rider name (borrowed from the reviews fixture) and per-ride earnings.
const rides = bookings.map((b, i) => ({
  ...b,
  rider: reviews[i % reviews.length].author,
  riderAvatar: reviews[i % reviews.length].avatar,
  earnings: b.total,
}));

export default function ProviderBookings() {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(
    () => (filter === "All" ? rides : rides.filter((b) => b.status === filter)),
    [filter],
  );

  return (
    <PageShell>
      <SecondaryTabs tabs={providerTabs} />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <h1 className="text-2xl font-bold text-[#222]">My Rides</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          Rides you've driven or have coming up, and what you earned from each.
        </p>

        <div className="mt-6 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-xl border px-4 py-2 text-xs font-bold transition-colors ${
                filter === f
                  ? "border-[#222] bg-[#222] text-white"
                  : "border-[color:var(--color-border)] text-[#222] hover:border-[#222]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-white py-16 text-center shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
            <Icon name="car" size={32} className="text-[color:var(--color-muted)]" />
            <p className="mt-3 text-sm font-semibold text-[#222]">No {filter.toLowerCase()} rides</p>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">Rides assigned to you will show up here.</p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="flex flex-col gap-4 rounded-xl border border-[color:var(--color-border)] bg-white p-4 shadow-[0px_1px_3px_rgba(25,32,36,0.16)] sm:flex-row sm:items-center"
              >
                <img
                  src={b.image}
                  alt={b.vehicle}
                  className="h-40 w-full shrink-0 rounded-lg object-cover sm:h-24 sm:w-32"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img src={b.riderAvatar} alt={b.rider} className="size-7 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-bold text-[#222]">{b.rider}</p>
                        <p className="text-xs text-[color:var(--color-muted)]">
                          {b.vehicle} &middot; #{b.id}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>

                  <div className="mt-3 flex flex-col gap-1.5 text-sm text-[#333] sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex items-center gap-1.5">
                      <Icon name="location" size={14} className="shrink-0 text-[color:var(--color-muted)]" />
                      <span className="truncate">
                        {b.pickup}{" "}
                        <Icon name="chevron-right" size={11} className="mx-0.5 inline text-[color:var(--color-muted)]" />{" "}
                        {b.dropoff}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[color:var(--color-muted)]">
                      <Icon name="calendar" size={14} />
                      {b.date}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-1 border-t border-[color:var(--color-border)] pt-3 sm:items-end sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                  <p className="text-xs text-[color:var(--color-muted)]">Earnings</p>
                  <p className="text-lg font-bold text-[#222]">${b.earnings}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
