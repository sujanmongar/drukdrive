import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import VehicleSpecs from "./VehicleSpecs";
import { vehicleClassOf, type Vehicle } from "../data/mockData";
import { routes } from "../lib/routes";
import { useCurrency } from "../lib/currency";
import { parseSearch } from "../lib/booking";
import { displayPrice } from "../lib/pricing";
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
  const price = displayPrice(parseSearch(bookingParams), vehicle.pricePerDay);
  const dayBased = price.unit === "/day";
  bookingParams.set("vehicleId", vehicle.id);
  const detailsHref = `${routes.bookingReview}?${bookingParams.toString()}`;
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
      className="flex w-full cursor-pointer items-stretch overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lift"
    >
      <div className="relative w-[118px] shrink-0 self-stretch overflow-hidden sm:w-[180px] lg:w-[250px]">
        <VehicleImage
          vehicleId={vehicle.id}
          category={vehicle.category}
          className="size-full p-2 lg:p-3"
        />
        <button
          type="button"
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(vehicle.id);
          }}
          className="icon-btn absolute right-2 top-2 size-9 bg-white/90 backdrop-blur-sm hover:!bg-white"
        >
          <Icon
            name="heart"
            size={16}
            className={`transition-colors ${saved ? "fill-current text-[color:var(--color-danger)]" : "text-[color:var(--color-ink)]"}`}
          />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-5 lg:flex-row lg:items-stretch lg:gap-6">
        <div className="min-w-0 flex-1">
          <p className="t-h4 truncate text-[color:var(--color-ink)]">
            {vehicle.name}
          </p>
          <p className="t-caption text-[color:var(--color-muted)]">
            or similar {vehicleClassOf[vehicle.category]}
          </p>

          <div className="t-caption mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[color:var(--color-ink)]">
            <span className="flex min-w-0 items-center gap-1.5">
              <Icon
                name="location"
                size={14}
                strokeWidth={2.3}
                className="shrink-0"
              />
              <span className="truncate">{vehicle.location}</span>
            </span>
            <span className="text-[color:var(--color-muted)]">•</span>
            <span className="flex items-center gap-1">
              <Icon
                name="star"
                size={13}
                className="fill-current text-[color:var(--color-star)]"
                strokeWidth={2.3}
              />
              <span className="font-semibold">{vehicle.rating}</span>
              <span className="text-[color:var(--color-muted)]">
                ({vehicle.reviewCount})
              </span>
            </span>
          </div>

          <VehicleSpecs vehicle={vehicle} className="mt-2.5" />
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-[color:var(--color-border)] pt-3 sm:pt-4 lg:w-[200px] lg:shrink-0 lg:flex-col lg:items-stretch lg:justify-center lg:gap-3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="min-w-0 lg:text-right">
            {dayBased && vehicle.strikePrice && (
              <div className="flex items-baseline gap-1.5 whitespace-nowrap lg:justify-end">
                <span className="t-caption font-semibold text-[color:var(--color-danger)]">
                  {discountPct}% off
                </span>
                <span className="t-caption text-[color:var(--color-muted)] line-through">
                  {format(vehicle.strikePrice)}
                </span>
              </div>
            )}
            <div className="flex items-baseline gap-x-1.5 whitespace-nowrap lg:justify-end">
              <span className="text-xl font-bold text-[color:var(--color-ink)] lg:text-2xl">
                {format(price.amount)}
              </span>
              <span className="t-caption text-[color:var(--color-ink)]">
                {price.unit}
              </span>
            </div>
            <p className="t-label mt-0.5 whitespace-nowrap text-[color:var(--color-muted)]">
              {price.note}
            </p>
          </div>
          <Link
            to={detailsHref}
            onClick={(e) => e.stopPropagation()}
            className="hidden shrink-0 whitespace-nowrap rounded-xl bg-[color:var(--color-ink)] px-5 py-3 text-center text-sm font-bold text-white transition-all duration-200 hover:bg-black lg:block"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
