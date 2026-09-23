import { Link } from "react-router-dom";
import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import { vehicles } from "../data/mockData";
import { routes } from "../lib/routes";
import { useCurrency } from "../lib/currency";
import { useWishlist } from "../lib/wishlist";
import { rowHover, sheet } from "../lib/ui";
import Button from "./Button";
import EmptyState from "./EmptyState";
import { t, tn } from "../lib/i18n";

// Saved cars in a bottom sheet, so comparing them mid-search never navigates
// away from the results. "View all" is the way out to the full account page.
export default function WishlistSheet({
  onClose,
  tripQuery = "",
}: {
  onClose: () => void;
  tripQuery?: string;
}) {
  const { ids, toggle } = useWishlist();
  const { format } = useCurrency();
  const saved = vehicles.filter((v) => ids.includes(v.id));

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button
        aria-label={t("Close")}
        className="animate-scrim-in absolute inset-0 cursor-default bg-black/40"
        onClick={onClose}
      />
      <div
        className={`${sheet} relative flex max-h-[80svh] w-full flex-col overflow-hidden`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[color:var(--color-border)] px-4 py-4">
          <h2 className="t-h3">
            {saved.length > 0
              ? t("Wishlist ({n})", { n: saved.length })
              : t("Wishlist")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close wishlist")}
            className="icon-btn icon-btn-filled -mr-1 size-10"
          >
            <Icon
              name="close"
              size={20}
              className="text-[color:var(--color-ink)]"
            />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {saved.length === 0 ? (
            <EmptyState
              icon="heart"
              title={t("No saved cars yet")}
              description={t(
                "Tap the heart on any car to keep it here for comparison.",
              )}
              className="m-4"
            />
          ) : (
            <ul className="divide-y divide-[color:var(--color-border)]">
              {saved.map((vehicle) => {
                const params = new URLSearchParams(tripQuery);
                params.set("vehicleId", vehicle.id);
                return (
                  <li
                    key={vehicle.id}
                    className={`flex items-center gap-3 px-4 py-3 ${rowHover}`}
                  >
                    <div className="size-16 shrink-0 overflow-hidden rounded-xl">
                      <VehicleImage
                        vehicleId={vehicle.id}
                        category={vehicle.category}
                        className="size-full p-1"
                      />
                    </div>
                    <Link
                      to={`${routes.bookingReview}?${params.toString()}`}
                      onClick={onClose}
                      className="min-w-0 flex-1"
                    >
                      <p className="t-h4 truncate">{vehicle.name}</p>
                      <p className="t-caption truncate">
                        {vehicle.location} &middot;{" "}
                        {tn(vehicle.seats, "{n} seat", "{n} seats")}
                      </p>
                      <p className="flex items-baseline gap-x-1.5">
                        <span className="t-h3 t-amount">
                          {format(vehicle.pricePerDay)}
                        </span>
                        <span className="t-caption">{t("/day")}</span>
                      </p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggle(vehicle.id)}
                      aria-label={t("Remove {vehicle} from wishlist", {
                        vehicle: vehicle.name,
                      })}
                      className="icon-btn icon-btn-filled size-10 shrink-0"
                    >
                      <Icon
                        name="heart"
                        size={18}
                        className="fill-current text-[color:var(--color-danger)]"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="shrink-0 border-t border-[color:var(--color-border)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {/* Leaving the page unmounts the sheet, so no onClose needed. */}
          <Button
            to={routes.accountWishlist}
            variant="secondary"
            size="lg"
            fullWidth
            className="h-12"
          >
            {t("View all")}
          </Button>
        </div>
      </div>
    </div>
  );
}
