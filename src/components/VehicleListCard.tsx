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

// The one search-result card. Image left, details beside it (heart above
// the name), then the price and Book Now: below a divider on phones, in
// their own column on the right from lg.
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

  const priceBlock = (
    <div className="min-w-0">
      {dayBased && vehicle.strikePrice && (
        <div className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="t-caption font-semibold text-[color:var(--color-danger)]">
            {discountPct}% off
          </span>
          <span className="t-caption text-[color:var(--color-muted)] line-through">
            {format(vehicle.strikePrice)}
          </span>
        </div>
      )}
      <div className="flex items-baseline gap-x-1.5 whitespace-nowrap">
        <span className="text-2xl font-bold tabular text-[color:var(--color-ink)]">
          {format(price.amount)}
        </span>
        <span className="t-caption text-[color:var(--color-muted)]">
          {price.unit}
        </span>
      </div>
      <p className="t-caption whitespace-nowrap text-[color:var(--color-muted)]">
        {price.note}
      </p>
    </div>
  );

  const bookButton = (
    <Link
      to={detailsHref}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-[color:var(--color-ink)] px-7 t-body-sm font-bold text-white transition-all duration-200 hover:bg-black"
    >
      Book Now
    </Link>
  );

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(detailsHref)}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(detailsHref);
      }}
      className="flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lift lg:flex-row lg:items-stretch"
    >
      {/* Image + details — the same content as before, only the layout moved. */}
      <div className="flex min-w-0 flex-1 gap-3 p-3 sm:gap-5 sm:p-5">
        <div className="relative flex w-[136px] shrink-0 items-center sm:w-[200px] lg:w-[230px]">
          <VehicleImage
            vehicleId={vehicle.id}
            category={vehicle.category}
            transparent
            className="w-full"
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
            className="icon-btn icon-btn-filled absolute -right-1 -top-1 size-9 shadow-card"
          >
            <Icon
              name="heart"
              size={16}
              className={`transition-colors ${saved ? "fill-current text-[color:var(--color-danger)]" : "text-[color:var(--color-ink)]"}`}
            />
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <p className="t-h3 truncate text-[color:var(--color-ink)]">
            {vehicle.name}
          </p>
          <p className="t-body-sm text-[color:var(--color-muted)]">
            or similar {vehicleClassOf[vehicle.category]}
          </p>

          <div className="t-body-sm mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[color:var(--color-ink)]">
            <span className="flex min-w-0 items-center gap-1.5">
              <Icon
                name="location"
                size={14}
                strokeWidth={2.3}
                className="shrink-0"
              />
              <span className="truncate">{vehicle.location}</span>
            </span>
          </div>

          <VehicleSpecs
            vehicle={vehicle}
            className="mt-3 !text-sm sm:!text-[15px]"
          />
          <div className="mt-3 flex items-center gap-2.5">
            <span className="rounded-md bg-[color:var(--color-success)] px-2 py-0.5 t-caption font-bold tabular text-white">
              {vehicle.rating.toFixed(1)}/5
            </span>
            <span className="border-l border-[color:var(--color-border)] pl-2.5 t-body-sm text-[color:var(--color-ink)]">
              {vehicle.reviewCount} ratings
            </span>
          </div>
        </div>
      </div>

      {/* Price + Book Now: a footer on phones, a right column from lg */}
      <div className="flex items-end justify-between gap-4 border-t border-[color:var(--color-border)] px-4 py-4 sm:px-5 lg:w-[240px] lg:shrink-0 lg:flex-col lg:items-stretch lg:justify-center lg:gap-4 lg:border-l lg:border-t-0 lg:p-6">
        {priceBlock}
        {bookButton}
      </div>
    </div>
  );
}
