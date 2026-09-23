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
import { t, tn } from "../lib/i18n";

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

  const priceBlock = (
    <div className="min-w-0">
      {dayBased && vehicle.strikePrice && (
        <div className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="t-caption font-semibold text-[color:var(--color-danger)]">
            {t("{pct}% off", { pct: discountPct ?? 0 })}
          </span>
          <span className="t-caption t-amount font-normal text-[color:var(--color-muted)] line-through">
            {format(vehicle.strikePrice)}
          </span>
        </div>
      )}
      <div className="flex items-baseline gap-x-1.5 whitespace-nowrap">
        <span className="t-h3 t-amount">{format(price.amount)}</span>
        <span className="t-caption">{t(price.unit)}</span>
      </div>
      <p className="t-caption whitespace-nowrap">{price.note}</p>
    </div>
  );

  const bookButton = (
    // `contents` keeps the button a direct flex child; the handler stops the
    // click reaching the card, which would navigate twice.
    <span className="contents" onClick={(e) => e.stopPropagation()}>
      <Button to={detailsHref} className="h-12 shrink-0 px-7">
        {t("Book Now")}
      </Button>
    </span>
  );

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(detailsHref)}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(detailsHref);
      }}
      className={`${cardLink} flex w-full cursor-pointer flex-col overflow-hidden lg:flex-row lg:items-stretch`}
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
          {canSave && (
            <button
              type="button"
              aria-label={
                saved ? t("Remove from wishlist") : t("Save to wishlist")
              }
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
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="t-h4 truncate">{vehicle.name}</p>
          <p className="t-caption">
            {t("or similar {class}", {
              class: t(vehicleClassOf[vehicle.category]),
            })}
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
          </div>

          <VehicleSpecs vehicle={vehicle} className="mt-3" />
          <div className="mt-3 flex items-center gap-2.5">
            <span className="rounded-full bg-[color:var(--color-success)] px-2 py-0.5 t-caption font-semibold tabular text-white">
              {vehicle.rating.toFixed(1)}/5
            </span>
            <span className="border-l border-[color:var(--color-border)] pl-2.5 t-caption text-[color:var(--color-ink)]">
              {tn(vehicle.reviewCount, "{n} rating", "{n} ratings")}
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
