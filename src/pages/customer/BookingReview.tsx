import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import AddOnCard from "../../components/AddOnCard";
import { Checkbox } from "../../components/CheckboxRow";
import BookingStepper from "../../components/BookingStepper";
import {
  StopsCard,
  VehicleSummaryCard,
} from "../../components/BookingRouteCard";
import CheckoutLayout from "../../components/CheckoutLayout";
import PriceSummaryCard from "../../components/PriceSummaryCard";
import ContactCard from "../../components/ContactCard";
import { vehicles } from "../../data/mockData";
import { routes } from "../../lib/routes";
import {
  addOnsFor,
  computeFare,
  isAddOnId,
  paymentSplit,
  promoDiscount,
} from "../../lib/pricing";
import { inclusionsFor, notesFor } from "../../lib/bookingContent";
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

  const booking = parseBooking(searchParams, isAddOnId);
  const vehicle =
    vehicles.find((v) => v.id === booking.vehicleId) ?? vehicles[0];
  const { pickup, dropoff } = booking;
  const date = formatPickup(booking);

  const addOns = addOnsFor(booking.type);
  const inclusions = inclusionsFor(booking.type);
  const notes = notesFor(booking.type);
  const searchHref = `${routes.search}?${bookingToParams(booking).toString()}`;
  const [notesOpen, setNotesOpen] = useState(false);
  const selfDrive = booking.type === "self-drive";
  // Self drive needs a licence Bhutan accepts; the driver confirms it here.
  const [licenceConfirmed, setLicenceConfirmed] = useState(false);
  const licenceGate = selfDrive && !licenceConfirmed;
  const [selected, setSelected] = useState<string[]>(booking.addOnIds);
  const fare = computeFare(
    { ...booking, addOnIds: selected },
    vehicle.pricePerDay,
    format,
  );
  const { total } = fare;
  const promoCode = searchParams.get("promo");
  const discount = promoDiscount(promoCode, total);
  const netPayable = Math.round((total - discount) * 100) / 100;
  const split = paymentSplit(booking, netPayable);

  function toggle(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }

  function handleContinue() {
    // Start from what the URL already holds — a promo or details typed on a
    // later step survive a trip back to Review — and overlay the trip.
    const params = new URLSearchParams(searchParams);
    params.delete("addons");
    bookingToParams({
      ...booking,
      vehicleId: vehicle.id,
      addOnIds: selected,
    }).forEach((v, k) => params.set(k, v));
    navigate(`${routes.reviewBooking}?${params.toString()}`);
  }

  return (
    <PageShell noFooter stickyHeader>
      <div className="mx-auto max-w-[1100px] px-4 pb-28 pt-6 md:px-10 md:pt-10 lg:pb-10">
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
          <BookingStepper
            current={2}
            hrefs={[searchHref]}
            detailsLabel={selfDrive ? "Driver details" : "Your details"}
          />
        </div>

        <CheckoutLayout
          vehicle={<VehicleSummaryCard vehicle={vehicle} />}
          trip={
            <StopsCard
              pickup={pickup}
              dropoff={dropoff}
              date={date}
              dropoffWhen={formatDropoff(booking)}
            />
          }
          price={
            <>
              <PriceSummaryCard
                fare={fare}
                netPayable={netPayable}
                payNow={split.now}
                payLater={split.later}
                discount={discount}
                promoCode={promoCode}
              />
              {booking.type === "rental" && (
                <p className="mt-2 px-1 t-caption text-[color:var(--color-muted)]">
                  Bhutan&rsquo;s Sustainable Development Fee is not included;
                  visitors pay it with their visa.
                </p>
              )}
            </>
          }
          help={<ContactCard />}
          main={
            <>
              {selfDrive && (
                <div className="flex gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-warning-bg)] text-[color:var(--color-warning)]">
                    <Icon name="info" size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="t-h4">Licence check</p>
                    <p className="mt-1 t-body-sm">
                      Bhutan accepts Bhutanese and Indian driving licences only,
                      not international driving permits.
                    </p>
                    <div className="mt-2">
                      <Checkbox
                        align="start"
                        checked={licenceConfirmed}
                        onChange={setLicenceConfirmed}
                        label="I hold a valid Bhutanese or Indian driving licence and am 21 or over."
                      />
                    </div>
                  </div>
                </div>
              )}

              <h2 className="mt-10 t-h3 text-[color:var(--color-ink)]">
                What&rsquo;s included
              </h2>
              <div className="mt-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card">
                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
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

              <div className="mt-10 rounded-2xl border border-[color:var(--color-border)] bg-white shadow-card">
                <button
                  type="button"
                  onClick={() => setNotesOpen((v) => !v)}
                  aria-expanded={notesOpen}
                  className="flex min-h-14 w-full items-center justify-between gap-3 px-5 text-left"
                >
                  <span className="t-h3 text-[color:var(--color-ink)]">
                    Read before you book
                  </span>
                  <Icon
                    name="chevron-down"
                    size={20}
                    className={`shrink-0 text-[color:var(--color-muted)] transition-transform duration-200 ${notesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {notesOpen && (
                  <div className="animate-popover border-t border-[color:var(--color-border)] px-5 pb-5 pt-4">
                    {notes.map((note, i) => (
                      <div key={note.title} className={i > 0 ? "mt-4" : ""}>
                        <h4 className="t-body font-bold text-[color:var(--color-ink)]">
                          {note.title}
                        </h4>
                        <ul className="mt-2 list-disc space-y-1.5 pl-4 t-body text-[color:var(--color-ink-soft)]">
                          {note.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
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
            </>
          }
        />
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-[color:var(--color-border)] bg-white p-4 shadow-[0px_-2px_14px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="flex flex-col items-start">
          <span className="t-h3 t-amount">{format(netPayable)}</span>
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
