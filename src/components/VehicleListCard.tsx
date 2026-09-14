import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import type { Vehicle } from "../data/mockData";
import { routes } from "../lib/routes";
import { useCurrency } from "../lib/currency";
import { useWishlist } from "../lib/wishlist";

// Horizontal row layout for the search results "List view" — image left,
// details centre, price + Book Now in their own divided column on the right.
// Shows the same fields as the grid VehicleCard, just laid out horizontally.
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
      <div className="relative w-[118px] shrink-0 self-stretch overflow-hidden sm:w-[180px] lg:w-[250px]">
        <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-full p-2 lg:p-3" />
        <button
          type="button"
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(vehicle.id);
          }}
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/90 transition-transform active:scale-90"
        >
          <Icon
            name="heart"
            size={16}
            className={`transition-colors ${saved ? "fill-current text-[color:var(--color-danger)]" : "text-[color:var(--color-ink)]"}`}
          />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-5 lg:flex-row lg:items-center lg:gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-bold text-[color:var(--color-ink)] sm:text-base lg:text-lg">{vehicle.name}</p>
            <span className="rounded-full bg-[color:var(--color-info-bg)] px-2 py-0.5 text-[9px] font-semibold uppercase text-[color:var(--color-info-text)]">
              {vehicle.category}
            </span>
          </div>

          <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-[color:var(--color-ink)]">
            <Icon name="location" size={14} className="shrink-0" />
            <span className="truncate">
              {vehicle.location}
              <span className="mx-1.5 text-[color:var(--color-muted)]">•</span>
              {vehicle.type}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-[color:var(--color-ink)] sm:gap-2 sm:text-xs">
            <span className="flex items-center gap-1 rounded-lg bg-neutral-50 px-2 py-1 sm:gap-1.5 sm:px-2.5 sm:py-1.5">
              <Icon name="seat" size={14} />
              {vehicle.seats} Seats
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-neutral-50 px-2 py-1 sm:gap-1.5 sm:px-2.5 sm:py-1.5">
              <Icon name="fuel" size={14} />
              {vehicle.fuel}
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-neutral-50 px-2 py-1 sm:gap-1.5 sm:px-2.5 sm:py-1.5">
              <Icon name="star" size={13} className="fill-current text-amber-400" />
              {vehicle.rating} ({vehicle.reviewCount})
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-[color:var(--color-border)] pt-3 sm:pt-4 lg:w-[200px] lg:shrink-0 lg:flex-col lg:items-stretch lg:justify-center lg:gap-3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="min-w-0 lg:text-right">
            {vehicle.strikePrice && (
              <div className="flex items-baseline gap-1.5 whitespace-nowrap lg:justify-end">
                <span className="text-xs font-semibold text-red-500">{discountPct}% off</span>
                <span className="text-xs text-[color:var(--color-muted)] line-through">{format(vehicle.strikePrice)}</span>
              </div>
            )}
            <div className="flex items-baseline gap-x-1.5 whitespace-nowrap lg:justify-end">
              <span className="text-lg font-extrabold text-[color:var(--color-ink)] sm:text-xl lg:text-2xl">
                {format(vehicle.pricePerDay)}
              </span>
              <span className="text-xs text-[color:var(--color-ink)]">/day</span>
            </div>
            <p className="mt-0.5 whitespace-nowrap text-[10px] text-[color:var(--color-muted)]">incl. taxes &amp; fees</p>
          </div>
          <Link
            to={detailsHref}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 whitespace-nowrap rounded-xl bg-[color:var(--color-ink)] px-4 py-2.5 text-center text-xs font-bold text-white hover:bg-black sm:px-5 sm:py-3 lg:text-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
