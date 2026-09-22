import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import StatusBadge from "./StatusBadge";
import VehicleImage from "./VehicleImage";
import EmptyState from "./EmptyState";
import {
  card,
  chip,
  metaLabel,
  metaValue,
  reference,
  rowHover,
} from "../lib/ui";

export type BookingListItem = {
  id: string;
  href: string;
  vehicle: { id: string; name: string; category: string };
  bookingType?: string;
  pickup: string;
  dropoff: string;
  date: string;
  status: string;
};

// The bookings list for both roles: title with a count, one chip per group,
// then the rows of the chosen group. The first group is selected on load.
export default function BookingsList({
  groups,
}: {
  groups: Record<string, BookingListItem[]>;
}) {
  const filters = Object.keys(groups);
  const [filter, setFilter] = useState(filters[0]);
  const filtered = groups[filter];
  const total = filters.reduce((sum, f) => sum + groups[f].length, 0);

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="t-h2">Bookings</h2>
        <span className="t-body-sm text-[color:var(--color-muted)]">
          {total} in total
        </span>
      </div>

      <div className="scrollbar-hide mt-6 flex gap-2 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 ${chip(filter === f)}`}
          >
            {f} ({groups[f].length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="car"
          title={`No ${filter.toLowerCase()} bookings yet`}
          description="Bookings show up here as soon as they're made."
        />
      ) : (
        <div
          className={`${card} mt-6 divide-y divide-[color:var(--color-border)] overflow-hidden`}
        >
          {filtered.map((b) => (
            <Link
              key={b.id}
              to={b.href}
              className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5 ${rowHover}`}
            >
              <div className="flex items-center gap-3 sm:w-48 sm:shrink-0">
                <VehicleImage
                  vehicleId={b.vehicle.id}
                  category={b.vehicle.category}
                  className="size-12 rounded-xl"
                />
                <div>
                  <p className={metaLabel}>Booking ID</p>
                  <p className={reference}>#{b.id}</p>
                  <p className="t-caption font-semibold text-[color:var(--color-ink-soft)]">
                    {b.vehicle.name}
                  </p>
                  {b.bookingType && (
                    <p className="t-caption">{b.bookingType}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <div>
                  <p className={metaLabel}>Pick up</p>
                  <p className={metaValue}>{b.pickup}</p>
                </div>
                <Icon
                  name="chevron-right"
                  size={16}
                  className="hidden shrink-0 text-[color:var(--color-muted)] sm:block"
                />
                <div>
                  <p className={metaLabel}>Drop off</p>
                  <p className={metaValue}>{b.dropoff}</p>
                </div>
                <p className="t-caption sm:ml-auto">{b.date}</p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:shrink-0">
                <StatusBadge
                  status={b.status === "Upcoming" ? "Not confirmed" : b.status}
                />
                <Icon
                  name="chevron-right"
                  size={18}
                  className="text-[color:var(--color-muted)]"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
