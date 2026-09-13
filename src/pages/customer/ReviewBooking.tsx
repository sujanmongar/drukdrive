import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import BookingStepper from "../../components/BookingStepper";
import BookingRouteCard from "../../components/BookingRouteCard";
import { vehicles } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { computeFare } from "../../lib/pricing";
import { useCurrency } from "../../lib/currency";
import { useAuth } from "../../lib/auth";
import { usePageTitle } from "../../hooks/usePageTitle";

const DEFAULT_PICKUP = "Thimphu, Druk School";
const DEFAULT_DROPOFF = "Punakha, Taxi Parking";

type PaymentOption = "half" | "full" | "hold";

const PROMO_CODES: Record<string, number> = {
  DRUK10: 0.1,
  WELCOME: 0.05,
};

export default function ReviewBooking() {
  usePageTitle("Review your booking");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();
  const { isLoggedIn } = useAuth();

  const vehicleId = searchParams.get("vehicleId");
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];
  const { total } = computeFare(vehicle.pricePerDay);

  const pickup = searchParams.get("pickup") || DEFAULT_PICKUP;
  const dropoff = searchParams.get("dropoff") || DEFAULT_DROPOFF;
  const date = searchParams.get("date") || "";

  const [title, setTitle] = useState("Mr");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickupAddress, setPickupAddress] = useState(pickup);
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [touched, setTouched] = useState(false);

  const [paymentOption, setPaymentOption] = useState<PaymentOption>("half");
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState("");

  const discount = promoApplied ? Math.round(total * promoApplied.discount * 100) / 100 : 0;
  const netPayable = Math.round((total - discount) * 100) / 100;
  const amountDue =
    paymentOption === "full" ? netPayable : paymentOption === "half" ? Math.round((netPayable / 2) * 100) / 100 : 0;

  const isValid = fullName.trim() !== "" && email.trim() !== "" && phone.trim() !== "" && pickupAddress.trim() !== "";

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
      travelerName: fullName,
      travelerEmail: email,
      travelerPhone: phone,
    });
    navigate(`${routes.payment}?${params.toString()}`);
  }

  const inputClass =
    "w-full rounded-xl border border-[color:var(--color-border)] px-3.5 py-2.5 text-sm text-[color:var(--color-ink)] outline-none placeholder:text-[color:var(--color-muted)] focus:border-[color:var(--color-ink)]";
  const labelClass = "mb-1.5 block text-xs font-medium text-[color:var(--color-ink-soft)]";
  const errorClass = "border-[color:var(--color-danger)]";

  const payButtonLabel =
    paymentOption === "hold" ? "Hold booking" : `Pay ${format(amountDue)} now`;

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[1320px] px-4 py-6 pb-10 md:px-[60px] md:py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-lg font-bold text-[color:var(--color-ink)]"
        >
          <Icon name="chevron-left" size={22} />
          Review Your Booking
        </button>

        <div className="mb-6">
          <BookingStepper current={2} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left: booking details + personal info */}
          <div className="min-w-0">
            <BookingRouteCard vehicle={vehicle} pickup={pickup} dropoff={dropoff} date={date} />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[color:var(--color-ink)]">Personal Information</h2>
              {!isLoggedIn && (
                <Link
                  to={routes.signIn}
                  className="rounded-lg bg-[color:var(--color-info-bg)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-info-text)] hover:opacity-90"
                >
                  Sign in/signup to speed up your booking process ↗
                </Link>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-[color:var(--color-border)] pt-5 sm:grid-cols-[100px_1fr]">
              <label>
                <span className={labelClass}>Title</span>
                <select value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass}>
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
                {touched && !fullName.trim() && <p className="mt-1 text-xs text-[color:var(--color-danger)]">Full name is required.</p>}
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label>
                <span className={labelClass}>Phone * (Your confirmation code will be sent here)</span>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${inputClass} ${touched && !phone.trim() ? errorClass : ""}`}
                />
                {touched && !phone.trim() && <p className="mt-1 text-xs text-[color:var(--color-danger)]">Phone number is required.</p>}
              </label>
              <label>
                <span className={labelClass}>Email * (Your E-ticket and updates will be sent here)</span>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} ${touched && !email.trim() ? errorClass : ""}`}
                />
                {touched && !email.trim() && <p className="mt-1 text-xs text-[color:var(--color-danger)]">Email is required.</p>}
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
                <span className={labelClass}>Drop off address (Optional)</span>
                <input
                  type="text"
                  placeholder="Drop address/landmark"
                  value={dropoffAddress}
                  onChange={(e) => setDropoffAddress(e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            <p className="mt-4 text-xs text-[color:var(--color-muted)]">
              By proceeding to book, I Agree to DrukDrive&rsquo;s{" "}
              <Link to={routes.privacyPolicy} target="_blank" rel="noopener noreferrer" className="font-semibold text-[color:var(--color-link)] underline">
                Privacy Policy
              </Link>
              ,{" "}
              <Link to={routes.userAgreement} target="_blank" rel="noopener noreferrer" className="font-semibold text-[color:var(--color-link)] underline">
                User Agreement
              </Link>{" "}
              and{" "}
              <Link to={routes.termsOfService} target="_blank" rel="noopener noreferrer" className="font-semibold text-[color:var(--color-link)] underline">
                Terms of Service
              </Link>
            </p>

            <h2 className="mt-10 text-lg font-bold text-[color:var(--color-ink)]">Read before you book!</h2>
            <div className="mt-4 rounded-xl border border-[color:var(--color-border)] p-5">
              <h3 className="text-sm font-bold text-[color:var(--color-ink)]">Safety precautions</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-[color:var(--color-ink-soft)]">
                <li>Our cabs are sanitised before pickup, however you may request the driver to sanitise before you board.</li>
                <li>Maintain social distancing and avoid touching your mouth, eyes or nose without sanitising your hands.</li>
                <li>Avoid travel in case you&rsquo;re experiencing any symptoms of illness.</li>
              </ul>
              <h3 className="mt-4 text-sm font-bold text-[color:var(--color-ink)]">Other information</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-[color:var(--color-ink-soft)]">
                <li>AC will be switched off in hilly areas.</li>
                <li>If you opt for partial payment, please pay the balance to the driver within 45 min from pickup time.</li>
                <li>Only one pick-up, one drop and one pit stop for a meal is included.</li>
              </ul>
            </div>
          </div>

          {/* Right: price summary sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
              <h2 className="text-lg font-bold text-[color:var(--color-ink)]">Price Summary</h2>

              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <p className="text-xl font-extrabold text-[color:var(--color-ink)]">{format(netPayable)}</p>
                  <p className="text-xs text-[color:var(--color-muted)]">Inclusive of taxes and fees</p>
                </div>
                <span className="text-xs font-semibold text-[color:var(--color-link)]">Fare summary</span>
              </div>

              <div className="mt-4 flex flex-col gap-2.5">
                {(
                  [
                    { value: "half" as const, label: "Make half payment now", hint: "Pay the rest to the driver", amount: Math.round((netPayable / 2) * 100) / 100 },
                    { value: "full" as const, label: "Make full payment now", hint: null, amount: netPayable },
                    { value: "hold" as const, label: "Hold booking", hint: null, amount: null },
                  ]
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPaymentOption(opt.value)}
                    className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                      paymentOption === opt.value ? "bg-[color:var(--color-info-bg)]" : "hover:bg-neutral-50"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          paymentOption === opt.value ? "border-[color:var(--color-ink)]" : "border-[color:var(--color-border)]"
                        }`}
                      >
                        {paymentOption === opt.value && <span className="size-2.5 rounded-full bg-[color:var(--color-ink)]" />}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-[color:var(--color-ink)]">{opt.label}</span>
                        {opt.hint && <span className="block text-xs text-[color:var(--color-muted)]">{opt.hint}</span>}
                      </span>
                    </span>
                    {opt.amount !== null ? (
                      <span className="shrink-0 text-sm font-bold text-[color:var(--color-ink)]">{format(opt.amount)}</span>
                    ) : (
                      <Icon name="info" size={16} className="shrink-0 text-[color:var(--color-muted)]" />
                    )}
                  </button>
                ))}
              </div>

              <Button variant="primary" size="lg" fullWidth className="mt-4" onClick={handleProceed}>
                {payButtonLabel}
              </Button>

              <h3 className="mt-6 text-sm font-bold text-[color:var(--color-ink)]">Offer (Optional)</h3>
              <div className="mt-2 rounded-xl border border-[color:var(--color-border)] p-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase text-[color:var(--color-muted)]">
                  <Icon name="info" size={13} />
                  Enter promo code
                </p>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Got a promo code? enter here"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-[color:var(--color-border)] px-3 py-2 text-sm text-[color:var(--color-ink)] outline-none placeholder:text-[color:var(--color-muted)] focus:border-[color:var(--color-ink)]"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="shrink-0 rounded-lg bg-[color:var(--color-ink)] px-4 py-2 text-sm font-bold text-white hover:bg-black"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="mt-2 text-xs font-semibold text-[color:var(--color-success)]">
                    {promoApplied.code} applied — {format(discount)} off
                  </p>
                )}
                {promoError && <p className="mt-2 text-xs text-[color:var(--color-danger)]">{promoError}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
