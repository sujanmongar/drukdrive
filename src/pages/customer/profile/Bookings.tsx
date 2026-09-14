import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import StatusBadge from "../../../components/StatusBadge";
import Icon from "../../../components/Icon";
import VehicleImage from "../../../components/VehicleImage";
import { bookings, vehicles } from "../../../data/mockData";
import { routes } from "../../../lib/routes";
import { accountTabs } from "./_tabs";
import { usePageTitle } from "../../../hooks/usePageTitle";

type Filter = "Current" | "Upcoming" | "Past";

export default function AccountBookings() {
  usePageTitle("My Bookings");
  const [filter, setFilter] = useState<Filter>("Current");

  const groups = useMemo(() => {
    const upcoming = bookings.filter((b) => b.status === "Upcoming");
    return {
      Current: upcoming.slice(0, 1),
      Upcoming: upcoming.slice(1),
      Past: bookings.filter((b) => b.status !== "Upcoming"),
    };
  }, []);

  const filtered = groups[filter];

  return (
    <PageShell>
      <ProfileHero />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={accountTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <div className="flex items-center justify-between">
          <h2 className="t-h2 text-[color:var(--color-ink)]">Bookings</h2>
          <span className="text-sm font-semibold text-[color:var(--color-ink)] underline">See all booking ({bookings.length})</span>
        </div>

        <div className="scrollbar-hide mt-5 flex gap-2 overflow-x-auto">
          {(["Current", "Upcoming", "Past"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                  : "border-[color:var(--color-border)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
              }`}
            >
              {f} ({groups[f].length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-[color:var(--color-border)] py-16 text-center">
            <Icon name="car" size={32} className="text-[color:var(--color-muted)]" />
            <p className="mt-3 text-sm font-semibold text-[color:var(--color-ink)]">No {filter.toLowerCase()} bookings</p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)]">
            {filtered.map((b, i) => {
              const vehicle = vehicles.find((v) => v.id === b.vehicleId) ?? vehicles[0];
              return (
              <Link
                key={b.id}
                to={routes.confirmation(b.id)}
                className={`flex flex-col gap-3 p-4 hover:bg-[color:var(--color-surface-soft)] sm:flex-row sm:items-center sm:gap-6 sm:p-5 ${
                  i !== 0 ? "border-t border-[color:var(--color-border)]" : ""
                }`}
              >
                <div className="flex items-center gap-3 sm:w-48 sm:shrink-0">
                  <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-12 rounded-lg" />
                  <div>
                    <p className="text-xs text-[color:var(--color-muted)]">Booking ID</p>
                    <p className="text-sm font-bold text-[color:var(--color-success)]">#{b.id}</p>
                    <p className="text-xs font-medium text-[color:var(--color-ink-soft)]">{vehicle.name}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <div>
                    <p className="text-xs text-[color:var(--color-muted)]">Pick up</p>
                    <p className="text-sm font-bold text-[color:var(--color-ink)]">{b.pickup}</p>
                  </div>
                  <Icon name="chevron-right" size={16} className="hidden shrink-0 text-[color:var(--color-muted)] sm:block" />
                  <div>
                    <p className="text-xs text-[color:var(--color-muted)]">Drop off</p>
                    <p className="text-sm font-bold text-[color:var(--color-ink)]">{b.dropoff}</p>
                  </div>
                  <p className="text-xs text-[color:var(--color-muted)] sm:ml-auto">{b.date}</p>
                </div>

                <div className="flex items-center justify-between gap-3 sm:shrink-0">
                  <StatusBadge status={b.status === "Upcoming" ? "Not confirmed" : b.status} />
                  <Icon name="chevron-right" size={18} className="text-[color:var(--color-muted)]" />
                </div>
              </Link>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
