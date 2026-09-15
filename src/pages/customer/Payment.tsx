import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import BookingStepper from "../../components/BookingStepper";
import BookingRouteCard from "../../components/BookingRouteCard";
import { routes } from "../../lib/routes";
import { vehicles } from "../../data/mockData";
import { useCurrency, currencies } from "../../lib/currency";
import { usePageTitle } from "../../hooks/usePageTitle";
import { formatDropoff, formatPickup, parseBooking } from "../../lib/booking";
import { computeFare, isAddOnId } from "../../lib/pricing";
import { useClientType } from "../../lib/clientType";

type PaymentMethod = "mbob" | "netbanking" | "card";

const banks = [
  "Bank of Bhutan",
  "Bhutan National Bank",
  "Druk PNB Bank",
  "T Bank",
];

export default function Payment() {
  usePageTitle("Payment");
  const navigate = useNavigate();
  const { format, currency } = useCurrency();
  const [searchParams] = useSearchParams();
  const { clientType: storedClientType } = useClientType();
  const booking = parseBooking(searchParams, isAddOnId);
  const vehicle =
    vehicles.find((v) => v.id === booking.vehicleId) ?? vehicles[0];
  // The details step stamps the client type into the URL so a refresh here
  // keeps the same method list and wording.
  const clientType =
    searchParams.get("clientType") === "local"
      ? "local"
      : searchParams.get("clientType") === "tourist"
        ? "tourist"
        : storedClientType;
  const fare = computeFare(booking, vehicle.pricePerDay, format);

  const { pickup, dropoff } = booking;
  const date = formatPickup(booking);
  const travelerName = searchParams.get("travelerName") || "";
  const travelerEmail = searchParams.get("travelerEmail") || "";
  const travelerPhone = searchParams.get("travelerPhone") || "";
  const grandTotal = Number(searchParams.get("total")) || fare.total;
  const amountDue = Number(searchParams.get("amountDue")) || grandTotal;
  const balance = Math.round((grandTotal - amountDue) * 100) / 100;

  // Residents pay by mBoB, net banking or card; visitors by card.
  const methods: PaymentMethod[] =
    clientType === "local" ? ["mbob", "netbanking", "card"] : ["card"];
  const [method, setMethod] = useState<PaymentMethod>(methods[0]);
  const [mbobNumber, setMbobNumber] = useState("");
  const nu = currencies.find((c) => c.code === "BTN")!;
  const inNu = (usd: number) =>
    `${nu.symbol} ${Math.round(usd * nu.rateFromUsd).toLocaleString()}`;
  const showNu = clientType === "tourist" && currency !== "BTN";
  const [bank, setBank] = useState(banks[0]);
  const [accountNumber, setAccountNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const inputClasses =
    "w-full rounded-lg border border-[color:var(--color-border)] px-3.5 py-2.5 t-body-sm text-[color:var(--color-ink)] placeholder:text-[color:var(--color-muted)] outline-none focus:border-[color:var(--color-ink)] focus:ring-2 focus:ring-[color:var(--color-ink)]/10";
  const labelClasses =
    "mb-1.5 block t-caption font-semibold text-[color:var(--color-ink-soft)]";

  function handlePay() {
    const params = new URLSearchParams(searchParams);
    params.set("vehicleId", vehicle.id);
    params.set(
      "method",
      method === "card"
        ? "Credit Card"
        : method === "mbob"
          ? "mBoB"
          : `Net Banking (${bank})`,
    );
    navigate(`${routes.paymentVerify}?${params.toString()}`);
  }

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[1320px] px-4 pb-10 pt-6 md:px-10 md:pt-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex min-h-11 cursor-pointer items-center gap-2 t-body-sm font-semibold text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
        >
          <Icon name="arrow-left" size={18} />
          Back
        </button>

        <div className="mb-6">
          <BookingStepper current={3} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left: payment methods */}
          <div className="min-w-0">
            <h2 className="t-h3 text-[color:var(--color-ink)]">
              Choose your payment method
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              {/* mBoB — residents only */}
              {methods.includes("mbob") && (
                <div
                  className={`rounded-xl bg-[color:var(--color-surface-subtle)] p-4 transition-colors ${method === "mbob" ? "ring-2 ring-[color:var(--color-ink)]" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => setMethod("mbob")}
                    className="flex min-h-11 w-full items-center justify-between gap-3"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${method === "mbob" ? "border-[color:var(--color-ink)]" : "border-[color:var(--color-border)]"}`}
                      >
                        {method === "mbob" && (
                          <span className="size-2.5 rounded-full bg-[color:var(--color-ink)]" />
                        )}
                      </span>
                      <span className="text-left">
                        <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">
                          mBoB
                        </span>
                        <span className="block t-caption text-[color:var(--color-muted)]">
                          Approve the payment in the Bank of Bhutan app
                        </span>
                      </span>
                    </span>
                    <Icon
                      name="phone"
                      size={22}
                      className="shrink-0 text-[color:var(--color-ink)]"
                    />
                  </button>
                  {method === "mbob" && (
                    <div className="mt-4 flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-4">
                      <div>
                        <label className={labelClasses}>
                          Mobile number linked to mBoB
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="+975 17 000 000"
                          value={mbobNumber}
                          onChange={(e) => setMbobNumber(e.target.value)}
                          className={inputClasses}
                        />
                      </div>
                      <p className="t-caption text-[color:var(--color-muted)]">
                        A payment request is sent to your phone; approve it in
                        the app to confirm the booking.
                      </p>
                      <button
                        type="button"
                        onClick={handlePay}
                        className="mt-1 w-full rounded-xl bg-[color:var(--color-ink)] py-3 t-body-sm font-bold text-white transition-colors hover:bg-black"
                      >
                        Pay {format(amountDue)}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Net Banking — residents only */}
              {methods.includes("netbanking") && (
                <div
                  className={`rounded-xl bg-[color:var(--color-surface-subtle)] p-4 transition-colors ${method === "netbanking" ? "ring-2 ring-[color:var(--color-ink)]" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => setMethod("netbanking")}
                    className="flex min-h-11 w-full items-center justify-between gap-3"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${method === "netbanking" ? "border-[color:var(--color-ink)]" : "border-[color:var(--color-border)]"}`}
                      >
                        {method === "netbanking" && (
                          <span className="size-2.5 rounded-full bg-[color:var(--color-ink)]" />
                        )}
                      </span>
                      <span className="text-left">
                        <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">
                          Net Banking
                        </span>
                        <span className="block t-caption text-[color:var(--color-muted)]">
                          All the major banks available
                        </span>
                      </span>
                    </span>
                    <Icon
                      name="bank"
                      size={22}
                      className="shrink-0 text-[color:var(--color-ink)]"
                    />
                  </button>

                  {method === "netbanking" && (
                    <div className="mt-4 flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-4">
                      <div>
                        <label className={labelClasses}>Select your bank</label>
                        <select
                          value={bank}
                          onChange={(e) => setBank(e.target.value)}
                          className={inputClasses}
                        >
                          {banks.map((b) => (
                            <option key={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClasses}>
                          Bank account number{" "}
                          <span className="font-normal text-[color:var(--color-muted)]">
                            (Savings/Current/Overdraft only)
                          </span>
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter your bank account number"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className={inputClasses}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handlePay}
                        className="mt-1 w-full rounded-xl bg-[color:var(--color-ink)] py-3.5 t-body-sm font-bold text-white transition-colors hover:bg-black"
                      >
                        Pay {format(amountDue)}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Card */}
              <div
                className={`rounded-xl bg-[color:var(--color-surface-subtle)] p-4 transition-colors ${method === "card" ? "ring-2 ring-[color:var(--color-ink)]" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className="flex min-h-11 w-full items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${method === "card" ? "border-[color:var(--color-ink)]" : "border-[color:var(--color-border)]"}`}
                    >
                      {method === "card" && (
                        <span className="size-2.5 rounded-full bg-[color:var(--color-ink)]" />
                      )}
                    </span>
                    <span className="text-left">
                      <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">
                        {clientType === "tourist"
                          ? "Credit or debit card"
                          : "Debit/Credit/ATM Card"}
                      </span>
                      <span className="block t-caption text-[color:var(--color-muted)]">
                        Visa, Mastercard, Rupay and more
                      </span>
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="rounded bg-white px-1.5 py-1 t-label font-bold italic text-[color:var(--color-link)] shadow-sm">
                      VISA
                    </span>
                    <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-amber-400" />
                  </span>
                </button>

                {method === "card" && (
                  <div className="mt-4 flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className={labelClasses}>Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="Enter your name"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Card Number</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className={inputClasses}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>
                          Expiry Date (MM / YYYY)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="MM"
                            maxLength={2}
                            value={expiryMonth}
                            onChange={(e) =>
                              setExpiryMonth(e.target.value.replace(/\D/g, ""))
                            }
                            className={inputClasses}
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="YYYY"
                            maxLength={4}
                            value={expiryYear}
                            onChange={(e) =>
                              setExpiryYear(e.target.value.replace(/\D/g, ""))
                            }
                            className={inputClasses}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelClasses}>CVC/CVV</label>
                        <input
                          type="password"
                          inputMode="numeric"
                          placeholder="0000"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className={inputClasses}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 t-caption text-[color:var(--color-muted)]">
                      <Icon name="lock" size={14} />
                      Your payment info is encrypted and secure.
                    </div>
                    <button
                      type="button"
                      onClick={handlePay}
                      className="mt-1 w-full rounded-xl bg-[color:var(--color-ink)] py-3.5 t-body-sm font-bold text-white transition-colors hover:bg-black"
                    >
                      Pay {format(amountDue)}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: booking summary sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-4">
              <h2 className="t-h3 text-[color:var(--color-ink)]">
                Your Booking
              </h2>
              <BookingRouteCard
                vehicle={vehicle}
                pickup={pickup}
                dropoff={dropoff}
                date={date}
                dropoffWhen={formatDropoff(booking)}
              />

              {travelerName && (
                <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-4">
                  <p className="flex items-center gap-1.5 t-body-sm font-bold text-[color:var(--color-ink)]">
                    <Icon name="user" size={15} />
                    Travelers
                  </p>
                  <p className="mt-2 t-body-sm font-semibold uppercase text-[color:var(--color-ink)]">
                    {travelerName}
                  </p>
                  <p className="t-caption text-[color:var(--color-muted)]">
                    {travelerEmail}
                    {travelerPhone && ` | ${travelerPhone}`}
                  </p>
                </div>
              )}

              {/* What is paid now, what is paid later, and any deposit. */}
              <dl className="flex flex-col gap-2 rounded-xl border border-[color:var(--color-border)] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <dt>
                    <span className="block t-body font-bold text-[color:var(--color-ink)]">
                      Paying now
                    </span>
                    <span className="block t-caption text-[color:var(--color-muted)]">
                      {balance > 0 ? "Half the fare" : "The full fare"}
                      {showNu && ` · ≈ ${inNu(amountDue)}`}
                    </span>
                  </dt>
                  <dd className="shrink-0 t-body font-bold tabular text-[color:var(--color-success)]">
                    {format(amountDue)}
                  </dd>
                </div>
                {balance > 0 && (
                  <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-2">
                    <dt>
                      <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">
                        Balance at pick-up
                      </span>
                      <span className="block t-caption text-[color:var(--color-muted)]">
                        {clientType === "tourist"
                          ? "To the driver, cash (Nu) or card"
                          : "To the driver, mBoB, card or cash"}
                        {showNu && ` · ≈ ${inNu(balance)}`}
                      </span>
                    </dt>
                    <dd className="shrink-0 t-body-sm font-bold tabular text-[color:var(--color-ink)]">
                      {format(balance)}
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
                        Refundable within 3 days of return
                      </span>
                    </dt>
                    <dd className="shrink-0 t-body-sm font-bold tabular text-[color:var(--color-ink)]">
                      {format(fare.deposit)}
                    </dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-2 t-caption text-[color:var(--color-muted)]">
                  <dt>Trip total, taxes and fees included</dt>
                  <dd className="tabular font-semibold">
                    {format(grandTotal)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
