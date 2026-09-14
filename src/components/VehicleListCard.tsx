import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import type { Vehicle } from "../data/mockData";
import { routes } from "../lib/routes";
import { useCurrency } from "../lib/currency";
import { useWishlist } from "../lib/wishlist";

// Horizontal row layout for the search results "List view" — image left,
// details right. Content differs by breakpoint per design: mobile shows a
// trust checklist, desktop shows spec chips + a rating badge and an explicit
// Book Now button (mobile relies on the whole row being clickable instead).
export default function VehicleListCard({
  vehicle,
  tripQuery = "",
}: {
  vehicle: Vehicle;
  tripQuery?: string;
}) {
  const { format } = useCurrency();
  const { isSaved, toggle } = useWishlist();
  const navigate = useNavigate();
  const saved = isSaved(vehicle.id);
  const bookingParams = new URLSearchParams(tripQuery);
  bookingParams.set("vehicleId", vehicle.id);
  const detailsHref = `${routes.reviewBooking}?${bookingParams.toString()}`;
  const discountPct = vehicle.strikePrice
    ? Math.round((1 - vehicle.pricePerDay / vehicle.strikePrice) * 100)
    : null;

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(detailsHref)}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(detailsHref);
      }}
      className="flex w-full cursor-pointer items-stretch gap-3 overflow-hidden rounded-xl bg-white p-3 shadow-[0px_1px_3px_rgba(25,32,36,0.16)] transition-shadow hover:shadow-[0px_4px_18px_rgba(25,32,36,0.22)] sm:gap-4 sm:p-4 lg:items-center"
    >
      <div className="relative w-[110px] shrink-0 self-stretch overflow-hidden rounded-lg sm:w-[140px] lg:h-[86px] lg:w-[150px] lg:self-auto">
        <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-full" />
        <button
          type="button"
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(vehicle.id);
          }}
          className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-white/90 transition-transform active:scale-90 lg:hidden"
        >
          <Icon
            name="heart"
            size={14}
            className={`transition-colors ${saved ? "fill-current text-[color:var(--color-danger)]" : "text-[color:var(--color-ink)]"}`}
          />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col lg:flex-row lg:items-center lg:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={saved}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle(vehicle.id);
              }}
              className="hidden items-center justify-center lg:flex"
            >
              <Icon
                name="heart"
                size={16}
                className={`transition-colors ${saved ? "fill-current text-[color:var(--color-danger)]" : "text-[color:var(--color-ink-soft)]"}`}
              />
            </button>
            <p className="text-sm font-bold text-[color:var(--color-ink)] sm:text-base">{vehicle.name}</p>
            <span className="rounded-full bg-[color:var(--color-info-bg)] px-2 py-0.5 text-[9px] font-semibold uppercase text-[color:var(--color-info-text)]">
              {vehicle.category}
            </span>
          </div>

          {/* Mobile: seats/fuel + location */}
          <div className="mt-1 flex items-center gap-3 text-xs text-[color:var(--color-ink)] lg:hidden">
            <span className="flex items-center gap-1">
              <Icon name="seat" size={13} />
              {vehicle.seats} Seats
            </span>
            <span className="flex items-center gap-1">
              <Icon name="fuel" size={13} />
              {vehicle.fuel}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-[color:var(--color-muted)] lg:hidden">
            <Icon name="location" size={13} />
            {vehicle.location}
          </div>
          {/* Desktop: spec chips + rating badge */}
          <div className="mt-1.5 hidden flex-wrap items-center gap-3 text-xs text-[color:var(--color-ink-soft)] lg:flex">
            <span className="flex items-center gap-1">
              <Icon name="gearbox" size={13} />
              {vehicle.transmission[0]}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="seat" size={13} />
              {vehicle.seats}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="fuel" size={13} />
              {vehicle.fuel[0]}
            </span>
            {vehicle.ac && (
              <span className="flex items-center gap-1">
                <Icon name="snowflake" size={13} />
                AC
              </span>
            )}
          </div>
          <div className="mt-2 hidden items-center gap-2 lg:flex">
            <span className="rounded-md bg-[color:var(--color-success-bg)] px-1.5 py-0.5 text-xs font-bold text-[color:var(--color-success)]">
              {vehicle.rating}/5
            </span>
            <span className="text-xs text-[color:var(--color-muted)]">{vehicle.reviewCount} ratings</span>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2 pt-2 lg:mt-0 lg:shrink-0 lg:flex-col lg:items-end lg:pt-0">
          <div className="min-w-0 lg:text-right">
            <div className="flex flex-wrap items-baseline gap-x-1.5 lg:justify-end">
              {vehicle.strikePrice && (
                <>
                  <span className="hidden text-xs font-semibold text-red-500 lg:inline">{discountPct}% off</span>
                  <span className="text-xs text-red-500 line-through">{format(vehicle.strikePrice)}</span>
                </>
              )}
              <span className="text-lg font-extrabold text-[color:var(--color-ink)] sm:text-xl">
                {format(vehicle.pricePerDay)}
              </span>
              <span className="text-xs text-[color:var(--color-ink)]">/day</span>
            </div>
            <p className="text-[10px] text-[color:var(--color-muted)]">incl. taxes &amp; fees</p>
          </div>
          <Link
            to={detailsHref}
            onClick={(e) => e.stopPropagation()}
            className="hidden shrink-0 whitespace-nowrap rounded-xl bg-[color:var(--color-ink)] px-5 py-2.5 text-xs font-bold text-white hover:bg-black lg:inline-flex lg:items-center lg:justify-center"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
