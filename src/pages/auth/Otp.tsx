import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";
import { currentUser } from "../../data/mockData";
import { useAuth } from "../../lib/auth";

const OTP_LENGTH = 6;

type LocationState = {
  role?: "customer" | "driver";
} | null;

export default function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const state = location.state as LocationState;
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      navigate(routes.providerProfile);
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
          className={`size-[48px] rounded-2xl border text-center text-xl font-bold text-[rgba(0,0,0,0.87)] outline-none transition-colors sm:size-[56px] ${
            digit ? "border-[rgba(0,0,0,0.87)]" : "border-[#e5ebf0]"
          } focus:border-[rgba(0,0,0,0.87)]`}
        />
      ))}
    </div>
  );

  const resendRow = (
    <div className="mt-6 flex items-center justify-between text-sm text-[rgba(0,0,0,0.87)]">
      <span>Time remaining 30s</span>
      <span className="flex items-center gap-2">
        <span className="text-[#929292]">Didn&rsquo;t receive?</span>
        <span className="cursor-not-allowed font-semibold text-[#bfc7cd]">Resend OTP</span>
      </span>
    </div>
  );

  return (
    <PageShell noFooter>
      <div className="mx-auto flex min-h-[75vh] w-full max-w-[1440px] items-center justify-center bg-neutral-50 px-4 py-12 md:px-[60px]">
        {/* Desktop */}
        <div className="relative hidden w-full max-w-[440px] flex-col rounded-xl border border-[#e5ebf0] bg-white p-8 shadow-[0px_2px_14px_rgba(0,0,0,0.1)] md:flex">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute left-6 top-6 text-[#222]"
          >
            <Icon name="chevron-left" size={22} />
          </button>
          <h1 className="mb-1 mt-8 text-2xl font-bold text-[rgba(0,0,0,0.87)]">Verify your mobile number</h1>
          <p className="mb-6 text-sm text-[rgba(0,0,0,0.87)]">
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
            <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="text-[#222]">
              <Icon name="arrow-left" size={22} />
            </button>
          </div>
          <h1 className="mb-1 text-[28px] font-bold leading-tight text-[#222]">Verify your mobile number</h1>
          <p className="mb-6 text-sm text-[rgba(0,0,0,0.87)]">
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
