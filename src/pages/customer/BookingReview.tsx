import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import AddOnCard from "../../components/AddOnCard";
import BookingStepper from "../../components/BookingStepper";
import {
  StopsCard,
  VehicleSummaryCard,
} from "../../components/BookingRouteCard";
import { vehicles } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { addOnsFor, computeFare, isAddOnId } from "../../lib/pricing";
import { exclusionsFor, inclusionsFor } from "../../lib/bookingContent";
import { useClientType } from "../../lib/clientType";
import ClientTypeSwitch from "../../components/ClientTypeSwitch";
import {
  bookingToParams,
  formatDropoff,
  formatPickup,
  parseBooking,
} from "../../lib/booking";
import { useCurrency } from "../../lib/currency";
import { usePageTitle } from "../../hooks/usePageTitle";

// Step 1 of checkout: everything about the trip, before any personal
// details are asked for. Add-ons chosen here travel to the next steps as
// an `addons` query param so the price summary can include them.
export default function BookingReview() {
  usePageTitle("Review your booking");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();

  const { clientType } = useClientType();
  const booking = parseBooking(searchParams, isAddOnId);
  const vehicle =
    vehicles.find((v) => v.id === booking.vehicleId) ?? vehicles[0];
  const { pickup, dropoff } = booking;
  const date = formatPickup(booking);

  const addOns = addOnsFor(booking.type, clientType);
  const inclusions = inclusionsFor(booking.type, clientType);
  const exclusions = exclusionsFor(booking.type, clientType);
  const selfDrive = booking.type === "self-drive";
  // Visitors may only self-drive on an Indian licence; they confirm it here.
  const [licenceConfirmed, setLicenceConfirmed] = useState(false);
  const licenceGate =
    selfDrive && clientType === "tourist" && !licenceConfirmed;
  const [selected, setSelectedRaw] = useState<string[]>(booking.addOnIds);
  const setSelected = (fn: (s: string[]) => string[]) =>
    setSelectedRaw((s) =>
      fn(s).filter((id) => addOns.some((a) => a.id === id)),
    );
  const fare = computeFare(
    { ...booking, addOnIds: selected },
    vehicle.pricePerDay,
    format,
  );
  const { total } = fare;

  function toggle(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }

  function handleContinue() {
    const params = bookingToParams({
      ...booking,
      vehicleId: vehicle.id,
      addOnIds: selected,
    });
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
          <ClientTypeSwitch className="ml-auto" />
        </div>

        <div className="mb-8">
          <BookingStepper current={1} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
          <div className="min-w-0">
            <VehicleSummaryCard vehicle={vehicle} />

            {selfDrive && clientType === "tourist" && (
              <div className="mt-6 rounded-2xl border border-[color:var(--color-warning)]/40 bg-[color:var(--color-warning-bg)] p-5">
                <p className="t-body font-bold text-[color:var(--color-warning)]">
                  Self drive is for Indian licence holders only
                </p>
                <p className="mt-1 t-body-sm text-[color:var(--color-ink-soft)]">
                  Bhutan does not accept international driving permits. Visitors
                  from other countries can book a rental with a driver instead.
                </p>
                <label className="mt-3 flex cursor-pointer items-start gap-2.5 t-body-sm text-[color:var(--color-ink)]">
                  <input
                    type="checkbox"
                    checked={licenceConfirmed}
                    onChange={(e) => setLicenceConfirmed(e.target.checked)}
                    className="mt-0.5 size-4 accent-[color:var(--color-ink)]"
                  />
                  I hold a valid Indian driving licence and am 21 or over.
                </label>
              </div>
            )}

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
              {addOns.map((addOn) => (
                <AddOnCard
                  key={addOn.id}
                  addOn={addOn}
                  added={selected.includes(addOn.id)}
                  price={format(addOn.pricePerDay)}
                  onToggle={() => toggle(addOn.id)}
                />
              ))}
            </div>

            <div className="mt-8 hidden justify-end lg:flex">
              <Button
                variant="primary"
                size="lg"
                onClick={handleContinue}
                disabled={licenceGate}
              >
                Continue to details
              </Button>
            </div>
          </div>

          {/* Right: the stops and the running total, sticky like the price summary on the next step. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <StopsCard
              pickup={pickup}
              dropoff={dropoff}
              date={date}
              dropoffWhen={formatDropoff(booking)}
            />
            <div className="mt-6 hidden lg:block">
              <div className="flex items-end justify-between gap-3 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card">
                <p className="t-body-sm text-[color:var(--color-muted)]">
                  Total for {fare.unit}
                  <span className="block t-caption">
                    taxes and fees included
                  </span>
                </p>
                <p className="t-h3 tabular text-[color:var(--color-ink)]">
                  {format(total)}
                </p>
              </div>
              {fare.deposit > 0 && (
                <p className="mt-2 px-1 t-caption text-[color:var(--color-muted)]">
                  Plus a refundable deposit of{" "}
                  <span className="tabular font-semibold text-[color:var(--color-ink)]">
                    {format(fare.deposit)}
                  </span>
                  , held at collection.
                </p>
              )}
              {clientType === "tourist" && booking.type !== "self-drive" && (
                <p className="mt-2 px-1 t-caption text-[color:var(--color-muted)]">
                  Bhutan&rsquo;s Sustainable Development Fee is not included; it
                  is paid with your visa.
                </p>
              )}
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
            {fare.deposit > 0
              ? `+ ${format(fare.deposit)} deposit`
              : "incl. taxes & fees"}
          </span>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={licenceGate}
        >
          Continue
        </Button>
      </div>
    </PageShell>
  );
}
