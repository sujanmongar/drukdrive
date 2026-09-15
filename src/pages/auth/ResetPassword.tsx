import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";
import { usePageTitle } from "../../hooks/usePageTitle";

const inputClass =
  "w-full rounded-xl border border-[color:var(--color-border)] px-5 py-4 t-body-sm text-[color:var(--color-ink)] placeholder:text-[color:var(--color-placeholder)] outline-none transition-colors focus:border-[color:var(--color-ink)]";

export default function ResetPassword() {
  usePageTitle("Reset password");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password && confirm && password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setError("");
    navigate(routes.signIn);
  };

  const form = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-center t-body-sm text-[color:var(--color-ink-87)]">
        Your new password must be different from previously used passwords.
      </p>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className={`${inputClass} pl-11 pr-11`}
        />
        <Icon
          name="lock"
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-placeholder)]"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="icon-btn absolute right-2 top-1/2 size-10 -translate-y-1/2 text-[color:var(--color-muted)]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <Icon name={showPassword ? "eye-off" : "eye"} size={18} />
        </button>
      </div>
      <div className="relative">
        <input
          type={showConfirm ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          className={`${inputClass} pl-11 pr-11`}
        />
        <Icon
          name="lock"
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-placeholder)]"
        />
        <button
          type="button"
          onClick={() => setShowConfirm((v) => !v)}
          className="icon-btn absolute right-2 top-1/2 size-10 -translate-y-1/2 text-[color:var(--color-muted)]"
          aria-label={showConfirm ? "Hide password" : "Show password"}
        >
          <Icon name={showConfirm ? "eye-off" : "eye"} size={18} />
        </button>
      </div>
      {error && (
        <p className="t-body-sm font-medium text-[color:var(--color-danger)]">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" fullWidth className="mt-2">
        Reset password
      </Button>
      <Link
        to={routes.signIn}
        className="mt-1 flex min-h-11 items-center justify-center text-center t-body-sm font-medium text-[color:var(--color-ink)]"
      >
        Back to sign in
      </Link>
    </form>
  );

  const footer = (
    <p className="mt-6 text-center t-caption leading-relaxed text-[color:var(--color-ink-87)]">
      By continuing, you agree our{" "}
      <span className="font-semibold text-[color:var(--color-link)] underline">
        Terms of Services
      </span>{" "}
      and{" "}
      <span className="font-semibold text-[color:var(--color-link)] underline">
        Privacy Policy
      </span>
      .
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
            className="icon-btn absolute left-4 top-4 size-10 text-[color:var(--color-ink)]"
          >
            <Icon name="chevron-left" size={22} />
          </button>
          <h1 className="t-h2 mb-6 mt-8 text-[color:var(--color-ink)]">
            Create new password
          </h1>
          {form}
          {footer}
        </div>
      </div>
    </PageShell>
  );
}
