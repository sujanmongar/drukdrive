import { useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import BookingStepper from "../../components/BookingStepper";
import BookingRouteCard from "../../components/BookingRouteCard";
import PriceSummaryCard from "../../components/PriceSummaryCard";
import { routes } from "../../lib/routes";
import { vehicles } from "../../data/mockData";
import { useCurrency } from "../../lib/currency";
import { usePageTitle } from "../../hooks/usePageTitle";
import {
  bookingToParams,
  formatDropoff,
  formatPickup,
  parseBooking,
} from "../../lib/booking";
import { computeFare, isAddOnId, promoDiscount } from "../../lib/pricing";
import {
  AmexMark,
  BankMark,
  MastercardMark,
  PayPalMark,
  VisaMark,
} from "../../components/PayLogos";

type PaymentMethod = "card" | "netbanking" | "paypal";

// RMA payment gateway banks, as on the reference.
const banks = [
  { name: "Bank of Bhutan", short: "BoB" },
  { name: "Bhutan National Bank", short: "BNB" },
  { name: "Druk PNB Bank", short: "DPNB" },
  { name: "T Bank", short: "TB" },
];

// The driver assigned once the booking is confirmed. A prototype value;
// the real one comes from dispatch.
const assignedDriver = {
  name: "Karma Dorji",
  rating: 4.9,
  trips: 312,
  since: 2019,
  languages: "Dzongkha, English, Hindi",
  plate: "BP-1-A1234",
};

const OTP_LENGTH = 6;

export default function Payment() {
  usePageTitle("Payment");
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [searchParams] = useSearchParams();
  const booking = parseBooking(searchParams, isAddOnId);
  const vehicle =
    vehicles.find((v) => v.id === booking.vehicleId) ?? vehicles[0];
  const fare = computeFare(booking, vehicle.pricePerDay, format);
  const selfDrive = booking.type === "self-drive";

  const { pickup, dropoff } = booking;
  const date = formatPickup(booking);
  const travelerName = searchParams.get("travelerName") || "";
  const travelerEmail = searchParams.get("travelerEmail") || "";
  const travelerPhone = searchParams.get("travelerPhone") || "";
  const promoCode = searchParams.get("promo");
  const discount = promoDiscount(promoCode, fare.total);
  const netPayable =
    Number(searchParams.get("total")) ||
    Math.round((fare.total - discount) * 100) / 100;
  const amountDue = Number(searchParams.get("amountDue")) || netPayable;
  const balance = Math.round((netPayable - amountDue) * 100) / 100;

  const stepHrefs = [
    `${routes.bookingReview}?${bookingToParams(booking).toString()}`,
    `${routes.reviewBooking}?${searchParams.toString()}`,
  ];

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [bank, setBank] = useState(banks[0].name);
  const [accountNumber, setAccountNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  // Net banking: after Pay, the bank sends an OTP; it is entered here.
  const [otpStage, setOtpStage] = useState(false);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const inputClass =
    "h-12 w-full rounded-xl border border-[color:var(--color-border)] px-3.5 t-body text-[color:var(--color-ink)] placeholder:text-[color:var(--color-muted)] outline-none focus:border-[color:var(--color-ink)]";
  const labelClass =
    "mb-1.5 block t-body-sm font-semibold text-[color:var(--color-ink)]";

  function finish(methodLabel: string) {
    const params = new URLSearchParams(searchParams);
    params.set("vehicleId", vehicle.id);
    params.set("method", methodLabel);
    navigate(`${routes.paymentSuccess}?${params.toString()}`);
  }

  function handlePay() {
    finish("Credit Card");
  }

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < OTP_LENGTH - 1) otpRefs.current[i + 1]?.focus();
  }

  const methods: { value: PaymentMethod; title: string }[] = [
    { value: "card", title: "Credit or debit card" },
    { value: "netbanking", title: "Net banking" },
    { value: "paypal", title: "PayPal" },
  ];
  const selectedBank = banks.find((b) => b.name === bank) ?? banks[0];

  const terms = (
    <p className="mt-3 text-center t-caption text-[color:var(--color-muted)]">
      By paying you accept DrukDrive&rsquo;s{" "}
      <Link
        to={routes.termsOfService}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[color:var(--color-link)] underline"
      >
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link
        to={routes.refundPolicy}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[color:var(--color-link)] underline"
      >
        Refund Policy
      </Link>
      .
    </p>
  );

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[1100px] px-4 py-6 pb-28 md:px-10 md:py-10 lg:pb-10">
        <div className="mb-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="icon-btn -ml-2 size-10"
          >
            <Icon name="chevron-left" size={22} />
          </button>
          <h1 className="t-h2 text-[color:var(--color-ink)]">Payment</h1>
        </div>

        <div className="mb-8">
          <BookingStepper current={3} hrefs={stepHrefs} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
          {/* Main: who drives, then how to pay */}
          <div className="min-w-0">
            <h2 className="t-h3 text-[color:var(--color-ink)]">
              {selfDrive ? "Collecting the car" : "Your driver"}
            </h2>
            <div className="mt-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card">
              {selfDrive ? (
                <div className="flex flex-col gap-2 t-body text-[color:var(--color-ink-soft)]">
                  <p>
                    Collect{" "}
                    <span className="font-semibold text-[color:var(--color-ink)]">
                      {vehicle.name}
                    </span>{" "}
                    at{" "}
                    <span className="font-semibold text-[color:var(--color-ink)]">
                      {pickup}
                    </span>{" "}
                    on {date}.
                  </p>
                  <p>
                    Bring your driving licence, your passport or CID, and a card
                    for the refundable deposit.
                  </p>
                  <p>
                    The car is handed over with a full tank; return it full.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-ink)] t-h4 text-white">
                    {assignedDriver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="t-h4 text-[color:var(--color-ink)]">
                      {assignedDriver.name}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 t-body-sm text-[color:var(--color-ink-soft)]">
                      <span className="flex items-center gap-1">
                        <Icon
                          name="star"
                          size={14}
                          className="fill-current text-[color:var(--color-star)]"
                        />
                        <span className="font-semibold text-[color:var(--color-ink)]">
                          {assignedDriver.rating}
                        </span>
                      </span>
                      <span className="text-[color:var(--color-muted)]">•</span>
                      <span>{assignedDriver.trips} trips</span>
                      <span className="text-[color:var(--color-muted)]">•</span>
                      <span>Driving since {assignedDriver.since}</span>
                    </p>
                    <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 t-body-sm sm:grid-cols-2">
                      <div>
                        <dt className="t-caption text-[color:var(--color-muted)]">
                          Vehicle
                        </dt>
                        <dd className="font-semibold text-[color:var(--color-ink)]">
                          {vehicle.name} · {assignedDriver.plate}
                        </dd>
                      </div>
                      <div>
                        <dt className="t-caption text-[color:var(--color-muted)]">
                          Speaks
                        </dt>
                        <dd className="font-semibold text-[color:var(--color-ink)]">
                          {assignedDriver.languages}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-3 t-caption text-[color:var(--color-muted)]">
                      The driver&rsquo;s phone number is shared 2 hours before
                      pick-up. Our support line is open until then.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <h2 className="mt-10 t-h3 text-[color:var(--color-ink)]">
              Payment method
            </h2>
            <div className="mt-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-4 shadow-card sm:p-5">
              {otpStage ? (
                <div>
                  <p className="t-body font-bold text-[color:var(--color-ink)]">
                    Request sent to {bank}
                  </p>
                  <p className="mt-1 t-body-sm text-[color:var(--color-ink-soft)]">
                    Approve the payment in your banking app, then enter the
                    one-time code your bank sent you.
                  </p>
                  <div className="mt-5 flex justify-between gap-2 sm:justify-start">
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => setDigit(i, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !digits[i] && i > 0)
                            otpRefs.current[i - 1]?.focus();
                        }}
                        aria-label={`Digit ${i + 1}`}
                        className="h-12 w-11 rounded-xl border border-[color:var(--color-border)] text-center t-h4 text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-ink)] sm:w-12"
                      />
                    ))}
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStage(false);
                        setDigits(Array(OTP_LENGTH).fill(""));
                      }}
                      className="inline-flex min-h-11 items-center t-body-sm font-semibold text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
                    >
                      Use a different method
                    </button>
                    <Button
                      variant="primary"
                      size="lg"
                      disabled={digits.some((d) => !d)}
                      onClick={() => finish(`Net Banking (${bank})`)}
                    >
                      Confirm payment
                    </Button>
                  </div>
                  {terms}
                </div>
              ) : (
                <>
                  <div
                    className="flex flex-col gap-2"
                    role="radiogroup"
                    aria-label="Payment method"
                  >
                    {methods.map((m) => {
                      const active = method === m.value;
                      return (
                        <div
                          key={m.value}
                          className={`rounded-xl border transition-colors ${
                            active
                              ? "border-[color:var(--color-ink)]"
                              : "border-[color:var(--color-border)]"
                          }`}
                        >
                          <button
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setMethod(m.value)}
                            className="flex min-h-14 w-full items-center gap-3 px-4 text-left"
                          >
                            <span
                              className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                active
                                  ? "border-[color:var(--color-ink)]"
                                  : "border-[color:var(--color-border)]"
                              }`}
                            >
                              {active && (
                                <span className="size-2.5 rounded-full bg-[color:var(--color-ink)]" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1 t-body font-bold text-[color:var(--color-ink)]">
                              {m.title}
                            </span>
                            <span className="flex shrink-0 items-center gap-1.5">
                              {m.value === "card" && (
                                <>
                                  <VisaMark />
                                  <MastercardMark />
                                  <AmexMark />
                                </>
                              )}
                              {m.value === "netbanking" &&
                                banks.map((b) => (
                                  <BankMark key={b.short} short={b.short} />
                                ))}
                              {m.value === "paypal" && <PayPalMark />}
                            </span>
                          </button>

                          {active && m.value === "card" && (
                            <div className="grid grid-cols-1 gap-4 border-t border-[color:var(--color-border)] p-4 sm:grid-cols-2">
                              <label className="sm:col-span-2">
                                <span className={labelClass}>Name on card</span>
                                <input
                                  type="text"
                                  value={cardName}
                                  onChange={(e) => setCardName(e.target.value)}
                                  placeholder="As printed on the card"
                                  className={inputClass}
                                />
                              </label>
                              <label className="sm:col-span-2">
                                <span className={labelClass}>Card number</span>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={cardNumber}
                                  onChange={(e) =>
                                    setCardNumber(e.target.value)
                                  }
                                  placeholder="1234 5678 9012 3456"
                                  className={inputClass}
                                />
                              </label>
                              <label>
                                <span className={labelClass}>Expiry</span>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={expiry}
                                  onChange={(e) => setExpiry(e.target.value)}
                                  placeholder="MM / YY"
                                  className={inputClass}
                                />
                              </label>
                              <label>
                                <span className={labelClass}>CVV</span>
                                <input
                                  type="password"
                                  inputMode="numeric"
                                  maxLength={4}
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  placeholder="•••"
                                  className={inputClass}
                                />
                              </label>
                            </div>
                          )}

                          {active && m.value === "netbanking" && (
                            <div className="flex flex-col gap-4 border-t border-[color:var(--color-border)] p-4">
                              <label>
                                <span className={labelClass}>
                                  Select your bank
                                </span>
                                <span className="relative block">
                                  <select
                                    value={bank}
                                    onChange={(e) => setBank(e.target.value)}
                                    className={`${inputClass} appearance-none pr-24`}
                                  >
                                    {banks.map((b) => (
                                      <option key={b.name}>{b.name}</option>
                                    ))}
                                  </select>
                                  <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                                    <BankMark short={selectedBank.short} />
                                    <Icon
                                      name="chevron-down"
                                      size={18}
                                      className="text-[color:var(--color-muted)]"
                                    />
                                  </span>
                                </span>
                              </label>
                              <label>
                                <span className={labelClass}>
                                  Bank account number{" "}
                                  <span className="font-normal text-[color:var(--color-muted)]">
                                    (savings, current or overdraft)
                                  </span>
                                </span>
                                <span className="relative block">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Enter your account number"
                                    value={accountNumber}
                                    onChange={(e) =>
                                      setAccountNumber(e.target.value)
                                    }
                                    className={`${inputClass} pr-14`}
                                  />
                                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                    <BankMark short={selectedBank.short} />
                                  </span>
                                </span>
                              </label>
                              <p className="t-caption text-[color:var(--color-muted)]">
                                A payment request is sent to your bank. Approve
                                it in mBoB, mPay or your bank&rsquo;s app and
                                enter the one-time code it sends you.
                              </p>
                              <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={() => setOtpStage(true)}
                              >
                                Send request for {format(amountDue)}
                              </Button>
                              {terms}
                            </div>
                          )}

                          {active && m.value === "paypal" && (
                            <div className="border-t border-[color:var(--color-border)] p-4">
                              <p className="t-body-sm text-[color:var(--color-ink-soft)]">
                                You&rsquo;ll be taken to PayPal to approve{" "}
                                {format(amountDue)}, then brought back here.
                              </p>
                              <a
                                href="https://www.paypal.com/checkoutnow"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => finish("PayPal")}
                                className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-[#ffc439] transition-colors hover:bg-[#f2b92c]"
                              >
                                <PayPalMark size="lg" />
                              </a>
                              {terms}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {method === "card" && !otpStage && (
              <div className="mt-8 hidden flex-col items-end lg:flex">
                <Button variant="primary" size="lg" onClick={handlePay}>
                  Pay {format(amountDue)}
                </Button>
                {terms}
              </div>
            )}
          </div>

          {/* Right: trip, price, travellers — as on the details step */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BookingRouteCard
              vehicle={vehicle}
              pickup={pickup}
              dropoff={dropoff}
              date={date}
              dropoffWhen={formatDropoff(booking)}
            />

            <h2 className="mt-8 t-h3 text-[color:var(--color-ink)]">
              Price summary
            </h2>
            <div className="mt-4">
              <PriceSummaryCard
                fare={fare}
                netPayable={netPayable}
                payNow={amountDue}
                payLater={balance}
                discount={discount}
                promoCode={promoCode}
              />
            </div>

            {travelerName && (
              <>
                <h2 className="mt-8 t-h3 text-[color:var(--color-ink)]">
                  Traveller
                </h2>
                <div className="mt-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card">
                  <p className="t-body font-semibold text-[color:var(--color-ink)]">
                    {travelerName}
                  </p>
                  <p className="t-body-sm text-[color:var(--color-muted)]">
                    {travelerEmail}
                    {travelerPhone && ` · ${travelerPhone}`}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: card payments confirm from the bottom bar, like Continue on the other steps. */}
      {method === "card" && !otpStage && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-[color:var(--color-border)] bg-white p-4 shadow-[0px_-2px_14px_rgba(0,0,0,0.08)] lg:hidden">
          <div className="flex flex-col items-start">
            <span className="t-h3 tabular text-[color:var(--color-ink)]">
              {format(amountDue)}
            </span>
            <span className="t-caption text-[color:var(--color-muted)]">
              {balance > 0
                ? `of ${format(netPayable)} total`
                : "incl. taxes & fees"}
            </span>
          </div>
          <Button variant="primary" size="lg" onClick={handlePay}>
            Pay now
          </Button>
        </div>
      )}
    </PageShell>
  );
}
