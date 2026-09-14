import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import type { Vehicle } from "../data/mockData";
import { routes } from "../lib/routes";
import { useCurrency } from "../lib/currency";
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
  bookingParams.set("vehicleId", vehicle.id);
  const detailsHref = `${routes.reviewBooking}?${bookingParams.toString()}`;
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(detailsHref)}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(detailsHref);
      }}
      className={`w-full shrink-0 cursor-pointer overflow-hidden rounded-xl bg-white shadow-[0px_1px_3px_rgba(25,32,36,0.16)] transition-shadow hover:shadow-[0px_4px_18px_rgba(25,32,36,0.22)] ${className}`}
    >
      <div className="relative h-[178px] w-full">
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
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 transition-transform active:scale-90"
        >
          <Icon
            name="heart"
            size={16}
            className={`transition-colors ${saved ? "fill-current text-[color:var(--color-danger)]" : "text-[color:var(--color-ink)]"}`}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <p className="text-base font-bold text-[color:var(--color-ink)]">{vehicle.name}</p>
          <span className="rounded-full bg-[color:var(--color-info-bg)] px-2 py-0.5 text-[9px] font-semibold uppercase text-[color:var(--color-info-text)]">
            {vehicle.category}
          </span>
        </div>
        <div className="mb-2 flex items-center gap-1.5 text-xs text-[color:var(--color-ink)]">
          <Icon name="location" size={14} />
          {vehicle.location}
          <span className="text-[color:var(--color-muted)]">•</span>
          {vehicle.type}
        </div>
        <div className="mb-3 flex items-center gap-3 text-xs text-[color:var(--color-ink)]">
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
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <span className="text-xl font-extrabold text-[color:var(--color-ink)]">{format(vehicle.pricePerDay)}</span>
              <span className="text-xs text-[color:var(--color-ink)]">/day</span>
              {vehicle.strikePrice && (
                <span className="text-xs text-red-500 line-through">{format(vehicle.strikePrice)}</span>
              )}
            </div>
            <p className="text-[10px] text-[color:var(--color-muted)]">incl. taxes & fees</p>
          </div>
          <Link
            to={detailsHref}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 whitespace-nowrap rounded-xl bg-[color:var(--color-ink)] px-5 py-2.5 text-xs font-bold text-white hover:bg-black"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
