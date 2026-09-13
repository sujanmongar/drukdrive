import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import VehicleImage from "../../components/VehicleImage";
import BookingStepper from "../../components/BookingStepper";
import { vehicles, reviews } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { RENTAL_DAYS, computeFare } from "../../lib/pricing";
import { useCurrency } from "../../lib/currency";
import { useWishlist } from "../../lib/wishlist";
import { formatTripDate } from "../../lib/formatTripDate";
import { usePageTitle } from "../../hooks/usePageTitle";

const DEFAULT_PICKUP = "Thimphu, Druk School";
const DEFAULT_DROPOFF = "Punakha, Taxi Parking";

const included = [
  { icon: "car" as const, label: "Pick up & drop-off at your location" },
  { icon: "user" as const, label: "Experienced, licensed local driver" },
  { icon: "check-circle" as const, label: "Sanitized and inspected before every trip" },
  { icon: "clock" as const, label: "Free cancellation up to 24 hours before pickup" },
];

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();
  const { isSaved, toggle } = useWishlist();
  const [summaryOpen, setSummaryOpen] = useState(false);

  const vehicle = vehicles.find((v) => v.id === id) ?? vehicles[0];
  usePageTitle(vehicle.name);
  const saved = isSaved(vehicle.id);

  const pickup = searchParams.get("pickup") || DEFAULT_PICKUP;
  const dropoff = searchParams.get("dropoff") || DEFAULT_DROPOFF;
  const date = searchParams.get("date") || formatTripDate(new Date(), "10:00");

  const { baseFare: basePrice, taxes, total } = computeFare(vehicle.pricePerDay);
  const previewReviews = reviews.slice(0, 2);

  function handleContinue() {
    const params = new URLSearchParams({ vehicleId: vehicle.id, pickup, dropoff, date });
    navigate(`${routes.reviewBooking}?${params.toString()}`);
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-[1440px] px-4 py-6 pb-28 md:px-[60px] md:py-10 md:pb-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-ink)] hover:underline"
        >
          <Icon name="arrow-left" size={16} />
          Back to results
        </button>

        <div className="mb-6">
          <BookingStepper current={1} />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-neutral-50 px-4 py-3 text-sm">
          <span className="flex items-center gap-1.5 text-[color:var(--color-ink)]">
            <Icon name="location" size={15} className="text-[color:var(--color-muted)]" />
            <span className="font-semibold">{pickup}</span>
            <Icon name="chevron-right" size={13} className="text-[color:var(--color-muted)]" />
            <span className="font-semibold">{dropoff}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[color:var(--color-muted)]">
            <Icon name="calendar" size={15} />
            {date}
          </span>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left: gallery + details */}
          <div className="min-w-0 flex-1">
            <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] shadow-[var(--shadow-card)]">
              <VehicleImage
                vehicleId={vehicle.id}
                category={vehicle.category}
                className="h-[260px] w-full sm:h-[360px] md:h-[440px]"
              />
              <button
                type="button"
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                aria-pressed={saved}
                onClick={() => toggle(vehicle.id)}
                className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/95 shadow-[var(--shadow-popup)] transition-transform active:scale-90"
              >
                <Icon
                  name="heart"
                  size={18}
                  className={saved ? "fill-current text-[color:var(--color-danger)]" : "text-[color:var(--color-ink)]"}
                />
              </button>
              {vehicle.strikePrice && (
                <span className="absolute left-4 top-4 rounded-full bg-[color:var(--color-success)] px-3 py-1.5 text-xs font-bold text-white shadow-[var(--shadow-popup)]">
                  Special offer
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold text-[color:var(--color-ink)] md:text-3xl">{vehicle.name}</h1>
                  <span className="rounded-full bg-[color:var(--color-info-bg)] px-2.5 py-1 text-[10px] font-semibold uppercase text-[color:var(--color-info-text)]">
                    {vehicle.category}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-sm text-[color:var(--color-muted)]">
                  <Icon name="location" size={15} />
                  {vehicle.location}
                  <span>•</span>
                  {vehicle.type}
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-[#f8f8f8] px-3 py-1.5">
                <Icon name="star" size={16} className="fill-current text-amber-400" />
                <span className="text-sm font-bold text-[color:var(--color-ink)]">{vehicle.rating}</span>
                <span className="text-sm text-[color:var(--color-muted)]">({vehicle.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["Free cancellation", "Sanitized vehicle", "Verified driver"].map((label) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full border border-[color:var(--color-border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-ink-soft)]"
                >
                  <Icon name="check" size={12} className="text-[color:var(--color-success)]" />
                  {label}
                </span>
              ))}
            </div>

            {/* Specs */}
            <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] p-5">
              <h2 className="text-base font-bold text-[color:var(--color-ink)]">Vehicle specifications</h2>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <span className="flex size-10 items-center justify-center rounded-full bg-neutral-100">
                    <Icon name="seat" size={18} className="text-[color:var(--color-ink)]" />
                  </span>
                  <span className="text-sm font-semibold text-[color:var(--color-ink)]">{vehicle.seats} Seats</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <span className="flex size-10 items-center justify-center rounded-full bg-neutral-100">
                    <Icon name="fuel" size={18} className="text-[color:var(--color-ink)]" />
                  </span>
                  <span className="text-sm font-semibold text-[color:var(--color-ink)]">{vehicle.fuel}</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <span className="flex size-10 items-center justify-center rounded-full bg-neutral-100">
                    <Icon name="car" size={18} className="text-[color:var(--color-ink)]" />
                  </span>
                  <span className="text-sm font-semibold text-[color:var(--color-ink)]">{vehicle.category}</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <span className="flex size-10 items-center justify-center rounded-full bg-neutral-100">
                    <Icon name="clock" size={18} className="text-[color:var(--color-ink)]" />
                  </span>
                  <span className="text-sm font-semibold text-[color:var(--color-ink)]">{RENTAL_DAYS} Days</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="mb-2 text-lg font-bold text-[color:var(--color-ink)]">About this vehicle</h2>
              <p className="text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                The {vehicle.name} is a well-maintained {vehicle.category.toLowerCase()} built for Bhutan's mountain
                roads, offering a comfortable ride between Thimphu, Paro and Punakha with confident handling on
                winding highway passes. Every trip includes an experienced local driver who knows the road
                conditions and permit checkpoints, so you can relax and take in the views.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                Regularly serviced and cleaned between rentals, this vehicle comes with {vehicle.seats} comfortable
                seats, ample luggage space and a {vehicle.fuel.toLowerCase()} engine suited to both city driving and
                longer outstation journeys.
              </p>
            </div>

            {/* What's included */}
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-[color:var(--color-ink)]">What&rsquo;s included</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {included.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-[color:var(--color-border)] px-4 py-3"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-success-bg)]">
                      <Icon name={item.icon} size={16} className="text-[color:var(--color-success)]" />
                    </span>
                    <span className="text-sm font-medium text-[color:var(--color-ink-soft)]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[color:var(--color-ink)]">Reviews</h2>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-ink)]">
                  <Icon name="star" size={15} className="fill-current text-amber-400" />
                  {vehicle.rating} · {vehicle.reviewCount} reviews
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {previewReviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-[color:var(--color-border)] p-4">
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt="" className="size-9 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--color-ink)]">{r.author}</p>
                        <p className="text-xs text-[color:var(--color-muted)]">{r.date}</p>
                      </div>
                      <span className="ml-auto flex items-center gap-1 text-xs font-bold text-[color:var(--color-ink)]">
                        <Icon name="star" size={12} className="fill-current text-amber-400" />
                        {r.rating}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: sticky booking summary (desktop) */}
          <div className="hidden w-[340px] shrink-0 lg:block">
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] p-4">
                <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-14 shrink-0 rounded-lg" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[color:var(--color-ink)]">{vehicle.name}</p>
                  <p className="text-xs text-[color:var(--color-muted)]">{vehicle.type}</p>
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-base font-bold text-[color:var(--color-ink)]">Fare Summary</h2>
                <div className="mt-4 flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between text-[color:var(--color-ink-soft)]">
                    <span>Base fare × {RENTAL_DAYS} days</span>
                    <span className="font-medium text-[color:var(--color-ink)]">{format(basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-[color:var(--color-ink-soft)]">
                    <span>Taxes & fees (10%)</span>
                    <span className="font-medium text-[color:var(--color-ink)]">{format(taxes)}</span>
                  </div>
                  <div className="mt-1 flex justify-between border-t border-[color:var(--color-border)] pt-3 text-base font-extrabold text-[color:var(--color-ink)]">
                    <span>Total</span>
                    <span>{format(total)}</span>
                  </div>
                </div>
                <Button variant="primary" size="lg" fullWidth className="mt-5" onClick={handleContinue}>
                  Continue to Booking
                </Button>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-[color:var(--color-muted)]">
                  <Icon name="check-circle" size={13} className="text-[color:var(--color-success)]" />
                  Free cancellation up to 24 hours before pickup
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--color-border)] bg-white p-4 shadow-[0px_-2px_14px_rgba(0,0,0,0.08)] lg:hidden">
        {summaryOpen && (
          <div className="mb-3 flex flex-col gap-2 border-b border-[color:var(--color-border)] pb-3 text-sm">
            <div className="flex justify-between text-[color:var(--color-ink-soft)]">
              <span>Base fare × {RENTAL_DAYS} days</span>
              <span className="font-medium text-[color:var(--color-ink)]">{format(basePrice)}</span>
            </div>
            <div className="flex justify-between text-[color:var(--color-ink-soft)]">
              <span>Taxes & fees (10%)</span>
              <span className="font-medium text-[color:var(--color-ink)]">{format(taxes)}</span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between gap-4">
          <button type="button" onClick={() => setSummaryOpen((v) => !v)} className="flex flex-col items-start">
            <span className="flex items-center gap-1 text-lg font-extrabold text-[color:var(--color-ink)]">
              {format(total)}
              <Icon name={summaryOpen ? "chevron-down" : "chevron-right"} size={14} className="text-[color:var(--color-muted)]" />
            </span>
            <span className="text-[11px] text-[color:var(--color-muted)]">incl. taxes & fees</span>
          </button>
          <Button variant="primary" size="lg" onClick={handleContinue}>
            Continue to Booking
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
