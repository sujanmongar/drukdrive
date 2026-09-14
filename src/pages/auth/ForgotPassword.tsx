import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";
import { currentUser } from "../../data/mockData";
import { usePageTitle } from "../../hooks/usePageTitle";

const inputClass =
  "w-full rounded-xl border border-[color:var(--color-border)] px-5 py-4 text-sm text-[color:var(--color-ink)] placeholder:text-[color:var(--color-placeholder)] outline-none transition-colors focus:border-[color:var(--color-ink)]";

export default function ForgotPassword() {
  usePageTitle("Forgot password");
  const navigate = useNavigate();
  const [value, setValue] = useState(currentUser.email);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(routes.resetPassword);
  };

  const form = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-center text-sm text-[color:var(--color-ink-87)]">
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
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-placeholder)]"
        />
      </div>
      <Button type="submit" size="lg" fullWidth className="mt-2">
        Send reset code
      </Button>
      <Link to={routes.signIn} className="mt-2 text-center text-sm font-medium text-[color:var(--color-ink)]">
        Back to sign in
      </Link>
    </form>
  );

  const footer = (
    <p className="mt-6 text-center text-xs leading-relaxed text-[color:var(--color-ink-87)]">
      By continuing, you agree our{" "}
      <span className="font-semibold text-[color:var(--color-link)] underline">Terms of Services</span> and{" "}
      <span className="font-semibold text-[color:var(--color-link)] underline">Privacy Policy</span>.
    </p>
  );

  return (
    <PageShell noFooter>
      <div className="mx-auto flex min-h-[75vh] w-full max-w-[1280px] items-center justify-center px-4 py-12 md:px-10">
        <div className="relative flex w-full max-w-[440px] flex-col rounded-3xl bg-white p-6 shadow-modal sm:p-9">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute left-6 top-6 text-[color:var(--color-ink)]"
          >
            <Icon name="chevron-left" size={22} />
          </button>
          <h1 className="t-h2 mb-6 mt-8 text-[color:var(--color-ink)]">Reset your password</h1>
          {form}
          {footer}
        </div>
      </div>
    </PageShell>
  );
}
