import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../../components/AuthShell";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";
import { useCurrentUser } from "../../lib/currentUser";
import { useAuth } from "../../lib/auth";
import { usePageTitle } from "../../hooks/usePageTitle";
import { otpDigit } from "../../lib/ui";

const OTP_LENGTH = 6;

type LocationState = {
  role?: "customer" | "driver";
} | null;

export default function Otp() {
  usePageTitle("Verify OTP");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { user: currentUser } = useCurrentUser();
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
          className={`${otpDigit} ${
            digit
              ? "border-[color:var(--color-ink)]"
              : "border-[color:var(--color-border)]"
          }`}
        />
      ))}
    </div>
  );

  const resendRow = (
    <div className="mt-6 flex items-center justify-between t-body-sm">
      <span>
        {secondsLeft > 0
          ? `Time remaining ${secondsLeft}s`
          : justResent
            ? "OTP resent"
            : ""}
      </span>
      <span className="flex items-center gap-2">
        <span className="text-[color:var(--color-muted)]">
          Didn&rsquo;t receive?
        </span>
        <Button
          variant="link"
          type="button"
          onClick={handleResend}
          disabled={secondsLeft > 0}
        >
          Resend OTP
        </Button>
      </span>
    </div>
  );

  return (
    <AuthShell
      title="Verify your mobile number"
      back
      subtitle={
        <>
          OTP has been sent to{" "}
          <span className="font-semibold text-[color:var(--color-ink)]">
            {currentUser.phone}
          </span>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        {boxes}
        {resendRow}
        <Button type="submit" size="lg" fullWidth className="mt-6">
          Verify
        </Button>
      </form>
    </AuthShell>
  );
}
