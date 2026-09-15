import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import BookingStepper from "../../components/BookingStepper";
import BookingRouteCard from "../../components/BookingRouteCard";
import FareSummary from "../../components/FareSummary";
import { vehicles } from "../../data/mockData";
import { routes } from "../../lib/routes";
import {
  addOns,
  computeFare,
  parseAddOnIds,
  RENTAL_DAYS,
} from "../../lib/pricing";
import { useCurrency } from "../../lib/currency";
import { useAuth } from "../../lib/auth";
import { useCurrentUser } from "../../lib/currentUser";
import { usePageTitle } from "../../hooks/usePageTitle";

const DEFAULT_PICKUP = "Thimphu, Druk School";
const DEFAULT_DROPOFF = "Punakha, Taxi Parking";

type PaymentOption = "half" | "full";

const PROMO_CODES: Record<string, number> = {
  DRUK10: 0.1,
  WELCOME: 0.05,
};

export default function ReviewBooking() {
  usePageTitle("Your details");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { format } = useCurrency();
  const { isLoggedIn } = useAuth();
  const { user } = useCurrentUser();

  const vehicleId = searchParams.get("vehicleId");
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];
  // Add-ons can still be changed here; the URL stays the source of truth so
  // a refresh or back-navigation keeps the choice.
  const addOnIds = parseAddOnIds(searchParams.get("addons"));
  function toggleAddOn(id: string) {
    const next = addOnIds.includes(id)
      ? addOnIds.filter((x) => x !== id)
      : [...addOnIds, id];
    const params = new URLSearchParams(searchParams);
    if (next.length) params.set("addons", next.join(","));
    else params.delete("addons");
    setSearchParams(params, { replace: true });
  }
  const { baseFare, taxes, total } = computeFare(vehicle.pricePerDay, addOnIds);

  const pickup = searchParams.get("pickup") || DEFAULT_PICKUP;
  const dropoff = searchParams.get("dropoff") || DEFAULT_DROPOFF;
  const date = searchParams.get("date") || "";

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
  const [touched, setTouched] = useState(false);

  const [paymentOption, setPaymentOption] = useState<PaymentOption>("half");
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
  const amountDue =
    paymentOption === "full"
      ? netPayable
      : Math.round((netPayable / 2) * 100) / 100;

  const isValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    pickupAddress.trim() !== "";

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
    const params = new URLSearchParams({
      vehicleId: vehicle.id,
      pickup: pickupAddress,
      dropoff: dropoffAddress || dropoff,
      date,
      total: netPayable.toFixed(2),
      grandTotal: total.toFixed(2),
      amountDue: amountDue.toFixed(2),
      paymentOption,
      ...(addOnIds.length ? { addons: addOnIds.join(",") } : {}),
      travelerName: fullName,
      travelerEmail: email,
      travelerPhone: phone,
    });
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
                    Phone * (Your confirmation code will be sent here)
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
              <h4 className="t-body font-bold text-[color:var(--color-ink)]">
                Safety precautions
              </h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 t-body text-[color:var(--color-ink-soft)]">
                <li>
                  Our cabs are sanitised before pickup, however you may request
                  the driver to sanitise before you board.
                </li>
                <li>
                  Maintain social distancing and avoid touching your mouth, eyes
                  or nose without sanitising your hands.
                </li>
                <li>
                  Avoid travel in case you&rsquo;re experiencing any symptoms of
                  illness.
                </li>
              </ul>
              <h4 className="mt-4 t-body font-bold text-[color:var(--color-ink)]">
                Other information
              </h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 t-body text-[color:var(--color-ink-soft)]">
                <li>AC will be switched off in hilly areas.</li>
                <li>
                  If you opt for partial payment, please pay the balance to the
                  driver within 45 min from pickup time.
                </li>
                <li>
                  Only one pick-up, one drop and one pit stop for a meal is
                  included.
                </li>
              </ul>
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
                  Total for {RENTAL_DAYS} days, taxes and fees included
                </p>
              </div>
              <div className="mt-3">
                <FareSummary
                  total={format(netPayable)}
                  lines={[
                    {
                      label: `${format(vehicle.pricePerDay)} × ${RENTAL_DAYS} days`,
                      value: format(baseFare),
                    },
                    ...addOns
                      .filter((a) => addOnIds.includes(a.id))
                      .map((a) => ({
                        label: a.name,
                        value: format(a.pricePerDay * RENTAL_DAYS),
                      })),
                    { label: "Taxes & fees", value: format(taxes) },
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

              <div className="mt-4 flex flex-col gap-2.5">
                {[
                  {
                    value: "half" as const,
                    label: "Pay half now",
                    hint: "Pay the rest to the driver at pick-up",
                    amount: Math.round((netPayable / 2) * 100) / 100,
                  },
                  {
                    value: "full" as const,
                    label: "Pay in full now",
                    hint: "Nothing to pay at pick-up",
                    amount: netPayable,
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPaymentOption(opt.value)}
                    className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                      paymentOption === opt.value
                        ? "bg-[color:var(--color-info-bg)]"
                        : "hover:bg-[color:var(--color-surface-soft)]"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          paymentOption === opt.value
                            ? "border-[color:var(--color-ink)]"
                            : "border-[color:var(--color-border)]"
                        }`}
                      >
                        {paymentOption === opt.value && (
                          <span className="size-2.5 rounded-full bg-[color:var(--color-ink)]" />
                        )}
                      </span>
                      <span>
                        <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">
                          {opt.label}
                        </span>
                        {opt.hint && (
                          <span className="block t-caption text-[color:var(--color-muted)]">
                            {opt.hint}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="shrink-0 t-body-sm font-bold tabular text-[color:var(--color-ink)]">
                      {format(opt.amount)}
                    </span>
                  </button>
                ))}
              </div>

              <div className="hidden lg:block">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="mt-4"
                  onClick={handleProceed}
                >
                  {payButtonLabel}
                </Button>
              </div>
            </div>

            <h2 className="mt-8 t-h3 text-[color:var(--color-ink)]">Add-ons</h2>
            <div className="mt-4 flex flex-col gap-4">
              {addOns.map((addOn) => {
                const added = addOnIds.includes(addOn.id);
                return (
                  <div
                    key={addOn.id}
                    className={`rounded-2xl border bg-white p-5 shadow-card transition-colors ${
                      added
                        ? "border-[color:var(--color-ink)]"
                        : "border-[color:var(--color-border)]"
                    }`}
                  >
                    <h3 className="t-h4 text-[color:var(--color-ink)]">
                      {addOn.name}
                    </h3>
                    <p className="mt-1 t-body-sm text-[color:var(--color-ink-soft)]">
                      {addOn.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <p>
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
                        onClick={() => toggleAddOn(addOn.id)}
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
                );
              })}
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
            {format(netPayable)}
          </span>
          <span className="t-caption text-[color:var(--color-muted)]">
            incl. taxes &amp; fees
          </span>
        </a>
        <Button variant="primary" size="lg" onClick={handleProceed}>
          Proceed To Payment
        </Button>
      </div>
    </PageShell>
  );
}
