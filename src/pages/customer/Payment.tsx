import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import BookingStepper from "../../components/BookingStepper";
import BookingRouteCard from "../../components/BookingRouteCard";
import { routes } from "../../lib/routes";
import { vehicles } from "../../data/mockData";
import { useCurrency } from "../../lib/currency";
import { usePageTitle } from "../../hooks/usePageTitle";

type PaymentMethod = "netbanking" | "card";

const banks = ["Bank of Bhutan", "Bhutan National Bank", "Druk PNB Bank", "T Bank"];

export default function Payment() {
  usePageTitle("Payment");
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];

  const pickup = searchParams.get("pickup") || vehicle.location;
  const dropoff = searchParams.get("dropoff") || vehicle.location;
  const date = searchParams.get("date") || "";
  const travelerName = searchParams.get("travelerName") || "";
  const travelerEmail = searchParams.get("travelerEmail") || "";
  const travelerPhone = searchParams.get("travelerPhone") || "";
  const grandTotal = Number(searchParams.get("grandTotal")) || vehicle.pricePerDay;
  const amountDue = Number(searchParams.get("amountDue")) || grandTotal;

  const [method, setMethod] = useState<PaymentMethod>("netbanking");
  const [bank, setBank] = useState(banks[0]);
  const [accountNumber, setAccountNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const inputClasses =
    "w-full rounded-lg border border-[color:var(--color-border)] px-3.5 py-2.5 t-body-sm text-[color:var(--color-ink)] placeholder:text-[color:var(--color-muted)] outline-none focus:border-[color:var(--color-ink)] focus:ring-2 focus:ring-[color:var(--color-ink)]/10";
  const labelClasses = "mb-1.5 block t-caption font-semibold text-[color:var(--color-ink-soft)]";

  function handlePay() {
    const params = new URLSearchParams(searchParams);
    params.set("vehicleId", vehicle.id);
    params.set("method", method === "card" ? "Credit Card" : `Net Banking (${bank})`);
    navigate(`${routes.paymentVerify}?${params.toString()}`);
  }

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[1320px] px-4 pb-10 pt-6 md:px-10 md:pt-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 t-body-sm font-semibold text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
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
            <h2 className="t-h3 text-[color:var(--color-ink)]">Choose your payment method</h2>

            <div className="mt-4 flex flex-col gap-3">
              {/* Net Banking */}
              <div
                className={`rounded-xl bg-[color:var(--color-surface-subtle)] p-4 transition-colors ${method === "netbanking" ? "ring-2 ring-[color:var(--color-ink)]" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setMethod("netbanking")}
                  className="flex w-full items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${method === "netbanking" ? "border-[color:var(--color-ink)]" : "border-[color:var(--color-border)]"}`}
                    >
                      {method === "netbanking" && <span className="size-2.5 rounded-full bg-[color:var(--color-ink)]" />}
                    </span>
                    <span className="text-left">
                      <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">Net Banking</span>
                      <span className="block t-caption text-[color:var(--color-muted)]">All the major banks available</span>
                    </span>
                  </span>
                  <Icon name="bank" size={22} className="shrink-0 text-[color:var(--color-ink)]" />
                </button>

                {method === "netbanking" && (
                  <div className="mt-4 flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-4">
                    <div>
                      <label className={labelClasses}>Select your bank</label>
                      <select value={bank} onChange={(e) => setBank(e.target.value)} className={inputClasses}>
                        {banks.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClasses}>
                        Bank account number <span className="font-normal text-[color:var(--color-muted)]">(Savings/Current/Overdraft only)</span>
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

              {/* Card */}
              <div
                className={`rounded-xl bg-[color:var(--color-surface-subtle)] p-4 transition-colors ${method === "card" ? "ring-2 ring-[color:var(--color-ink)]" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className="flex w-full items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${method === "card" ? "border-[color:var(--color-ink)]" : "border-[color:var(--color-border)]"}`}
                    >
                      {method === "card" && <span className="size-2.5 rounded-full bg-[color:var(--color-ink)]" />}
                    </span>
                    <span className="text-left">
                      <span className="block t-body-sm font-bold text-[color:var(--color-ink)]">Debit/Credit/ATM Card</span>
                      <span className="block t-caption text-[color:var(--color-muted)]">Visa, Mastercard, Rupay and more</span>
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="rounded bg-white px-1.5 py-1 t-label font-bold italic text-[color:var(--color-link)] shadow-sm">VISA</span>
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
                        <label className={labelClasses}>Expiry Date (MM / YYYY)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="MM"
                            maxLength={2}
                            value={expiryMonth}
                            onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, ""))}
                            className={inputClasses}
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="YYYY"
                            maxLength={4}
                            value={expiryYear}
                            onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, ""))}
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
              <h2 className="t-h3 text-[color:var(--color-ink)]">Your Booking</h2>
              <BookingRouteCard vehicle={vehicle} pickup={pickup} dropoff={dropoff} date={date} />

              {travelerName && (
                <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-4">
                  <p className="flex items-center gap-1.5 t-body-sm font-bold text-[color:var(--color-ink)]">
                    <Icon name="user" size={15} />
                    Travelers
                  </p>
                  <p className="mt-2 t-body-sm font-semibold uppercase text-[color:var(--color-ink)]">{travelerName}</p>
                  <p className="t-caption text-[color:var(--color-muted)]">
                    {travelerEmail}
                    {travelerPhone && ` | ${travelerPhone}`}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl border border-[color:var(--color-border)] bg-white p-4">
                <p className="text-base font-bold text-[color:var(--color-ink)]">Grand Total</p>
                <p className="text-base font-bold text-[color:var(--color-success)]">{format(amountDue)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
