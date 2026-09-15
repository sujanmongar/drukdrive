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

export default function VehicleCard({
  vehicle,
  className = "",
  tripQuery = "",
}: {
  vehicle: Vehicle;
  className?: string;
  /** Query string (e.g. "pickup=...&dropoff=...&date=...") carried into Review Booking so the trip context picked on Home/SearchResults survives the click-through. */
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
      className={`w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lift ${className}`}
    >
      <div className="relative h-[178px] w-full">
        <VehicleImage
          vehicleId={vehicle.id}
          category={vehicle.category}
          className="size-full p-3"
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
          className="icon-btn icon-btn-filled absolute right-3 top-3 size-9 shadow-card"
        >
          <Icon
            name="heart"
            size={16}
            className={`transition-colors ${saved ? "fill-current text-[color:var(--color-danger)]" : "text-[color:var(--color-ink)]"}`}
          />
        </button>
      </div>
      <div className="p-4">
        <p className="t-h4 truncate text-[color:var(--color-ink)]">
          {vehicle.name}
        </p>
        <p className="t-caption mb-2 text-[color:var(--color-muted)]">
          or similar {vehicleClassOf[vehicle.category]}
        </p>
        <div className="t-caption mb-2 flex items-center gap-x-2 gap-y-1 text-[color:var(--color-ink)]">
          <span className="flex items-center gap-1.5">
            <Icon name="location" size={14} strokeWidth={2.3} />
            {vehicle.location}
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
        <VehicleSpecs vehicle={vehicle} className="mb-3" />
        <div className="flex items-end justify-between gap-x-2 gap-y-2">
          <div className="min-w-0 flex-1">
            {dayBased && vehicle.strikePrice && (
              <div className="flex items-baseline gap-1.5">
                <span className="t-caption font-semibold text-[color:var(--color-danger)]">
                  {discountPct}% off
                </span>
                <span className="t-caption text-[color:var(--color-muted)] line-through">
                  {format(vehicle.strikePrice)}
                </span>
              </div>
            )}
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <span className="t-h3 font-bold text-[color:var(--color-ink)]">
                {format(price.amount)}
              </span>
              <span className="t-caption text-[color:var(--color-ink)]">
                {price.unit}
              </span>
            </div>
            <p className="t-label text-[color:var(--color-muted)]">
              {price.note}
            </p>
          </div>
          <Link
            to={detailsHref}
            onClick={(e) => e.stopPropagation()}
            className="hidden shrink-0 whitespace-nowrap rounded-xl bg-[color:var(--color-ink)] px-5 py-2.5 t-caption font-bold text-white transition-all duration-200 hover:bg-black lg:inline-flex"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
