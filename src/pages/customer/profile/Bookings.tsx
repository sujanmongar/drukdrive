import { useMemo, useState } from "react";
import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import StatusBadge from "../../../components/StatusBadge";
import Icon from "../../../components/Icon";
import Button from "../../../components/Button";
import { bookings, type Booking } from "../../../data/mockData";
import { routes } from "../../../lib/routes";
import { accountTabs } from "./_tabs";

type Filter = "All" | Booking["status"];

const filters: Filter[] = ["All", "Upcoming", "Completed", "Cancelled"];

export default function AccountBookings() {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(
    () => (filter === "All" ? bookings : bookings.filter((b) => b.status === filter)),
    [filter],
  );

  return (
    <PageShell>
      <SecondaryTabs tabs={accountTabs} />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <h1 className="text-2xl font-bold text-[#222]">My Bookings</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          Track and manage all your rides in one place.
        </p>

        {/* Filter tabs */}
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
            <p className="mt-3 text-sm font-semibold text-[#222]">No {filter.toLowerCase()} bookings</p>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              Bookings you make will show up here.
            </p>
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
                    <div>
                      <p className="text-sm font-bold text-[#222]">{b.vehicle}</p>
                      <p className="text-xs text-[color:var(--color-muted)]">
                        {b.bookingType} &middot; #{b.id}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>

                  <div className="mt-3 flex flex-col gap-1.5 text-sm text-[#333] sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex items-center gap-1.5">
                      <Icon name="location" size={14} className="shrink-0 text-[color:var(--color-muted)]" />
                      <span className="truncate">
                        {b.pickup} <Icon name="chevron-right" size={11} className="mx-0.5 inline text-[color:var(--color-muted)]" /> {b.dropoff}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[color:var(--color-muted)]">
                      <Icon name="calendar" size={14} />
                      {b.date}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-3 border-t border-[color:var(--color-border)] pt-3 sm:items-end sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                  <p className="text-lg font-bold text-[#222]">${b.total}</p>
                  <div className="flex gap-2">
                    <Button to={routes.invoice(b.id)} variant="secondary" size="sm">
                      Invoice
                    </Button>
                    <Button to={routes.confirmation(b.id)} variant="primary" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
