import { Link } from "react-router-dom";
import Icon from "./Icon";
import VehicleImage from "./VehicleImage";
import { vehicles } from "../data/mockData";
import { routes } from "../lib/routes";
import { useCurrency } from "../lib/currency";
import { useWishlist } from "../lib/wishlist";

// Saved cars in a bottom sheet, so comparing them mid-search never navigates
// away from the results. "View all" is the way out to the full account page.
export default function WishlistSheet({ onClose, tripQuery = "" }: { onClose: () => void; tripQuery?: string }) {
  const { ids, toggle } = useWishlist();
  const { format } = useCurrency();
  const saved = vehicles.filter((v) => ids.includes(v.id));

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button aria-label="Close" className="animate-scrim-in absolute inset-0 cursor-default bg-black/40" onClick={onClose} />
      <div className="animate-sheet-up relative flex max-h-[80svh] w-full flex-col overflow-hidden rounded-t-2xl bg-white">
        <div className="flex shrink-0 items-center justify-between border-b border-[color:var(--color-border)] px-4 py-4">
          <button type="button" onClick={onClose} aria-label="Close wishlist" className="icon-btn size-10 -ml-2">
            <Icon name="close" size={20} className="text-[color:var(--color-ink)]" />
          </button>
          <h2 className="t-h3 text-[color:var(--color-ink)]">
            Wishlist{saved.length > 0 ? ` (${saved.length})` : ""}
          </h2>
          <span className="w-5" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {saved.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <Icon name="heart" size={28} className="text-[color:var(--color-muted)]" />
              <p className="t-body font-semibold text-[color:var(--color-ink)]">No saved cars yet</p>
              <p className="t-caption text-[color:var(--color-muted)]">
                Tap the heart on any car to keep it here for comparison.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[color:var(--color-border)]">
              {saved.map((vehicle) => {
                const params = new URLSearchParams(tripQuery);
                params.set("vehicleId", vehicle.id);
                return (
                  <li key={vehicle.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="size-16 shrink-0 overflow-hidden rounded-lg">
                      <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-full p-1" />
                    </div>
                    <Link
                      to={`${routes.reviewBooking}?${params.toString()}`}
                      onClick={onClose}
                      className="min-w-0 flex-1"
                    >
                      <p className="t-body truncate font-bold text-[color:var(--color-ink)]">{vehicle.name}</p>
                      <p className="t-caption truncate text-[color:var(--color-muted)]">
                        {vehicle.location} &middot; {vehicle.seats} seats
                      </p>
                      <p className="t-body font-extrabold text-[color:var(--color-ink)]">
                        {format(vehicle.pricePerDay)}
                        <span className="t-caption font-normal"> /day</span>
                      </p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggle(vehicle.id)}
                      aria-label={`Remove ${vehicle.name} from wishlist`}
                      className="icon-btn size-10 shrink-0"
                    >
                      <Icon name="heart" size={18} className="fill-current text-[color:var(--color-danger)]" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="shrink-0 border-t border-[color:var(--color-border)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Link
            to={routes.accountWishlist}
            onClick={onClose}
            className="block w-full rounded-xl border border-[color:var(--color-ink)] py-3 text-center text-sm font-bold text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-soft)]"
          >
            View all
          </Link>
        </div>
      </div>
    </div>
  );
}
