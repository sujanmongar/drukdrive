import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import BookingRouteCard from "../../components/BookingRouteCard";
import { routes } from "../../lib/routes";
import { vehicles } from "../../data/mockData";
import { useCurrency } from "../../lib/currency";

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 113; // matches the "Time left: 1:53" reference

function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function PaymentVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();

  const vehicleId = searchParams.get("vehicleId");
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];
  const pickup = searchParams.get("pickup") || vehicle.location;
  const dropoff = searchParams.get("dropoff") || vehicle.location;
  const date = searchParams.get("date") || "";
  const amountDue = Number(searchParams.get("amountDue")) || vehicle.pricePerDay;

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH;

  function handleChange(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePay() {
    if (!isComplete) {
      setTouched(true);
      return;
    }
    const params = new URLSearchParams(searchParams);
    navigate(`${routes.paymentSuccess}?${params.toString()}`);
  }

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[1320px] px-4 pb-10 pt-6 md:px-[60px] md:pt-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left: OTP form */}
          <div className="flex min-w-0 flex-col items-center pt-6 text-center lg:items-start lg:pt-10 lg:text-left">
            <h1 className="text-2xl font-bold text-[#222] md:text-3xl">OTP Verification</h1>
            <p className="mt-3 max-w-sm text-sm text-[color:var(--color-muted)]">
              An OTP has been sent to your mobile number and email associated with your account. OTP is valid for
              the next {Math.ceil(COUNTDOWN_SECONDS / 60)} minutes only.
            </p>

            <div className="mt-8 flex gap-2 sm:gap-3">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  className={`size-[48px] rounded-2xl border text-center text-xl font-bold text-[#222] outline-none transition-colors sm:size-[56px] ${
                    digit ? "border-[#222]" : "border-[color:var(--color-border)]"
                  } ${touched && !isComplete ? "border-[color:var(--color-danger)]" : ""} focus:border-[#222]`}
                />
              ))}
            </div>
            {touched && !isComplete && (
              <p className="mt-2 text-xs text-[color:var(--color-danger)]">Enter the full 6-digit code.</p>
            )}

            <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-danger)]">
              <Icon name="clock" size={15} />
              Time left: {formatCountdown(secondsLeft)}
            </p>

            <button
              type="button"
              onClick={handlePay}
              className="mt-6 w-full max-w-md rounded-xl bg-[#222] py-4 text-base font-bold text-white transition-colors hover:bg-black"
            >
              Pay {format(amountDue)} Now
            </button>

            <p className="mt-4 max-w-md text-xs text-[color:var(--color-muted)]">
              By continuing to pay, I understand and agree with the{" "}
              <span className="font-semibold text-[#2276e3]">privacy policy</span>, the{" "}
              <span className="font-semibold text-[#2276e3]">user agreement</span> and{" "}
              <span className="font-semibold text-[#2276e3]">terms of service</span> of DrukDrive.
            </p>
          </div>

          {/* Right: booking summary sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-[#222]">Your Booking</h2>
              <BookingRouteCard vehicle={vehicle} pickup={pickup} dropoff={dropoff} date={date} />
              <div className="flex items-center justify-between rounded-xl border border-[color:var(--color-border)] bg-white p-4">
                <p className="text-base font-bold text-[#222]">Grand Total</p>
                <p className="text-base font-bold text-[color:var(--color-success)]">{format(amountDue)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
