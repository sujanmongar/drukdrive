import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";
import { currentUser } from "../../data/mockData";
import { useAuth } from "../../lib/auth";
import { usePageTitle } from "../../hooks/usePageTitle";

const OTP_LENGTH = 6;

type LocationState = {
  role?: "customer" | "driver";
} | null;

export default function Otp() {
  usePageTitle("Verify OTP");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const state = location.state as LocationState;
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [justResent, setJustResent] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  function handleResend() {
    if (secondsLeft > 0) return;
    setDigits(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
    setSecondsLeft(30);
    setJustResent(true);
    setTimeout(() => setJustResent(false), 3000);
  }

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login();
    if (state?.role === "driver") {
      navigate(routes.providerBookings);
    } else {
      navigate(routes.home);
    }
  };

  const boxes = (
    <div className="flex justify-between gap-2 sm:gap-3">
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
          className={`size-[48px] rounded-2xl border text-center text-xl font-bold text-[color:var(--color-ink-87)] outline-none transition-colors sm:size-[56px] ${
            digit ? "border-[color:var(--color-ink-87)]" : "border-[color:var(--color-border)]"
          } focus:border-[color:var(--color-ink-87)]`}
        />
      ))}
    </div>
  );

  const resendRow = (
    <div className="mt-6 flex items-center justify-between text-sm text-[color:var(--color-ink-87)]">
      <span>{secondsLeft > 0 ? `Time remaining ${secondsLeft}s` : justResent ? "OTP resent" : ""}</span>
      <span className="flex items-center gap-2">
        <span className="text-[#929292]">Didn&rsquo;t receive?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={secondsLeft > 0}
          className={`font-semibold ${
            secondsLeft > 0 ? "cursor-not-allowed text-[color:var(--color-muted)]" : "text-[color:var(--color-ink)] underline"
          }`}
        >
          Resend OTP
        </button>
      </span>
    </div>
  );

  return (
    <PageShell noFooter>
      <div className="mx-auto flex min-h-[75vh] w-full max-w-[1440px] items-center justify-center bg-neutral-50 px-4 py-12 md:px-[60px]">
        {/* Desktop */}
        <div className="relative hidden w-full max-w-[440px] flex-col rounded-xl border border-[color:var(--color-border)] bg-white p-8 shadow-[0px_2px_14px_rgba(0,0,0,0.1)] md:flex">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute left-6 top-6 text-[color:var(--color-ink)]"
          >
            <Icon name="chevron-left" size={22} />
          </button>
          <h1 className="mb-1 mt-8 text-2xl font-bold text-[color:var(--color-ink-87)]">Verify your mobile number</h1>
          <p className="mb-6 text-sm text-[color:var(--color-ink-87)]">
            OTP has been sent to <span className="text-lg font-bold">{currentUser.phone}</span>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col">
            {boxes}
            {resendRow}
            <Button type="submit" size="lg" fullWidth className="mt-6">
              Verify
            </Button>
          </form>
        </div>

        {/* Mobile */}
        <div className="w-full max-w-md md:hidden">
          <div className="mb-8 flex items-center">
            <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="text-[color:var(--color-ink)]">
              <Icon name="arrow-left" size={22} />
            </button>
          </div>
          <h1 className="mb-1 text-[34px] font-bold leading-tight text-[color:var(--color-ink)]">Verify your mobile number</h1>
          <p className="mb-6 text-sm text-[color:var(--color-ink-87)]">
            OTP has been sent to <span className="text-lg font-bold">{currentUser.phone}</span>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col">
            {boxes}
            {resendRow}
            <Button type="submit" size="lg" fullWidth className="mt-6">
              Verify
            </Button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
