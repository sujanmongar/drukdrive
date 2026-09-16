import { useRef, useState } from "react";
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
import PromoCard from "../../components/PromoCard";
import ContactCard from "../../components/ContactCard";
import CheckoutLayout from "../../components/CheckoutLayout";
import BrandLogo from "../../components/BrandLogo";
import {
  AmexMark,
  BankMark,
  MastercardMark,
  PayPalMark,
  VisaMark,
} from "../../components/PayLogos";
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
import {
  addOnsFor,
  computeFare,
  isAddOnId,
  paymentSplit,
  promoDiscount,
} from "../../lib/pricing";

type PaymentMethod = "card" | "netbanking" | "paypal";

// RMA payment gateway banks. Logos live in /public/logos; a drawn mark is
// the fallback if a file is missing.
const banks = [
  { name: "Bank of Bhutan", short: "BoB", logo: "bob", dark: false },
  { name: "Bhutan National Bank", short: "BNB", logo: "bnb", dark: false },
  { name: "Druk PNB Bank", short: "DPNB", logo: "dpnb", dark: true },
  { name: "T Bank", short: "TB", logo: "tbank", dark: false },
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

// The details step stores the date of birth as the <input type="date">
// value; show it the way every other date in checkout reads.
function formatDob(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export default function Payment() {
  usePageTitle("Payment");
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const booking = parseBooking(searchParams, isAddOnId);
  const vehicle =
    vehicles.find((v) => v.id === booking.vehicleId) ?? vehicles[0];
  const selfDrive = booking.type === "self-drive";
  const detailsLabel = selfDrive ? "Driver details" : "Your details";

  const { pickup, dropoff } = booking;
  const date = formatPickup(booking);
  const q = (k: string) => searchParams.get(k) || "";
  const travelerName = q("travelerName");
  const promoCode = searchParams.get("promo");

  // Amounts come from the booking itself, so add-ons or a promo changed on
  // this page stay right; nothing is trusted from an earlier step's params.
  const fare = computeFare(booking, vehicle.pricePerDay, format);
  const discount = promoDiscount(promoCode, fare.total);
  const netPayable = Math.round((fare.total - discount) * 100) / 100;
  const split = paymentSplit(booking, netPayable);
  const amountDue = split.now;
  const balance = split.later;
  const addOns = addOnsFor(booking.type);

  function updateBooking(
    next: Partial<typeof booking>,
    extra: Record<string, string | null> = {},
  ) {
    const params = new URLSearchParams(searchParams);
    params.delete("addons");
    bookingToParams({ ...booking, ...next }).forEach((v, k) =>
      params.set(k, v),
    );
    for (const [k, v] of Object.entries(extra)) {
      if (v === null) params.delete(k);
      else params.set(k, v);
    }
    setSearchParams(params, { replace: true });
  }

  const stepHrefs = [
    `${routes.search}?${bookingToParams(booking).toString()}`,
    `${routes.bookingReview}?${searchParams.toString()}`,
    `${routes.reviewBooking}?${searchParams.toString()}`,
  ];
  const detailsHref = stepHrefs[2];

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [bank, setBank] = useState(banks[0].name);
  const selectedBank = banks.find((b) => b.name === bank) ?? banks[0];
  const [accountNumber, setAccountNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  // Net banking: after the request, the bank sends an OTP; it is entered here.
  const [otpStage, setOtpStage] = useState(false);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const inputClass =
    "h-12 w-full rounded-xl border border-[color:var(--color-border)] bg-white px-3.5 t-body text-[color:var(--color-ink)] placeholder:text-[color:var(--color-muted)] outline-none focus:border-[color:var(--color-ink)]";
  const labelClass =
    "mb-1.5 block t-body-sm font-semibold text-[color:var(--color-ink)]";

  function finish(methodLabel: string) {
    const params = new URLSearchParams(searchParams);
    params.set("vehicleId", vehicle.id);
    params.set("method", methodLabel);
    params.set("amountDue", amountDue.toFixed(2));
    params.set("paymentOption", balance > 0 ? "half" : "full");
    navigate(`${routes.confirmation(`GI${Date.now()}`)}?${params.toString()}`);
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

  const terms = (
    <p className="mt-3 text-center t-caption">
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

  const driverCard = selfDrive ? (
    <div className="flex flex-col gap-2 t-body">
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
        Bring your driving licence, your passport or CID, and a card for the
        refundable deposit.
      </p>
      <p>The car is handed over with a full tank; return it full.</p>
    </div>
  ) : (
    <div>
      <div className="flex items-center gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-surface-soft)] t-h3">
          {assignedDriver.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 t-h4">
            {assignedDriver.name}
            <Icon
              name="check-circle"
              size={16}
              className="shrink-0 text-[color:var(--color-success)]"
            />
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="rounded-md bg-[color:var(--color-success)] px-2 py-0.5 t-caption font-bold tabular text-white">
              {assignedDriver.rating.toFixed(1)}/5
            </span>
            <span className="border-l border-[color:var(--color-border)] pl-2 t-body-sm text-[color:var(--color-ink)]">
              {assignedDriver.trips} trips
            </span>
          </div>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[color:var(--color-border)] pt-4 t-body-sm sm:grid-cols-3">
        <div>
          <dt className="t-caption">Vehicle</dt>
          <dd className="font-semibold text-[color:var(--color-ink)]">
            {vehicle.name}
          </dd>
        </div>
        <div>
          <dt className="t-caption">Number plate</dt>
          <dd className="font-semibold tabular text-[color:var(--color-ink)]">
            {assignedDriver.plate}
          </dd>
        </div>
        <div>
          <dt className="t-caption">Driving since</dt>
          <dd className="font-semibold text-[color:var(--color-ink)]">
            {assignedDriver.since}
          </dd>
        </div>
        <div className="col-span-2 sm:col-span-3">
          <dt className="t-caption">Speaks</dt>
          <dd className="font-semibold text-[color:var(--color-ink)]">
            {assignedDriver.languages}
          </dd>
        </div>
      </dl>
      <p className="mt-4 flex items-start gap-2 rounded-xl bg-[color:var(--color-surface-subtle)] px-3.5 py-3 t-caption">
        <Icon
          name="phone"
          size={15}
          className="mt-0.5 shrink-0 text-[color:var(--color-ink)]"
        />
        The driver&rsquo;s number is shared 2 hours before pick-up. Until then,
        our support line is there for anything.
      </p>
    </div>
  );

  // What was entered on the previous step, with a way back to change it.
  const detailRows: [string, string][] = (
    [
      ["Name", `${q("travelerTitle")} ${travelerName}`.trim()],
      ["Phone", q("travelerPhone")],
      ["Email", q("travelerEmail")],
      ["Passport or CID", q("travelerId")],
      ["Flight", q("flight")],
      ["Driving licence", q("licence")],
      ["Date of birth", formatDob(q("dob"))],
      [selfDrive ? "Collection address" : "Pickup address", q("pickupAddress")],
      [selfDrive ? "Return address" : "Drop-off address", q("dropoffAddress")],
    ] as [string, string][]
  ).filter(([, v]) => v);

  const otpPanel = (
    <div className="p-4 sm:p-5">
      <p className="t-body font-bold text-[color:var(--color-ink)]">
        Request sent to {bank}
      </p>
      <p className="mt-1 t-body-sm">
        Approve the payment in your banking app, then enter the one-time code
        your bank sent you.
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
            className="h-12 w-11 rounded-xl border border-[color:var(--color-border)] text-center t-h4 outline-none focus:border-[color:var(--color-ink)] sm:w-12"
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
  );

  const methodList = (
    <fieldset className="flex flex-col">
      <legend className="sr-only">Payment method</legend>
      {methods.map((m) => {
        const active = method === m.value;
        return (
          <div
            key={m.value}
            className="border-t border-[color:var(--color-border)] first:border-t-0"
          >
            <label className="flex min-h-[60px] w-full cursor-pointer items-center gap-3 px-4 text-left transition-colors hover:bg-[color:var(--color-surface-subtle)] sm:px-5">
              <input
                type="radio"
                name="payment-method"
                value={m.value}
                checked={active}
                onChange={() => setMethod(m.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--color-ink)] peer-focus-visible:ring-offset-2 ${
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
              <span aria-hidden className="flex shrink-0 items-center gap-2">
                {m.value === "card" && (
                  <>
                    <BrandLogo
                      name="visa"
                      alt=""
                      fallback={<VisaMark />}
                      className="h-4"
                    />
                    <BrandLogo
                      name="mastercard"
                      alt=""
                      fallback={<MastercardMark />}
                      className="h-5"
                    />
                    <BrandLogo
                      name="amex"
                      alt=""
                      fallback={<AmexMark />}
                      className="h-6"
                    />
                  </>
                )}
                {m.value === "netbanking" && (
                  <>
                    {banks.map((b, i) => (
                      <BrandLogo
                        key={b.short}
                        name={b.logo}
                        alt=""
                        fallback={<BankMark short={b.short} />}
                        className="h-5"
                        wrapperClassName={i > 1 ? "hidden sm:inline-flex" : ""}
                        dark={b.dark}
                      />
                    ))}
                    <span className="t-caption font-semibold sm:hidden">
                      +{banks.length - 2}
                    </span>
                  </>
                )}
                {m.value === "paypal" && (
                  <BrandLogo
                    name="paypal"
                    alt=""
                    fallback={<PayPalMark />}
                    className="h-5"
                  />
                )}
              </span>
            </label>

            {active && m.value === "card" && (
              <div className="grid grid-cols-1 gap-4 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-4 sm:grid-cols-2 sm:p-5">
                <label className="sm:col-span-2">
                  <span className={labelClass}>Name on card</span>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="As printed on the card"
                    className={inputClass}
                    autoComplete="cc-name"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>Card number</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className={inputClass}
                    autoComplete="cc-number"
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
                    autoComplete="cc-exp"
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
                    autoComplete="cc-csc"
                  />
                </label>
              </div>
            )}

            {active && m.value === "netbanking" && (
              <div className="flex flex-col gap-4 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-4 sm:p-5">
                <label>
                  <span className={labelClass}>Select your bank</span>
                  <span className="relative block">
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className={`${inputClass} appearance-none pr-32`}
                    >
                      {banks.map((b) => (
                        <option key={b.name}>{b.name}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                      <BrandLogo
                        name={selectedBank.logo}
                        alt={selectedBank.name}
                        fallback={<BankMark short={selectedBank.short} />}
                        className="h-5"
                        dark={selectedBank.dark}
                      />
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
                      placeholder="Account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className={`${inputClass} pr-28`}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <BrandLogo
                        name={selectedBank.logo}
                        alt=""
                        fallback={<BankMark short={selectedBank.short} />}
                        className="h-5"
                        dark={selectedBank.dark}
                      />
                    </span>
                  </span>
                </label>
                <p className="t-caption">
                  A payment request is sent to your bank. Approve it in mBoB,
                  mPay or your bank&rsquo;s app and enter the one-time code it
                  sends you.
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
              <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-4 sm:p-5">
                <p className="t-body-sm">
                  You&rsquo;ll be taken to PayPal to approve {format(amountDue)}
                  , then brought back here.
                </p>
                <a
                  href="https://www.paypal.com/checkoutnow"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => finish("PayPal")}
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-[#ffc439] transition-colors hover:bg-[#f2b92c]"
                >
                  <BrandLogo
                    name="paypal"
                    alt="PayPal"
                    fallback={<PayPalMark size="lg" />}
                    className="h-6"
                  />
                </a>
                {terms}
              </div>
            )}
          </div>
        );
      })}
    </fieldset>
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
          <h1 className="t-h2">Payment</h1>
        </div>

        <div className="mb-8">
          <BookingStepper
            current={4}
            hrefs={stepHrefs}
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
              fare={fare}
              netPayable={netPayable}
              payNow={amountDue}
              payLater={balance}
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
              <h2 className="t-h3">
                {selfDrive ? "Collecting the car" : "Your driver"}
              </h2>
              <div className="mt-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card">
                {driverCard}
              </div>

              {travelerName && (
                <>
                  <div className="mt-10 flex items-center justify-between gap-3">
                    <h2 className="t-h3">{detailsLabel}</h2>
                    <Link
                      to={detailsHref}
                      aria-label={`Edit ${detailsLabel.toLowerCase()}`}
                      className="icon-btn icon-btn-filled size-10"
                    >
                      <Icon name="edit" size={16} />
                    </Link>
                  </div>
                  <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card sm:grid-cols-2">
                    {detailRows.map(([k, v]) => (
                      <div key={k} className="min-w-0">
                        <dt className="t-caption">{k}</dt>
                        <dd className="break-words t-body font-semibold text-[color:var(--color-ink)]">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}

              <h2 className="mt-10 t-h3">Add-ons</h2>
              <div className="mt-4 flex flex-col gap-4">
                {addOns.map((addOn) => (
                  <AddOnCard
                    key={addOn.id}
                    addOn={addOn}
                    added={booking.addOnIds.includes(addOn.id)}
                    price={format(addOn.pricePerDay)}
                    onToggle={() =>
                      updateBooking({
                        addOnIds: booking.addOnIds.includes(addOn.id)
                          ? booking.addOnIds.filter((x) => x !== addOn.id)
                          : [...booking.addOnIds, addOn.id],
                      })
                    }
                  />
                ))}
              </div>

              <h2 className="mt-10 t-h3">Payment method</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white shadow-card">
                {otpStage ? otpPanel : methodList}
              </div>

              {method === "card" && !otpStage && (
                <div className="mt-8 hidden flex-col items-end lg:flex">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => finish("Credit Card")}
                  >
                    Pay {format(amountDue)}
                  </Button>
                  {terms}
                </div>
              )}
            </>
          }
        />
      </div>

      {/* Mobile: card payments confirm from the bottom bar, like Continue on the other steps. */}
      {method === "card" && !otpStage && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-[color:var(--color-border)] bg-white p-4 shadow-[0px_-2px_14px_rgba(0,0,0,0.08)] lg:hidden">
          <div className="flex flex-col items-start">
            <span className="t-h3 t-amount">{format(amountDue)}</span>
            <span className="t-caption">
              {balance > 0
                ? `of ${format(netPayable)} total`
                : "incl. taxes & fees"}
            </span>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => finish("Credit Card")}
          >
            Pay now
          </Button>
        </div>
      )}
    </PageShell>
  );
}
