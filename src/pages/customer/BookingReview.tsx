import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import BookingStepper from "../../components/BookingStepper";
import {
  StopsCard,
  VehicleSummaryCard,
} from "../../components/BookingRouteCard";
import { vehicles } from "../../data/mockData";
import { routes } from "../../lib/routes";
import {
  addOns,
  computeFare,
  parseAddOnIds,
  RENTAL_DAYS,
} from "../../lib/pricing";
import { useCurrency } from "../../lib/currency";
import { usePageTitle } from "../../hooks/usePageTitle";

const DEFAULT_PICKUP = "Thimphu, Druk School";
const DEFAULT_DROPOFF = "Punakha, Taxi Parking";

const inclusions = [
  "Professional driver",
  "Fuel and tolls",
  "Door-to-door pick-up and drop-off",
  "One meal stop on the way",
  "Free cancellation up to 24 hours before pick-up",
];
const exclusions = [
  "Parking and entry permits",
  "Extra stops beyond the route",
  "Driver accommodation on overnight trips",
];

// Step 1 of checkout: everything about the trip, before any personal
// details are asked for. Add-ons chosen here travel to the next steps as
// an `addons` query param so the price summary can include them.
export default function BookingReview() {
  usePageTitle("Review your booking");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();

  const vehicleId = searchParams.get("vehicleId");
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];
  const pickup = searchParams.get("pickup") || DEFAULT_PICKUP;
  const dropoff = searchParams.get("dropoff") || DEFAULT_DROPOFF;
  const date = searchParams.get("date") || "";

  const [selected, setSelected] = useState<string[]>(() =>
    parseAddOnIds(searchParams.get("addons")),
  );
  const { total } = computeFare(vehicle.pricePerDay, selected);

  function toggle(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }

  function handleContinue() {
    const params = new URLSearchParams(searchParams);
    params.set("vehicleId", vehicle.id);
    if (selected.length) params.set("addons", selected.join(","));
    else params.delete("addons");
    navigate(`${routes.reviewBooking}?${params.toString()}`);
  }

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[1100px] px-4 py-6 pb-28 md:px-10 md:py-10">
        <div className="mb-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="icon-btn -ml-2 size-10"
          >
            <Icon name="chevron-left" size={22} />
          </button>
          <h1 className="t-h2 text-[color:var(--color-ink)]">
            Review your booking
          </h1>
        </div>

        <div className="mb-8">
          <BookingStepper current={1} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
          <div className="min-w-0">
            <VehicleSummaryCard vehicle={vehicle} />

            <h2 className="mt-10 t-h3 text-[color:var(--color-ink)]">
              What&rsquo;s included
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-6 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card sm:grid-cols-2">
              <div>
                <h3 className="t-body font-bold text-[color:var(--color-ink)]">
                  Inclusions
                </h3>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {inclusions.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 t-body text-[color:var(--color-ink-soft)]"
                    >
                      <Icon
                        name="check"
                        size={18}
                        strokeWidth={2.5}
                        className="mt-0.5 shrink-0 text-[color:var(--color-success)]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="t-body font-bold text-[color:var(--color-ink)]">
                  Exclusions
                </h3>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {exclusions.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 t-body text-[color:var(--color-ink-soft)]"
                    >
                      <Icon
                        name="close"
                        size={18}
                        strokeWidth={2.5}
                        className="mt-0.5 shrink-0 text-[color:var(--color-muted)]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h2 className="mt-10 t-h3 text-[color:var(--color-ink)]">
              Add-ons
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {addOns.map((addOn) => {
                const added = selected.includes(addOn.id);
                return (
                  <div
                    key={addOn.id}
                    className={`rounded-2xl border bg-white p-5 shadow-card transition-colors ${
                      added
                        ? "border-[color:var(--color-ink)]"
                        : "border-[color:var(--color-border)]"
                    }`}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="min-w-0">
                        <h3 className="t-h4 text-[color:var(--color-ink)]">
                          {addOn.name}
                        </h3>
                        <p className="mt-1 t-body-sm text-[color:var(--color-ink-soft)]">
                          {addOn.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-right">
                          <span className="block t-body-lg tabular font-bold text-[color:var(--color-ink)]">
                            {format(addOn.pricePerDay)}
                          </span>
                          <span className="block t-caption text-[color:var(--color-muted)]">
                            per day
                          </span>
                        </p>
                        <Button
                          variant={added ? "secondary" : "primary"}
                          size="md"
                          onClick={() => toggle(addOn.id)}
                          aria-pressed={added}
                          className="min-w-[104px]"
                        >
                          {added ? (
                            <span className="flex items-center gap-1.5">
                              <Icon name="check" size={16} strokeWidth={2.5} />
                              Added
                            </span>
                          ) : (
                            "Add"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 hidden justify-end lg:flex">
              <Button variant="primary" size="lg" onClick={handleContinue}>
                Continue to details
              </Button>
            </div>
          </div>

          {/* Right: the stops and the running total, sticky like the price summary on the next step. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <StopsCard pickup={pickup} dropoff={dropoff} date={date} />
            <div className="mt-6 hidden lg:block">
              <div className="flex items-end justify-between gap-3 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card">
                <p className="t-body-sm text-[color:var(--color-muted)]">
                  Total for {RENTAL_DAYS} days
                  <span className="block t-caption">
                    taxes and fees included
                  </span>
                </p>
                <p className="t-h3 tabular text-[color:var(--color-ink)]">
                  {format(total)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-[color:var(--color-border)] bg-white p-4 shadow-[0px_-2px_14px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="flex flex-col items-start">
          <span className="t-h3 tabular text-[color:var(--color-ink)]">
            {format(total)}
          </span>
          <span className="t-caption text-[color:var(--color-muted)]">
            incl. taxes &amp; fees
          </span>
        </div>
        <Button variant="primary" size="lg" onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </PageShell>
  );
}
