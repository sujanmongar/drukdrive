import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import AddOnCard from "../../components/AddOnCard";
import BookingStepper from "../../components/BookingStepper";
import {
  StopsCard,
  VehicleSummaryCard,
} from "../../components/BookingRouteCard";
import PriceSummaryCard from "../../components/PriceSummaryCard";
import ContactCard from "../../components/ContactCard";
import CheckoutLayout from "../../components/CheckoutLayout";
import PromoCard from "../../components/PromoCard";
import { vehicles } from "../../data/mockData";
import { routes } from "../../lib/routes";
import {
  addOnsFor,
  computeFare,
  isAddOnId,
  paymentSplit,
  promoDiscount,
} from "../../lib/pricing";
import { needsFlightNumber } from "../../lib/bookingContent";
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

// Step 3 of checkout: who is travelling (or who is driving, on self drive).
// The trip itself was settled on the review step and travels in the URL.
export default function ReviewBooking() {
  usePageTitle("Details");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { format } = useCurrency();
  const { isLoggedIn } = useAuth();
  const { user } = useCurrentUser();

  const booking = parseBooking(searchParams, isAddOnId);
  const vehicle =
    vehicles.find((v) => v.id === booking.vehicleId) ?? vehicles[0];
  const { addOnIds, pickup, dropoff } = booking;
  const date = formatPickup(booking);
  const searchHref = `${routes.search}?${bookingToParams(booking).toString()}`;
  const promoCode = searchParams.get("promo");
  const reviewHref = `${routes.bookingReview}?${bookingToParams(booking, promoCode ? { promo: promoCode } : {}).toString()}`;

  // Add-ons and the promo code live in the URL, so a refresh or a step back
  // keeps them and the payment page sees the same numbers.
  function updateBooking(
    next: Partial<typeof booking>,
    extra: Record<string, string | null> = {},
  ) {
    const params = bookingToParams({ ...booking, ...next });
    if (promoCode && !("promo" in extra)) params.set("promo", promoCode);
    for (const [k, v] of Object.entries(extra)) {
      if (v === null) params.delete(k);
      else params.set(k, v);
    }
    setSearchParams(params, { replace: true });
  }

  const fare = computeFare(booking, vehicle.pricePerDay, format);
  const { total } = fare;
  const addOns = addOnsFor(booking.type);
  const selfDrive = booking.type === "self-drive";
  const detailsLabel = selfDrive ? "Driver details" : "Your details";
  const askFlight = needsFlightNumber(pickup, dropoff);
  const discount = promoDiscount(promoCode, total);
  const netPayable = Math.round((total - discount) * 100) / 100;
  const split = paymentSplit(booking, netPayable);
  const amountDue = split.now;

  // Coming back from Payment, the URL already holds what was typed; otherwise
  // a signed-in traveller's details are pulled from their account.
  const q = (k: string) => searchParams.get(k) ?? "";
  const [title, setTitle] = useState(
    q("travelerTitle") ||
      (isLoggedIn && user.gender === "Female" ? "Ms" : "Mr"),
  );
  const [fullName, setFullName] = useState(
    q("travelerName") || (isLoggedIn ? user.name : ""),
  );
  const [phone, setPhone] = useState(
    q("travelerPhone") || (isLoggedIn ? user.phone : ""),
  );
  const [email, setEmail] = useState(
    q("travelerEmail") || (isLoggedIn ? user.email : ""),
  );
  const [pickupAddress, setPickupAddress] = useState(
    q("pickupAddress") || pickup,
  );
  const [dropoffAddress, setDropoffAddress] = useState(q("dropoffAddress"));
  const [identity, setIdentity] = useState(q("travelerId"));
  const [flight, setFlight] = useState(q("flight"));
  const [licence, setLicence] = useState(q("licence"));
  const [dob, setDob] = useState(q("dob"));
  const [touched, setTouched] = useState(false);

  const isValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    pickupAddress.trim() !== "" &&
    identity.trim() !== "" &&
    (!selfDrive || (licence.trim() !== "" && dob.trim() !== ""));

  function handleProceed() {
    if (!isValid) {
      setTouched(true);
      return;
    }
    // The trip's pick-up/drop-off stay as searched (they drive the fare and
    // driving time); the exact addresses travel alongside.
    const params = bookingToParams(
      { ...booking, vehicleId: vehicle.id },
      {
        ...(pickupAddress.trim() && pickupAddress.trim() !== pickup
          ? { pickupAddress: pickupAddress.trim() }
          : {}),
        ...(dropoffAddress.trim()
          ? { dropoffAddress: dropoffAddress.trim() }
          : {}),
        travelerTitle: title,
        travelerName: fullName,
        travelerEmail: email,
        travelerPhone: phone,
        travelerId: identity,
        ...(promoCode && discount > 0 ? { promo: promoCode } : {}),
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
  const err = (msg: string) => (
    <p className="mt-1 t-caption text-[color:var(--color-danger)]">{msg}</p>
  );

  const form = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-h3 text-[color:var(--color-ink)]">
          {selfDrive ? "Driver information" : "Personal information"}
        </h2>
        {!isLoggedIn && (
          <Link
            to={routes.signIn}
            className="inline-flex min-h-11 items-center rounded-lg bg-[color:var(--color-info-bg)] px-3 t-body-sm font-semibold text-[color:var(--color-info-text)] hover:opacity-90"
          >
            Sign in to speed this up ↗
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
            <span className={labelClass}>Full name *</span>
            <input
              type="text"
              placeholder="As on your passport or CID"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`${inputClass} ${touched && !fullName.trim() ? errorClass : ""}`}
            />
            {touched && !fullName.trim() && err("Full name is required.")}
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className={labelClass}>Phone * (WhatsApp preferred)</span>
            <input
              type="tel"
              placeholder="+975 17 000 000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${inputClass} ${touched && !phone.trim() ? errorClass : ""}`}
            />
            {touched && !phone.trim() && err("Phone number is required.")}
          </label>
          <label>
            <span className={labelClass}>
              Email * (your e-ticket goes here)
            </span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputClass} ${touched && !email.trim() ? errorClass : ""}`}
            />
            {touched && !email.trim() && err("Email is required.")}
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className={labelClass}>
              {selfDrive ? "Collection address *" : "Pickup address *"}
            </span>
            <input
              type="text"
              placeholder="Address or landmark"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              className={`${inputClass} ${touched && !pickupAddress.trim() ? errorClass : ""}`}
            />
          </label>
          <label>
            <span className={labelClass}>
              {selfDrive
                ? "Return address (optional)"
                : "Drop-off address (optional)"}
            </span>
            <input
              type="text"
              placeholder="Address or landmark"
              value={dropoffAddress}
              onChange={(e) => setDropoffAddress(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className={labelClass}>Passport or CID number *</span>
            <input
              type="text"
              placeholder="For the driver to verify you"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              className={`${inputClass} ${touched && !identity.trim() ? errorClass : ""}`}
            />
            {touched &&
              !identity.trim() &&
              err("A passport or CID number is required.")}
          </label>
          {askFlight && (
            <label>
              <span className={labelClass}>Flight number (optional)</span>
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
                <span className={labelClass}>Driving licence number *</span>
                <input
                  type="text"
                  placeholder="Bhutanese or Indian licence"
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
          Your information is used for driver verification, trip updates and
          your booking confirmation.
        </p>
        <p className="mt-3 t-body-sm text-[color:var(--color-muted)]">
          By continuing you agree to DrukDrive&rsquo;s{" "}
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
          .
        </p>
      </div>
    </>
  );

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
          <h1 className="t-h2 text-[color:var(--color-ink)]">{detailsLabel}</h1>
        </div>

        <div className="mb-8">
          <BookingStepper
            current={3}
            hrefs={[searchHref, reviewHref]}
            detailsLabel={detailsLabel}
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
            <PriceSummaryCard
              id="price-summary"
              fare={fare}
              netPayable={netPayable}
              payNow={split.now}
              payLater={split.later}
              discount={discount}
              promoCode={promoCode}
            />
          }
          promo={
            <PromoCard
              promoCode={promoCode}
              discount={discount}
              onChange={(code) => updateBooking({}, { promo: code })}
            />
          }
          help={<ContactCard />}
          main={
            <>
              {form}

              <h2 className="mt-10 t-h3 text-[color:var(--color-ink)]">
                Add-ons
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {addOns.map((addOn) => (
                  <AddOnCard
                    key={addOn.id}
                    addOn={addOn}
                    added={addOnIds.includes(addOn.id)}
                    price={format(addOn.pricePerDay)}
                    onToggle={() =>
                      updateBooking({
                        addOnIds: addOnIds.includes(addOn.id)
                          ? addOnIds.filter((x) => x !== addOn.id)
                          : [...addOnIds, addOn.id],
                      })
                    }
                  />
                ))}
              </div>

              <div className="mt-8 hidden justify-end lg:flex">
                <Button variant="primary" size="lg" onClick={handleProceed}>
                  Continue to payment
                </Button>
              </div>
            </>
          }
        />
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-[color:var(--color-border)] bg-white p-4 shadow-[0px_-2px_14px_rgba(0,0,0,0.08)] lg:hidden">
        <a href="#price-summary" className="flex flex-col items-start">
          <span className="t-h3 t-amount">{format(amountDue)}</span>
          <span className="whitespace-nowrap t-caption text-[color:var(--color-muted)]">
            {split.later > 0
              ? `Pay now · of ${format(netPayable)}`
              : "incl. taxes & fees"}
          </span>
        </a>
        <Button variant="primary" size="lg" onClick={handleProceed}>
          Continue
        </Button>
      </div>
    </PageShell>
  );
}
