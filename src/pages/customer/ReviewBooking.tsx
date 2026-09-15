import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import AddOnCard from "../../components/AddOnCard";
import BookingStepper from "../../components/BookingStepper";
import BookingRouteCard from "../../components/BookingRouteCard";
import FareSummary from "../../components/FareSummary";
import { vehicles } from "../../data/mockData";
import { routes } from "../../lib/routes";
import {
  addOnsFor,
  computeFare,
  isAddOnId,
  paymentSplit,
} from "../../lib/pricing";
import {
  identityLabel,
  needsFlightNumber,
  notesFor,
} from "../../lib/bookingContent";
import { useClientType } from "../../lib/clientType";
import { currencies } from "../../lib/currency";
import {
  bookingToParams,
  formatDropoff,
  formatPickup,
  parseBooking,
} from "../../lib/booking";
import { useCurrency } from "../../lib/currency";
import { useAuth } from "../../lib/auth";
import { useCurrentUser } from "../../lib/currentUser";
import { usePageTitle } from "../../hooks/usePageTitle";

const PROMO_CODES: Record<string, number> = {
  DRUK10: 0.1,
  WELCOME: 0.05,
};

export default function ReviewBooking() {
  usePageTitle("Your details");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { format, currency } = useCurrency();
  const { clientType } = useClientType();
  const { isLoggedIn } = useAuth();
  const { user } = useCurrentUser();

  const booking = parseBooking(searchParams, isAddOnId);
  const vehicle =
    vehicles.find((v) => v.id === booking.vehicleId) ?? vehicles[0];
  const { addOnIds, pickup, dropoff } = booking;
  const date = formatPickup(booking);
  // Add-ons can still be changed here; the URL stays the source of truth so
  // a refresh or back-navigation keeps the choice.
  function toggleAddOn(id: string) {
    const next = addOnIds.includes(id)
      ? addOnIds.filter((x) => x !== id)
      : [...addOnIds, id];
    setSearchParams(bookingToParams({ ...booking, addOnIds: next }), {
      replace: true,
    });
  }
  const fare = computeFare(booking, vehicle.pricePerDay, format);
  const { total } = fare;
  const addOns = addOnsFor(booking.type, clientType);
  const selfDrive = booking.type === "self-drive";
  const askFlight = needsFlightNumber(clientType, pickup, dropoff);
  const notes = notesFor(booking.type, clientType);
  // Visitors see the ngultrum amount too, since the balance is paid locally.
  const nu = currencies.find((c) => c.code === "BTN")!;
  const inNu = (usd: number) =>
    `${nu.symbol} ${Math.round(usd * nu.rateFromUsd).toLocaleString()}`;
  const showNu = clientType === "tourist" && currency !== "BTN";

  // Already signed in? Skip retyping — pull the traveler's details straight
  // from their account instead of starting from blank fields.
  const [title, setTitle] = useState(
    isLoggedIn && user.gender === "Female" ? "Ms" : "Mr",
  );
  const [fullName, setFullName] = useState(isLoggedIn ? user.name : "");
  const [phone, setPhone] = useState(isLoggedIn ? user.phone : "");
  const [email, setEmail] = useState(isLoggedIn ? user.email : "");
  const [pickupAddress, setPickupAddress] = useState(pickup);
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [identity, setIdentity] = useState("");
  const [flight, setFlight] = useState("");
  const [licence, setLicence] = useState("");
  const [dob, setDob] = useState("");
  const [touched, setTouched] = useState(false);

  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [promoError, setPromoError] = useState("");

  const discount = promoApplied
    ? Math.round(total * promoApplied.discount * 100) / 100
    : 0;
  const netPayable = Math.round((total - discount) * 100) / 100;
  // Daily rides are paid in full; rentals and self-drive pay half now and
  // the other half to the driver at pick-up.
  const split = paymentSplit(booking, netPayable);
  const amountDue = split.now;

  const isValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    pickupAddress.trim() !== "" &&
    identity.trim() !== "" &&
    (!selfDrive || (licence.trim() !== "" && dob.trim() !== ""));

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const rate = PROMO_CODES[code];
    if (rate) {
      setPromoApplied({ code, discount: rate });
      setPromoError("");
    } else {
      setPromoApplied(null);
      setPromoError("Invalid promo code");
    }
  }

  function handleProceed() {
    if (!isValid) {
      setTouched(true);
      return;
    }
    const params = bookingToParams(
      {
        ...booking,
        vehicleId: vehicle.id,
        pickup: pickupAddress,
        dropoff: dropoffAddress || dropoff,
      },
      {
        total: netPayable.toFixed(2),
        grandTotal: total.toFixed(2),
        amountDue: amountDue.toFixed(2),
        paymentOption: split.later > 0 ? "half" : "full",
        travelerName: fullName,
        travelerEmail: email,
        travelerPhone: phone,
        travelerId: identity,
        clientType,
        ...(flight ? { flight } : {}),
        ...(selfDrive ? { licence, dob } : {}),
      },
    );
    navigate(`${routes.payment}?${params.toString()}`);
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-[color:var(--color-border)] px-3.5 t-body text-[color:var(--color-ink)] outline-none placeholder:text-[color:var(--color-muted)] focus:border-[color:var(--color-ink)]";
  const labelClass =
    "mb-1.5 block t-body-sm font-semibold text-[color:var(--color-ink)]";
  const errorClass = "border-[color:var(--color-danger)]";

  const payButtonLabel = `Pay ${format(amountDue)} now`;

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[1100px] px-4 py-6 pb-28 md:px-10 md:py-10 md:pb-10">
        <div className="mb-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="icon-btn -ml-2 size-10"
          >
            <Icon name="chevron-left" size={22} />
          </button>
          <h1 className="t-h2 text-[color:var(--color-ink)]">Your details</h1>
        </div>

        <div className="mb-8">
          <BookingStepper current={2} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: booking details + personal info */}
          <div className="min-w-0 max-w-[640px]">
            <BookingRouteCard
              vehicle={vehicle}
              pickup={pickup}
              dropoff={dropoff}
              date={date}
              dropoffWhen={formatDropoff(booking)}
            />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <h2 className="t-h3 text-[color:var(--color-ink)]">
                Personal Information
              </h2>
              {!isLoggedIn && (
                <Link
                  to={routes.signIn}
                  className="rounded-lg bg-[color:var(--color-info-bg)] px-3 py-1.5 t-body-sm font-semibold text-[color:var(--color-info-text)] hover:opacity-90"
                >
                  Sign in/signup to speed up your booking process ↗
                </Link>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-4 shadow-card sm:p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[110px_1fr]">
                <label>
                  <span className={labelClass}>Title</span>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                  >
                    {["Mr", "Mrs", "Ms"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className={labelClass}>Full Name *</span>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`${inputClass} ${touched && !fullName.trim() ? errorClass : ""}`}
                  />
                  {touched && !fullName.trim() && (
                    <p className="mt-1 t-caption text-[color:var(--color-danger)]">
                      Full name is required.
                    </p>
                  )}
                </label>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label>
                  <span className={labelClass}>
                    Phone *{" "}
                    {clientType === "tourist"
                      ? "(WhatsApp preferred)"
                      : "(Your confirmation code will be sent here)"}
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`${inputClass} ${touched && !phone.trim() ? errorClass : ""}`}
                  />
                  {touched && !phone.trim() && (
                    <p className="mt-1 t-caption text-[color:var(--color-danger)]">
                      Phone number is required.
                    </p>
                  )}
                </label>
                <label>
                  <span className={labelClass}>
                    Email * (Your E-ticket and updates will be sent here)
                  </span>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputClass} ${touched && !email.trim() ? errorClass : ""}`}
                  />
                  {touched && !email.trim() && (
                    <p className="mt-1 t-caption text-[color:var(--color-danger)]">
                      Email is required.
                    </p>
                  )}
                </label>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label>
                  <span className={labelClass}>Pickup address *</span>
                  <input
                    type="text"
                    placeholder="Pickup address/landmark"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className={`${inputClass} ${touched && !pickupAddress.trim() ? errorClass : ""}`}
                  />
                </label>
                <label>
                  <span className={labelClass}>
                    Drop off address (Optional)
                  </span>
                  <input
                    type="text"
                    placeholder="Drop address/landmark"
                    value={dropoffAddress}
                    onChange={(e) => setDropoffAddress(e.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label>
                  <span className={labelClass}>
                    {identityLabel(clientType)} *
                  </span>
                  <input
                    type="text"
                    placeholder={
                      clientType === "tourist"
                        ? "As shown in your passport"
                        : "11-digit CID"
                    }
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    className={`${inputClass} ${touched && !identity.trim() ? errorClass : ""}`}
                  />
                  {touched && !identity.trim() && (
                    <p className="mt-1 t-caption text-[color:var(--color-danger)]">
                      {identityLabel(clientType)} is required for the driver to
                      verify you.
                    </p>
                  )}
                </label>
                {askFlight && (
                  <label>
                    <span className={labelClass}>Flight number (Optional)</span>
                    <input
                      type="text"
                      placeholder="e.g. KB 205"
                      value={flight}
                      onChange={(e) => setFlight(e.target.value)}
                      className={inputClass}
                    />
                    <p className="mt-1 t-caption text-[color:var(--color-muted)]">
                      So your driver can track a delayed flight.
                    </p>
                  </label>
                )}
                {selfDrive && (
                  <>
                    <label>
                      <span className={labelClass}>
                        Driving licence number *
                      </span>
                      <input
                        type="text"
                        placeholder={
                          clientType === "tourist"
                            ? "Indian licence number"
                            : "Bhutanese licence number"
                        }
                        value={licence}
                        onChange={(e) => setLicence(e.target.value)}
                        className={`${inputClass} ${touched && !licence.trim() ? errorClass : ""}`}
                      />
                    </label>
                    <label>
                      <span className={labelClass}>Date of birth *</span>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className={`${inputClass} ${touched && !dob.trim() ? errorClass : ""}`}
                      />
                      <p className="mt-1 t-caption text-[color:var(--color-muted)]">
                        Drivers must be 21 or over.
                      </p>
                    </label>
                  </>
                )}
              </div>

              <p className="mt-4 t-body-sm text-[color:var(--color-muted)]">
                <span className="font-semibold text-[color:var(--color-ink-soft)]">
                  Note:
                </span>{" "}
                Your information is required for driver verification, trip
                updates, and issuing your booking confirmation.
              </p>

              <p className="mt-4 t-body-sm text-[color:var(--color-muted)]">
                By proceeding to book, I Agree to DrukDrive&rsquo;s{" "}
                <Link
                  to={routes.privacyPolicy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[color:var(--color-link)] underline"
                >
                  Privacy Policy
                </Link>
                ,{" "}
                <Link
                  to={routes.userAgreement}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[color:var(--color-link)] underline"
                >
                  User Agreement
                </Link>{" "}
                and{" "}
                <Link
                  to={routes.termsOfService}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[color:var(--color-link)] underline"
                >
                  Terms of Service
                </Link>
              </p>
            </div>

            <h2 className="t-h3 mt-10 text-[color:var(--color-ink)]">
              Read before you book!
            </h2>
            <div className="mt-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card">
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

            <div className="mt-8 hidden justify-end lg:flex">
              <Button variant="primary" size="lg" onClick={handleProceed}>
                {payButtonLabel}
              </Button>
            </div>
          </div>

          {/* Right: price summary sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="t-h3 text-[color:var(--color-ink)]">
              Price summary
            </h2>
            <div
              id="price-summary"
              className="mt-4 scroll-mt-24 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card"
            >
              <div>
                <p className="t-h2 tabular text-[color:var(--color-ink)]">
                  {format(netPayable)}
                </p>
                <p className="t-body-sm text-[color:var(--color-muted)]">
                  Total for {fare.unit}, taxes and fees included
                </p>
              </div>
              <div className="mt-3">
                <FareSummary
                  total={format(netPayable)}
                  lines={[
                    ...fare.lines.map((l) => ({
                      label: l.label,
                      value: format(l.amount),
                    })),
                    ...(discount > 0
                      ? [
                          {
                            label: `Promo ${promoApplied?.code}`,
                            value: `−${format(discount)}`,
                            success: true,
                          },
                        ]
                      : []),
                  ]}
                />
              </div>

              {/* Rides are paid in full; rentals and self-drive pay half now and
                  half to the driver at pick-up. */}
              <dl className="mt-4 flex flex-col gap-2 rounded-xl bg-[color:var(--color-surface-subtle)] px-4 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <dt>
                    <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">
                      Pay now
                    </span>
                    <span className="block t-caption text-[color:var(--color-muted)]">
                      {split.later > 0
                        ? "Half the fare, to confirm your booking"
                        : "The full fare, to confirm your booking"}
                      {showNu && ` · ≈ ${inNu(amountDue)}`}
                    </span>
                  </dt>
                  <dd className="shrink-0 t-body font-bold tabular text-[color:var(--color-ink)]">
                    {format(amountDue)}
                  </dd>
                </div>
                {split.later > 0 && (
                  <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-2">
                    <dt>
                      <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">
                        Pay at pick-up
                      </span>
                      <span className="block t-caption text-[color:var(--color-muted)]">
                        {clientType === "tourist"
                          ? "The other half, to the driver in cash (Nu) or by card"
                          : "The other half, to the driver by mBoB, card or cash"}
                        {showNu && ` · ≈ ${inNu(netPayable - amountDue)}`}
                      </span>
                    </dt>
                    <dd className="shrink-0 t-body font-bold tabular text-[color:var(--color-ink)]">
                      {format(netPayable - amountDue)}
                    </dd>
                  </div>
                )}
                {fare.deposit > 0 && (
                  <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-2">
                    <dt>
                      <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">
                        Deposit at collection
                      </span>
                      <span className="block t-caption text-[color:var(--color-muted)]">
                        Refundable, released within 3 days of return
                      </span>
                    </dt>
                    <dd className="shrink-0 t-body font-bold tabular text-[color:var(--color-ink)]">
                      {format(fare.deposit)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <h2 className="mt-8 t-h3 text-[color:var(--color-ink)]">Add-ons</h2>
            <div className="mt-4 flex flex-col gap-4">
              {addOns.map((addOn) => (
                <AddOnCard
                  key={addOn.id}
                  addOn={addOn}
                  added={addOnIds.includes(addOn.id)}
                  price={format(addOn.pricePerDay)}
                  onToggle={() => toggleAddOn(addOn.id)}
                />
              ))}
            </div>

            <h2 className="mt-8 t-h3 text-[color:var(--color-ink)]">
              Offer{" "}
              <span className="t-body-sm font-medium text-[color:var(--color-muted)]">
                (Optional)
              </span>
            </h2>
            <div className="mt-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-4 shadow-card">
              <p className="flex items-center gap-1.5 t-label font-semibold uppercase text-[color:var(--color-muted)]">
                <Icon name="info" size={13} />
                Enter promo code
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Got a promo code? enter here"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="h-11 min-w-0 flex-1 rounded-lg border border-[color:var(--color-border)] px-3 t-body text-[color:var(--color-ink)] outline-none placeholder:text-[color:var(--color-muted)] focus:border-[color:var(--color-ink)]"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="h-11 shrink-0 rounded-lg bg-[color:var(--color-ink)] px-4 t-body-sm font-bold text-white transition-all duration-200 hover:bg-black"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="mt-2 t-caption font-semibold text-[color:var(--color-success)]">
                  {promoApplied.code} applied — {format(discount)} off
                </p>
              )}
              {promoError && (
                <p className="mt-2 t-caption text-[color:var(--color-danger)]">
                  {promoError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-[color:var(--color-border)] bg-white p-4 shadow-[0px_-2px_14px_rgba(0,0,0,0.08)] lg:hidden">
        <a href="#price-summary" className="flex flex-col items-start">
          <span className="t-h3 tabular text-[color:var(--color-ink)]">
            {format(amountDue)}
          </span>
          <span className="whitespace-nowrap t-caption text-[color:var(--color-muted)]">
            {split.later > 0
              ? `Pay now · of ${format(netPayable)}`
              : "incl. taxes & fees"}
          </span>
        </a>
        <Button variant="primary" size="lg" onClick={handleProceed}>
          Proceed To Payment
        </Button>
      </div>
    </PageShell>
  );
}
