import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { vehicles } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { RENTAL_DAYS, computeFare } from "../../lib/pricing";
import { useCurrency } from "../../lib/currency";

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [summaryOpen, setSummaryOpen] = useState(false);

  const vehicle = vehicles.find((v) => v.id === id) ?? vehicles[0];

  const { baseFare: basePrice, taxes, total } = computeFare(vehicle.pricePerDay);

  function handleContinue() {
    navigate(`${routes.reviewBooking}?vehicleId=${vehicle.id}`);
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-[1440px] px-4 py-6 pb-28 md:px-[60px] md:py-10 md:pb-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-[#222] hover:underline"
        >
          <Icon name="arrow-left" size={16} />
          Back to results
        </button>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left: gallery + details */}
          <div className="min-w-0 flex-1">
            <div className="overflow-hidden rounded-xl">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="h-[240px] w-full object-cover sm:h-[340px] md:h-[420px]"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold text-[#222] md:text-3xl">{vehicle.name}</h1>
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
                <span className="text-sm font-bold text-[#222]">{vehicle.rating}</span>
                <span className="text-sm text-[color:var(--color-muted)]">({vehicle.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Specs */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] py-4">
                <Icon name="seat" size={20} className="text-[#222]" />
                <span className="text-sm font-semibold text-[#222]">{vehicle.seats} Seats</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] py-4">
                <Icon name="fuel" size={20} className="text-[#222]" />
                <span className="text-sm font-semibold text-[#222]">{vehicle.fuel}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] py-4">
                <Icon name="car" size={20} className="text-[#222]" />
                <span className="text-sm font-semibold text-[#222]">{vehicle.category}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] py-4">
                <Icon name="clock" size={20} className="text-[#222]" />
                <span className="text-sm font-semibold text-[#222]">{RENTAL_DAYS} Days</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="mb-2 text-lg font-bold text-[#222]">About this vehicle</h2>
              <p className="text-sm leading-relaxed text-[#333]">
                The {vehicle.name} is a well-maintained {vehicle.category.toLowerCase()} built for Bhutan's mountain
                roads, offering a comfortable ride between Thimphu, Paro and Punakha with confident handling on
                winding highway passes. Every trip includes an experienced local driver who knows the road
                conditions and permit checkpoints, so you can relax and take in the views.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#333]">
                Regularly serviced and cleaned between rentals, this vehicle comes with {vehicle.seats} comfortable
                seats, ample luggage space and a {vehicle.fuel.toLowerCase()} engine suited to both city driving and
                longer outstation journeys.
              </p>
            </div>
          </div>

          {/* Right: sticky booking summary (desktop) */}
          <div className="hidden w-[340px] shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
              <h2 className="text-base font-bold text-[#222]">Fare Summary</h2>
              <div className="mt-4 flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between text-[#333]">
                  <span>
                    Base fare × {RENTAL_DAYS} days
                  </span>
                  <span className="font-medium text-[#222]">{format(basePrice)}</span>
                </div>
                <div className="flex justify-between text-[#333]">
                  <span>Taxes & fees (10%)</span>
                  <span className="font-medium text-[#222]">{format(taxes)}</span>
                </div>
                <div className="mt-1 flex justify-between border-t border-[color:var(--color-border)] pt-3 text-base font-extrabold text-[#222]">
                  <span>Total</span>
                  <span>{format(total)}</span>
                </div>
              </div>
              <Button variant="primary" size="lg" fullWidth className="mt-5" onClick={handleContinue}>
                Continue to Booking
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--color-border)] bg-white p-4 shadow-[0px_-2px_14px_rgba(0,0,0,0.08)] lg:hidden">
        {summaryOpen && (
          <div className="mb-3 flex flex-col gap-2 border-b border-[color:var(--color-border)] pb-3 text-sm">
            <div className="flex justify-between text-[#333]">
              <span>Base fare × {RENTAL_DAYS} days</span>
              <span className="font-medium text-[#222]">{format(basePrice)}</span>
            </div>
            <div className="flex justify-between text-[#333]">
              <span>Taxes & fees (10%)</span>
              <span className="font-medium text-[#222]">{format(taxes)}</span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setSummaryOpen((v) => !v)}
            className="flex flex-col items-start"
          >
            <span className="flex items-center gap-1 text-lg font-extrabold text-[#222]">
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
