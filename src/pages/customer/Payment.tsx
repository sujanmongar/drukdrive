import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import VehicleImage from "../../components/VehicleImage";
import BookingStepper from "../../components/BookingStepper";
import { routes } from "../../lib/routes";
import { vehicles } from "../../data/mockData";
import { computeFare } from "../../lib/pricing";
import { useCurrency } from "../../lib/currency";

type PaymentMethod = "card" | "paypal" | "netbanking";

export default function Payment() {
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const { total } = computeFare(vehicle.pricePerDay);

  const inputClasses =
    "w-full rounded-lg border border-[#e5ebf0] px-3.5 py-2.5 text-sm text-[#222] placeholder:text-[#747474] focus:outline-none focus:border-[#222] focus:ring-2 focus:ring-[#222]/10";
  const labelClasses = "mb-1.5 block text-xs font-semibold text-[#333]";

  const handlePay = () => {
    const params = new URLSearchParams(searchParams);
    params.set("vehicleId", vehicle.id);
    params.set("total", total.toFixed(2));
    navigate(`${routes.paymentVerify}?${params.toString()}`);
  };

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[1000px] px-4 pb-32 pt-6 md:px-[60px] md:pt-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#333] hover:text-[#222]"
        >
          <Icon name="arrow-left" size={18} />
          Back
        </button>

        <BookingStepper current={3} />

        <div className="mt-8 flex items-center gap-4 rounded-xl bg-neutral-50 p-4">
          <VehicleImage vehicleId={vehicle.id} category={vehicle.category} className="size-14 shrink-0 rounded-lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-[#222]">{vehicle.name}</p>
              <span className="rounded-full bg-[color:var(--color-info-bg)] px-2 py-0.5 text-[9px] font-semibold uppercase text-[color:var(--color-info-text)]">
                {vehicle.category}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[color:var(--color-muted)]">{vehicle.type}</p>
          </div>
        </div>

        <h2 className="mt-8 text-lg font-bold text-[#222]">Choose your payment method</h2>

        <div className="mt-4 flex flex-col gap-3">
          {/* Card */}
          <div
            className={`rounded-xl bg-neutral-50 p-4 transition-colors ${method === "card" ? "ring-2 ring-[#222]" : ""}`}
          >
            <button
              type="button"
              onClick={() => setMethod("card")}
              className="flex w-full items-center justify-between gap-3"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${method === "card" ? "border-[#222]" : "border-[color:var(--color-border)]"}`}
                >
                  {method === "card" && <span className="size-2.5 rounded-full bg-[#222]" />}
                </span>
                <span className="text-sm font-bold text-[#222]">Debit/Credit Card</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="rounded bg-white px-1.5 py-1 text-[10px] font-extrabold italic text-blue-700 shadow-sm">VISA</span>
                <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-amber-400" />
              </span>
            </button>
            {method === "card" && (
              <div className="mt-4 flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-4">
                <div>
                  <label className={labelClasses}>Card number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Name on card</label>
                  <input
                    type="text"
                    placeholder="Karma Dorji"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClasses}>Expiry date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>CVV</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      placeholder="123"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[color:var(--color-muted)]">
                  <Icon name="lock" size={14} />
                  Your payment info is encrypted and secure.
                </div>
              </div>
            )}
          </div>

          {/* PayPal */}
          <div
            className={`rounded-xl bg-neutral-50 p-4 transition-colors ${method === "paypal" ? "ring-2 ring-[#222]" : ""}`}
          >
            <button
              type="button"
              onClick={() => setMethod("paypal")}
              className="flex w-full items-center justify-between gap-3"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${method === "paypal" ? "border-[#222]" : "border-[color:var(--color-border)]"}`}
                >
                  {method === "paypal" && <span className="size-2.5 rounded-full bg-[#222]" />}
                </span>
                <span className="text-sm font-bold text-[#222]">PayPal</span>
              </span>
              <span className="text-sm font-extrabold italic text-blue-800">
                Pay<span className="text-sky-500">Pal</span>
              </span>
            </button>
            {method === "paypal" && (
              <div className="mt-4 border-t border-[color:var(--color-border)] pt-4">
                <div className="flex items-start gap-2 rounded-lg bg-[color:var(--color-info-bg)] px-3.5 py-3 text-xs text-[color:var(--color-info-text)]">
                  <Icon name="info" size={16} className="shrink-0" />
                  You will be redirected to PayPal to complete your payment securely.
                </div>
                <button
                  type="button"
                  onClick={handlePay}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 text-sm font-extrabold italic text-blue-900 transition-colors hover:bg-amber-300"
                >
                  Pay via PayPal
                </button>
              </div>
            )}
          </div>

          {/* Net Banking */}
          <div
            className={`rounded-xl bg-neutral-50 p-4 transition-colors ${method === "netbanking" ? "ring-2 ring-[#222]" : ""}`}
          >
            <button
              type="button"
              onClick={() => setMethod("netbanking")}
              className="flex w-full items-center justify-between gap-3"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${method === "netbanking" ? "border-[#222]" : "border-[color:var(--color-border)]"}`}
                >
                  {method === "netbanking" && <span className="size-2.5 rounded-full bg-[#222]" />}
                </span>
                <span className="text-sm font-bold text-[#222]">Net Banking</span>
              </span>
              <Icon name="bank" size={20} className="text-[#222]" />
            </button>
            {method === "netbanking" && (
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[color:var(--color-border)] pt-4 sm:grid-cols-4">
                {["Bank of Bhutan", "Bhutan National Bank", "Druk PNB Bank", "T Bank"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    className="rounded-lg border border-[color:var(--color-border)] px-3 py-2.5 text-center text-xs font-semibold text-[#222] hover:border-[#222]"
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--color-border)] bg-white p-4 shadow-[0px_-2px_14px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[color:var(--color-muted)]">Net Payable</p>
            <p className="text-lg font-extrabold text-[#222]">{format(total)}</p>
          </div>
          {method !== "paypal" && (
            <button
              type="button"
              onClick={handlePay}
              className="rounded-xl bg-[#222] px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-black"
            >
              Proceed to Payment
            </button>
          )}
        </div>
      </div>
    </PageShell>
  );
}
