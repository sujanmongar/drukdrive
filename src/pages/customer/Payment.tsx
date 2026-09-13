import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { routes } from "../../lib/routes";
import { vehicles } from "../../data/mockData";
import { RENTAL_DAYS, computeFare } from "../../lib/pricing";
import { useCurrency } from "../../lib/currency";

type PaymentMethod = "netbanking" | "card" | "wallet";

const banks = ["Bank of Bhutan", "Bhutan National Bank", "Druk PNB Bank", "T Bank"];

const methods: { id: PaymentMethod; label: string; icon: "bank" | "credit-card" | "wallet" }[] = [
  { id: "netbanking", label: "Net Banking", icon: "bank" },
  { id: "card", label: "Credit/Debit Card", icon: "credit-card" },
  { id: "wallet", label: "PayPal / Wallet", icon: "wallet" },
];

export default function Payment() {
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [bank, setBank] = useState(banks[0]);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const { baseFare, taxes, total } = computeFare(vehicle.pricePerDay);

  const inputClasses =
    "w-full rounded-lg border border-[#e5ebf0] px-3.5 py-2.5 text-sm text-[#222] placeholder:text-[#747474] focus:outline-none focus:border-[#222] focus:ring-2 focus:ring-[#222]/10";
  const labelClasses = "mb-1.5 block text-xs font-semibold text-[#333]";

  const handlePay = () => {
    const params = new URLSearchParams({ vehicleId: vehicle.id, total: total.toFixed(2) });
    navigate(`${routes.paymentVerify}?${params.toString()}`);
  };

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-[60px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#333] hover:text-[#222]"
        >
          <Icon name="arrow-left" size={18} />
          Back
        </button>

        <h1 className="text-2xl font-bold text-[#222] md:text-3xl">Payment</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          Choose a payment method to complete your booking.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left: method selector + form */}
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-2.5 rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition-colors cursor-pointer ${
                    method === m.id
                      ? "border-[#222] bg-[#222] text-white"
                      : "border-[#e5ebf0] text-[#222] hover:border-[#222]/40"
                  }`}
                >
                  <Icon name={m.icon} size={20} />
                  {m.label}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-[#e5ebf0] p-6 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
              {method === "netbanking" && (
                <div>
                  <h2 className="mb-4 text-base font-bold text-[#222]">Select your bank</h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {banks.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBank(b)}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors cursor-pointer ${
                          bank === b
                            ? "border-[#222] ring-1 ring-[#222]"
                            : "border-[#e5ebf0] hover:border-[#222]/40"
                        }`}
                      >
                        <Icon name="bank" size={18} />
                        {b}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-[color:var(--color-info-bg)] px-3.5 py-3 text-xs text-[color:var(--color-info-text)]">
                    <Icon name="info" size={16} />
                    <span>You&apos;ll be redirected to {bank} to securely complete this payment.</span>
                  </div>
                </div>
              )}

              {method === "card" && (
                <div>
                  <h2 className="mb-4 text-base font-bold text-[#222]">Card details</h2>
                  <div className="grid grid-cols-1 gap-4">
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
                    <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-[color:var(--color-muted)]">
                    <Icon name="lock" size={14} />
                    Your payment info is encrypted and secure.
                  </div>
                </div>
              )}

              {method === "wallet" && (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#f4f6f8]">
                    <Icon name="wallet" size={26} />
                  </div>
                  <h2 className="text-base font-bold text-[#222]">Pay with PayPal / Wallet</h2>
                  <p className="mt-1.5 max-w-xs text-sm text-[color:var(--color-muted)]">
                    You&apos;ll be redirected to PayPal to log in and confirm this payment securely.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: fare summary */}
          <aside className="h-fit rounded-xl border border-[#e5ebf0] p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)] lg:sticky lg:top-6">
            <div className="flex gap-3">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="size-16 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-bold text-[#222]">{vehicle.name}</p>
                <p className="text-xs text-[color:var(--color-muted)]">{vehicle.type}</p>
                <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                  24 Sep, 10:00 &ndash; 27 Sep, 10:00 &middot; {RENTAL_DAYS} days
                </p>
              </div>
            </div>

            <div className="my-4 h-px bg-[#e5ebf0]" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#333]">
                <span>Base fare &times; {RENTAL_DAYS} days</span>
                <span>{format(baseFare)}</span>
              </div>
              <div className="flex justify-between text-[#333]">
                <span>Taxes &amp; fees (10%)</span>
                <span>{format(taxes)}</span>
              </div>
            </div>

            <div className="my-4 h-px bg-[#e5ebf0]" />

            <div className="flex justify-between text-base font-bold text-[#222]">
              <span>Total</span>
              <span>{format(total)}</span>
            </div>

            <Button variant="primary" size="lg" fullWidth className="mt-5" onClick={handlePay}>
              Pay {format(total)}
            </Button>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
