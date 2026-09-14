import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import type { Vehicle } from "../data/mockData";
import { routes } from "../lib/routes";
import { useCurrency } from "../lib/currency";
import { useWishlist } from "../lib/wishlist";

// Horizontal row layout for the search results "List view" — image left,
// details right. Shows the same fields as the grid VehicleCard (just laid
// out horizontally); only the desktop breakpoint adds an explicit Book Now
// button — mobile relies on the whole row being clickable instead.
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
      className="flex w-full cursor-pointer items-stretch overflow-hidden rounded-xl bg-white shadow-[0px_1px_3px_rgba(25,32,36,0.16)] transition-shadow hover:shadow-[0px_4px_18px_rgba(25,32,36,0.22)] lg:items-center"
    >
      <div className="relative w-[110px] shrink-0 self-stretch overflow-hidden sm:w-[140px] lg:h-[110px] lg:w-[170px] lg:self-auto">
        <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-full p-3" />
        <button
          type="button"
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(vehicle.id);
          }}
          className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-white/90 transition-transform active:scale-90"
        >
          <Icon
            name="heart"
            size={14}
            className={`transition-colors ${saved ? "fill-current text-[color:var(--color-danger)]" : "text-[color:var(--color-ink)]"}`}
          />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-[color:var(--color-ink)] sm:text-base">{vehicle.name}</p>
            <span className="rounded-full bg-[color:var(--color-info-bg)] px-2 py-0.5 text-[9px] font-semibold uppercase text-[color:var(--color-info-text)]">
              {vehicle.category}
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[color:var(--color-ink)]">
            <Icon name="location" size={14} />
            {vehicle.location}
            <span className="text-[color:var(--color-muted)]">•</span>
            {vehicle.type}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[color:var(--color-ink)]">
            <span className="flex items-center gap-1">
              <Icon name="seat" size={15} />
              {vehicle.seats} Seats
            </span>
            <span className="flex items-center gap-1">
              <Icon name="fuel" size={15} />
              {vehicle.fuel}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="star" size={13} className="fill-current text-amber-400" />
              {vehicle.rating} ({vehicle.reviewCount})
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between gap-x-2 gap-y-2 lg:mt-0 lg:shrink-0 lg:gap-x-8">
          <div className="min-w-0 flex-1 lg:flex-none lg:text-right">
            {vehicle.strikePrice && (
              <div className="flex items-baseline gap-1.5 lg:justify-end">
                <span className="text-xs font-semibold text-red-500">{discountPct}% off</span>
                <span className="text-xs text-[color:var(--color-muted)] line-through">{format(vehicle.strikePrice)}</span>
              </div>
            )}
            <div className="flex flex-wrap items-baseline gap-x-1.5 lg:justify-end">
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
