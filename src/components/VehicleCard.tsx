import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import VehicleSpecs from "./VehicleSpecs";
import { vehicleClassOf, type Vehicle } from "../data/mockData";
import { routes } from "../lib/routes";
import { useCurrency } from "../lib/currency";
import { parseSearch } from "../lib/booking";
import { displayPrice } from "../lib/pricing";
import { useWishlist } from "../lib/wishlist";
import { cardLink } from "../lib/ui";
import Button from "./Button";

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
  const { enabled: canSave, isSaved, toggle } = useWishlist();
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
      className={`${cardLink} w-full shrink-0 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="relative h-[178px] w-full">
        <VehicleImage
          vehicleId={vehicle.id}
          category={vehicle.category}
          transparent
          className="size-full p-3"
        />
        {canSave && (
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
        )}
      </div>
      <div className="p-4">
        <p className="t-h4 truncate">{vehicle.name}</p>
        <p className="t-caption mb-2">
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
                <span className="t-caption t-amount font-normal text-[color:var(--color-muted)] line-through">
                  {format(vehicle.strikePrice)}
                </span>
              </div>
            )}
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <span className="t-h3 t-amount">{format(price.amount)}</span>
              <span className="t-caption">{price.unit}</span>
            </div>
            <p className="t-caption">{price.note}</p>
          </div>
          {/* Stops the click reaching the card, which would navigate twice. */}
          <div
            className="hidden shrink-0 lg:flex"
            onClick={(e) => e.stopPropagation()}
          >
            <Button to={detailsHref} className="px-5">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
