import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";
import { currentUser } from "../../data/mockData";

const inputClass =
  "w-full rounded-xl border border-[#e5ebf0] px-5 py-4 text-sm text-[#222] placeholder:text-[#bfc7cd] outline-none transition-colors focus:border-[#222]";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [value, setValue] = useState(currentUser.email);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(routes.resetPassword);
  };

  const form = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-center text-sm text-[rgba(0,0,0,0.87)]">
        We will send you a reset OTP on your registered e-mail ID or mobile number.
      </p>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Email or phone number"
          className={`${inputClass} pl-11`}
        />
        <Icon
          name="mail"
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#bfc7cd]"
        />
      </div>
      <Button type="submit" size="lg" fullWidth className="mt-2">
        Send reset code
      </Button>
      <Link to={routes.signIn} className="mt-2 text-center text-sm font-medium text-[#222]">
        Back to sign in
      </Link>
    </form>
  );

  const footer = (
    <p className="mt-6 text-center text-xs leading-relaxed text-[rgba(0,0,0,0.87)]">
      By continuing, you agree our{" "}
      <span className="font-semibold text-[#2276e3] underline">Terms of Services</span> and{" "}
      <span className="font-semibold text-[#2276e3] underline">Privacy Policy</span>.
    </p>
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
          <h1 className="mb-6 mt-8 text-2xl font-bold text-[rgba(0,0,0,0.87)]">Reset your password</h1>
          {form}
          {footer}
        </div>

        {/* Mobile */}
        <div className="w-full max-w-md md:hidden">
          <div className="mb-8 flex items-center">
            <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="text-[#222]">
              <Icon name="arrow-left" size={22} />
            </button>
          </div>
          <h1 className="mb-6 text-[34px] font-bold leading-tight text-[#222]">Reset your password</h1>
          {form}
          {footer}
        </div>
      </div>
    </PageShell>
  );
}
